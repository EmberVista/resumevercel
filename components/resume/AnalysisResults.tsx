'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, XCircle, TrendingUp, FileText, Sparkles, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import LeadCapture from '@/components/email/LeadCapture'

interface AnalysisResultsProps {
  analysis: any
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const router = useRouter()
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  
  const { analysis_result: result, original_filename, ats_score } = analysis

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Resume Analysis Complete</h1>
        <p className="text-muted-foreground">
          Analysis for: <span className="font-medium">{original_filename}</span>
        </p>
      </div>

      {/* ATS Score Card */}
      <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">ATS Compatibility Score</h2>
            <p className="text-sm text-muted-foreground">
              How well your resume performs in Applicant Tracking Systems
            </p>
          </div>
          <div className="text-center">
            <div className={cn("text-5xl font-bold", getScoreColor(ats_score))}>
              {ats_score}
            </div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
        </div>

        {/* Score Breakdown Bar */}
        <div className="mt-4">
          <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full transition-all duration-500",
                ats_score >= 80 ? "bg-green-500" : ats_score >= 60 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${ats_score}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Poor (0-59)</span>
            <span>Good (60-79)</span>
            <span>Excellent (80-100)</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Recommendations</h2>
        <div className="space-y-4">
          {result.recommendations.map((rec: any, index: number) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                {getPriorityIcon(rec.priority)}
                <div className="flex-1">
                  <h3 className="font-semibold">{rec.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                  <p className="mt-2 text-sm font-medium text-primary">{rec.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-3 font-semibold text-green-600">Keywords Found</h3>
          <div className="flex flex-wrap gap-2">
            {result.keywordAnalysis.found.slice(0, 10).map((keyword: string, index: number) => (
              <span
                key={index}
                className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
              >
                {keyword}
              </span>
            ))}
            {result.keywordAnalysis.found.length > 10 && (
              <span className="text-xs text-muted-foreground">
                +{result.keywordAnalysis.found.length - 10} more
              </span>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-3 font-semibold text-red-600">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {result.keywordAnalysis.missing.slice(0, 10).map((keyword: string, index: number) => (
              <span
                key={index}
                className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
              >
                {keyword}
              </span>
            ))}
            {result.keywordAnalysis.missing.length > 10 && (
              <span className="text-xs text-muted-foreground">
                +{result.keywordAnalysis.missing.length - 10} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Analysis */}
      <div className="mb-8 rounded-lg border bg-card p-6">
        <h3 className="mb-3 font-semibold">Formatting Analysis</h3>
        <div className="mb-3 flex items-center gap-2">
          <div className="text-lg font-medium">Formatting Score:</div>
          <div className={cn("text-2xl font-bold", getScoreColor(result.formatting.score))}>
            {result.formatting.score}/100
          </div>
        </div>
        
        {result.formatting.issues.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-red-600">Issues Found:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {result.formatting.issues.map((issue: string, index: number) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.formatting.suggestions.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-green-600">Suggestions:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {result.formatting.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lead Capture Section */}
      {!showLeadCapture && (
        <div className="mb-8 rounded-lg border bg-primary/5 p-6 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Get More Resume Tips</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Join thousands getting weekly resume optimization tips and job search strategies.
          </p>
          <button
            onClick={() => setShowLeadCapture(true)}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get Free Resume Tips
          </button>
        </div>
      )}

      {showLeadCapture && (
        <div className="mb-8">
          <LeadCapture />
        </div>
      )}

      {/* CTA Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-white">
        <Sparkles className="mx-auto mb-3 h-10 w-10" />
        <h2 className="mb-2 text-2xl font-bold">
          Ready to Transform Your Resume?
        </h2>
        <p className="mb-6 text-lg opacity-90">
          Get a professionally rewritten resume that guarantees 85+ ATS score
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push('/register')}
            className="rounded-lg bg-white px-8 py-3 font-semibold text-primary hover:bg-gray-100"
          >
            Get Premium Rewrite - $17
          </button>
          <button
            onClick={() => router.push('/pricing')}
            className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10"
          >
            View Pricing Options
          </button>
        </div>
      </div>
    </div>
  )
}