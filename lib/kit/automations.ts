import { kitClient } from './client'
import { createClient } from '@/lib/supabase/server'

// User lifecycle events
export async function addUserToKit(email: string, fullName?: string) {
  if (!kitClient) {
    console.error('Kit client not initialized - missing API key')
    return { success: false, error: 'Kit not configured' }
  }

  try {
    // Create or update subscriber
    const result = await kitClient.createSubscriber({
      email_address: email,
      first_name: fullName?.split(' ')[0],
      fields: {
        source: 'resumeably_signup',
        signup_date: new Date().toISOString(),
      },
    })

    if (!result.success) {
      return result
    }

    // Add to default form if configured
    if (process.env.KIT_DEFAULT_FORM_ID) {
      await kitClient.addSubscriberToForm(process.env.KIT_DEFAULT_FORM_ID, email)
    }

    // Tag as free user
    if (process.env.KIT_FREE_USER_TAG_ID) {
      await kitClient.tagSubscriber(process.env.KIT_FREE_USER_TAG_ID, email)
    }

    // Add to welcome sequence if configured
    if (process.env.KIT_WELCOME_SEQUENCE_ID) {
      await kitClient.addSubscriberToSequence(process.env.KIT_WELCOME_SEQUENCE_ID, email)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error adding user to Kit:', error)
    return { success: false, error: 'Failed to add user to Kit' }
  }
}

export async function updateSubscriberToPaid(email: string) {
  if (!kitClient) {
    console.error('Kit client not initialized - missing API key')
    return { success: false, error: 'Kit not configured' }
  }

  try {
    // Get subscriber
    const subscriberResult = await kitClient.getSubscriberByEmail(email)
    if (!subscriberResult.success || !subscriberResult.data?.subscribers?.[0]) {
      return { success: false, error: 'Subscriber not found' }
    }

    const subscriber = subscriberResult.data.subscribers[0]

    // Remove free tag
    if (process.env.KIT_FREE_USER_TAG_ID) {
      // Note: Kit API doesn't have a remove tag endpoint, so we'll add the paid tag
    }

    // Add paid user tag
    if (process.env.KIT_PAID_USER_TAG_ID) {
      await kitClient.tagSubscriber(process.env.KIT_PAID_USER_TAG_ID, email)
    }

    // Update custom fields
    await kitClient.updateSubscriberFields(subscriber.id, {
      subscription_status: 'paid',
      subscription_date: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating subscriber to paid:', error)
    return { success: false, error: 'Failed to update subscriber' }
  }
}

export async function updateSubscriberToChurned(email: string) {
  if (!kitClient) {
    console.error('Kit client not initialized - missing API key')
    return { success: false, error: 'Kit not configured' }
  }

  try {
    // Get subscriber
    const subscriberResult = await kitClient.getSubscriberByEmail(email)
    if (!subscriberResult.success || !subscriberResult.data?.subscribers?.[0]) {
      return { success: false, error: 'Subscriber not found' }
    }

    const subscriber = subscriberResult.data.subscribers[0]

    // Add churned user tag
    if (process.env.KIT_CHURNED_USER_TAG_ID) {
      await kitClient.tagSubscriber(process.env.KIT_CHURNED_USER_TAG_ID, email)
    }

    // Update custom fields
    await kitClient.updateSubscriberFields(subscriber.id, {
      subscription_status: 'churned',
      churn_date: new Date().toISOString(),
    })

    // Add to win-back sequence if configured
    if (process.env.KIT_WINBACK_SEQUENCE_ID) {
      await kitClient.addSubscriberToSequence(process.env.KIT_WINBACK_SEQUENCE_ID, email)
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating subscriber to churned:', error)
    return { success: false, error: 'Failed to update subscriber' }
  }
}

export async function trackAnalysisCompleted(email: string, atsScore: number) {
  if (!kitClient) {
    console.error('Kit client not initialized - missing API key')
    return { success: false, error: 'Kit not configured' }
  }

  try {
    // Get subscriber
    const subscriberResult = await kitClient.getSubscriberByEmail(email)
    if (!subscriberResult.success || !subscriberResult.data?.subscribers?.[0]) {
      // Create subscriber if doesn't exist
      await addUserToKit(email)
      const retryResult = await kitClient.getSubscriberByEmail(email)
      if (!retryResult.success || !retryResult.data?.subscribers?.[0]) {
        return { success: false, error: 'Failed to create subscriber' }
      }
    }

    const subscriber = subscriberResult.data.subscribers[0]

    // Update custom fields
    await kitClient.updateSubscriberFields(subscriber.id, {
      last_analysis_date: new Date().toISOString(),
      last_ats_score: atsScore,
      total_analyses: (subscriber.fields?.total_analyses || 0) + 1,
    })

    // Tag based on score
    if (atsScore < 60 && process.env.KIT_LOW_SCORE_TAG_ID) {
      await kitClient.tagSubscriber(process.env.KIT_LOW_SCORE_TAG_ID, email)
    }

    return { success: true }
  } catch (error) {
    console.error('Error tracking analysis:', error)
    return { success: false, error: 'Failed to track analysis' }
  }
}

export async function trackResumeGenerated(email: string) {
  if (!kitClient) {
    console.error('Kit client not initialized - missing API key')
    return { success: false, error: 'Kit not configured' }
  }

  try {
    // Get subscriber
    const subscriberResult = await kitClient.getSubscriberByEmail(email)
    if (!subscriberResult.success || !subscriberResult.data?.subscribers?.[0]) {
      return { success: false, error: 'Subscriber not found' }
    }

    const subscriber = subscriberResult.data.subscribers[0]

    // Update custom fields
    await kitClient.updateSubscriberFields(subscriber.id, {
      last_generation_date: new Date().toISOString(),
      total_generations: (subscriber.fields?.total_generations || 0) + 1,
    })

    return { success: true }
  } catch (error) {
    console.error('Error tracking generation:', error)
    return { success: false, error: 'Failed to track generation' }
  }
}

// Initialize Kit setup for a new account
export async function setupKitForNewAccount() {
  if (!kitClient) {
    console.error('Kit client not initialized - missing API key')
    return { success: false, error: 'Kit not configured' }
  }

  try {
    console.log('Setting up Kit for new account...')
    
    // Get existing tags
    const tagsResult = await kitClient.getTags()
    console.log('Existing tags:', tagsResult.data?.tags?.length || 0)

    // Get existing forms
    const formsResult = await kitClient.getForms()
    console.log('Existing forms:', formsResult.data?.forms?.length || 0)

    // Get existing sequences
    const sequencesResult = await kitClient.getSequences()
    console.log('Existing sequences:', sequencesResult.data?.sequences?.length || 0)

    return {
      success: true,
      data: {
        tags: tagsResult.data?.tags || [],
        forms: formsResult.data?.forms || [],
        sequences: sequencesResult.data?.sequences || [],
      },
      message: 'Kit account overview retrieved. Please create tags, forms, and sequences in Kit, then update your .env.local file.',
    }
  } catch (error) {
    console.error('Error setting up Kit:', error)
    return { success: false, error: 'Failed to setup Kit' }
  }
}