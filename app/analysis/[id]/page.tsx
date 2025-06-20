import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AnalysisResults from '@/components/resume/AnalysisResults'

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch analysis data
  const { data: analysis, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !analysis) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AnalysisResults analysis={analysis} isAuthenticated={!!user} />
      </div>
    </div>
  )
}