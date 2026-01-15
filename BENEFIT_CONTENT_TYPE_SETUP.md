# Benefit Content Type Setup

## Overview

The Benefit content type provides SEO-optimized benefit entries that can be used across the site. Each benefit includes comprehensive SEO metadata for better search engine visibility.

## Content Type Structure

### Fields

- **siteId** (string, required): Multi-site identifier
- **slug** (UID, required): URL-friendly identifier (auto-generated from title)
- **title** (string, required): Benefit title
- **description** (text, required): Detailed benefit description
- **shortDescription** (string, optional): Short description for cards/previews
- **metaDescription** (text, optional): SEO meta description (150-160 characters recommended)
- **metaKeywords** (string, optional): SEO keywords (comma-separated)
- **metaTitle** (string, optional): Custom SEO title (if different from title)
- **iconPath** (string, optional): Path to icon SVG
- **color** (string, default: #fff2b2): Background color (hex)
- **textColor** (string, default: #1e2021): Text color (hex)
- **featured** (boolean, default: false): Featured benefit (shown prominently)
- **order** (integer, default: 0): Display order

## Setup Instructions

### 1. Deploy CMS

First, ensure the CMS is deployed to Strapi Cloud so the content type is available:

```bash
cd cms
npm run build
npm run deploy -- --force
```

Wait 30-60 seconds for Strapi Cloud to sync the new content type.

### 2. Create Benefits

Run the script to create the two SEO-optimized benefits:

```bash
cd scripts
python3 create_benefits_via_api.py
```

Or set environment variables:

```bash
export STRAPI_URL="https://your-strapi-instance.strapiapp.com"
export STRAPI_API_TOKEN="your-api-token"
export SITE_ID="geldgeregeld"
python3 create_benefits_via_api.py
```

### 3. Verify Benefits

Check that benefits were created:

```bash
curl -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  "$STRAPI_URL/api/benefits?filters[siteId][\$eq]=geldgeregeld"
```

## Created Benefits

The script creates two SEO-optimized benefits:

### 1. Geen wachttijden
- **Slug**: `geen-wachttijden`
- **Title**: Geen wachttijden
- **Description**: Snel geregeld zonder lange wachttijden. Bij ons krijg je binnen 24 uur een beslissing op je aanvraag.
- **SEO Keywords**: geen wachttijden, snel zakelijke lening, snelle financiering, zakelijke lening zonder wachttijd

### 2. Geen bijkomende kosten
- **Slug**: `geen-bijkomende-kosten`
- **Title**: Geen bijkomende kosten
- **Description**: Transparante tarieven zonder verborgen kosten. Geen opstartkosten, geen verborgen fees.
- **SEO Keywords**: geen bijkomende kosten, transparante zakelijke lening, geen opstartkosten, zakelijke lening zonder verborgen kosten

## API Usage

### Fetch All Benefits

```bash
GET /api/benefits?filters[siteId][$eq]=geldgeregeld
```

### Fetch Single Benefit

```bash
GET /api/benefits?filters[slug][$eq]=geen-wachttijden&filters[siteId][$eq]=geldgeregeld
```

### Fetch Featured Benefits

```bash
GET /api/benefits?filters[featured][$eq]=true&filters[siteId][$eq]=geldgeregeld&sort=order:asc
```

## Frontend Integration

Benefits can be fetched and displayed in the frontend:

```typescript
// Fetch benefits from Strapi
const response = await fetch(
  `${STRAPI_URL}/api/benefits?filters[siteId][$eq]=geldgeregeld&sort=order:asc`
);
const { data } = await response.json();

// Use in components
data.forEach(benefit => {
  // benefit.title
  // benefit.description
  // benefit.metaDescription
  // benefit.iconPath
  // etc.
});
```

## SEO Best Practices

Each benefit includes:
- **Unique slug**: URL-friendly identifier
- **Meta title**: Optimized for search engines (50-60 characters)
- **Meta description**: Compelling description (150-160 characters)
- **Meta keywords**: Relevant search terms
- **Structured content**: Clear title and description hierarchy

## Manual Creation

If you prefer to create benefits manually in Strapi Admin:

1. Go to **Content Manager** → **Benefit**
2. Click **Create new entry**
3. Fill in all fields:
   - Set `siteId` to your site identifier
   - Enter `title` (slug will auto-generate)
   - Add `description` and `shortDescription`
   - Fill in SEO fields (`metaTitle`, `metaDescription`, `metaKeywords`)
   - Set `iconPath`, `color`, `textColor` if needed
   - Set `featured` and `order` for display control
4. Click **Save** and **Publish**

## Troubleshooting

### Content Type Not Found

If you get a 404 error:
1. Ensure CMS is deployed: `cd cms && npm run deploy`
2. Wait 30-60 seconds for sync
3. Check Strapi Admin → Content-Type Builder → Benefit exists

### Permissions Error

If you get a 403 error:
1. Check that permissions are enabled in `cms/src/index.ts`
2. Verify public role has `api::benefit.benefit.find` and `api::benefit.benefit.findOne` permissions
3. Re-deploy CMS if permissions were updated

### Benefits Not Appearing

1. Check `siteId` filter matches your site
2. Verify benefits are published (not draft)
3. Check API response for errors
