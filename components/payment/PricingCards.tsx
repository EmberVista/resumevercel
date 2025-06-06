'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const plans = [
  {
    name: 'Free Analysis',
    price: '$0',
    description: 'Get started with a comprehensive ATS analysis',
    features: [
      'ATS compatibility score',
      'Keyword analysis',
      'Formatting review',
      'Actionable recommendations',
      'Industry best practices',
    ],
    cta: 'Get Free Analysis',
    ctaLink: '/',
    popular: false,
    priceId: null,
  },
  {
    name: 'One-Time Rewrite',
    price: '$17',
    description: 'Perfect for a single job application',
    features: [
      'Everything in Free Analysis',
      'AI-powered full rewrite',
      '85+ ATS score guarantee',
      'DOCX & PDF downloads',
      '7-day money-back guarantee',
    ],
    cta: 'Get Premium Rewrite',
    ctaLink: '/checkout',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_ID,
  },
  {
    name: 'Monthly Unlimited',
    price: '$27',
    period: '/month',
    description: 'For active job seekers',
    features: [
      'Everything in One-Time',
      'Unlimited resume rewrites',
      'Priority support',
      'Resume templates',
      'Cancel anytime',
    ],
    cta: 'Start Monthly Plan',
    ctaLink: '/checkout',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
  },
]

export default function PricingCards() {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const supabase = createClient()

  const handleCheckout = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      router.push('/')
      return
    }

    setLoadingPlan(planName)
    
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Store the intended purchase in session storage
        sessionStorage.setItem('pendingCheckout', priceId)
        router.push('/register')
        return
      }

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode: planName === 'Monthly Unlimited' ? 'subscription' : 'payment',
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-lg border ${
            plan.popular ? 'border-primary shadow-lg' : 'border-border'
          } bg-card p-8`}
        >
          {plan.popular && (
            <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
              <div className="flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                Most Popular
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <div className="mt-3 flex items-baseline">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="ml-1 text-muted-foreground">{plan.period}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
          </div>

          <ul className="mb-8 space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleCheckout(plan.priceId, plan.name)}
            disabled={loadingPlan === plan.name}
            className={`w-full rounded-lg px-4 py-3 font-medium transition-colors ${
              plan.popular
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            } disabled:opacity-50 flex items-center justify-center`}
          >
            {loadingPlan === plan.name ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              plan.cta
            )}
          </button>
        </div>
      ))}
    </div>
  )
}