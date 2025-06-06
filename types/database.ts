export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          subscription_status: 'free' | 'premium' | 'pro'
          stripe_customer_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          subscription_status?: 'free' | 'premium' | 'pro'
          stripe_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          subscription_status?: 'free' | 'premium' | 'pro'
          stripe_customer_id?: string | null
          created_at?: string
        }
      }
      resume_analyses: {
        Row: {
          id: string
          user_id: string | null
          original_filename: string
          original_text: string
          job_description: string | null
          analysis_result: any
          ats_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          original_filename: string
          original_text: string
          job_description?: string | null
          analysis_result: any
          ats_score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          original_filename?: string
          original_text?: string
          job_description?: string | null
          analysis_result?: any
          ats_score?: number
          created_at?: string
        }
      }
      resume_generations: {
        Row: {
          id: string
          user_id: string
          analysis_id: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          rewritten_text: string | null
          docx_url: string | null
          pdf_url: string | null
          generation_model: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          analysis_id: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          rewritten_text?: string | null
          docx_url?: string | null
          pdf_url?: string | null
          generation_model?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          analysis_id?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          rewritten_text?: string | null
          docx_url?: string | null
          pdf_url?: string | null
          generation_model?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string
          amount: number
          currency: string
          status: string
          type: 'one_time' | 'subscription'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id: string
          amount: number
          currency: string
          status: string
          type: 'one_time' | 'subscription'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          currency?: string
          status?: string
          type?: 'one_time' | 'subscription'
          created_at?: string
        }
      }
    }
  }
}