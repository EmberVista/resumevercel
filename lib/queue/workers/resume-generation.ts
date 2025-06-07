import { queueManager, QUEUES, Job } from '../client'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { rewriteWithAI } from '@/lib/ai/rewriter'
import { generateResumeFiles } from '@/lib/utils/resume-generator'
import { trackResumeGenerated } from '@/lib/kit/automations'

export interface ResumeGenerationJobData {
  generationId: string
  userId: string
  analysisId: string
}

export async function processResumeGenerationJob(job: Job<ResumeGenerationJobData>) {
  const { generationId, userId, analysisId } = job.data
  const supabase = await createServiceRoleClient()
  
  try {
    // Update generation status to processing
    await supabase
      .from('resume_generations')
      .update({ status: 'processing' })
      .eq('id', generationId)
    
    // Get analysis data
    const { data: analysis, error: analysisError } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()
    
    if (analysisError || !analysis) {
      throw new Error('Analysis not found')
    }
    
    // Get user profile for email tracking
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single()
    
    // Rewrite resume with AI
    console.log(`Processing resume generation ${generationId}`)
    const rewrittenContent = await rewriteWithAI(
      analysis.original_text,
      analysis.job_description,
      analysis.analysis_result
    )
    
    // Generate DOCX and PDF files
    const { docxBuffer, pdfBuffer } = await generateResumeFiles(rewrittenContent)
    
    // Upload files to Supabase storage
    const timestamp = Date.now()
    const docxPath = `${userId}/${generationId}_${timestamp}.docx`
    const pdfPath = `${userId}/${generationId}_${timestamp}.pdf`
    
    // Upload DOCX
    const { error: docxError } = await supabase
      .storage
      .from('resumes')
      .upload(docxPath, docxBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
    
    if (docxError) {
      throw new Error(`Failed to upload DOCX: ${docxError.message}`)
    }
    
    // Upload PDF
    const { error: pdfError } = await supabase
      .storage
      .from('resumes')
      .upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
      })
    
    if (pdfError) {
      throw new Error(`Failed to upload PDF: ${pdfError.message}`)
    }
    
    // Get public URLs
    const { data: { publicUrl: docxUrl } } = supabase
      .storage
      .from('resumes')
      .getPublicUrl(docxPath)
    
    const { data: { publicUrl: pdfUrl } } = supabase
      .storage
      .from('resumes')
      .getPublicUrl(pdfPath)
    
    // Update generation record
    const { error: updateError } = await supabase
      .from('resume_generations')
      .update({
        status: 'completed',
        rewritten_text: rewrittenContent,
        docx_url: docxUrl,
        pdf_url: pdfUrl,
        generation_model: 'claude-4-sonnet',
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId)
    
    if (updateError) {
      throw new Error(`Failed to update generation: ${updateError.message}`)
    }
    
    // Track in Kit if user has email
    if (profile?.email) {
      await trackResumeGenerated(profile.email)
    }
    
    // Complete the job
    await queueManager.completeJob(job.id, QUEUES.RESUME_GENERATION)
    
    console.log(`Successfully completed resume generation ${generationId}`)
  } catch (error) {
    console.error(`Error processing resume generation ${generationId}:`, error)
    
    // Update generation status to failed
    await supabase
      .from('resume_generations')
      .update({ 
        status: 'failed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId)
    
    // Fail the job (will retry if attempts remaining)
    await queueManager.failJob(
      job.id,
      QUEUES.RESUME_GENERATION,
      error instanceof Error ? error.message : 'Unknown error'
    )
    
    throw error
  }
}

// Worker function that continuously processes jobs
export async function startResumeGenerationWorker() {
  console.log('Starting resume generation worker...')
  
  while (true) {
    try {
      // Get next job from queue
      const job = await queueManager.getNextJob(QUEUES.RESUME_GENERATION)
      
      if (job) {
        console.log(`Processing job ${job.id}`)
        await processResumeGenerationJob(job as Job<ResumeGenerationJobData>)
      } else {
        // No jobs available, wait before checking again
        await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second poll interval
      }
    } catch (error) {
      console.error('Worker error:', error)
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 10000)) // 10 second error backoff
    }
  }
}