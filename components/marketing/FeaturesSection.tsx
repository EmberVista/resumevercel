import { Shield, Zap, Target, BarChart3, FileCheck, Users } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'ATS-Optimized',
    description: 'Beat Applicant Tracking Systems with formatting and keywords that get you noticed.',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get comprehensive feedback in seconds, not hours. No waiting, no delays.',
  },
  {
    icon: Target,
    title: 'Targeted Recommendations',
    description: 'Specific, actionable advice tailored to your industry and target role.',
  },
  {
    icon: BarChart3,
    title: 'ATS Score',
    description: 'Know exactly how your resume ranks with a detailed scoring breakdown.',
  },
  {
    icon: FileCheck,
    title: 'Premium Rewrites',
    description: 'AI-powered complete resume transformation following our proven Banger Blueprint.',
  },
  {
    icon: Users,
    title: 'Trusted by Thousands',
    description: 'Join 10,000+ job seekers who landed interviews at top companies.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
            Why Choose Resumeably.ai?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform gives you the edge you need in today's competitive job market.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}