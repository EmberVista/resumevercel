# Kit (ConvertKit) Setup Instructions

## Quick Start Guide

This guide helps you configure Kit (ConvertKit) for the ResumeV5 application.

## 1. Get Your API Credentials

1. Log in to Kit: https://app.kit.com
2. Go to Settings → Advanced → API
3. Copy your **API Key** and **API Secret**
4. Update `.env.local`:
   ```
   KIT_API_KEY=your-actual-api-key
   KIT_API_SECRET=your-actual-api-secret
   ```

## 2. Create Required Tags

Go to Subscribers → Tags and create:
1. **Free User** - For users who sign up but haven't paid
2. **Paid User** - For users with active subscriptions
3. **Churned User** - For users who cancelled
4. **Low ATS Score** - For users with ATS scores below 60

Get each Tag ID from the URL (e.g., `https://app.kit.com/tags/1234567` → ID is `1234567`)

Update `.env.local`:
```
KIT_FREE_USER_TAG_ID=your-free-user-tag-id
KIT_PAID_USER_TAG_ID=your-paid-user-tag-id
KIT_CHURNED_USER_TAG_ID=your-churned-user-tag-id
KIT_LOW_SCORE_TAG_ID=your-low-score-tag-id
```

## 3. Create Newsletter Form

1. Go to Grow → Landing Pages & Forms
2. Create form: "ResumeV5 Newsletter"
3. Settings:
   - Enable double opt-in
   - Add incentive email with resume tips
4. Get Form ID and update `.env.local`:
   ```
   KIT_DEFAULT_FORM_ID=your-form-id
   ```

## 4. Create Email Sequences

### Welcome Sequence
1. Go to Automate → Sequences → Create "Welcome Series"
2. Add emails:
   - Day 0: Welcome & top 3 resume mistakes
   - Day 2: ATS optimization guide
   - Day 4: Achievement writing formula
   - Day 7: Cover letter templates
   - Day 10: Interview prep checklist

### Win-Back Sequence
1. Create "Win Back" sequence
2. Add emails:
   - Day 0: We miss you + special offer
   - Day 3: Success story testimonial
   - Day 7: Limited time discount
   - Day 14: Final offer

Update `.env.local`:
```
KIT_WELCOME_SEQUENCE_ID=your-welcome-sequence-id
KIT_WINBACK_SEQUENCE_ID=your-winback-sequence-id
```

## 5. Set Up Webhooks

1. Go to Automations → Rules
2. Create "Webhook on Subscribe":
   - Trigger: Subscriber activated
   - Action: Webhook → POST to `https://resumeably.ai/api/kit/webhook`
3. Create "Webhook on Unsubscribe":
   - Trigger: Subscriber unsubscribed
   - Action: Webhook → POST to `https://resumeably.ai/api/kit/webhook`

## 6. Verify Setup

Run the verification script:
```bash
npm run kit:setup
```

This will:
- Test API connection
- List all tags, forms, and sequences
- Show what's missing
- Provide next steps

## 7. Test Integration

1. Sign up on the website
2. Check Kit dashboard for new subscriber
3. Verify tags are applied
4. Confirm welcome sequence starts

## Support

- Kit Documentation: https://developers.kit.com
- Kit Support: https://help.kit.com
- ResumeV5 Admin: inquire@resumeably.ai

## Full Documentation

For detailed setup instructions, email templates, and troubleshooting, see:
`/docs/kit-setup-guide.md`