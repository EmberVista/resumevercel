import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { queueManager, QUEUES } from '@/lib/queue/client'
import type { ResumeGenerationJobData } from '@/lib/queue/workers/resume-generation'

export async function POST(request: NextRequest) {
  try {
    const { generationId } = await request.json()

    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      )
    }

    // Get the user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Use service role client for admin operations
    const serviceSupabase = await createServiceRoleClient()

    // Get the generation record
    const { data: generation, error: genError } = await serviceSupabase
      .from('resume_generations')
      .select('*, resume_analyses(*)')
      .eq('id', generationId)
      .eq('user_id', user.id)
      .single()

    if (genError || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    // Check if already processed or processing
    if (generation.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        docxUrl: generation.docx_url,
        pdfUrl: generation.pdf_url,
      })
    }
    
    if (generation.status === 'processing') {
      return NextResponse.json({
        status: 'processing',
        message: 'Resume generation is in progress',
      })
    }

    // Add job to queue instead of processing synchronously
    const jobData: ResumeGenerationJobData = {
      generationId,
      userId: user.id,
      analysisId: generation.analysis_id,
    }
    
    await queueManager.addJob(QUEUES.RESUME_GENERATION, jobData)
    
    // Update status to indicate it's queued
    await serviceSupabase
      .from('resume_generations')
      .update({ status: 'processing' })
      .eq('id', generationId)

    return NextResponse.json({
      status: 'processing',
      message: 'Resume generation has been queued',
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const generationId = searchParams.get('id')

  if (!generationId) {
    return NextResponse.json(
      { error: 'Generation ID is required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get generation status
    const { data: generation, error } = await supabase
      .from('resume_generations')
      .select('status, docx_url, pdf_url')
      .eq('id', generationId)
      .eq('user_id', user.id)
      .single()

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: generation.status,
      docxUrl: generation.docx_url,
      pdfUrl: generation.pdf_url,
    })
  } catch (error) {
    console.error('Get generation status error:', error)
    return NextResponse.json(
      { error: 'Failed to get generation status' },
      { status: 500 }
    )
  }
}