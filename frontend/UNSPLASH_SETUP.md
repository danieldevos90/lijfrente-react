# Unsplash API Setup

This project uses Unsplash API to fetch high-quality images for sector pages when Strapi images are not available.

## Getting an Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an account or log in
3. Click "New Application"
4. Fill in the application details:
   - Application name: "GeldGeregeld" (or your app name)
   - Description: "Business financing website"
   - Website URL: Your website URL
5. Accept the API Use and Guidelines
6. Copy your **Access Key** (starts with something like `abc123...`)

## Setting Up Environment Variables

### Local Development

Add to `frontend/.env.local`:

```bash
UNSPLASH_ACCESS_KEY=your_access_key_here
```

### Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `UNSPLASH_ACCESS_KEY`
   - **Value**: Your Unsplash Access Key
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your application

## Usage

The Unsplash integration automatically:
- Fetches images for use cases when Strapi images are not available
- Uses sector-specific search queries (e.g., "restaurant kitchen" for horeca)
- Caches images for 1 hour to reduce API calls
- Falls back gracefully if the API key is not set

## API Rate Limits

Unsplash free tier allows:
- 50 requests per hour
- 5,000 requests per month

Images are cached for 1 hour, so repeated page loads won't count against your limit.

## Sector-Specific Queries

The following sectors have predefined search queries:

- `horeca`: "restaurant kitchen professional"
- `retail`: "retail store shop"
- `transport`: "truck logistics delivery"
- `bouw`: "construction building site"
- `ecommerce`: "online shopping warehouse"
- `zorg`: "healthcare medical"
- `consultants`: "business meeting office"
- `schoonmaak`: "cleaning service professional"
- `automotive`: "car repair garage automotive"
- `productie`: "factory manufacturing production"

You can customize these in `frontend/lib/unsplash.ts`.
