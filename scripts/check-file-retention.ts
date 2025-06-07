import { config } from 'dotenv'
import { resolve } from 'path'
import { checkAndQueueExpiredFiles } from '../lib/queue/workers/file-retention'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function run() {
  console.log('🗑️  Running file retention check...')
  
  try {
    await checkAndQueueExpiredFiles()
    console.log('✅ File retention check completed')
  } catch (error) {
    console.error('❌ Error running file retention check:', error)
    process.exit(1)
  }
}

run()