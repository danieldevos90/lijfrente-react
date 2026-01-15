# Dynamic Sector-Based Testimonials Guide

## Overview

The testimonials system has been enhanced to be dynamic, SEO-proof, Dutch, and sector-specific. Testimonials now automatically adapt to the sector being viewed, improving relevance and SEO performance.

## Features

### ✅ Sector-Specific Testimonials
- Each sector (horeca, retail, transport, etc.) has its own set of testimonials
- Testimonials are automatically displayed on sector pages
- Falls back to general testimonials if sector-specific ones are not available

### ✅ SEO Optimization
- Structured data (JSON-LD) added for rich snippets
- Testimonials include ratings, author information, and company details
- Improves search engine visibility and potential for star ratings in search results

### ✅ Dutch Language
- All testimonials are in Dutch
- Sector-specific terminology and context
- Authentic Dutch business names and roles

### ✅ Dynamic Loading
- Fetches from Strapi CMS first (if available)
- Falls back to static testimonials if Strapi is unavailable
- Supports both Strapi-managed and static testimonials

## Implementation Details

### 1. Strapi Schema Updates

The testimonial schema has been updated to include:
- `sector` (string) - Sector slug for filtering
- `role` (string) - Job title or role
- `image` (media) - Profile image (optional)

**File**: `cms/src/api/testimonial/content-types/testimonial/schema.json`

### 2. TypeScript Types

Updated `StrapiTestimonial` interface to include:
- `sector?: string`
- `company: string`
- `role?: string`
- `rating?: number`
- `featured?: boolean`

**File**: `frontend/types/strapi-cms.ts`

### 3. New Functions

#### `getSectorTestimonials(sector: string)`
Returns sector-specific testimonials from static data.

**File**: `frontend/lib/sector-testimonials.ts`

#### `getSectorTestimonials(siteId: string, sector: string, options?)`
Fetches sector-specific testimonials from Strapi CMS.

**File**: `frontend/lib/strapi-cms.ts`

### 4. Component Updates

#### TestimonialsCarousel
- Added structured data (JSON-LD) for SEO
- Supports optional ratings display
- Shows company name alongside role
- Handles missing images gracefully

**File**: `frontend/components/TestimonialsCarousel.tsx`

### 5. Sector Pages Integration

Sector pages now automatically:
- Fetch sector-specific testimonials from Strapi
- Fall back to static testimonials if Strapi is unavailable
- Display testimonials with sector-specific titles

**File**: `frontend/app/sectoren/[sector]/page.tsx`

## Available Sectors

The following sectors have testimonials:

1. **horeca** - Horeca (restaurants, cafés, hotels)
2. **retail** - Retail (webshops, physical stores)
3. **transport** - Transport & Logistiek
4. **bouw** - Bouw & Installatie
5. **ecommerce** - E-commerce
6. **zorg** - Zorg & Welzijn
7. **consultants** - Advies & Consultancy
8. **schoonmaak** - Schoonmaak
9. **automotive** - Automotive
10. **productie** - Productie & Industrie

## Usage

### In Sector Pages

Testimonials are automatically displayed on sector pages. No additional configuration needed.

### In Other Pages

To use sector-specific testimonials in other pages:

```typescript
import { getSectorTestimonials, convertToCarouselFormat } from '@/lib/sector-testimonials';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

// Get testimonials for a specific sector
const testimonials = getSectorTestimonials('horeca');
const carouselTestimonials = convertToCarouselFormat(testimonials);

// Use in component
<TestimonialsCarousel
  title="Wat horeca ondernemers zeggen"
  subtitle="Meer dan 500 tevreden ondernemers gingen je voor"
  testimonials={carouselTestimonials}
/>
```

### From Strapi CMS

```typescript
import { getSectorTestimonials } from '@/lib/strapi-cms';

const strapiTestimonials = await getSectorTestimonials('geldgeregeld', 'horeca', {
  next: { revalidate: 3600 }
});
```

## Adding New Testimonials

### Via Strapi CMS

1. Go to **Content Manager** → **Testimonials** → **Create New Entry**
2. Fill in:
   - **Name**: Customer name
   - **Company**: Company name
   - **Role**: Job title (optional)
   - **Text**: Testimonial text
   - **Rating**: 1-5 stars (default: 5)
   - **Sector**: Sector slug (e.g., 'horeca', 'retail')
   - **Site ID**: Your site ID (e.g., 'geldgeregeld')
   - **Image**: Profile image (optional)
   - **Featured**: Mark as featured (optional)

### Via Static Data

Edit `frontend/lib/sector-testimonials.ts` and add testimonials to the `SECTOR_TESTIMONIALS` object:

```typescript
export const SECTOR_TESTIMONIALS: Record<string, SectorTestimonial[]> = {
  horeca: [
    {
      name: 'Customer Name',
      role: 'Job Title',
      company: 'Company Name',
      text: 'Testimonial text in Dutch...',
      rating: 5,
      sector: 'horeca'
    },
    // Add more testimonials...
  ],
  // Add more sectors...
};
```

## SEO Benefits

### Structured Data

The testimonials component now includes JSON-LD structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Customer Name",
        "jobTitle": "Job Title"
      },
      "reviewBody": "Testimonial text...",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5
      }
    }
  ]
}
```

This helps search engines:
- Understand the content better
- Potentially display star ratings in search results
- Improve click-through rates

## Best Practices

1. **Keep testimonials authentic**: Use real-sounding Dutch names and companies
2. **Sector-specific content**: Mention sector-specific benefits and use cases
3. **Include ratings**: Always include a rating (1-5 stars) for better SEO
4. **Add images**: Profile images improve trust and engagement
5. **Regular updates**: Keep testimonials fresh and relevant

## Testing

To test the testimonials:

1. Visit a sector page: `/sectoren/horeca`
2. Scroll to the testimonials section
3. Verify testimonials are sector-specific
4. Check browser console for any errors
5. Verify structured data in page source (View → Developer → View Source)

## Troubleshooting

### Testimonials not showing

1. Check if sector exists in `SECTOR_TESTIMONIALS`
2. Verify Strapi connection (check console logs)
3. Check if testimonials are published in Strapi

### Wrong testimonials displayed

1. Verify sector slug matches exactly
2. Check Strapi filters are correct
3. Verify fallback logic is working

### Images not loading

1. Check image paths are correct
2. Verify Strapi image URLs are properly formatted
3. Check if default fallback image exists

## Future Enhancements

Potential improvements:
- [ ] Add testimonial filtering by rating
- [ ] Add testimonial search functionality
- [ ] Add testimonial moderation workflow
- [ ] Add testimonial analytics
- [ ] Support multiple languages
- [ ] Add testimonial categories/tags
