import { Metadata } from 'next'
import HeroSection from '@/components/marketing/HeroSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Resumeably.ai - AI-Powered Resume Optimization | Beat the ATS',
  description: 'Get your resume past ATS systems with our free AI analysis and premium rewriting service. Increase your interview chances by 3x.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  )
}