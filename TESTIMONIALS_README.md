# Testimonials Feature

This document describes the testimonial system in the Geldgeregeld platform.

## Overview

The testimonial system allows you to collect and display customer reviews and testimonials across your site. It's built with Strapi as the CMS backend and React components for the frontend.

## Strapi Content Type

The `Testimonial` content type has the following fields:

- **name** (string, required): Customer's name
- **company** (string, required): Customer's company name
- **text** (text, required): The testimonial text
- **rating** (integer, 1-5): Star rating (default: 5)
- **siteId** (string, required): Site identifier (e.g., "geldgeregeld")
- **featured** (boolean): Whether to feature this testimonial prominently

## Seeding Testimonials

To populate your Strapi instance with sample testimonials:

1. Make sure your Strapi server is running:
   ```bash
   cd cms
   npm run develop
   ```

2. Get your Strapi API token:
   - Go to Settings → API Tokens in Strapi admin
   - Create a new token with "Full access" permissions
   - Copy the token

3. Run the seeding script:
   ```bash
   export STRAPI_TOKEN="your-token-here"
   export STRAPI_URL="http://localhost:1337"  # Optional, defaults to localhost
   python3 scripts/seed_testimonials.py
   ```

The script will create 20 diverse Dutch testimonials from various business sectors.

## Adding Testimonials Manually

Via Strapi Admin:

1. Navigate to Content Manager → Testimonials
2. Click "Create new entry"
3. Fill in the fields:
   - Name: Customer's full name
   - Company: Business name
   - Text: Testimonial content (keep it concise, 2-3 sentences)
   - Rating: 1-5 stars
   - Site ID: "geldgeregeld"
   - Featured: Check if you want it prominently displayed
4. Click "Save" and then "Publish"

## Using Testimonials in Pages

### In Strapi Dynamic Zones

When editing a Page in Strapi, you can add a testimonials section component that will fetch and display testimonials.

### Programmatically

Fetch testimonials via the Strapi API:

```typescript
const response = await fetch('http://localhost:1337/api/testimonials?filters[siteId][$eq]=geldgeregeld&filters[featured][$eq]=true');
const data = await response.json();
const testimonials = data.data.map(item => item.attributes);
```

### Component Usage

```tsx
import TestimonialsSection from '@/components/sections/TestimonialsSection';

<TestimonialsSection 
  title="Wat onze klanten zeggen"
  testimonials={testimonials}
/>
```

## Frontend Components

### TestimonialsSection
Main section wrapper with blue background.

### TestimonialSection
Grid layout displaying testimonial cards with:
- Star ratings
- Testimonial text
- Customer name and company
- Hover effects

## Best Practices

1. **Keep testimonials concise**: 2-3 sentences work best
2. **Use real names**: Builds trust and credibility
3. **Vary the businesses**: Show diversity in your customer base
4. **Update regularly**: Add new testimonials as you get them
5. **Feature your best**: Use the "featured" flag for exceptional reviews
6. **Include specific details**: Numbers, timeframes, and specific benefits are more credible

## Examples

### Good Testimonial
✓ "Binnen 48 uur had ik de bevestiging en kon ik verder met mijn groeiplans. De aanvraag was simpel en het hele proces transparant."

### Less Effective
✗ "Great service!" (too short, vague)
✗ "This is the best financial service I've ever used in my entire life and I recommend it to everyone..." (too long)

## API Endpoints

- **GET** `/api/testimonials` - List all testimonials
- **GET** `/api/testimonials/:id` - Get single testimonial
- **POST** `/api/testimonials` - Create testimonial (requires auth)
- **PUT** `/api/testimonials/:id` - Update testimonial (requires auth)
- **DELETE** `/api/testimonials/:id` - Delete testimonial (requires auth)

### Query Parameters

Filter by site:
```
/api/testimonials?filters[siteId][$eq]=geldgeregeld
```

Get only featured:
```
/api/testimonials?filters[featured][$eq]=true
```

Sort by creation date:
```
/api/testimonials?sort=createdAt:desc
```

## Troubleshooting

### Testimonials not appearing
- Check that testimonials are published (not draft)
- Verify the siteId matches your configuration
- Check API permissions in Strapi

### Script fails to create testimonials
- Ensure STRAPI_TOKEN is set correctly
- Verify Strapi is running
- Check that the testimonial content type exists

### Styling issues
- Check that tokens.css is properly imported
- Verify the Section component is wrapping properly
- Inspect browser console for errors

## Future Enhancements

Potential improvements:
- Photo uploads for testimonials
- Video testimonials
- Verification badges
- Industry/category filtering
- Testimonial request forms
- Import from review platforms




