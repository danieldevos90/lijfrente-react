# Strapi CMS Complete Guide

## Overview

This Strapi CMS provides a complete content management system for the frontend website, allowing non-technical users to manage all sections and components dynamically.

## Architecture

### Multi-Site Support

All content types include a `siteId` field for multi-site filtering:
- `siteId`: String identifier for filtering content by site
- Use in API calls: `GET /api/pages?filters[siteId][$eq]=geldgeregeld`

### Content Types

#### 1. **Site** (`/api/site`)
Manages site-wide configuration.

**Attributes:**
- `siteId` (UID/string, unique, required)
- `name` (string)
- `domain` (string)

#### 2. **Page** (`/api/page`)
Dynamic page builder with section components.

**Attributes:**
- `siteId` (string, required) - Multi-site identifier
- `slug` (UID, required) - URL-friendly identifier
- `title` (string, required) - Page title
- `metaDescription` (text) - SEO meta description
- `metaKeywords` (string) - SEO keywords
- `sections` (dynamiczone) - **Main content area with all section components**
- `body` (richtext) - Legacy field (deprecated)
- `primaryCtaLabel` (string)
- `primaryCtaHref` (string)

**Available Section Components:**
1. Hero Section
2. Benefits Carousel
3. Feature Section
4. Testimonials Carousel
5. How It Works Bento
6. Process Steps
7. Why Choose Section
8. Content Section
9. Services Section
10. Trust Section
11. CTA Section
12. FAQ Section
13. Feature Showcase
14. Two Column Support
15. Animated Stats

#### 3. **Navigation Item** (`/api/navigation-item`)
Site navigation menu items.

**Attributes:**
- `siteId` (string)
- `label` (string)
- `href` (string)
- `order` (integer)

#### 4. **Token Set** (`/api/token-set`)
Design tokens per site (colors, typography, components).

**Attributes:**
- `siteId` (string)
- `colors` (JSON)
- `typography` (JSON)
- `components` (JSON)

#### 5. **Testimonial** (`/api/testimonial`)
Customer testimonials collection.

**Attributes:**
- `siteId` (string)
- `name` (string)
- `role` (string)
- `text` (text)
- `image` (media)

#### 6. **Lead** (`/api/lead`)
Lead form submissions.

---

## Components

### Shared Components (`/components/shared`)

#### Button
Reusable button component.
- `label` (string, required)
- `href` (string)
- `variant` (enum: primary, secondary, outline, text)
- `size` (enum: small, medium, large)
- `icon` (string) - Icon path or name

#### Image
Reusable image component.
- `url` (string, required)
- `alternativeText` (string, required)
- `caption` (string)
- `width` (integer)
- `height` (integer)

#### Service Item
Service card with icon, title and description.
- `icon` (string, required) - Icon path
- `title` (string, required)
- `description` (text, required)
- `href` (string) - Optional link

#### Trust Badge
Trust badge with icon and text.
- `icon` (string, required)
- `text` (string, required)

#### Benefit Item
Benefit card with icon, title, description and colors.
- `iconPath` (string, required)
- `title` (string, required)
- `description` (text, required)
- `color` (string) - Background color (hex)
- `textColor` (string) - Text color (hex)

#### Testimonial Item
Single testimonial.
- `name` (string, required)
- `role` (string, required)
- `text` (text, required)
- `image` (string, required)

#### Process Step
Single process step.
- `number` (string, required) - e.g., "01"
- `title` (string, required)
- `description` (text, required)
- `details` (JSON) - Array of detail strings
- `imagePath` (string) - Optional image

#### Bento Item
Bento grid item.
- `title` (string, required)
- `description` (text, required)
- `backgroundColor` (string, required)
- `textColor` (string, required)
- `iconPath` (string, required)
- `gridArea` (string, required) - CSS grid area name

#### FAQ Item
FAQ question and answer.
- `question` (string, required)
- `answer` (text, required)

#### Feature Card
Feature card for showcase.
- `icon` (string)
- `title` (string, required)
- `description` (text)

### Section Components (`/components/sections`)

#### Hero Section
Full-screen hero with title, subtitle and CTAs.
- `badge` (string) - Optional badge text
- `title` (string, required)
- `subtitle` (text)
- `backgroundImage` (string)
- `variant` (enum: default, gradient, image)
- `iconPath` (string)
- `icons` (JSON) - Array of icon paths
- `primaryCta` (Button component)
- `secondaryCta` (Button component)

#### Benefits Carousel
Horizontal scrolling benefit cards.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `benefits` (Benefit Item components, repeatable)

#### Feature Section
Two-column section with image and content.
- `title` (string, required)
- `description` (text, required)
- `buttonText` (string)
- `imagePath` (string, required)
- `imagePosition` (enum: left, right)
- `backgroundColor` (string)

#### Testimonials Carousel
Customer testimonials carousel.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `testimonials` (Testimonial Item components, repeatable)

#### How It Works Bento
Bento grid layout for process steps.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `bentoItems` (Bento Item components, repeatable)

#### Process Steps
Stacking cards showing process steps.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `steps` (Process Step components, repeatable)

#### Why Choose Section
Grid of reasons to choose service.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `benefits` (Benefit Item components, repeatable)

#### Content Section
Image and text block with optional CTA.
- `title` (string, required)
- `content` (text, required)
- `layout` (enum: image-left, image-right)
- `variant` (enum: default, bordered, shadow)
- `background` (enum: white, gray, blue, dark)
- `ctaLabel` (string)
- `ctaHref` (string)

#### Services Section
Grid of service cards.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `services` (Service Item components, repeatable)

#### Trust Section
Trust badges to build credibility.
- `title` (string)
- `variant` (enum: default, centered, compact)
- `backgroundColor` (string)
- `badges` (Trust Badge components, repeatable)

#### CTA Section
Call-to-action with title, subtitle and button.
- `title` (string, required)
- `subtitle` (text)
- `ctaLabel` (string, required)
- `ctaHref` (string, required)
- `background` (enum: white, gray, blue, dark)

#### FAQ Section
Frequently asked questions accordion.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `items` (FAQ Item components, repeatable)

#### Feature Showcase
Showcase features in a grid layout.
- `title` (string)
- `subtitle` (text)
- `features` (Feature Card components, repeatable)

#### Two Column Support
Two-column layout for support content.
- `title` (string, required)
- `content` (richtext, required)

#### Animated Stats
Animated statistics cards.
- `title` (string)
- `subtitle` (text)
- `backgroundColor` (string)
- `stats` (JSON) - Array of stat objects

---

## Usage Guide

### Creating a New Page

1. **Navigate to Pages** in Strapi admin
2. **Click "Create new entry"**
3. **Fill in basic info:**
   - Title
   - Slug (auto-generated from title)
   - Site ID (e.g., "geldgeregeld")
   - Meta Description (for SEO)
   - Meta Keywords (for SEO)

4. **Add Sections:**
   - Click "+ Add component to sections"
   - Choose from available section components
   - Fill in section-specific fields
   - Repeat to add multiple sections

5. **Save and Publish**

### Example: Homepage Structure

```
Page: Home
├── Hero Section
│   ├── Title: "Zakelijke financiering binnen 24 uur"
│   ├── Subtitle: "Geen gedoe met de bank"
│   ├── Background Image: "/images/hero.jpg"
│   ├── Primary CTA: "Start aanvraag"
│   └── Secondary CTA: "Bereken je lening"
├── Benefits Carousel
│   ├── Title: "Zakelijke lening zonder gedoe"
│   └── Benefits (6 items)
├── Feature Section
│   ├── Title: "Flexibele aflossing"
│   ├── Image: "/images/feature.jpg"
│   └── Image Position: left
├── Testimonials Carousel
│   └── Testimonials (3 items)
├── How It Works Bento
│   └── Bento Items (4 items)
└── CTA Section
    ├── Title: "Zakelijke lening aanvragen?"
    ├── Background: dark
    └── CTA: "Start je aanvraag nu"
```

### API Usage Examples

#### Fetch a Page with All Sections

```javascript
// Fetch page by slug with all sections populated
const response = await fetch(
  'http://localhost:1337/api/pages?' + 
  'filters[slug][$eq]=home&' +
  'filters[siteId][$eq]=geldgeregeld&' +
  'populate[sections][populate]=*'
);
const data = await response.json();
```

#### Fetch Testimonials

```javascript
const response = await fetch(
  'http://localhost:1337/api/testimonials?' +
  'filters[siteId][$eq]=geldgeregeld'
);
const testimonials = await response.json();
```

#### Fetch Navigation Items

```javascript
const response = await fetch(
  'http://localhost:1337/api/navigation-items?' +
  'filters[siteId][$eq]=geldgeregeld&' +
  'sort=order:asc'
);
const navItems = await response.json();
```

---

## Frontend Integration

### Dynamic Page Renderer

Create a dynamic page component that renders sections based on their type:

```typescript
// app/[slug]/page.tsx
import { getStrapiData } from '@/lib/strapi';

export default async function DynamicPage({ params }) {
  const page = await getStrapiData(`/pages?filters[slug][$eq]=${params.slug}`);
  
  return (
    <>
      {page.sections.map((section, index) => {
        switch (section.__component) {
          case 'sections.hero-section':
            return <HeroSection key={index} {...section} />;
          case 'sections.benefits-carousel':
            return <BenefitsCarousel key={index} {...section} />;
          case 'sections.feature-section':
            return <FeatureSection key={index} {...section} />;
          // ... other section types
          default:
            return null;
        }
      })}
    </>
  );
}
```

### Example Component Integration

```typescript
// components/sections/HeroSection.tsx
import { HeroSectionProps } from '@/types/strapi';

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  primaryCta,
  secondaryCta
}: HeroSectionProps) {
  return (
    <section style={{ 
      backgroundImage: `url(${backgroundImage})` 
    }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {primaryCta && (
        <a href={primaryCta.href}>{primaryCta.label}</a>
      )}
      {secondaryCta && (
        <a href={secondaryCta.href}>{secondaryCta.label}</a>
      )}
    </section>
  );
}
```

---

## Best Practices

### 1. Icon Paths
Use consistent icon paths:
- Format: `/icons/SVG/category/icon-name.svg`
- Example: `/icons/SVG/interface/shield.svg`

### 2. Color Palette
Use the standard color palette:
- Yellow: `#fff2b2` with text `#1e2021`
- Green: `#bbe7be` with text `#114e0b`
- Blue: `#aad5fc` with text `#0f1720`
- Purple: `#d7d0ff` with text `#3b0b5e`
- Pink: `#f8e4e4` with text `#3b0b0b`
- Cream: `#fcf8d8` with text `#1e2021`

### 3. Image Guidelines
- Use descriptive alternative text for accessibility
- Optimize images before uploading (recommended max 1MB)
- Use WebP format when possible
- Recommended dimensions: Hero (1920x1080), Features (800x600)

### 4. SEO
- Always fill in metaDescription (150-160 characters)
- Use relevant metaKeywords (5-10 keywords)
- Use descriptive page titles (50-60 characters)

### 5. Performance
- Limit sections per page to 10-15 for optimal performance
- Use the appropriate section component for your content
- Avoid repeating similar content across sections

---

## Development Workflow

### 1. Local Development

```bash
cd cms
npm install
npm run develop
```

Access Strapi admin at: `http://localhost:1337/admin`

### 2. Content Changes
1. Make changes in Strapi admin
2. Content is immediately available via API
3. Frontend fetches updated content on next build/page load

### 3. Schema Changes
1. Update schema files in `cms/src/components/` or `cms/src/api/`
2. Restart Strapi
3. Schema changes appear in admin panel
4. Update frontend TypeScript types if needed

### 4. Deployment to Strapi Cloud
```bash
# Strapi Cloud automatically deploys from git
git add .
git commit -m "Update content types"
git push origin main
```

---

## Troubleshooting

### Component Not Showing in Dynamic Zone
- Check component is listed in `page/schema.json` under `sections.components`
- Restart Strapi after adding new components
- Clear browser cache

### API Returns Empty Data
- Check siteId filter matches your site
- Ensure content is Published (not Draft)
- Verify permissions in Settings > Roles > Public

### Images Not Loading
- Check image paths are absolute (start with `/`)
- Verify images exist in frontend `public` folder
- Check CORS settings if loading from external source

---

## Migration from Static to CMS

To migrate existing static pages:

1. **Create Page Entry** in Strapi
2. **Add Sections** matching your current page structure
3. **Copy Content** from static files to Strapi fields
4. **Update Frontend** to fetch from Strapi instead of static data
5. **Test Thoroughly** before removing static version
6. **Update** routing to use dynamic `[slug]` page

Example migration:
```typescript
// Before (static)
const benefits = [
  { title: 'Fast', description: '...' }
];

// After (from Strapi)
const { data } = await fetch('/api/pages?filters[slug]=home');
const benefits = data.sections
  .find(s => s.__component === 'sections.benefits-carousel')
  .benefits;
```

---

## Future Enhancements

Planned features:
- [ ] Media library integration for images
- [ ] Multi-language support (i18n)
- [ ] Version history and rollback
- [ ] A/B testing capabilities
- [ ] Analytics integration
- [ ] Advanced permissions per section
- [ ] Page templates/presets
- [ ] Component preview in admin

---

## Support

For questions or issues:
1. Check this guide first
2. Review Strapi documentation: https://docs.strapi.io
3. Check frontend component implementation
4. Contact development team

---

**Last Updated:** November 7, 2025
**Version:** 1.0.0

