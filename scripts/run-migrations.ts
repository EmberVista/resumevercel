import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  console.log('Running Supabase migrations...')
  
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
  const migrationFiles = fs.readdirSync(migrationsDir).sort()
  
  for (const file of migrationFiles) {
    if (file.endsWith('.sql')) {
      console.log(`Running migration: ${file}`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql })
        if (error) {
          console.error(`Error running migration ${file}:`, error)
          process.exit(1)
        }
        console.log(`✓ Migration ${file} completed`)
      } catch (err) {
        console.error(`Failed to run migration ${file}:`, err)
        process.exit(1)
      }
    }
  }
  
  console.log('All migrations completed successfully!')
}

runMigrations().catch(console.error)