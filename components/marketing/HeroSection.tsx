'use client'

import { useState } from 'react'
import { Upload, FileText, Sparkles } from 'lucide-react'
import UploadForm from '@/components/resume/UploadForm'

export default function HeroSection() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Content */}
          <div className="mb-8 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Resume Optimization
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Beat the ATS and Land Your
            <span className="block text-primary">Dream Job</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Get a free AI-powered ATS analysis of your resume. Our advanced AI identifies exactly what recruiters and ATS systems are looking for.
          </p>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-3 gap-4 sm:gap-8">
            <div>
              <div className="text-2xl font-bold text-primary sm:text-3xl">3x</div>
              <div className="text-sm text-muted-foreground">More Interviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary sm:text-3xl">85%+</div>
              <div className="text-sm text-muted-foreground">ATS Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary sm:text-3xl">10k+</div>
              <div className="text-sm text-muted-foreground">Resumes Optimized</div>
            </div>
          </div>

          {/* Upload Section */}
          {!showUpload ? (
            <div className="mx-auto max-w-md">
              <button
                onClick={() => setShowUpload(true)}
                className="group relative w-full overflow-hidden rounded-xl bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Upload className="mr-3 h-5 w-5" />
                  Get Your Free ATS Analysis
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required • 100% free analysis
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl relative z-50">
              <UploadForm />
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              PDF, DOCX, TXT supported
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center">
              <span className="mr-2">🔒</span>
              Secure & Confidential
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center">
              <span className="mr-2">⚡</span>
              Results in 30 seconds
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}