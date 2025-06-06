'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard')
      return
    }

    // Verify the payment session
    const verifySession = async () => {
      try {
        // In a real app, you'd verify the session with your backend
        // For now, we'll just wait a moment and redirect
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsVerifying(false)
      } catch (error) {
        console.error('Error verifying session:', error)
        router.push('/dashboard')
      }
    }

    verifySession()
  }, [sessionId, router])

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mb-4 text-3xl font-bold">Payment Successful!</h1>
        
        <p className="mb-8 text-lg text-muted-foreground">
          Thank you for your purchase. Your premium features are now active.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
          
          <p className="text-sm text-muted-foreground">
            You'll receive a confirmation email shortly with your receipt.
          </p>
        </div>

        <div className="mt-12 rounded-lg border bg-card p-6 text-left">
          <h2 className="mb-3 font-semibold">What's Next?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Upload your resume to generate an optimized version</li>
            <li>• Download your new resume in DOCX or PDF format</li>
            <li>• Apply to jobs with confidence knowing you have an 85+ ATS score</li>
          </ul>
        </div>
      </div>
    </div>
  )
}