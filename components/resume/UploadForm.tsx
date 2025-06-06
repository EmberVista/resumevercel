'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, X, Loader2, Sparkles } from 'lucide-react'
import { cn, validateFile } from '@/lib/utils'
import { analyzeResume } from '@/app/actions/analyze'

export default function UploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    const validation = validateFile(selectedFile)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }
    setError(null)
    setFile(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please upload a resume')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim())
      }

      const result = await analyzeResume(formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.analysisId) {
        router.push(`/analysis/${result.analysisId}`)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Your Resume <span className="text-destructive">*</span>
        </label>
        
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border",
            file ? "bg-accent/50" : "hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-full p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                Drop your resume here or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOCX, or TXT (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">
          Target Job Description (Optional)
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description you're applying for to get targeted recommendations..."
          className="w-full min-h-[120px] rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Adding a job description helps us provide more specific recommendations
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || isAnalyzing}
        className={cn(
          "w-full rounded-lg px-4 py-3 font-medium transition-colors",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center"
        )}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Your Resume...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Get Free ATS Analysis
          </>
        )}
      </button>
    </form>
  )
}