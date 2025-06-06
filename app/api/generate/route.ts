import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { rewriteResume } from '@/lib/ai/rewriter'
import { generateDOCX, generatePDF } from '@/lib/utils/resume-generator'
import { AppError } from '@/lib/utils'

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

    // Check if already processed
    if (generation.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        docxUrl: generation.docx_url,
        pdfUrl: generation.pdf_url,
      })
    }

    // Update status to processing
    await serviceSupabase
      .from('resume_generations')
      .update({ status: 'processing' })
      .eq('id', generationId)

    try {
      // Get the analysis data
      const analysis = generation.resume_analyses
      
      // Rewrite the resume using AI
      const rewrittenText = await rewriteResume({
        originalText: analysis.original_text,
        analysisResult: analysis.analysis_result,
        jobDescription: analysis.job_description,
      })

      // Generate DOCX
      const docxBuffer = await generateDOCX(rewrittenText)
      
      // Generate PDF
      const pdfBuffer = await generatePDF(rewrittenText)

      // Upload files to Supabase Storage
      const timestamp = Date.now()
      const userId = user.id
      
      const docxPath = `resumes/${userId}/${timestamp}_resume.docx`
      const pdfPath = `resumes/${userId}/${timestamp}_resume.pdf`

      // Upload DOCX
      const { error: docxError } = await serviceSupabase.storage
        .from('user-files')
        .upload(docxPath, docxBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: false,
        })

      if (docxError) throw docxError

      // Upload PDF
      const { error: pdfError } = await serviceSupabase.storage
        .from('user-files')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (pdfError) throw pdfError

      // Get public URLs
      const { data: { publicUrl: docxUrl } } = serviceSupabase.storage
        .from('user-files')
        .getPublicUrl(docxPath)

      const { data: { publicUrl: pdfUrl } } = serviceSupabase.storage
        .from('user-files')
        .getPublicUrl(pdfPath)

      // Update generation record
      await serviceSupabase
        .from('resume_generations')
        .update({
          status: 'completed',
          rewritten_text: rewrittenText,
          docx_url: docxUrl,
          pdf_url: pdfUrl,
          generation_model: 'claude-3-5-sonnet',
          completed_at: new Date().toISOString(),
        })
        .eq('id', generationId)

      return NextResponse.json({
        status: 'completed',
        docxUrl,
        pdfUrl,
      })

    } catch (error) {
      console.error('Generation error:', error)
      
      // Update status to failed
      await serviceSupabase
        .from('resume_generations')
        .update({ status: 'failed' })
        .eq('id', generationId)

      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }

      return NextResponse.json(
        { error: 'Failed to generate resume' },
        { status: 500 }
      )
    }
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