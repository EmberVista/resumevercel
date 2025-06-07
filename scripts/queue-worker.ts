import { config } from 'dotenv'
import { resolve } from 'path'
import { startResumeGenerationWorker } from '../lib/queue/workers/resume-generation'
import { startFileDeletionWorker } from '../lib/queue/workers/file-retention'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

console.log('🚀 Starting queue workers...')

// Start workers
Promise.all([
  startResumeGenerationWorker(),
  startFileDeletionWorker(),
]).catch(error => {
  console.error('Worker error:', error)
  process.exit(1)
})