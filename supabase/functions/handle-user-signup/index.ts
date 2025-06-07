import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user } = await req.json()
    
    if (!user?.email) {
      return new Response(
        JSON.stringify({ error: 'Invalid user data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Add user to Kit
    const kitApiKey = Deno.env.get('KIT_API_KEY')
    if (kitApiKey && kitApiKey !== 'your-kit-api-key') {
      const kitResponse = await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'X-Kit-Api-Key': kitApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: user.email,
          first_name: user.user_metadata?.full_name?.split(' ')[0],
          fields: {
            source: 'resumeably_signup',
            signup_date: new Date().toISOString(),
          },
        }),
      })

      if (!kitResponse.ok) {
        console.error('Kit API error:', await kitResponse.text())
      } else {
        // Add to default form if configured
        const formId = Deno.env.get('KIT_DEFAULT_FORM_ID')
        if (formId && formId !== 'your-form-id') {
          await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
            method: 'POST',
            headers: {
              'X-Kit-Api-Key': kitApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: user.email,
            }),
          })
        }

        // Tag as free user
        const freeTagId = Deno.env.get('KIT_FREE_USER_TAG_ID')
        if (freeTagId && freeTagId !== 'your-free-user-tag-id') {
          await fetch(`https://api.kit.com/v4/tags/${freeTagId}/subscribers`, {
            method: 'POST',
            headers: {
              'X-Kit-Api-Key': kitApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: user.email,
            }),
          })
        }

        // Add to welcome sequence
        const sequenceId = Deno.env.get('KIT_WELCOME_SEQUENCE_ID')
        if (sequenceId && sequenceId !== 'your-welcome-sequence-id') {
          await fetch(`https://api.kit.com/v4/sequences/${sequenceId}/subscribers`, {
            method: 'POST',
            headers: {
              'X-Kit-Api-Key': kitApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: user.email,
            }),
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handle-user-signup:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})