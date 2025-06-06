# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Resumeably.ai is an AI-powered resume optimization platform built with Next.js 14, TypeScript, and Supabase. The platform offers free ATS analysis and premium AI-powered resume rewrites following the "Banger Blueprint" framework.

## Critical Project Context

### Architecture
- **Framework**: Next.js 14 with App Router (NOT Pages Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (use MCP server when available)
- **Payments**: Stripe (use MCP server when available)
- **Email**: Kit (formerly ConvertKit)
- **AI**: Claude API primary, OpenAI fallback
- **Deployment**: Docker locally, Vercel production

### Domain & URLs
- **Production**: https://resumeably.ai
- **Admin Email**: inquire@resumeably.ai (has admin dashboard access)
- **Webhooks**: 
  - Stripe: https://resumeably.ai/api/stripe/webhook
  - Kit: https://resumeably.ai/api/kit/webhook

## Development Workflow

### 1. Git Commits
ALWAYS commit after completing:
- Each major feature
- Each user flow
- Service integrations
- UI components
- Bug fixes
- End of development session

Commit format:
```
[TYPE] Brief description

Detailed explanation of:
- What was changed
- Why it was changed
- Testing performed
- Next steps
```

Types: [FEAT], [FIX], [REFACTOR], [STYLE], [DOCS], [TEST], [CHORE]

### 2. Docker Requirements
- ALWAYS rebuild images after ANY code change: `docker-compose build --no-cache`
- Use docker-compose.yml for development
- Use docker-compose.test.yml for testing
- Stripe CLI is included in Docker container

### 3. Testing Philosophy
- Use REAL external services (no mocks)
- Test with actual AI API calls
- Use Stripe test mode with real webhooks
- Implement Playwright for E2E testing
- Use Puppeteer MCP for development automation

### 4. File Organization
Follow the exact directory structure in PRD.txt:
- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/lib` - Business logic and integrations
- `/types` - TypeScript type definitions
- `/tests` - All test files and fixtures

## AI Integration Guidelines

### Free Analysis (Claude 3.5 Haiku)
- MUST provide valuable insights even without payment
- Minimum 5 specific recommendations
- ATS score 1-100 with clear calculation
- If no job description: Generic best practices
- If job description provided: Targeted keyword analysis

### Premium Rewrite (Claude 4 Sonnet)
- MUST follow BANGER_BLUEPRINT.md EXACTLY
- No deviations from the blueprint format
- Maintain truthfulness while enhancing impact
- Generate metrics with user confirmation
- Guarantee 85+ ATS score

### Error Handling
- Primary: Claude API
- Fallback: OpenAI GPT-4
- If both fail: Queue for retry
- Always communicate clearly to user

## Security & Privacy

### Data Handling
- 6-month retention for all files
- GDPR compliant deletion
- Encrypted storage in Supabase
- No exit popups or dark patterns

### Admin Access
- Only inquire@resumeably.ai has admin access
- Admin dashboard at /admin route
- Can process refunds and manage users

## UI/UX Principles

### Mobile-First Design
- Single column layouts
- 44px minimum touch targets
- Simplified navigation
- No intrusive popups
- Fast, modern, beautiful

### User Experience
- Clear value proposition
- Transparent pricing
- Easy file uploads
- Real-time progress updates
- Downloadable DOCX/PDF files

## Integration Notes

### Supabase
- Use MCP server when available: `mcp__supabase__*`
- RLS policies for all tables
- Proper error handling
- Connection pooling

### Stripe
- Use MCP server when available: `mcp__stripe__*`
- Test mode for development
- Real webhook testing with CLI
- Handle all payment states

### Kit (Email)
- V4 API endpoints
- Test account for development
- Strategic inline forms (no popups)
- Automated sequences for nurturing

## Code Style

### TypeScript
- Strict mode enabled
- Explicit types (no `any`)
- Interface over type when possible
- Proper error boundaries

### React/Next.js
- Server Components by default
- Client Components only when needed
- Proper loading/error states
- Accessible components (ARIA)

### General
- NO console.logs in production
- Comprehensive error handling
- Performance optimized
- Well-commented complex logic

## Testing Requirements

### Automated Tests
- E2E flows with Playwright
- Real API calls (no mocks)
- Visual regression testing
- Performance benchmarks

### Manual Testing
- Test on actual mobile devices
- Verify webhook processing
- Check email delivery
- Validate file downloads

## Deployment Checklist

Before deploying:
1. All tests passing
2. Environment variables set
3. Database migrations run
4. Webhooks configured
5. DNS records updated
6. SSL certificates active

## Common Issues & Solutions

### Docker Issues
- Always rebuild with `--no-cache`
- Check volume mounts
- Verify port mappings

### API Rate Limits
- Implement retry logic
- Cache responses when possible
- Monitor usage in admin dashboard

### File Upload Issues
- Max 10MB file size
- Support PDF/DOCX/TXT
- Virus scanning required
- Proper error messages

## Remember

1. This is a PAID product - quality matters
2. The free tier must provide real value
3. Mobile experience is PRIORITY
4. Use real services for testing
5. Commit early and often
6. Follow the PRD.txt exactly
7. When in doubt, check BANGER_BLUEPRINT.md

## Support

For questions or issues:
- Check PRD.txt first
- Review test files for examples
- Use admin dashboard for monitoring
- Contact via inquire@resumeably.ai