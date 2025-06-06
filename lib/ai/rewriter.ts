import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { AppError } from '@/lib/utils'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface RewriteOptions {
  originalText: string
  analysisResult: any
  jobDescription?: string
  targetRole?: string
}

export async function rewriteResume(options: RewriteOptions): Promise<string> {
  try {
    // Try Claude 4 Sonnet first
    return await rewriteWithClaude(options)
  } catch (error) {
    console.error('Claude rewrite failed, falling back to OpenAI:', error)
    
    // Fallback to OpenAI GPT-4
    try {
      return await rewriteWithOpenAI(options)
    } catch (fallbackError) {
      console.error('OpenAI rewrite also failed:', fallbackError)
      throw new AppError('Both AI services are currently unavailable. Please try again later.', 503)
    }
  }
}

async function rewriteWithClaude(options: RewriteOptions): Promise<string> {
  const prompt = createRewritePrompt(options)
  
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return extractRewrittenResume(content.text)
}

async function rewriteWithOpenAI(options: RewriteOptions): Promise<string> {
  const prompt = createRewritePrompt(options)
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.3,
    max_tokens: 4000,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  return extractRewrittenResume(content)
}

function createRewritePrompt(options: RewriteOptions): string {
  const { originalText, analysisResult, jobDescription, targetRole } = options

  return `You are an expert resume writer following the "Banger Blueprint" framework. Your task is to completely rewrite this resume to achieve an 85+ ATS score while maintaining truthfulness.

ORIGINAL RESUME:
${originalText}

ANALYSIS RESULTS:
ATS Score: ${analysisResult.atsScore}
Missing Keywords: ${analysisResult.keywordAnalysis.missing.join(', ')}
Formatting Issues: ${analysisResult.formatting.issues.join(', ')}

${jobDescription ? `TARGET JOB DESCRIPTION:
${jobDescription}` : ''}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

REQUIREMENTS (from Banger Blueprint):
1. Structure (1-page max):
   - Header: Name (18pt) · Phone · City, ST · LinkedIn URL
   - Headline: Target title + specialty keywords
   - Performance Summary: 3-4 lines with metrics
   - Core Competencies: 8-12 hard skills
   - Professional Experience: 3 bullets per role using C-A-R-M formula
   - Education & Certs: Degree/school/year
   - Tools & Tech: Quick list

2. Bullet Formula (C-A-R-M):
   - Challenge → Action → Result → Metric
   - Start with power verb
   - Include specific metric (%, $, time)
   - End with tool/tech/keyword from JD

3. Keywords:
   - Extract top 15 from job description
   - Ensure each appears at least once
   - Include plural/singular variants
   - Maintain natural readability

4. Formatting:
   - Single column, no tables/images
   - 11-12pt modern sans font
   - Max 650 words
   - ATS-safe design

5. Truth & Compliance:
   - No fabrications
   - If metrics are missing, propose reasonable estimates marked with [VERIFY]
   - Maintain all factual information

OUTPUT FORMAT:
Provide the complete rewritten resume in plain text format, optimized for ATS systems. Use clear section headers and bullet points. Mark any proposed metrics that need verification with [VERIFY].

Remember: Every line must help win this specific job. Delete anything irrelevant.`
}

function extractRewrittenResume(aiResponse: string): string {
  // The AI should return the resume in plain text format
  // Clean up any potential markdown or extra formatting
  let resume = aiResponse
    .replace(/```[\w]*\n/g, '') // Remove code blocks
    .replace(/```/g, '')
    .trim()

  // Ensure we have content
  if (!resume || resume.length < 100) {
    throw new Error('Invalid resume output from AI')
  }

  return resume
}