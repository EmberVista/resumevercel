'use server'

import { createClient } from '@/lib/supabase/server'
import { extractTextFromFile } from '@/lib/utils/file-processor'
import { analyzeWithAI } from '@/lib/ai/analyzer'
import { AppError } from '@/lib/utils'
import { trackAnalysisCompleted } from '@/lib/kit/automations'

export async function analyzeResume(formData: FormData) {
  try {
    const file = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string | null

    if (!file) {
      return { error: 'No file provided' }
    }

    // Extract text from file
    const extractedText = await extractTextFromFile(file)
    if (!extractedText) {
      return { error: 'Could not extract text from file. Please ensure the file is not corrupted.' }
    }

    // Get current user (if logged in)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Analyze with AI
    const analysis = await analyzeWithAI(extractedText, jobDescription || undefined)

    // Save to database
    const { data, error: dbError } = await supabase
      .from('resume_analyses')
      .insert({
        user_id: user?.id || null,
        original_filename: file.name,
        original_text: extractedText,
        job_description: jobDescription,
        analysis_result: analysis as any,
        ats_score: analysis.atsScore,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return { error: 'Failed to save analysis. Please try again.' }
    }

    // Track analysis in Kit if user is logged in
    if (user?.email) {
      await trackAnalysisCompleted(user.email, analysis.atsScore)
    }

    return { analysisId: data.id }
  } catch (error) {
    console.error('Analysis error:', error)
    if (error instanceof AppError) {
      return { error: error.message }
    }
    return { error: 'An unexpected error occurred during analysis.' }
  }
}