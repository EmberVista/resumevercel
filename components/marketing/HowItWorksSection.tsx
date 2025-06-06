import { Upload, Sparkles, Download } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Simply upload your current resume in PDF, DOCX, or TXT format. Add a job description for targeted analysis.',
  },
  {
    number: '2',
    icon: Sparkles,
    title: 'AI Analysis & Rewrite',
    description: 'Our AI analyzes your resume against ATS requirements and optionally rewrites it following our proven blueprint.',
  },
  {
    number: '3',
    icon: Download,
    title: 'Download & Apply',
    description: 'Get your ATS-optimized resume in multiple formats. Start applying with confidence and land more interviews.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-24 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your ATS-optimized resume in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative text-center">
                {/* Connection line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-x-1/2 bg-border md:block" />
                )}
                
                <div className="relative">
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-md">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#upload"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
          >
            <Upload className="mr-2 h-5 w-5" />
            Start Your Free Analysis
          </a>
        </div>
      </div>
    </section>
  )
}