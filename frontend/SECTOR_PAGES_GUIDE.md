# Sector Pages Implementation Guide

## Overview

This implementation creates a comprehensive sector/industry page system for SEO purposes. Each sector gets its own dedicated page with unique content that can be managed through Strapi CMS.

## Structure

### Routes Created

1. **`/sectoren`** - Sector listing page showing all available sectors
2. **`/sectoren/[sector]`** - Individual sector pages (e.g., `/sectoren/horeca`, `/sectoren/retail`)

### Files Created

- `frontend/app/sectoren/page.tsx` - Sector listing/index page
- `frontend/app/sectoren/[sector]/page.tsx` - Dynamic sector page template

## How It Works

### 1. Slug Convention

Sector pages in Strapi use the slug pattern: `sector-{sector-slug}`

For example:
- URL: `/sectoren/horeca` → Strapi slug: `sector-horeca`
- URL: `/sectoren/retail` → Strapi slug: `sector-retail`

### 2. Predefined Sectors

The system includes 10 predefined sectors with SEO metadata:

- **horeca** - Horeca (restaurants, cafés, hotels)
- **retail** - Retail (webshops, physical stores)
- **transport** - Transport & Logistiek
- **bouw** - Bouw & Installatie
- **ecommerce** - E-commerce
- **zorg** - Zorg & Welzijn
- **consultants** - Advies & Consultancy
- **schoonmaak** - Schoonmaak
- **automotive** - Automotive
- **productie** - Productie & Industrie

### 3. Fallback Content

If a sector page doesn't exist in Strapi yet, the system will:
- Show a basic page with sector-specific information
- Use predefined SEO metadata
- Display a CTA to request financing

### 4. Strapi Integration

When creating sector pages in Strapi:

1. **Page Slug**: Use `sector-{sector-name}` (e.g., `sector-horeca`)
2. **Site ID**: Set to your site ID (default: `geldgeregeld`)
3. **Sections**: Use any of the available section components:
   - Hero Section
   - Benefits Carousel
   - Feature Section
   - Content Section
   - FAQ Section
   - CTA Section
   - And more...

4. **SEO Fields**:
   - `title` - Page title
   - `metaDescription` - SEO description
   - `metaKeywords` - SEO keywords

## Creating a Sector Page in Strapi

### Example: Creating Horeca Sector Page

1. Go to Strapi CMS → Pages → Create New Entry
2. Set the following fields:
   - **Site ID**: `geldgeregeld`
   - **Slug**: `sector-horeca`
   - **Title**: `Zakelijke financiering voor de horeca`
   - **Meta Description**: `Zakelijke financiering speciaal voor restaurants, cafés en hotels. Snel, flexibel en zonder gedoe.`
   - **Meta Keywords**: `horeca financiering, restaurant lening, café financiering, hotel financiering`

3. Add sections (e.g., Hero Section, Benefits, FAQ)
4. Publish the page

### Adding New Sectors

To add a new sector:

1. Add the sector to `SECTOR_INFO` in both:
   - `frontend/app/sectoren/page.tsx`
   - `frontend/app/sectoren/[sector]/page.tsx`

2. Add the sector slug to `generateStaticParams()` in `[sector]/page.tsx`

3. Create the page in Strapi with slug `sector-{new-sector-slug}`

## SEO Benefits

1. **Unique Content**: Each sector page can have completely unique content
2. **Targeted Keywords**: Sector-specific keywords for better rankings
3. **Internal Linking**: Related sectors section creates internal links
4. **Structured Data**: Proper metadata and OpenGraph tags
5. **Static Generation**: Common sectors are pre-rendered for better performance

## Features

- ✅ Dynamic routing for unlimited sectors
- ✅ Strapi CMS integration
- ✅ Fallback content for sectors without Strapi pages
- ✅ SEO-optimized metadata
- ✅ Related sectors section
- ✅ Responsive design
- ✅ Static generation for common sectors

## Next Steps

1. Create sector pages in Strapi for each predefined sector
2. Add unique, sector-specific content to each page
3. Monitor SEO performance for sector-related keywords
4. Expand with additional sectors as needed

## Example URLs

- `/sectoren` - All sectors listing
- `/sectoren/horeca` - Horeca sector page
- `/sectoren/retail` - Retail sector page
- `/sectoren/transport` - Transport sector page

