# Resumeably.ai

AI-powered resume optimization platform that helps job seekers pass ATS systems and land more interviews.

## Features

- 🔍 **Free ATS Analysis** - Get instant feedback on your resume's ATS compatibility
- 🤖 **AI-Powered Rewriting** - Professional resume optimization using Claude AI
- 📊 **ATS Score** - See exactly how your resume performs (1-100 score)
- 📄 **Multiple Formats** - Download optimized resumes in DOCX and PDF
- 💼 **Job-Specific Optimization** - Tailor your resume for specific job descriptions
- 🔒 **Secure & Private** - GDPR compliant with 6-month data retention

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Anthropic Claude API (primary), OpenAI GPT-4 (fallback)
- **Payments**: Stripe
- **Email**: Kit (ConvertKit)
- **Queue**: Upstash Redis
- **Deployment**: Vercel

## Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run queue workers
npm run worker:dev
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## License

Private repository - All rights reserved