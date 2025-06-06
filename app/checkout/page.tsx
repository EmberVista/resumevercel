'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initiateCheckout = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Get price ID from URL or session storage
        let priceId = searchParams.get('price')
        if (!priceId) {
          priceId = sessionStorage.getItem('pendingCheckout')
        }

        if (!priceId) {
          priceId = process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_ID!
        }

        // Get analysis ID if available
        const analysisId = sessionStorage.getItem('pendingAnalysis')

        // Create checkout session
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            mode: priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'subscription' : 'payment',
            analysisId,
          }),
        })

        const data = await response.json()

        if (data.url) {
          // Clear session storage
          sessionStorage.removeItem('pendingCheckout')
          sessionStorage.removeItem('pendingAnalysis')
          
          // Redirect to Stripe checkout
          window.location.href = data.url
        } else {
          throw new Error('Failed to create checkout session')
        }
      } catch (err) {
        console.error('Checkout error:', err)
        setError('Failed to start checkout. Please try again.')
        setIsLoading(false)
      }
    }

    initiateCheckout()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Checkout Error</h1>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push('/pricing')}
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
        <h1 className="mb-2 text-2xl font-bold">Redirecting to checkout...</h1>
        <p className="text-muted-foreground">Please wait while we prepare your secure payment page.</p>
      </div>
    </div>
  )
}