import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import puppeteer from 'puppeteer'

interface ResumeSection {
  type: 'header' | 'headline' | 'summary' | 'skills' | 'experience' | 'education' | 'tools'
  content: string
}

export async function generateDOCX(resumeText: string): Promise<Buffer> {
  const sections = parseResumeSections(resumeText)
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720, // 0.6 inches
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children: createDocumentContent(sections),
    }],
  })

  return await Packer.toBuffer(doc)
}

export async function generatePDF(resumeText: string): Promise<Buffer> {
  const html = createHTMLFromResume(resumeText)
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'letter',
      margin: {
        top: '0.6in',
        right: '0.6in',
        bottom: '0.6in',
        left: '0.6in',
      },
      printBackground: true,
    })

    return pdf
  } finally {
    await browser.close()
  }
}

function parseResumeSections(resumeText: string): ResumeSection[] {
  const sections: ResumeSection[] = []
  const lines = resumeText.split('\n').filter(line => line.trim())

  let currentSection: ResumeSection | null = null
  let currentContent: string[] = []

  const sectionHeaders = {
    'PERFORMANCE SUMMARY': 'summary',
    'PROFESSIONAL SUMMARY': 'summary',
    'CORE COMPETENCIES': 'skills',
    'SKILLS': 'skills',
    'PROFESSIONAL EXPERIENCE': 'experience',
    'WORK EXPERIENCE': 'experience',
    'EDUCATION': 'education',
    'CERTIFICATIONS': 'education',
    'TOOLS & TECHNOLOGIES': 'tools',
    'TECHNICAL SKILLS': 'tools',
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Check if this is the header (first few lines)
    if (i < 3 && !currentSection) {
      sections.push({ type: 'header', content: lines.slice(0, 3).join('\n') })
      i = 2
      continue
    }

    // Check if this is a headline (after header, before sections)
    if (i === 3 && !line.toUpperCase().includes('SUMMARY') && !line.toUpperCase().includes('COMPETENCIES')) {
      sections.push({ type: 'headline', content: line })
      continue
    }

    // Check if this is a section header
    const upperLine = line.toUpperCase()
    const matchedHeader = Object.keys(sectionHeaders).find(header => upperLine.includes(header))
    
    if (matchedHeader) {
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent.join('\n')
        sections.push(currentSection)
      }
      
      // Start new section
      currentSection = { 
        type: sectionHeaders[matchedHeader] as any, 
        content: '' 
      }
      currentContent = []
    } else if (currentSection) {
      currentContent.push(line)
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent.join('\n')
    sections.push(currentSection)
  }

  return sections
}

function createDocumentContent(sections: ResumeSection[]): Paragraph[] {
  const paragraphs: Paragraph[] = []

  sections.forEach(section => {
    switch (section.type) {
      case 'header':
        const headerLines = section.content.split('\n')
        // Name - larger font
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: headerLines[0],
                bold: true,
                size: 36, // 18pt
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          })
        )
        // Contact info
        if (headerLines[1]) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: headerLines[1],
                  size: 22, // 11pt
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          )
        }
        break

      case 'headline':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                bold: true,
                size: 24, // 12pt
                color: '2563EB', // Indigo accent
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        )
        break

      case 'summary':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'PERFORMANCE SUMMARY',
                bold: true,
                size: 26, // 13pt
                color: '2563EB',
              }),
            ],
            spacing: { before: 100, after: 100 },
            border: {
              bottom: {
                color: '2563EB',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        )
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 200 },
          })
        )
        break

      case 'skills':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'CORE COMPETENCIES',
                bold: true,
                size: 26, // 13pt
                color: '2563EB',
              }),
            ],
            spacing: { before: 100, after: 100 },
            border: {
              bottom: {
                color: '2563EB',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        )
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 200 },
          })
        )
        break

      case 'experience':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 26, // 13pt
                color: '2563EB',
              }),
            ],
            spacing: { before: 100, after: 100 },
            border: {
              bottom: {
                color: '2563EB',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        )
        
        // Parse and format experience entries
        const experiences = section.content.split('\n\n')
        experiences.forEach(exp => {
          const lines = exp.split('\n')
          lines.forEach((line, index) => {
            if (index === 0) {
              // Job title and company
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      bold: true,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 100, after: 50 },
                })
              )
            } else if (line.startsWith('•') || line.startsWith('-')) {
              // Bullet points
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      size: 22,
                    }),
                  ],
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
              )
            } else {
              // Regular text
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      size: 22,
                    }),
                  ],
                  spacing: { after: 50 },
                })
              )
            }
          })
        })
        break

      case 'education':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION & CERTIFICATIONS',
                bold: true,
                size: 26, // 13pt
                color: '2563EB',
              }),
            ],
            spacing: { before: 100, after: 100 },
            border: {
              bottom: {
                color: '2563EB',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        )
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 200 },
          })
        )
        break

      case 'tools':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'TOOLS & TECHNOLOGIES',
                bold: true,
                size: 26, // 13pt
                color: '2563EB',
              }),
            ],
            spacing: { before: 100, after: 100 },
            border: {
              bottom: {
                color: '2563EB',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        )
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 200 },
          })
        )
        break
    }
  })

  return paragraphs
}

function createHTMLFromResume(resumeText: string): string {
  const sections = parseResumeSections(resumeText)
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #1a1a1a;
          margin: 0;
          padding: 0.6in;
          max-width: 8.5in;
        }
        
        h1 {
          font-size: 18pt;
          font-weight: 700;
          text-align: center;
          margin: 0 0 8px 0;
        }
        
        .contact {
          text-align: center;
          margin-bottom: 16px;
          font-size: 10pt;
        }
        
        .headline {
          text-align: center;
          font-weight: 600;
          font-size: 12pt;
          color: #2563EB;
          margin-bottom: 16px;
        }
        
        h2 {
          font-size: 13pt;
          font-weight: 600;
          color: #2563EB;
          border-bottom: 1px solid #2563EB;
          padding-bottom: 4px;
          margin: 16px 0 8px 0;
        }
        
        .job-title {
          font-weight: 600;
          margin: 12px 0 4px 0;
        }
        
        ul {
          margin: 4px 0;
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 4px;
        }
        
        p {
          margin: 4px 0;
        }
      </style>
    </head>
    <body>
  `

  sections.forEach(section => {
    switch (section.type) {
      case 'header':
        const headerLines = section.content.split('\n')
        html += `<h1>${headerLines[0]}</h1>`
        if (headerLines[1]) {
          html += `<div class="contact">${headerLines[1]}</div>`
        }
        break

      case 'headline':
        html += `<div class="headline">${section.content}</div>`
        break

      case 'summary':
        html += `<h2>PERFORMANCE SUMMARY</h2>`
        html += `<p>${section.content.replace(/\n/g, '<br>')}</p>`
        break

      case 'skills':
        html += `<h2>CORE COMPETENCIES</h2>`
        html += `<p>${section.content}</p>`
        break

      case 'experience':
        html += `<h2>PROFESSIONAL EXPERIENCE</h2>`
        const experiences = section.content.split('\n\n')
        experiences.forEach(exp => {
          const lines = exp.split('\n')
          html += '<div>'
          lines.forEach((line, index) => {
            if (index === 0) {
              html += `<div class="job-title">${line}</div>`
            } else if (line.startsWith('•') || line.startsWith('-')) {
              if (!html.includes('<ul>')) html += '<ul>'
              html += `<li>${line.substring(1).trim()}</li>`
            } else {
              if (html.includes('<ul>')) html += '</ul>'
              html += `<p>${line}</p>`
            }
          })
          if (html.includes('<ul>') && !html.endsWith('</ul>')) html += '</ul>'
          html += '</div>'
        })
        break

      case 'education':
        html += `<h2>EDUCATION & CERTIFICATIONS</h2>`
        html += `<p>${section.content.replace(/\n/g, '<br>')}</p>`
        break

      case 'tools':
        html += `<h2>TOOLS & TECHNOLOGIES</h2>`
        html += `<p>${section.content}</p>`
        break
    }
  })

  html += `
    </body>
    </html>
  `

  return html
}