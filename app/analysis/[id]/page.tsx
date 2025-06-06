import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AnalysisResults from '@/components/resume/AnalysisResults'

export default async function AnalysisPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  
  // Fetch analysis data
  const { data: analysis, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !analysis) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AnalysisResults analysis={analysis} />
      </div>
    </div>
  )
}