# Sector Pages - Strapi Collection Type Guide

## Overview

A dedicated Strapi collection type (`sector-page`) has been created for managing industry/sector-specific pages with structured content. These pages use the same visual style as `ImageTextBlock` and `BenefitsCarousel` components for consistency.

## Files Created

### Strapi Schemas
- `/cms/src/api/sector-page/content-types/sector-page/schema.json` - Main collection type
- `/cms/src/components/sectors/use-case.json` - Use case component
- `/cms/src/components/sectors/benefit.json` - Benefit component
- `/strapi/content-types/sector-page.schema.json` - Reference schema

### Frontend Components
- `/frontend/components/sections/EasyLendingSection.tsx` - Easy lending section (ImageTextBlock style)
- `/frontend/components/sections/UseCasesSection.tsx` - Use cases carousel (BenefitsCarousel style)
- `/frontend/app/sectoren/[sector]/page.tsx` - Updated sector page template

### Library Functions
- `/frontend/lib/strapi-cms.ts` - Added `getSectorPage()` and `getAllSectorPages()` functions

## Setup Instructions

### 1. Restart Strapi CMS

After adding the new collection type and components, restart Strapi:

```bash
cd cms
npm run develop
```

### 2. Create Sector Pages in Strapi

1. Go to **Content Manager** → **Sector Pages** → **Create New Entry**
2. Fill in the required fields:

#### Basic Information
- **Site ID**: `geldgeregeld` (or your site ID)
- **Sector Slug**: `horeca` (URL-friendly identifier, e.g., `horeca`, `retail`, `transport`)
- **Sector Name**: `Horeca` (Display name)

#### SEO Fields
- **Meta Title**: SEO title for the page (used for the `<title>` tag)
- **Meta Description**: SEO description for the page
- **Meta Keywords**: Comma-separated keywords

#### Hero Section
- **Hero Title**: Main title (e.g., "Zakelijke financiering voor de horeca")
- **Hero Subtitle**: Subtitle/description
- **Hero Image**: Optional hero image

#### Easy Lending Section
- **Easy Lending Title**: Title explaining how easy it is to get financing
- **Easy Lending Content**: Rich text content (HTML supported)
- **Easy Lending Image**: Optional image
- **Easy Lending Image Position**: `left`, `right`, or `top`

#### Use Cases Section
- **Use Cases Title**: Title for use cases (default: "Waarvoor kun je de financiering gebruiken?")
- **Use Cases Subtitle**: Subtitle
- **Use Cases**: Add multiple use case items:
  - Title (e.g., "Renovatie van restaurant")
  - Description (e.g., "Financier je restaurantrenovatie zonder gedoe")
  - Icon Path (e.g., `/icons/SVG/finance/wallet.svg`)
  - Color (hex, e.g., `#fff2b2`)
  - Text Color (hex, e.g., `#1e2021`)

#### Benefits Section
- **Benefits Title**: Title for benefits
- **Benefits Subtitle**: Subtitle
- **Benefits**: Add multiple benefit items (same structure as use cases)

#### CTA Section
- **CTA Title**: Call-to-action title
- **CTA Subtitle**: CTA subtitle
- **CTA Label**: Button text (default: "Vraag financiering aan")
- **CTA Href**: Button link (default: "/lead")

### 3. Example: Creating Horeca Sector Page

```json
{
  "siteId": "geldgeregeld",
  "sectorSlug": "horeca",
  "sectorName": "Horeca",
  "metaTitle": "Horeca financiering - Binnen 24 uur duidelijkheid",
  "metaDescription": "Zakelijke financiering speciaal voor restaurants, cafés en hotels. Snel, flexibel en zonder gedoe.",
  "metaKeywords": "horeca financiering, restaurant lening, café financiering",
  "heroTitle": "Zakelijke financiering voor de horeca",
  "heroSubtitle": "Financiering op maat voor restaurants, cafés en hotels",
  "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
  "easyLendingContent": "<p>Binnen 24 uur weet je of je in aanmerking komt. Geen papierwerk, geen gedoe.</p>",
  "easyLendingImagePosition": "left",
  "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
  "useCases": [
    {
      "title": "Restaurant renovatie",
      "description": "Financier je restaurantrenovatie zonder gedoe",
      "iconPath": "/icons/SVG/finance/wallet.svg",
      "color": "#fff2b2",
      "textColor": "#1e2021"
    },
    {
      "title": "Nieuwe apparatuur",
      "description": "Investeer in nieuwe keukenapparatuur",
      "iconPath": "/icons/SVG/finance/wallet.svg",
      "color": "#e4f2ff",
      "textColor": "#0f1720"
    }
  ],
  "benefitsTitle": "Waarom kiezen voor onze financiering?",
  "benefits": [
    {
      "title": "Snel geregeld",
      "description": "Binnen 24 uur inzicht",
      "iconPath": "/icons/SVG/interface/zap.svg"
    }
  ],
  "ctaTitle": "Klaar om te beginnen?",
  "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan",
  "ctaLabel": "Vraag financiering aan",
  "ctaHref": "/lead"
}
```

## Component Styles

### Easy Lending Section
- Uses `ImageTextBlock` component style
- Supports image left/right/top layouts
- Centered content with titles and descriptions
- Matches existing design system

### Use Cases Section
- Uses `BenefitsCarousel` component style
- Horizontal scrolling carousel
- Colorful cards with icons
- Alternating colors (yellow/blue pattern)

### Benefits Section
- Uses `BenefitsCarousel` component
- Same visual style as use cases
- Sector-specific benefits

## URL Structure

Sector pages are automatically available at:
- `/sectoren/horeca` - Horeca sector page
- `/sectoren/retail` - Retail sector page
- `/sectoren/transport` - Transport sector page
- etc.

## Features

✅ **Structured Content**: Dedicated fields for each section
✅ **SEO Optimized**: Meta description and keywords
✅ **Visual Consistency**: Uses existing component styles
✅ **Flexible**: Add/remove use cases and benefits easily
✅ **Image Support**: Hero and easy lending images
✅ **Rich Text**: HTML content support
✅ **No Navigation**: Pages are not included in navigation (as requested)

## Fallback Behavior

If a sector page doesn't exist in Strapi:
- Shows basic page with sector name and description
- Uses predefined SEO metadata
- Displays CTA button

## Adding New Sectors

1. Add sector info to `SECTOR_INFO` in `/frontend/app/sectoren/[sector]/page.tsx`
2. Create the sector page in Strapi with matching `sectorSlug`
3. The page will automatically be available at `/sectoren/{sector-slug}`

## API Endpoints

- `GET /api/sector-pages?filters[sectorSlug][$eq]=horeca&filters[siteId][$eq]=geldgeregeld`
- `GET /api/sector-pages?filters[siteId][$eq]=geldgeregeld` (all sectors)

## Next Steps

1. Restart Strapi CMS to load the new collection type
2. Create sector pages for each industry
3. Add unique, sector-specific content
4. Monitor SEO performance

