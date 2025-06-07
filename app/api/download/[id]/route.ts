import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: generationId } = await params
    const fileType = request.nextUrl.searchParams.get('type') || 'docx'
    
    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Use service role to check file ownership
    const serviceSupabase = await createServiceRoleClient()
    
    // Get generation details
    const { data: generation, error: genError } = await serviceSupabase
      .from('resume_generations')
      .select('*, resume_analyses(original_filename)')
      .eq('id', generationId)
      .single()
    
    if (genError || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }
    
    // Verify ownership
    if (generation.user_id !== user.id) {
      // Check if user is admin
      if (user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
    }
    
    // Check if generation is complete
    if (generation.status !== 'completed') {
      return NextResponse.json(
        { error: 'Generation not complete' },
        { status: 400 }
      )
    }
    
    // Get the file URL based on type
    const fileUrl = fileType === 'pdf' ? generation.pdf_url : generation.docx_url
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File not available' },
        { status: 404 }
      )
    }
    
    // Download file from Supabase storage
    const filePath = fileUrl.split('/').slice(-2).join('/')
    const { data: fileData, error: downloadError } = await serviceSupabase
      .storage
      .from('resumes')
      .download(filePath)
    
    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return NextResponse.json(
        { error: 'Failed to download file' },
        { status: 500 }
      )
    }
    
    // Get original filename
    const originalName = generation.resume_analyses?.original_filename || 'resume'
    const baseName = originalName.replace(/\.[^/.]+$/, '') // Remove extension
    const filename = `${baseName}_optimized.${fileType}`
    
    // Return file with appropriate headers
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}