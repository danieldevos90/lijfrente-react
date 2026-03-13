# Fix Strapi 401 Error on Vercel

## Quick Fix

The 401 error on Vercel is because `STRAPI_API_TOKEN` is missing from Vercel environment variables.

### Option 1: Automated Fix (Recommended)

```bash
cd frontend

# Get your token from Strapi Admin first:
# 1. Visit: https://cms.geldgeregeld.nl/admin
# 2. Go to: Settings → API Tokens
# 3. Create a new token and copy it

# Then run:
./scripts/fix-vercel-strapi.sh <your-token>
```

This script will:
- ✅ Add `NEXT_PUBLIC_STRAPI_URL` to all environments
- ✅ Add `STRAPI_API_TOKEN` to all environments
- ✅ Test the token before adding
- ✅ Verify the setup

### Option 2: Manual Fix via Vercel CLI

```bash
cd frontend

# Add STRAPI_API_TOKEN
vercel env add STRAPI_API_TOKEN
# Select: Production, Preview, Development
# Paste your token when prompted

# Add NEXT_PUBLIC_STRAPI_URL (if not already set)
vercel env add NEXT_PUBLIC_STRAPI_URL
# Value: https://cms.geldgeregeld.nl
# Select: Production, Preview, Development
```

### Option 3: Manual Fix via Vercel Dashboard

1. Go to: https://vercel.com/danieldevos90s-projects/geldgeregeld2/settings/environment-variables

2. **Add STRAPI_API_TOKEN:**
   - Click **Add New**
   - Name: `STRAPI_API_TOKEN`
   - Value: `your-token-from-strapi-admin`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

3. **Add NEXT_PUBLIC_STRAPI_URL (if missing):**
   - Click **Add New**
   - Name: `NEXT_PUBLIC_STRAPI_URL`
   - Value: `https://cms.geldgeregeld.nl`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

4. **Redeploy:**
   - Go to Deployments
   - Click the three dots on the latest deployment
   - Click **Redeploy**

## Get Your Strapi Token

1. Visit: https://cms.geldgeregeld.nl/admin
2. Navigate to: **Settings → API Tokens**
3. Click **Create new API Token**
4. Fill in:
   - **Name**: `Frontend API Token`
   - **Token type**: `Read-only` (or `Full-access` if needed)
   - **Token duration**: `Unlimited` (or set expiration)
5. Click **Save**
6. **Copy the token** (you'll only see it once!)

## Verify Fix

After adding the token and redeploying:

```bash
# Check environment variables
cd frontend
vercel env ls | grep STRAPI

# Should show:
# STRAPI_API_TOKEN           Encrypted    Production, Preview, Development
# NEXT_PUBLIC_STRAPI_URL     Encrypted    Production, Preview, Development
```

## Important Notes

- ⚠️ **Redeploy required**: Environment variable changes require a new deployment
- ✅ **All environments**: Make sure to add to Production, Preview, AND Development
- 🔒 **Security**: Never commit tokens to git
- 🔄 **After adding**: Trigger a new deployment from Vercel dashboard

## Troubleshooting

### Still getting 401 after adding token?
- ✅ Verify token is correct (no extra spaces)
- ✅ Check token hasn't expired
- ✅ Ensure token has correct permissions
- ✅ **Redeploy** after adding environment variables
- ✅ Check Vercel logs for the actual error

### Token not working?
- ✅ Test token locally first: `curl -H "Authorization: Bearer <token>" https://cms.geldgeregeld.nl/api/pages`
- ✅ Verify token type is correct (Read-only minimum)
- ✅ Check Strapi admin to see if token is active
