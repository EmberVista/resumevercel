import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { updateSubscriberToPaid, updateSubscriberToChurned } from '@/lib/kit/automations'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const supabase = await createServiceRoleClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { userId, analysisId } = session.metadata

        // Update user's subscription status
        if (session.mode === 'subscription') {
          const { data: profile } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'premium',
              stripe_customer_id: session.customer,
            })
            .eq('id', userId)
            .select('email')
            .single()
          
          // Update Kit subscriber to paid
          if (profile?.email) {
            await updateSubscriberToPaid(profile.email)
          }
        } else {
          // For one-time payments, update the profile to show they've made a purchase
          const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single()

          if (!profile?.stripe_customer_id) {
            await supabase
              .from('profiles')
              .update({
                stripe_customer_id: session.customer,
              })
              .eq('id', userId)
          }
        }

        // Record the payment
        await supabase
          .from('payments')
          .insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent || session.id,
            amount: session.amount_total,
            currency: session.currency,
            status: 'succeeded',
            type: session.mode === 'subscription' ? 'subscription' : 'one_time',
          })

        // If there's an analysis ID, trigger resume generation
        if (analysisId && session.payment_status === 'paid') {
          const { data: generation } = await supabase
            .from('resume_generations')
            .insert({
              user_id: userId,
              analysis_id: analysisId,
              status: 'pending',
            })
            .select('id')
            .single()

          // Trigger generation process
          if (generation) {
            // In production, you'd use a queue here
            // For now, we'll call the generation API directly
            fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ generationId: generation.id }),
            }).catch(err => console.error('Failed to trigger generation:', err))
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer

        // Find user by Stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          const status = subscription.status === 'active' ? 'premium' : 'free'
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ subscription_status: status })
            .eq('id', profile.id)
            .select('email')
            .single()
          
          // Update Kit subscriber status
          if (updatedProfile?.email && status === 'premium') {
            await updateSubscriberToPaid(updatedProfile.email)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer

        // Find user by Stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ subscription_status: 'free' })
            .eq('id', profile.id)
            .select('email')
            .single()
          
          // Update Kit subscriber to churned
          if (updatedProfile?.email) {
            await updateSubscriberToChurned(updatedProfile.email)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.error('Payment failed:', paymentIntent.id)
        // You could send an email notification here
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Stripe requires the raw body to verify webhook signatures
export const config = {
  api: {
    bodyParser: false,
  },
}