'use client'

import { useState } from 'react'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'

export default function LeadCapture() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg border bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-8 w-8 text-green-600" />
        <h3 className="mb-2 text-lg font-semibold text-green-900">Success!</h3>
        <p className="text-sm text-green-700">
          Check your email for resume tips and strategies.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <Mail className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Get Weekly Resume Tips</h3>
      </div>
      
      <p className="mb-4 text-sm text-muted-foreground">
        Join 5,000+ job seekers getting actionable advice to land more interviews.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isSubmitting}
          />
          {error && (
            <p className="mt-1 text-xs text-destructive">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            'Get Free Tips'
          )}
        </button>
      </form>

      <p className="mt-3 text-xs text-muted-foreground">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}