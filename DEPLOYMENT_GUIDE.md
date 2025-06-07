# Deployment Guide for Resumeably.ai

This guide walks you through deploying Resumeably.ai to production using GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Domain name (resumeably.ai)
- All environment variables from .env.local

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - Repository name: `resumeably-app`
   - Description: "AI-powered resume optimization platform"
   - Set to **Private** (recommended)
   - Don't initialize with README (we already have one)

3. After creating, you'll see instructions. In your terminal, run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/resumeably-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "New Project"
3. Import your GitHub repository:
   - Connect GitHub account if not already connected
   - Select `resumeably-app` repository

4. Configure project settings:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Environment Variables**: Add ALL variables from .env.local
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
   STRIPE_SECRET_KEY=your-secret-key
   STRIPE_WEBHOOK_SECRET=your-webhook-secret
   STRIPE_MONTHLY_PRICE_ID=your-monthly-price-id
   STRIPE_SINGLE_PRICE_ID=your-single-price-id
   
   # AI APIs
   ANTHROPIC_API_KEY=your-anthropic-key
   OPENAI_API_KEY=your-openai-key
   
   # Kit (ConvertKit)
   KIT_API_KEY=your-kit-api-key
   KIT_API_SECRET=your-kit-api-secret
   KIT_WEBHOOK_SECRET=your-webhook-secret
   # ... all other Kit IDs ...
   
   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your-upstash-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token
   
   # Application
   NEXT_PUBLIC_APP_URL=https://resumeably.ai
   ADMIN_EMAIL=inquire@resumeably.ai
   ```

6. Click "Deploy"

## Step 3: Configure Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add `resumeably.ai`
3. Choose configuration:
   - Add both `resumeably.ai` and `www.resumeably.ai`
   - Set `resumeably.ai` as primary

4. Update DNS records at your domain registrar:
   ```
   Type  Name    Value
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```

5. Wait for DNS propagation (5-30 minutes)

## Step 4: Set Up Production Webhooks

### Stripe Webhooks
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://resumeably.ai/api/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the signing secret and update in Vercel:
   - `STRIPE_WEBHOOK_SECRET=whsec_...`

### Kit Webhooks
1. In Kit, go to Automations → Rules
2. Create webhook rules as per KIT_SETUP_INSTRUCTIONS.md
3. Use webhook URL: `https://resumeably.ai/api/kit/webhook`

## Step 5: Set Up Upstash Redis

1. Go to https://upstash.com and create account
2. Create a new Redis database:
   - Name: `resumeably-production`
   - Region: Choose closest to your users
   - Enable "Eviction"

3. Copy credentials and update in Vercel:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 6: Set Up Queue Workers

Since Vercel is serverless, you need a separate service for queue workers:

### Option 1: Railway (Recommended)
1. Go to https://railway.app
2. Create new project from GitHub repo
3. Add service with custom start command:
   ```
   npm run worker
   ```
4. Add all environment variables

### Option 2: Render
1. Go to https://render.com
2. Create new "Background Worker"
3. Connect GitHub repo
4. Start command: `npm run worker`
5. Add environment variables

### Option 3: Heroku
1. Create new app
2. Add buildpack: `heroku/nodejs`
3. Deploy and scale worker dyno:
   ```
   heroku ps:scale worker=1
   ```

## Step 7: Final Checks

1. **Test the deployment**:
   - Visit https://resumeably.ai
   - Test free analysis
   - Test user registration
   - Test payment flow (use Stripe test cards)

2. **Monitor logs** in Vercel dashboard

3. **Set up monitoring**:
   - Google Analytics 4 (add to layout.tsx)
   - Sentry error tracking
   - Uptime monitoring (e.g., UptimeRobot)

## Step 8: Go Live Checklist

- [ ] All environment variables set in Vercel
- [ ] Domain DNS configured and propagated
- [ ] Stripe webhooks configured and tested
- [ ] Kit webhooks configured
- [ ] Queue workers running
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Test all user flows
- [ ] Backup database
- [ ] Set up error alerts

## Troubleshooting

**Build Errors**:
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

**Environment Variables**:
- Double-check all variables are set
- No quotes around values in Vercel
- Restart deployment after changes

**Domain Issues**:
- Verify DNS records
- Wait for propagation
- Check Vercel domain settings

**Webhook Failures**:
- Check endpoint URLs
- Verify webhook secrets
- Monitor webhook logs in Stripe/Kit

## Support

For deployment issues:
- Vercel Discord: https://vercel.com/discord
- Vercel Support: https://vercel.com/support
- GitHub issues for code problems