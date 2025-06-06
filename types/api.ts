export interface AnalysisRequest {
  resume: File
  jobDescription?: string
}

export interface AnalysisResponse {
  id: string
  atsScore: number
  recommendations: Recommendation[]
  keywordAnalysis: KeywordAnalysis
  formatting: FormattingAnalysis
}

export interface Recommendation {
  category: 'content' | 'formatting' | 'keywords' | 'skills'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
}

export interface KeywordAnalysis {
  found: string[]
  missing: string[]
  density: Record<string, number>
}

export interface FormattingAnalysis {
  issues: string[]
  score: number
  suggestions: string[]
}

export interface GenerationRequest {
  analysisId: string
  targetJobDescription?: string
}

export interface GenerationResponse {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  docxUrl?: string
  pdfUrl?: string
  error?: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  subscriptionStatus: 'free' | 'premium' | 'pro'
  stripeCustomerId?: string
  createdAt: Date
}

export interface PaymentIntent {
  clientSecret: string
  amount: number
  currency: string
}