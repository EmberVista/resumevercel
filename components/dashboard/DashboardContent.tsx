'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Clock, CheckCircle, XCircle, Download, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

interface DashboardContentProps {
  user: User
  profile: any
  analyses: any[]
  generations: any[]
}

export default function DashboardContent({ user, profile, analyses, generations }: DashboardContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'analyses' | 'generations'>('analyses')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const hasActiveSubscription = profile?.subscription_status === 'premium' || profile?.subscription_status === 'pro'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || user.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {hasActiveSubscription 
            ? `You have a ${profile.subscription_status} subscription.`
            : 'You are on the free plan.'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md"
        >
          <Upload className="mr-3 h-6 w-6 text-primary" />
          <span className="font-medium">Upload New Resume</span>
        </button>

        {!hasActiveSubscription && (
          <button
            onClick={() => router.push('/pricing')}
            className="flex items-center justify-center rounded-lg border bg-primary/10 p-6 text-center transition-all hover:shadow-md"
          >
            <Sparkles className="mr-3 h-6 w-6 text-primary" />
            <span className="font-medium">Upgrade to Premium</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('analyses')}
            className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'analyses'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Resume Analyses ({analyses.length})
          </button>
          <button
            onClick={() => setActiveTab('generations')}
            className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'generations'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Generated Resumes ({generations.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'analyses' ? (
        <div className="space-y-4">
          {analyses.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No analyses yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Upload your first resume to get started
              </p>
              <button
                onClick={() => router.push('/')}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Upload Resume
              </button>
            </div>
          ) : (
            analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-lg border bg-card p-6 transition-all hover:shadow-md cursor-pointer"
                onClick={() => router.push(`/analysis/${analysis.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{analysis.original_filename}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ATS Score: <span className="font-medium text-primary">{analysis.ats_score}/100</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Analyzed on {formatDate(analysis.created_at)}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {generations.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No generated resumes yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {hasActiveSubscription 
                  ? 'Generate your first optimized resume'
                  : 'Upgrade to premium to generate optimized resumes'}
              </p>
              <button
                onClick={() => router.push(hasActiveSubscription ? '/' : '/pricing')}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {hasActiveSubscription ? 'Upload Resume' : 'View Pricing'}
              </button>
            </div>
          ) : (
            generations.map((generation) => (
              <div
                key={generation.id}
                className="rounded-lg border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Generated Resume</h3>
                      {getStatusIcon(generation.status)}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Status: <span className="capitalize">{generation.status}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created on {formatDate(generation.created_at)}
                    </p>
                  </div>
                  
                  {generation.status === 'completed' && (
                    <div className="flex space-x-2">
                      {generation.docx_url && (
                        <a
                          href={`/api/download/${generation.id}?type=docx`}
                          download
                          className="flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          DOCX
                        </a>
                      )}
                      {generation.pdf_url && (
                        <a
                          href={`/api/download/${generation.id}?type=pdf`}
                          download
                          className="flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          PDF
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}