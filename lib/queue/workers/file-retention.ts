import { createServiceRoleClient } from '@/lib/supabase/server'
import { queueManager, QUEUES, Job } from '../client'

export interface FileDeletionJobData {
  userId: string
  filePaths: string[]
  reason: string
}

// Process a single file deletion job
export async function processFileDeletionJob(job: Job<FileDeletionJobData>) {
  const { userId, filePaths, reason } = job.data
  const supabase = await createServiceRoleClient()
  
  console.log(`Processing file deletion for user ${userId}, reason: ${reason}`)
  
  try {
    // Delete files from storage
    if (filePaths.length > 0) {
      const { error } = await supabase
        .storage
        .from('resumes')
        .remove(filePaths)
      
      if (error) {
        throw new Error(`Failed to delete files: ${error.message}`)
      }
      
      console.log(`Deleted ${filePaths.length} files for user ${userId}`)
    }
    
    await queueManager.completeJob(job.id, QUEUES.FILE_DELETION)
  } catch (error) {
    console.error(`Error deleting files for user ${userId}:`, error)
    await queueManager.failJob(
      job.id,
      QUEUES.FILE_DELETION,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

// Check for files older than 6 months and queue them for deletion
export async function checkAndQueueExpiredFiles() {
  const supabase = await createServiceRoleClient()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  console.log('Checking for files older than 6 months...')
  
  try {
    // Get all resume generations older than 6 months
    const { data: expiredGenerations, error } = await supabase
      .from('resume_generations')
      .select('id, user_id, docx_url, pdf_url')
      .lt('created_at', sixMonthsAgo.toISOString())
      .eq('status', 'completed')
    
    if (error) {
      console.error('Error fetching expired generations:', error)
      return
    }
    
    if (!expiredGenerations || expiredGenerations.length === 0) {
      console.log('No expired files found')
      return
    }
    
    console.log(`Found ${expiredGenerations.length} expired generations`)
    
    // Group files by user
    const filesByUser = new Map<string, string[]>()
    const generationIds: string[] = []
    
    for (const generation of expiredGenerations) {
      generationIds.push(generation.id)
      
      const userFiles = filesByUser.get(generation.user_id) || []
      
      // Extract file paths from URLs
      if (generation.docx_url) {
        const docxPath = generation.docx_url.split('/').slice(-2).join('/')
        userFiles.push(docxPath)
      }
      
      if (generation.pdf_url) {
        const pdfPath = generation.pdf_url.split('/').slice(-2).join('/')
        userFiles.push(pdfPath)
      }
      
      filesByUser.set(generation.user_id, userFiles)
    }
    
    // Queue deletion jobs for each user
    for (const [userId, filePaths] of filesByUser.entries()) {
      await queueManager.addJob<FileDeletionJobData>(
        QUEUES.FILE_DELETION,
        {
          userId,
          filePaths,
          reason: '6-month retention policy',
        }
      )
    }
    
    // Mark generations as having files deleted
    const { error: updateError } = await supabase
      .from('resume_generations')
      .update({ 
        docx_url: null,
        pdf_url: null,
      })
      .in('id', generationIds)
    
    if (updateError) {
      console.error('Error updating generation records:', updateError)
    }
    
    console.log(`Queued ${filesByUser.size} file deletion jobs`)
  } catch (error) {
    console.error('Error in file retention check:', error)
  }
}

// Worker function for file deletion
export async function startFileDeletionWorker() {
  console.log('Starting file deletion worker...')
  
  // Run retention check once at startup
  await checkAndQueueExpiredFiles()
  
  // Schedule retention check to run daily
  setInterval(async () => {
    await checkAndQueueExpiredFiles()
  }, 24 * 60 * 60 * 1000) // 24 hours
  
  // Process deletion jobs
  while (true) {
    try {
      const job = await queueManager.getNextJob(QUEUES.FILE_DELETION)
      
      if (job) {
        await processFileDeletionJob(job as Job<FileDeletionJobData>)
      } else {
        // No jobs available, wait before checking again
        await new Promise(resolve => setTimeout(resolve, 30000)) // 30 seconds
      }
    } catch (error) {
      console.error('File deletion worker error:', error)
      await new Promise(resolve => setTimeout(resolve, 60000)) // 1 minute
    }
  }
}