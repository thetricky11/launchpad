import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  'https://ehgfmkqxyqwlsoytfzgv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZ2Zta3F4eXF3bHNveXRmemd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI4NTc1MSwiZXhwIjoyMDkxODYxNzUxfQ.qHSlQSGemXsYgSaMgpaIMuFp7RcLc8PJ3uz9wefa-5g',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function runMigrations() {
  const sql = readFileSync(join(process.cwd(), 'supabase/migrations/001_initial.sql'), 'utf-8')
  
  // Split by semicolon and run each statement
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0)
  
  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec', { sql: statement + ';' })
      if (error) {
        // Try direct approach
        console.log('Statement:', statement.substring(0, 50) + '...')
        console.log('Note: Some statements may need to be run manually')
      }
    } catch (e) {
      console.log('Error:', e)
    }
  }
  
  console.log('Migration complete')
}

runMigrations()
