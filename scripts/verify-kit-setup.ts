import { config } from 'dotenv'
import { resolve } from 'path'
import { KitClient } from '../lib/kit/client'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function verifyKitSetup() {
  console.log('\n🔍 Verifying Kit (ConvertKit) Setup...\n')
  
  // Check API key
  const apiKey = process.env.KIT_API_KEY
  if (!apiKey || apiKey === 'your-kit-api-key') {
    console.error('❌ KIT_API_KEY not configured in .env.local')
    console.log('   Get your API key from: https://app.kit.com/account/edit#api')
    return
  }
  
  console.log('✅ API Key configured')
  
  // Initialize client
  const client = new KitClient(apiKey)
  
  try {
    // Test API connection
    console.log('\n📡 Testing API connection...')
    const accountResult = await client.client.get('/account')
    console.log(`✅ Connected to Kit account: ${accountResult.data.primary_email_address}`)
    
    // Get tags
    console.log('\n🏷️  Fetching tags...')
    const tagsResult = await client.getTags()
    if (tagsResult.success && tagsResult.data?.tags) {
      console.log(`Found ${tagsResult.data.tags.length} tags:`)
      tagsResult.data.tags.forEach((tag: any) => {
        console.log(`   - ${tag.name} (ID: ${tag.id})`)
      })
      
      // Check configured tags
      const requiredTags = [
        { env: 'KIT_FREE_USER_TAG_ID', name: 'Free User' },
        { env: 'KIT_PAID_USER_TAG_ID', name: 'Paid User' },
        { env: 'KIT_CHURNED_USER_TAG_ID', name: 'Churned User' },
        { env: 'KIT_LOW_SCORE_TAG_ID', name: 'Low ATS Score' },
      ]
      
      console.log('\n🔍 Checking configured tags...')
      requiredTags.forEach(({ env, name }) => {
        const value = process.env[env]
        if (!value || value.includes('your-')) {
          console.log(`   ⚠️  ${env} not configured (for "${name}" tag)`)
        } else {
          const exists = tagsResult.data.tags.some((t: any) => t.id.toString() === value)
          if (exists) {
            console.log(`   ✅ ${env} configured and valid`)
          } else {
            console.log(`   ❌ ${env} configured but tag ID ${value} not found`)
          }
        }
      })
    }
    
    // Get forms
    console.log('\n📝 Fetching forms...')
    const formsResult = await client.getForms()
    if (formsResult.success && formsResult.data?.forms) {
      console.log(`Found ${formsResult.data.forms.length} forms:`)
      formsResult.data.forms.forEach((form: any) => {
        console.log(`   - ${form.name} (ID: ${form.id})`)
      })
      
      // Check configured form
      const formId = process.env.KIT_DEFAULT_FORM_ID
      if (!formId || formId.includes('your-')) {
        console.log('\n   ⚠️  KIT_DEFAULT_FORM_ID not configured')
      } else {
        const exists = formsResult.data.forms.some((f: any) => f.id.toString() === formId)
        if (exists) {
          console.log('\n   ✅ KIT_DEFAULT_FORM_ID configured and valid')
        } else {
          console.log(`\n   ❌ KIT_DEFAULT_FORM_ID configured but form ID ${formId} not found`)
        }
      }
    }
    
    // Get sequences
    console.log('\n📧 Fetching sequences...')
    const sequencesResult = await client.getSequences()
    if (sequencesResult.success && sequencesResult.data?.sequences) {
      console.log(`Found ${sequencesResult.data.sequences.length} sequences:`)
      sequencesResult.data.sequences.forEach((seq: any) => {
        console.log(`   - ${seq.name} (ID: ${seq.id})`)
      })
      
      // Check configured sequences
      const requiredSequences = [
        { env: 'KIT_WELCOME_SEQUENCE_ID', name: 'Welcome Series' },
        { env: 'KIT_WINBACK_SEQUENCE_ID', name: 'Win Back' },
      ]
      
      console.log('\n🔍 Checking configured sequences...')
      requiredSequences.forEach(({ env, name }) => {
        const value = process.env[env]
        if (!value || value.includes('your-')) {
          console.log(`   ⚠️  ${env} not configured (for "${name}" sequence)`)
        } else {
          const exists = sequencesResult.data.sequences.some((s: any) => s.id.toString() === value)
          if (exists) {
            console.log(`   ✅ ${env} configured and valid`)
          } else {
            console.log(`   ❌ ${env} configured but sequence ID ${value} not found`)
          }
        }
      })
    }
    
    // Summary
    console.log('\n📊 Setup Summary:')
    console.log('   1. Create missing tags in Kit dashboard')
    console.log('   2. Create a newsletter form')
    console.log('   3. Create welcome and win-back sequences')
    console.log('   4. Update .env.local with the IDs')
    console.log('   5. Set up webhooks in Kit automations')
    console.log('\n📖 Full setup guide: docs/kit-setup-guide.md\n')
    
  } catch (error: any) {
    console.error('\n❌ Error connecting to Kit API:')
    console.error(`   ${error.response?.data?.error || error.message}`)
    console.log('\n   Check your API key and try again.')
  }
}

// Run verification
verifyKitSetup().catch(console.error)