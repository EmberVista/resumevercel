import { Metadata } from 'next'
import PricingCards from '@/components/payment/PricingCards'

export const metadata: Metadata = {
  title: 'Pricing - Resumeably.ai',
  description: 'Choose the perfect plan for your resume optimization needs',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. No hidden fees.
          </p>
        </div>

        <PricingCards />

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">What's included in the free analysis?</h3>
              <p className="text-sm text-muted-foreground">
                Our free analysis includes a comprehensive ATS score, keyword analysis, formatting review, 
                and specific recommendations to improve your resume. It's a complete evaluation that provides 
                real value without any payment.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">How does the premium rewrite work?</h3>
              <p className="text-sm text-muted-foreground">
                After payment, our AI rewrites your entire resume following our proven "Banger Blueprint" 
                framework. You'll get a professionally optimized resume with an 85+ ATS score guarantee, 
                available in both DOCX and PDF formats.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your monthly subscription at any time from your dashboard. 
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">What's your refund policy?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied with your rewritten resume, 
                contact us at support@resumeably.ai for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}