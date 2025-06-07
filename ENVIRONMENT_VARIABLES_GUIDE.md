# Environment Variables Setup Guide for Vercel

This guide lists all the environment variables needed for deployment WITHOUT including actual sensitive values.

## Required Environment Variables

### 1. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=       # Your Supabase project URL (from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Your Supabase anonymous key (safe for client-side)
SUPABASE_SERVICE_ROLE_KEY=      # Your Supabase service role key (keep secret!)
```

### 2. Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Stripe publishable key (pk_test_... or pk_live_...)
STRIPE_SECRET_KEY=                   # Stripe secret key (sk_test_... or sk_live_...)
STRIPE_WEBHOOK_SECRET=               # Generated after creating webhook endpoint
STRIPE_MONTHLY_PRICE_ID=             # Price ID for monthly subscription
STRIPE_SINGLE_PRICE_ID=              # Price ID for one-time purchase
```

### 3. AI API Keys
```
ANTHROPIC_API_KEY=  # Your Anthropic (Claude) API key
OPENAI_API_KEY=     # Your OpenAI API key (fallback)
```

### 4. Kit (ConvertKit) Configuration
```
KIT_API_KEY=                # Your Kit API key
KIT_API_SECRET=             # Your Kit API secret
KIT_WEBHOOK_SECRET=         # Optional: for webhook verification
KIT_DEFAULT_FORM_ID=        # ID of your default signup form
KIT_WELCOME_SEQUENCE_ID=    # ID of welcome email sequence
KIT_WINBACK_SEQUENCE_ID=    # ID of win-back sequence
KIT_FREE_USER_TAG_ID=       # Tag ID for free users
KIT_PAID_USER_TAG_ID=       # Tag ID for paid users
KIT_CHURNED_USER_TAG_ID=    # Tag ID for churned users
KIT_LOW_SCORE_TAG_ID=       # Tag ID for low ATS scores
```

### 5. Upstash Redis (for Queue System)
```
UPSTASH_REDIS_REST_URL=    # Your Upstash Redis REST URL
UPSTASH_REDIS_REST_TOKEN=  # Your Upstash Redis REST token
```

### 6. Application Settings
```
NEXT_PUBLIC_APP_URL=  # https://resumeably.ai (or your domain)
ADMIN_EMAIL=          # Admin email address (e.g., inquire@resumeably.ai)
```

## How to Set These in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with its corresponding value
4. Make sure to select the appropriate environments (Production, Preview, Development)

## Important Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Keep all other variables secret, especially:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - All API keys

## Getting Your Keys

### Supabase
1. Go to your Supabase project
2. Settings → API
3. Copy the URL and keys

### Stripe
1. Dashboard → Developers → API keys
2. For webhooks: Developers → Webhooks → Add endpoint
3. Use endpoint: `https://your-domain.com/api/stripe/webhook`

### Anthropic
1. Visit https://console.anthropic.com
2. Create an API key

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Create an API key

### Kit (ConvertKit)
1. Settings → Advanced → API
2. Follow the setup guide in KIT_SETUP_INSTRUCTIONS.md

### Upstash
1. Create account at https://upstash.com
2. Create a Redis database
3. Copy REST URL and token from the dashboard