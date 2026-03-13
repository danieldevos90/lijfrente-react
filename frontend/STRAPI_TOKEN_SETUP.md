# Strapi API Token Setup Guide

## Quick Fix for 401 Error

The 401 error occurs because the Strapi API token is missing or invalid. Here's how to fix it:

### Option 1: Quick Setup (Recommended)

1. **Get your token from Strapi Admin:**
   - Visit: https://cms.geldgeregeld.nl/admin
   - Go to: **Settings → API Tokens**
   - Click **Create new API Token**
   - Name: `Frontend API Token`
   - Token type: `Read-only` (or `Full-access` if you need write access)
   - Token duration: `Unlimited` (or set expiration)
   - Click **Save**
   - **Copy the token** (you'll only see it once!)

2. **Add to local environment:**
   ```bash
   cd frontend
   echo "STRAPI_API_TOKEN=your-token-here" >> .env.local
   ```

3. **Add to Vercel (for production):**
   ```bash
   cd frontend
   vercel env add STRAPI_API_TOKEN
   # Paste your token when prompted
   # Select: Production, Preview, Development
   ```

### Option 2: Use the Setup Script

```bash
cd frontend
python3 scripts/setup-strapi-token.py <your-token>
```

Or use the quick script:
```bash
cd frontend
./scripts/quick-setup-token.sh <your-token>
```

### Option 3: Manual Setup

1. **Local (.env.local):**
   ```bash
   cd frontend
   # Edit .env.local and add:
   STRAPI_API_TOKEN=your-token-here
   ```

2. **Vercel:**
   - Go to: https://vercel.com/danieldevos90s-projects/geldgeregeld2/settings/environment-variables
   - Click **Add New**
   - Name: `STRAPI_API_TOKEN`
   - Value: `your-token-here`
   - Select environments: Production, Preview, Development
   - Click **Save**

## Verify Setup

After adding the token, test it:

```bash
cd frontend
curl -H "Authorization: Bearer $(grep STRAPI_API_TOKEN .env.local | cut -d '=' -f2)" \
  "https://cms.geldgeregeld.nl/api/pages?pagination[pageSize]=1"
```

Should return HTTP 200.

## Troubleshooting

### Still getting 401?
- ✅ Check token is correct (no extra spaces)
- ✅ Verify token hasn't expired
- ✅ Ensure token has correct permissions (Read-only minimum)
- ✅ Restart dev server after adding to .env.local

### Token not working in production?
- ✅ Check Vercel environment variables are set
- ✅ Verify you selected the right environments (Production/Preview/Development)
- ✅ Redeploy after adding environment variables

## Security Notes

- ⚠️ Never commit `.env.local` to git (it's in `.gitignore`)
- ⚠️ Never commit tokens to code
- ✅ Use environment variables for all tokens
- ✅ Use Read-only tokens when possible (more secure)
