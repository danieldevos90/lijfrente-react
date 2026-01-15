# Populate Sector Testimonials - CLI Guide

## Overview

The `populate_sector_testimonials.py` script populates Strapi CMS with sector-specific testimonials. It includes 54 testimonials across 18 sectors, all in Dutch and SEO-optimized.

## Prerequisites

1. Python 3.x installed
2. Valid Strapi API token
3. Strapi CMS running and accessible

## Setup

### 1. Set Environment Variables

Set your Strapi credentials as environment variables:

```bash
export STRAPI_URL="https://your-strapi-instance.com"
export STRAPI_TOKEN="your-api-token-here"
export SITE_ID="geldgeregeld"  # Optional, defaults to 'geldgeregeld'
```

Or create a `.env` file in the project root:

```bash
STRAPI_URL=https://your-strapi-instance.com
STRAPI_TOKEN=your-api-token-here
SITE_ID=geldgeregeld
```

### 2. Get Your Strapi API Token

1. Log into your Strapi admin panel
2. Go to **Settings** → **API Tokens**
3. Create a new API token with **Full access** permissions
4. Copy the token and set it as `STRAPI_TOKEN`

## Usage

### List Available Sectors

```bash
python3 scripts/populate_sector_testimonials.py --list
```

### Populate All Testimonials

```bash
python3 scripts/populate_sector_testimonials.py
```

### Populate Specific Sector

```bash
python3 scripts/populate_sector_testimonials.py --sector horeca
```

### Delete Existing and Repopulate All

```bash
python3 scripts/populate_sector_testimonials.py --delete-all
```

### Delete Existing and Repopulate Specific Sector

```bash
python3 scripts/populate_sector_testimonials.py --sector horeca --delete
```

## Available Sectors

- `horeca` - Horeca (restaurants, cafés, hotels)
- `retail` - Retail (webshops, physical stores)
- `transport` - Transport & Logistiek
- `bouw` - Bouw & Installatie
- `ecommerce` - E-commerce
- `zorg` - Zorg & Welzijn
- `consultants` - Advies & Consultancy
- `schoonmaak` - Schoonmaak
- `automotive` - Automotive
- `productie` - Productie & Industrie
- `zzp` - ZZP (zelfstandigen zonder personeel)
- `starters` - Starters & Startups
- `franchise` - Franchise
- `medisch` - Medische Praktijken
- `tandarts` - Tandartspraktijken
- `groothandel` - Groothandel
- `schoonheid` - Schoonheidsindustrie
- `kasstroom` - Kasstroom & Werkkapitaal

## Examples

```bash
# Populate all testimonials
python3 scripts/populate_sector_testimonials.py

# Populate only horeca testimonials
python3 scripts/populate_sector_testimonials.py --sector horeca

# Delete all existing testimonials and repopulate
python3 scripts/populate_sector_testimonials.py --delete-all

# Delete horeca testimonials and repopulate
python3 scripts/populate_sector_testimonials.py --sector horeca --delete
```

## Output

The script will show:
- Progress for each sector
- Success/failure for each testimonial
- Summary at the end with total created/failed

Example output:
```
============================================================
🚀 Populating Sector-Specific Testimonials
============================================================
Site ID: geldgeregeld
Strapi URL: https://your-strapi-instance.com
Total testimonials: 54
Sectors: 18
============================================================

📝 Processing sector: HORECA
   Testimonials: 3
  ✅ Created: Sarah van der Berg - Café de Hoek (horeca)
  ✅ Created: Pieter Bakker - Restaurant De Gouden Leeuw (horeca)
  ✅ Created: Marieke de Vries - Hotel Amstelzicht (horeca)
...

============================================================
✅ COMPLETED
============================================================
Created: 54
Failed: 0
Total: 54
============================================================
```

## Troubleshooting

### 401 Unauthorized Error

This means your API token is invalid or expired. 

**Solution:**
1. Check your `STRAPI_TOKEN` environment variable
2. Verify the token has full access permissions in Strapi
3. Generate a new token if needed

### Connection Errors

**Solution:**
1. Verify `STRAPI_URL` is correct
2. Check if Strapi is running and accessible
3. Verify network connectivity

### Rate Limiting

If you see rate limit errors, the script includes small delays between requests. You can increase the delay in the script if needed.

## Notes

- The script creates testimonials with `featured: false` by default
- All testimonials are set to `rating: 5` (5 stars)
- Testimonials are linked to the sector via the `sector` field
- The script preserves existing testimonials unless `--delete` is used

## Integration with Frontend

After populating testimonials in Strapi:

1. The frontend will automatically fetch sector-specific testimonials
2. Testimonials are displayed on sector pages (e.g., `/sectoren/horeca`)
3. If Strapi testimonials are unavailable, the frontend falls back to static testimonials

## Next Steps

After running the script:

1. Verify testimonials in Strapi admin panel
2. Check sector pages to see testimonials displayed
3. Optionally add profile images to testimonials in Strapi
4. Mark important testimonials as `featured: true` if needed
