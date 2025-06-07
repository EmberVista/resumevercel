import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const headersList = await headers()
    
    // Verify webhook signature if configured
    const webhookSecret = process.env.KIT_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = headersList.get('x-kit-signature')
      // Kit uses HMAC-SHA256 for webhook signatures
      // Verify signature here if needed
    }
    
    const { subscriber } = body
    
    if (!subscriber?.email_address) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
    }
    
    const supabase = await createServiceRoleClient()
    
    // Handle different webhook events
    switch (body.type) {
      case 'subscriber.subscriber_activate':
        // New subscriber confirmed
        console.log('New subscriber activated:', subscriber.email_address)
        break
        
      case 'subscriber.subscriber_unsubscribe':
        // Subscriber unsubscribed
        console.log('Subscriber unsubscribed:', subscriber.email_address)
        
        // Update user's email preferences in database
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', subscriber.email_address)
          .single()
          
        if (profile) {
          await supabase
            .from('profiles')
            .update({ email_marketing_consent: false } as any)
            .eq('id', profile.id)
        }
        break
        
      case 'subscriber.tag_add':
        // Tag added to subscriber
        console.log('Tag added to subscriber:', subscriber.email_address, body.tag)
        break
        
      case 'subscriber.tag_remove':
        // Tag removed from subscriber
        console.log('Tag removed from subscriber:', subscriber.email_address, body.tag)
        break
        
      default:
        console.log('Unhandled webhook event:', body.type)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Kit webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}