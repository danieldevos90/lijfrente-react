# Strapi CMS Frontend Integration Examples

## Overview

This document shows how to integrate the Strapi CMS with your Next.js frontend using the provided utilities and types.

## Setup

### 1. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

### 2. Import Types and Utilities

```typescript
import { getPageBySlug, getTestimonials } from '@/lib/strapi-cms';
import { StrapiPage, StrapiSection } from '@/types/strapi-cms';
```

## Examples

### Dynamic Page Routing

Create a dynamic page that renders any page from Strapi:

```typescript
// app/[slug]/page.tsx
import { getPageBySlug, getPageSlugs } from '@/lib/strapi-cms';
import { StrapiSection } from '@/types/strapi-cms';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsCarousel from '@/components/BenefitsCarousel';
import FeatureSection from '@/components/FeatureSection';
// ... import other sections

const SITE_ID = 'geldgeregeld';

export async function generateStaticParams() {
  const slugs = await getPageSlugs(SITE_ID);
  return slugs.map((slug) => ({ slug }));
}

export default async function DynamicPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const page = await getPageBySlug(params.slug, SITE_ID);

  if (!page) {
    return <div>Page not found</div>;
  }

  const { title, metaDescription, sections } = page.attributes;

  return (
    <main>
      <h1 className="sr-only">{title}</h1>
      {sections?.map((section, index) => renderSection(section, index))}
    </main>
  );
}

function renderSection(section: StrapiSection, index: number) {
  switch (section.__component) {
    case 'sections.hero-section':
      return <HeroSection key={index} {...section} />;
    
    case 'sections.benefits-carousel':
      return <BenefitsCarousel key={index} {...section} />;
    
    case 'sections.feature-section':
      return <FeatureSection key={index} {...section} />;
    
    case 'sections.testimonials-carousel':
      return <TestimonialsCarousel key={index} {...section} />;
    
    case 'sections.how-it-works-bento':
      return <HowItWorksBento key={index} {...section} />;
    
    case 'sections.process-steps':
      return <ProcessSteps key={index} steps={section.steps} />;
    
    case 'sections.why-choose-section':
      return <WhyChooseSection key={index} {...section} />;
    
    case 'sections.content-section':
      return <ContentSection key={index} {...section} />;
    
    case 'sections.services-section':
      return <ServicesSection key={index} {...section} />;
    
    case 'sections.trust-section':
      return <TrustSection key={index} {...section} />;
    
    case 'sections.cta-section':
      return <CTASection key={index} {...section} />;
    
    case 'sections.faq-section':
      return <FAQSection key={index} {...section} />;
    
    case 'sections.feature-showcase':
      return <FeatureShowcase key={index} {...section} />;
    
    case 'sections.two-column-support':
      return <TwoColumnSupport key={index} {...section} />;
    
    case 'sections.animated-stats':
      return <AnimatedStats key={index} {...section} />;
    
    default:
      console.warn('Unknown section type:', section);
      return null;
  }
}

// SEO Metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const page = await getPageBySlug(params.slug, SITE_ID);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const { title, metaDescription, metaKeywords } = page.attributes;

  return {
    title,
    description: metaDescription,
    keywords: metaKeywords?.split(',').map(k => k.trim()),
  };
}
```

### Fetch Testimonials

```typescript
// app/testimonials/page.tsx
import { getTestimonials } from '@/lib/strapi-cms';
import TestimonialCard from '@/components/TestimonialCard';

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials('geldgeregeld', {
    next: { revalidate: 60 } // Revalidate every minute
  });

  return (
    <div>
      <h1>Customer Testimonials</h1>
      <div className="grid">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            name={testimonial.attributes.name}
            role={testimonial.attributes.role}
            text={testimonial.attributes.text}
            image={testimonial.attributes.image.data.attributes.url}
          />
        ))}
      </div>
    </div>
  );
}
```

### Navigation Menu

```typescript
// components/Navigation.tsx
import { getNavigationItems } from '@/lib/strapi-cms';
import Link from 'next/link';

export default async function Navigation() {
  const navItems = await getNavigationItems('geldgeregeld', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.id}>
            <Link href={item.attributes.href}>
              {item.attributes.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Type-Safe Component

```typescript
// components/sections/HeroSection.tsx
import { StrapiHeroSection } from '@/types/strapi-cms';

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  primaryCta,
  secondaryCta,
  variant = 'default'
}: StrapiHeroSection) {
  return (
    <section 
      className="hero"
      style={{
        backgroundImage: backgroundImage 
          ? `url(${backgroundImage})` 
          : undefined
      }}
    >
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        
        <div className="hero-ctas">
          {primaryCta && (
            <a 
              href={primaryCta.href}
              className={`btn btn-${primaryCta.variant || 'primary'}`}
            >
              {primaryCta.label}
            </a>
          )}
          
          {secondaryCta && (
            <a 
              href={secondaryCta.href}
              className={`btn btn-${secondaryCta.variant || 'secondary'}`}
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

### Using Type Guards

```typescript
import { 
  getSectionByType, 
  getAllSectionsByType,
  isSectionType 
} from '@/types/strapi-cms';

// Get the first hero section
const heroSection = getSectionByType(
  page.sections, 
  'sections.hero-section'
);

// Get all CTA sections
const ctaSections = getAllSectionsByType(
  page.sections,
  'sections.cta-section'
);

// Type guard usage
if (isSectionType(section, 'sections.hero-section')) {
  // section is now typed as StrapiHeroSection
  console.log(section.primaryCta);
}
```

### Error Handling

```typescript
import { safeFetchStrapi } from '@/lib/strapi-cms';

export default async function SafePage() {
  const { data, error } = await safeFetchStrapi('/pages?filters[slug][$eq]=home');

  if (error) {
    return <div>Error loading page: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <div>{/* Render data */}</div>;
}
```

### Client Component with Loading

```typescript
'use client';

import { useEffect, useState } from 'react';
import { StrapiTestimonial } from '@/types/strapi-cms';

export default function TestimonialsClient() {
  const [testimonials, setTestimonials] = useState<StrapiTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {testimonials.map(t => (
        <div key={t.id}>{t.attributes.name}</div>
      ))}
    </div>
  );
}
```

### API Route Handler

```typescript
// app/api/testimonials/route.ts
import { NextResponse } from 'next/server';
import { getTestimonials } from '@/lib/strapi-cms';

export async function GET() {
  try {
    const testimonials = await getTestimonials('geldgeregeld');
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
```

### Conditional Rendering Based on Section

```typescript
function renderSection(section: StrapiSection, index: number) {
  // Skip sections that are empty
  if (section.__component === 'sections.benefits-carousel' && 
      !section.benefits?.length) {
    return null;
  }

  if (section.__component === 'sections.testimonials-carousel' && 
      !section.testimonials?.length) {
    return null;
  }

  // Normal rendering
  switch (section.__component) {
    // ... cases
  }
}
```

### Custom Hook for Strapi Data

```typescript
// hooks/useStrapPage.ts
'use client';

import { useEffect, useState } from 'react';
import { StrapiPage } from '@/types/strapi-cms';

export function useStrapiPage(slug: string, siteId: string) {
  const [page, setPage] = useState<StrapiPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`/api/pages/${slug}?siteId=${siteId}`)
      .then(res => res.json())
      .then(data => {
        setPage(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [slug, siteId]);

  return { page, loading, error };
}
```

## Best Practices

### 1. Caching Strategy

```typescript
// Static content (changes rarely)
const page = await getPageBySlug('about', 'geldgeregeld', {
  next: { revalidate: 3600 } // 1 hour
});

// Dynamic content (changes frequently)
const testimonials = await getTestimonials('geldgeregeld', {
  next: { revalidate: 60 } // 1 minute
});

// Real-time content (always fresh)
const liveData = await getPageBySlug('live', 'geldgeregeld', {
  cache: 'no-store'
});
```

### 2. Error Boundaries

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong loading the page</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 3. Loading States

```typescript
// app/[slug]/loading.tsx
export default function Loading() {
  return <div>Loading page...</div>;
}
```

### 4. Type Safety

Always use the provided TypeScript types:

```typescript
import type { StrapiSection, StrapiPage } from '@/types/strapi-cms';

// Good ✅
const section: StrapiSection = {...};

// Bad ❌
const section: any = {...};
```

## Testing

### Mock Strapi Data

```typescript
// __mocks__/strapi.ts
export const mockPage: StrapiPage = {
  id: 1,
  attributes: {
    siteId: 'geldgeregeld',
    slug: 'test',
    title: 'Test Page',
    metaDescription: 'Test description',
    sections: [
      {
        __component: 'sections.hero-section',
        title: 'Test Hero',
        subtitle: 'Test subtitle',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};
```

## Common Issues

### Issue: Images not loading

```typescript
// Solution: Use getStrapiImageUrl helper
import { getStrapiImageUrl } from '@/lib/strapi-cms';

const imageUrl = getStrapiImageUrl(testimonial.attributes.image.data.attributes.url);
```

### Issue: Sections not populating

```typescript
// Make sure to use populate parameter
const page = await getPageBySlug('home', 'geldgeregeld');
// sections are automatically populated by getPageBySlug
```

### Issue: Type errors with sections

```typescript
// Use type guards
if (isSectionType(section, 'sections.hero-section')) {
  // Now section is typed correctly
  console.log(section.primaryCta);
}
```

## Resources

- **Complete Guide**: `/cms/STRAPI_CMS_GUIDE.md`
- **Quick Start**: `/cms/QUICK_START.md`
- **Type Definitions**: `/frontend/types/strapi-cms.ts`
- **Utilities**: `/frontend/lib/strapi-cms.ts`

---

**Last Updated**: November 7, 2025

