# Strapi CMS - Content Types & Components

## Overview

This folder contains the Strapi Cloud content type schemas. The actual Strapi application is in the `/cms` folder.

## Architecture

We use a `siteId` field (string) for multi-site filtering across all content types.

## Content Types

### 1. **site**
Site-wide configuration
   - `siteId` (UID/string, unique)
   - `name` (string)
   - `domain` (string)

### 2. **page** 
Dynamic page builder with section components
   - `siteId` (string, index)
   - `slug` (UID/string)
   - `title` (string)
- `metaDescription` (text) - SEO
- `metaKeywords` (string) - SEO
- `sections` (dynamiczone) - **15 available section components**
- `body` (richtext) - Legacy field

### 3. **navigationItem**
Navigation menu items
   - `siteId` (string)
   - `label` (string)
   - `href` (string)
   - `order` (integer)

### 4. **tokenSet**
Design tokens per site
   - `siteId` (string)
   - `colors` (JSON)
   - `typography` (JSON)
   - `components` (JSON)

### 5. **testimonial**
Customer testimonials
- `siteId` (string)
- `name` (string)
- `role` (string)
- `text` (text)
- `image` (media)

### 6. **lead**
Form submissions
- Form field data

## Available Section Components (15)

### Hero & Content
1. **Hero Section** - Full-screen hero with CTAs
2. **Content Section** - Image + text block
3. **Feature Section** - Two-column feature showcase

### Benefits & Features
4. **Benefits Carousel** - Scrolling benefit cards
5. **Why Choose Section** - Grid of benefits
6. **Feature Showcase** - Feature grid layout

### Social Proof
7. **Testimonials Carousel** - Customer reviews
8. **Trust Section** - Trust badges

### Process & Guides
9. **How It Works Bento** - Bento grid (4 steps)
10. **Process Steps** - Stacking cards

### Information
11. **Services Section** - Service grid
12. **FAQ Section** - Accordion questions
13. **Two Column Support** - Support content

### Conversion
14. **CTA Section** - Call-to-action
15. **Animated Stats** - Statistics showcase

## Shared Components (9)

1. **Button** - Reusable button
2. **Image** - Image component
3. **Service Item** - Service card
4. **Trust Badge** - Trust badge
5. **Benefit Item** - Benefit card
6. **Testimonial Item** - Single testimonial
7. **Process Step** - Process step
8. **Bento Item** - Bento grid item
9. **FAQ Item** - FAQ question/answer

## API Usage

### Fetch Page with Sections
```
GET /api/pages?filters[siteId][$eq]=geldgeregeld&filters[slug][$eq]=home&populate[sections][populate]=*
```

### Fetch Testimonials
```
GET /api/testimonials?filters[siteId][$eq]=geldgeregeld
```

### Fetch Navigation
```
GET /api/navigation-items?filters[siteId][$eq]=geldgeregeld&sort=order:asc
```

## Documentation

For complete documentation, see:
- `/cms/STRAPI_CMS_GUIDE.md` - Complete reference guide
- `/cms/QUICK_START.md` - Quick start guide

## Deployment

This Strapi instance is connected to Strapi Cloud and deploys automatically from git.


