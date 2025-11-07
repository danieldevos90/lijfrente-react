# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel project dashboard:

### Resend API Configuration

1. **RESEND_API_KEY**
   - Get from: https://resend.com/api-keys
   - **Never commit this to git** - only set in Vercel
   - Required for contact form to work

2. **RESEND_FROM_EMAIL**
   - Value: `hello@geldgeregeld.nl`
   - Must be verified in your Resend account
   - Defaults to `hello@geldgeregeld.nl` if not set

3. **CONTACT_EMAIL** (optional)
   - Value: `info@geldgeregeld.nl`
   - Email address to receive contact form submissions
   - Defaults to `info@geldgeregeld.nl` if not set

## How to Set in Vercel

1. Go to your Vercel project: https://vercel.com/danieldevos90s-projects/geldgeregeld2
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add each variable:
   - Name: `RESEND_API_KEY`
   - Value: `your_actual_api_key_from_resend`
   - Environment: Select **Production**, **Preview**, and **Development** as needed
5. Click **Save**
6. Redeploy your application for changes to take effect

## Verify Environment Variables

You can verify environment variables are set correctly:

```bash
# Check via Vercel CLI
vercel env ls

# Or check in Vercel dashboard
# Settings → Environment Variables
```

## Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ No API keys in code
- ✅ No API keys in documentation
- ✅ Code uses `process.env.RESEND_API_KEY`
- ⚠️ **Make sure RESEND_API_KEY is set in Vercel dashboard**

