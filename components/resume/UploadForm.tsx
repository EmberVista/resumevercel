'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, X, Loader2, Sparkles, FileUp, Type } from 'lucide-react'
import { cn, validateFile } from '@/lib/utils'
import { analyzeResume } from '@/app/actions/analyze'

export default function UploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate based on input method
    if (inputMethod === 'file' && !file) {
      setError('Please upload a resume file')
      return
    }
    
    if (inputMethod === 'text' && !resumeText.trim()) {
      setError('Please paste your resume text')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      
      if (inputMethod === 'file' && file) {
        formData.append('resume', file)
      } else if (inputMethod === 'text') {
        // Create a text file from the pasted content
        const textBlob = new Blob([resumeText], { type: 'text/plain' })
        const textFile = new File([textBlob], 'resume.txt', { type: 'text/plain' })
        formData.append('resume', textFile)
      }
      
      // Job description is optional
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
    <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
      {/* Input Method Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg relative z-10">
        <button
          type="button"
          onClick={() => {
            setInputMethod('file')
            setResumeText('')
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer",
            inputMethod === 'file' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <FileUp className="h-4 w-4" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => {
            setInputMethod('text')
            setFile(null)
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer",
            inputMethod === 'text' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <Type className="h-4 w-4" />
          Paste Text
        </button>
      </div>

      {/* File Upload Area */}
      {inputMethod === 'file' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Your Resume <span className="text-destructive">*</span>
          </label>
          
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
              dragActive ? "border-primary bg-primary/5" : "border-border",
              file ? "bg-accent/50" : "hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="sr-only"
              id="resume-upload"
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
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="rounded-full p-1 hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  Drop your resume here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, or TXT (max 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Text Paste Area */}
      {inputMethod === 'text' && (
        <div>
          <label htmlFor="resumeText" className="block text-sm font-medium mb-2">
            Paste Your Resume <span className="text-destructive">*</span>
          </label>
          <textarea
            id="resumeText"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full min-h-[200px] rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required={inputMethod === 'text'}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Copy and paste your entire resume text
          </p>
        </div>
      )}

      {/* Job Description - OPTIONAL */}
      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">
          Target Job Description <span className="text-muted-foreground">(Optional)</span>
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for more targeted recommendations..."
          className="w-full min-h-[120px] rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring relative z-10"
          style={{ position: 'relative', zIndex: 10 }}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Leave blank for general ATS best practices, or add a job description for targeted analysis
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
        disabled={(inputMethod === 'file' && !file) || (inputMethod === 'text' && !resumeText.trim()) || isAnalyzing}
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