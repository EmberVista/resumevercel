import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export async function extractTextFromFile(file: File): Promise<string | null> {
  try {
    const fileType = file.type
    const fileName = file.name.toLowerCase()
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Handle different file types
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const data = await pdfParse(buffer)
      return data.text.trim()
    } 
    
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer })
      return result.value.trim()
    }
    
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return new TextDecoder().decode(buffer).trim()
    }

    return null
  } catch (error) {
    console.error('Error extracting text:', error)
    return null
  }
}

export function sanitizeText(text: string): string {
  // Remove excessive whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}