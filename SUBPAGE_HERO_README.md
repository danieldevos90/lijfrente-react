# SubpageHero Component - Strapi Integration

## Overview
The `SubpageHero` component is a reusable hero section for subpages that displays a title, subtitle, and CTA button. It's designed to work with content from Strapi CMS.

## Usage

### Basic Example
```tsx
import SubpageHero from '@/components/SubpageHero';

<SubpageHero
  title="We believe in shaping a better financial future for everyone"
  subtitle="Empowering businesses and employees with seamless financial solutions."
  ctaText="Request a Demo"
  onCtaClick={() => console.log('CTA clicked')}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | The main heading text |
| `subtitle` | `string` | No | - | Optional subtitle/description text |
| `ctaText` | `string` | No | - | Text for the CTA button |
| `ctaHref` | `string` | No | - | Link for the CTA button |
| `onCtaClick` | `function` | No | - | Click handler for the CTA button |
| `backgroundColor` | `string` | No | `#f5f5f5` | Background color of the hero section |

## Strapi Content Type Structure

### Create a "Page Hero" Component in Strapi

```json
{
  "collectionName": "components_layout_page_heroes",
  "info": {
    "displayName": "Page Hero",
    "description": "Hero section for subpages"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "subtitle": {
      "type": "text"
    },
    "ctaText": {
      "type": "string"
    },
    "ctaHref": {
      "type": "string"
    },
    "backgroundColor": {
      "type": "string",
      "default": "#f5f5f5"
    }
  }
}
```

## Fetching Data from Strapi

### Server Component (Recommended)
```tsx
// app/over-ons/page.tsx
import SubpageHero from '@/components/SubpageHero';

async function getPageData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/over-ons?populate=hero`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  
  if (!res.ok) throw new Error('Failed to fetch page data');
  return res.json();
}

export default async function OverOnsPage() {
  const { data } = await getPageData();
  const hero = data.attributes.hero;

  return (
    <SubpageHero
      title={hero.title}
      subtitle={hero.subtitle}
      ctaText={hero.ctaText}
      ctaHref={hero.ctaHref}
      backgroundColor={hero.backgroundColor}
    />
  );
}
```

### Client Component with SWR
```tsx
'use client';
import useSWR from 'swr';
import SubpageHero from '@/components/SubpageHero';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function OverOnsPage() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/over-ons?populate=hero`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const hero = data.data.attributes.hero;

  return (
    <SubpageHero
      title={hero.title}
      subtitle={hero.subtitle}
      ctaText={hero.ctaText}
      ctaHref={hero.ctaHref}
      backgroundColor={hero.backgroundColor}
    />
  );
}
```

## Styling

The component uses the established design system:
- **Title**: PP Neue Montreal font, 400 weight, responsive sizing
- **Subtitle**: Thin (300) weight, subtle opacity
- **CTA Button**: Black background, minimal border radius, hover effect
- **Background**: Customizable via `backgroundColor` prop

## Example Pages Using This Component

- `/over-ons` - About page
- `/contact` - Contact page
- Other subpages as needed

## Environment Variables

Add to your `.env.local`:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

