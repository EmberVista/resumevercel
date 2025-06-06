import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  mode = 'payment',
  analysisId,
}: {
  userId: string
  userEmail: string
  priceId: string
  mode?: 'payment' | 'subscription'
  analysisId?: string
}) {
  const metadata: Record<string, string> = {
    userId,
  }
  
  if (analysisId) {
    metadata.analysisId = analysisId
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    mode,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata,
  })

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account`,
  })

  return session
}