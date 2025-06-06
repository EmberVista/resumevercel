# Resumeably.ai - Docker Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Supabase account and project created
- Stripe account (test mode is fine for development)
- Anthropic API key (for Claude)
- OpenAI API key (optional, for fallback)

## Quick Start

1. **Clone and setup environment:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit .env.local with your actual API keys and configuration
   ```

2. **Configure Supabase:**
   - Create a new Supabase project at https://supabase.com
   - Run the migrations in `supabase/migrations/` in your Supabase SQL editor
   - Copy your project URL and keys to `.env.local`

3. **Configure Stripe:**
   - Create products and prices in Stripe Dashboard (test mode)
   - One-time payment product ($17)
   - Monthly subscription product ($27)
   - Copy the price IDs to `.env.local`

4. **Run with Docker:**
   ```bash
   # Build and start the containers
   docker-compose up --build

   # Or run in detached mode
   docker-compose up -d --build
   ```

5. **Access the application:**
   - Main app: http://localhost:3000
   - Stripe webhook forwarding will start automatically

## Docker Commands

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up

# View logs
docker-compose logs -f app

# Access container shell
docker exec -it resumeably-app-1 sh
```

## Environment Variables

### Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Get this from Stripe CLI output
- `STRIPE_MONTHLY_PRICE_ID` - Your monthly subscription price ID
- `STRIPE_SINGLE_PRICE_ID` - Your one-time payment price ID
- `ANTHROPIC_API_KEY` - Claude API key

### Optional:
- `OPENAI_API_KEY` - For fallback AI service
- `KIT_API_KEY` - For email marketing
- `UPSTASH_REDIS_REST_URL` - For queue system (not required for MVP)

## Testing the Application

1. **Free Analysis Flow:**
   - Visit http://localhost:3000
   - Upload a resume (PDF, DOCX, or TXT)
   - View the free ATS analysis

2. **Payment Flow:**
   - Create an account or login
   - Use Stripe test card: 4242 4242 4242 4242
   - Any future date for expiry, any CVC

3. **Check Webhook:**
   - The Stripe CLI container will show webhook events
   - Check the logs: `docker-compose logs -f stripe-cli`

## Troubleshooting

### Port already in use:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database connection issues:
- Ensure your Supabase project is active
- Check that all environment variables are set correctly
- Verify the database migrations have been run

### Stripe webhook issues:
- The Stripe CLI container handles webhook forwarding automatically
- Check the webhook secret matches what's shown in Stripe CLI output
- Ensure the app container is running before stripe-cli

### File upload issues:
- Ensure Puppeteer dependencies are installed (handled by Dockerfile)
- Check that file size is under 10MB
- Verify supported formats: PDF, DOCX, TXT

## Production Deployment

For production deployment:
1. Use the production Dockerfile in `docker/Dockerfile`
2. Set proper environment variables
3. Use real Stripe webhook endpoint
4. Configure proper domain and SSL
5. Set up monitoring and logging