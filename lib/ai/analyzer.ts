import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { AnalysisResponse, Recommendation, KeywordAnalysis, FormattingAnalysis } from '@/types/api'
import { AppError } from '@/lib/utils'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function analyzeWithAI(
  resumeText: string,
  jobDescription?: string
): Promise<AnalysisResponse> {
  try {
    // Try Claude first
    return await analyzeWithClaude(resumeText, jobDescription)
  } catch (error) {
    console.error('Claude analysis failed, falling back to OpenAI:', error)
    
    // Fallback to OpenAI
    try {
      return await analyzeWithOpenAI(resumeText, jobDescription)
    } catch (fallbackError) {
      console.error('OpenAI analysis also failed:', fallbackError)
      throw new AppError('Both AI services are currently unavailable. Please try again later.', 503)
    }
  }
}

async function analyzeWithClaude(resumeText: string, jobDescription?: string): Promise<AnalysisResponse> {
  const prompt = createAnalysisPrompt(resumeText, jobDescription)
  
  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 2000,
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

  return parseAIResponse(content.text)
}

async function analyzeWithOpenAI(resumeText: string, jobDescription?: string): Promise<AnalysisResponse> {
  const prompt = createAnalysisPrompt(resumeText, jobDescription)
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.3,
    max_tokens: 2000,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  return parseAIResponse(content)
}

function createAnalysisPrompt(resumeText: string, jobDescription?: string): string {
  return `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze the following resume and provide a comprehensive evaluation.

RESUME:
${resumeText}

${jobDescription ? `TARGET JOB DESCRIPTION:
${jobDescription}` : ''}

Provide a detailed analysis in the following JSON format:
{
  "atsScore": <number 0-100>,
  "recommendations": [
    {
      "category": "content|formatting|keywords|skills",
      "priority": "high|medium|low",
      "title": "<brief title>",
      "description": "<detailed description of the issue>",
      "impact": "<specific impact on ATS/hiring chances>"
    }
  ],
  "keywordAnalysis": {
    "found": ["<keywords found that match the job/industry>"],
    "missing": ["<important keywords missing>"],
    "density": { "<keyword>": <count> }
  },
  "formatting": {
    "issues": ["<formatting issues that affect ATS parsing>"],
    "score": <0-100>,
    "suggestions": ["<specific formatting improvements>"]
  }
}

Guidelines:
1. ATS Score should reflect how well the resume will perform in ATS systems (0-100)
2. Provide at least 5 specific, actionable recommendations
3. Focus on concrete improvements that will increase interview chances
4. If job description provided, analyze keyword match closely
5. Check for ATS-friendly formatting (simple structure, no tables/graphics, standard fonts)
6. Identify missing critical sections (summary, skills, achievements with metrics)
7. Be constructive but honest about weaknesses

Remember: This analysis should provide real value even in the free tier.`
}

function parseAIResponse(responseText: string): AnalysisResponse {
  try {
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate and transform the response
    return {
      id: '', // Will be set by the database
      atsScore: Math.min(100, Math.max(0, parseInt(parsed.atsScore) || 50)),
      recommendations: (parsed.recommendations || []).slice(0, 10).map((rec: any) => ({
        category: rec.category || 'content',
        priority: rec.priority || 'medium',
        title: rec.title || 'Recommendation',
        description: rec.description || '',
        impact: rec.impact || 'May improve your chances',
      })),
      keywordAnalysis: {
        found: parsed.keywordAnalysis?.found || [],
        missing: parsed.keywordAnalysis?.missing || [],
        density: parsed.keywordAnalysis?.density || {},
      },
      formatting: {
        issues: parsed.formatting?.issues || [],
        score: parseInt(parsed.formatting?.score) || 50,
        suggestions: parsed.formatting?.suggestions || [],
      },
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    
    // Return a basic analysis if parsing fails
    return {
      id: '',
      atsScore: 50,
      recommendations: [
        {
          category: 'content',
          priority: 'high',
          title: 'Analysis Error',
          description: 'We encountered an issue analyzing your resume. Please try again.',
          impact: 'Unable to provide specific recommendations at this time.',
        },
      ],
      keywordAnalysis: {
        found: [],
        missing: [],
        density: {},
      },
      formatting: {
        issues: [],
        score: 50,
        suggestions: [],
      },
    }
  }
}