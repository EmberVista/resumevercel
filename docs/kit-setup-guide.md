# Kit (ConvertKit) Setup Guide

This guide will help you set up Kit integration for ResumeV5 with a fresh Kit account.

## Step 1: Get Your API Credentials

1. Log in to your Kit account at https://app.kit.com
2. Go to Settings → Advanced → API
3. Copy your **API Key** and **API Secret**
4. Update `.env.local` with these values:
   ```
   KIT_API_KEY=your-actual-api-key
   KIT_API_SECRET=your-actual-api-secret
   ```

## Step 2: Create Tags

In Kit, go to Subscribers → Tags and create these tags:

1. **Free User** - For users who sign up but haven't paid
2. **Paid User** - For users with active subscriptions
3. **Churned User** - For users who cancelled
4. **Low ATS Score** - For users with ATS scores below 60

After creating each tag, click on it to get the Tag ID from the URL:
- Example: `https://app.kit.com/tags/1234567` → Tag ID is `1234567`

Update `.env.local` with these IDs:
```
KIT_FREE_USER_TAG_ID=your-free-user-tag-id
KIT_PAID_USER_TAG_ID=your-paid-user-tag-id
KIT_CHURNED_USER_TAG_ID=your-churned-user-tag-id
KIT_LOW_SCORE_TAG_ID=your-low-score-tag-id
```

## Step 3: Create Forms

1. Go to Grow → Landing Pages & Forms
2. Create a new form called "ResumeV5 Newsletter"
3. Configure the form settings:
   - Incentive Email: Create a welcome email with resume tips
   - Success Action: Show success message
   - Settings: Enable double opt-in

4. Get the Form ID from the URL or API
5. Update `.env.local`:
   ```
   KIT_DEFAULT_FORM_ID=your-form-id
   ```

## Step 4: Create Email Sequences

### Welcome Sequence
1. Go to Automate → Sequences
2. Create "Welcome Series" sequence
3. Add 5-7 emails with resume tips:
   - Email 1: Welcome & top 3 resume mistakes (immediate)
   - Email 2: ATS optimization guide (day 2)
   - Email 3: Achievement writing formula (day 4)
   - Email 4: Cover letter templates (day 7)
   - Email 5: Interview prep checklist (day 10)

### Win-Back Sequence
1. Create "Win Back" sequence for churned users
2. Add 3-4 emails:
   - Email 1: We miss you + special offer (immediate)
   - Email 2: Success story testimonial (day 3)
   - Email 3: Limited time discount (day 7)
   - Email 4: Final offer (day 14)

Update `.env.local` with sequence IDs:
```
KIT_WELCOME_SEQUENCE_ID=your-welcome-sequence-id
KIT_WINBACK_SEQUENCE_ID=your-winback-sequence-id
```

## Step 5: Set Up Webhooks

1. In Kit, go to Automations → Rules
2. Create a new rule: "Webhook on Subscribe"
   - Trigger: Subscriber activated
   - Action: Webhook → POST to `https://resumeably.ai/api/kit/webhook`

3. Create another rule: "Webhook on Unsubscribe"
   - Trigger: Subscriber unsubscribed
   - Action: Webhook → POST to `https://resumeably.ai/api/kit/webhook`

4. Generate a webhook secret for security (optional but recommended)
5. Update `.env.local`:
   ```
   KIT_WEBHOOK_SECRET=your-webhook-secret
   ```

## Step 6: Configure Custom Fields

In Kit, go to Subscribers → Custom Fields and create:

1. **source** (text) - Where they signed up from
2. **signup_date** (date) - When they joined
3. **subscription_status** (text) - free/paid/churned
4. **subscription_date** (date) - When they became paid
5. **churn_date** (date) - When they cancelled
6. **last_analysis_date** (date) - Last resume analysis
7. **last_ats_score** (number) - Their ATS score
8. **total_analyses** (number) - Total analyses performed
9. **last_generation_date** (date) - Last AI rewrite
10. **total_generations** (number) - Total rewrites

## Step 7: Test the Integration

1. Run the setup verification:
   ```bash
   npm run kit:setup
   ```

2. This will:
   - Verify your API credentials
   - List all tags, forms, and sequences
   - Show what's missing

3. Test subscriber flow:
   - Sign up on the website
   - Check Kit dashboard for new subscriber
   - Verify tags are applied
   - Confirm welcome sequence starts

## Step 8: Create Automations

### Free to Paid Automation
1. Create rule: "Tag Paid Users"
   - Trigger: Tag added "Paid User"
   - Action: Remove tag "Free User"
   - Action: Send internal notification

### Low Score Nurture
1. Create rule: "Low Score Follow-up"
   - Trigger: Tag added "Low ATS Score"
   - Action: Add to sequence "ATS Improvement Tips"
   - Action: Send email with upgrade offer

### Re-engagement Campaign
1. Create segment: "Inactive 30 days"
   - Subscribed 30+ days ago
   - No email opens in 30 days
   - Tag is "Free User"
2. Create broadcast campaign with tips + upgrade offer

## Email Templates

### Welcome Email
```
Subject: Your 3 biggest resume mistakes (and how to fix them)

Hi {subscriber.first_name|there},

Thanks for joining ResumeV5! I'm excited to help you create a resume that gets noticed.

Here are the 3 biggest mistakes I see on resumes every day:

1. **Generic objective statements** - Replace with a powerful summary
2. **Listing duties instead of achievements** - Show impact with numbers
3. **Poor ATS optimization** - Missing keywords = instant rejection

Want to see how your resume scores? Get your free ATS analysis:
[Get Free Analysis](https://resumeably.ai)

Over the next few days, I'll share my best strategies for fixing these issues.

Best,
[Your Name]
P.S. Reply and tell me your biggest resume challenge - I read every email!
```

### Upgrade Email
```
Subject: {subscriber.first_name}, your resume scored {subscriber.last_ats_score}/100

Based on your recent analysis, your resume needs work to pass ATS filters.

The good news? Our AI can rewrite it to score 85+ guaranteed.

Here's what you get:
✓ Complete professional rewrite
✓ ATS-optimized formatting
✓ Powerful achievement bullets
✓ Keywords for your target role
✓ Downloadable DOCX file

Upgrade now and get interviews, not rejections:
[Upgrade Your Resume](https://resumeably.ai/checkout?email={subscriber.email_address})

Questions? Just reply to this email.
```

## Monitoring & Optimization

1. **Weekly Reviews**:
   - Check email open rates (target: 25%+)
   - Monitor click rates (target: 7%+)
   - Review unsubscribe rate (keep under 0.5%)

2. **Monthly Analysis**:
   - Free to paid conversion rate
   - Sequence completion rates
   - Tag distribution
   - Revenue per subscriber

3. **A/B Testing**:
   - Subject lines
   - Call-to-action buttons
   - Email send times
   - Upgrade offers

## Troubleshooting

**Subscribers not receiving emails?**
- Check if double opt-in is enabled
- Verify domain authentication in Kit
- Check spam folder

**Webhooks not working?**
- Verify webhook URL is correct
- Check for firewall/security blocks
- Test with Kit's webhook tester

**Tags not applying?**
- Ensure tag IDs are correct in .env
- Check API key permissions
- Look for errors in application logs

## Support

- Kit Support: https://help.kit.com
- API Documentation: https://developers.kit.com
- ResumeV5 Admin: inquire@resumeably.ai