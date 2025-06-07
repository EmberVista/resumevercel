import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Use service role client to bypass RLS
    const serviceSupabase = await createServiceRoleClient()
    
    // Fetch all user data
    const [profile, analyses, generations, payments] = await Promise.all([
      serviceSupabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
      
      serviceSupabase
        .from('resume_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      serviceSupabase
        .from('resume_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      serviceSupabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ])
    
    // Compile all data
    const exportData = {
      export_date: new Date().toISOString(),
      user_id: user.id,
      profile: profile.data,
      resume_analyses: analyses.data || [],
      resume_generations: generations.data || [],
      payments: payments.data || [],
      account_created: user.created_at,
      email: user.email,
      auth_metadata: {
        provider: user.app_metadata.provider,
        providers: user.app_metadata.providers,
      }
    }
    
    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="resumeably-data-export-${user.id}.json"`
      }
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}