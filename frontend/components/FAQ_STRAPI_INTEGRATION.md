# FAQ Section - Strapi Integration Guide

## Overview

This guide explains how to integrate the FAQ Section component with your Strapi CMS backend.

## Components Created

### Backend (Strapi)

1. **`sections/faq-section.json`** - Main FAQ section component
2. **`shared/faq-item.json`** - Individual FAQ item component

### Frontend (React/Next.js)

1. **`FAQSection.tsx`** - Full-width section with header
2. **`FAQAccordion.tsx`** - Compact accordion (can be embedded anywhere)
3. **`/faq/page.tsx`** - Standalone FAQ page demo
4. **`/product-example/page.tsx`** - Example integration in product page

## Step-by-Step Setup

### 1. Install Strapi Components

The component schemas are already created in:
- `/cms/src/components/sections/faq-section.json`
- `/cms/src/components/shared/faq-item.json`

**Restart Strapi to load the new components:**

```bash
cd cms
npm run develop
```

### 2. Add FAQ Section to Page Content Type

Option A: **Using Dynamic Zones (Recommended)**

Edit `/cms/src/api/page/content-types/page/schema.json`:

```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "options": { "draftAndPublish": true },
  "attributes": {
    "siteId": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "title": { "type": "string", "required": true },
    "body": { "type": "richtext" },
    "primaryCtaLabel": { "type": "string" },
    "primaryCtaHref": { "type": "string" },
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.faq-section",
        "sections.two-column-support"
      ]
    }
  }
}
```

Option B: **Direct Component Field**

Or add as a single component:

```json
"faqSection": {
  "type": "component",
  "repeatable": false,
  "component": "sections.faq-section"
}
```

**Restart Strapi** after editing the schema.

### 3. Create FAQ Content in Strapi

1. Go to **Content Manager** → **Pages**
2. Create or edit a page
3. Add a **FAQ Section** component
4. Fill in:
   - **Title**: e.g., "Veelgestelde vragen"
   - **Subtitle**: e.g., "Vind snel antwoord op uw vraag"
   - **FAQ Items**: Click "Add component" to add multiple Q&A pairs
     - **Question**: Short, clear question
     - **Answer**: Detailed answer (2-4 sentences)
5. Save and publish

### 4. Fetch Data in Frontend

Create a service to fetch pages with FAQ data:

```typescript
// lib/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getPageBySlug(slug: string) {
  const res = await fetch(
    `${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate[sections][populate]=*`,
    { next: { revalidate: 60 } }
  );
  
  const data = await res.json();
  return data.data[0] || null;
}
```

### 5. Render FAQ Section

#### Option A: Using Dynamic Zones

```typescript
// app/[slug]/page.tsx
import { getPageBySlug } from '@/lib/strapi';
import FAQSection from '@/components/FAQSection';
import TwoColumnSupport from '@/components/TwoColumnSupport';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  
  if (!page) return <div>Page not found</div>;
  
  return (
    <main>
      <h1>{page.attributes.title}</h1>
      
      {/* Render dynamic sections */}
      {page.attributes.sections?.map((section: any, index: number) => {
        switch (section.__component) {
          case 'sections.faq-section':
            return (
              <FAQSection
                key={index}
                title={section.title}
                subtitle={section.subtitle}
                faqItems={section.faqItems.map((item: any) => ({
                  id: item.id,
                  question: item.question,
                  answer: item.answer,
                }))}
              />
            );
          
          case 'sections.two-column-support':
            return <TwoColumnSupport key={index} {...section} />;
          
          default:
            return null;
        }
      })}
    </main>
  );
}
```

#### Option B: Direct Component

```typescript
// app/faq-demo/page.tsx
import { getPageBySlug } from '@/lib/strapi';
import FAQSection from '@/components/FAQSection';

export default async function FAQPage() {
  const page = await getPageBySlug('faq');
  
  if (!page?.attributes.faqSection) {
    return <div>No FAQ content found</div>;
  }
  
  const { faqSection } = page.attributes;
  
  return (
    <FAQSection
      title={faqSection.title}
      subtitle={faqSection.subtitle}
      faqItems={faqSection.faqItems.map((item: any) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
      }))}
    />
  );
}
```

### 6. Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# Or for production:
# NEXT_PUBLIC_STRAPI_URL=https://your-strapi.com
```

## API Endpoints

### Get all pages with FAQ sections

```
GET /api/pages?populate[sections][populate]=*
```

### Get specific page with FAQ

```
GET /api/pages?filters[slug][$eq]=faq&populate[sections][populate]=*
```

### Response Example

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "slug": "faq",
        "title": "Veelgestelde vragen",
        "sections": [
          {
            "__component": "sections.faq-section",
            "id": 1,
            "title": "Veelgestelde vragen",
            "subtitle": "Vind snel antwoord op uw vraag",
            "faqItems": [
              {
                "id": 1,
                "question": "Hoe lang duurt het?",
                "answer": "Meestal binnen 24 uur."
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## Component Variants

### 1. Full Section (FAQSection)

Use when you want a complete standalone section with background:

```tsx
<FAQSection 
  title="Veelgestelde vragen"
  subtitle="Vind antwoorden"
  faqItems={items}
/>
```

### 2. Compact Accordion (FAQAccordion)

Use when embedding within other sections:

```tsx
<FAQAccordion 
  items={items}
  defaultBackground="white"
  activeBackground="rgb(228, 242, 255)"
  maxWidth="900px"
/>
```

## Styling Customization

### Props

**FAQAccordion specific props:**

- `defaultBackground` - Background color for closed items (default: "white")
- `activeBackground` - Background color for open items (default: "rgb(228, 242, 255)")
- `maxWidth` - Max width of accordion (default: "900px")

### CSS Override

Create a custom wrapper:

```tsx
<div className="custom-faq">
  <FAQAccordion items={items} />
</div>

<style jsx>{`
  .custom-faq {
    --faq-text-color: #0f1720;
    --faq-border-radius: 12px;
  }
`}</style>
```

## Best Practices

### Content Guidelines

1. **Questions**: 
   - Keep under 100 characters
   - Start with question words (How, What, When, Why)
   - Be specific

2. **Answers**:
   - 2-4 sentences ideal
   - Use simple language
   - Include next steps when relevant

3. **Organization**:
   - Group related questions
   - Put most common questions first
   - Limit to 6-8 FAQs per section

### Performance

1. **Use ISR (Incremental Static Regeneration)**:
   ```typescript
   fetch(url, { next: { revalidate: 3600 } }) // Revalidate hourly
   ```

2. **Populate only what you need**:
   ```
   populate[sections][populate]=faqItems
   ```

3. **Cache strategy**:
   - Static pages: Build-time generation
   - Dynamic pages: ISR with 1-hour revalidation
   - Real-time pages: Client-side fetching

## Troubleshooting

### Components not appearing in Strapi

**Solution**: Restart Strapi after creating component schemas
```bash
cd cms && npm run develop
```

### TypeError: Cannot read property 'map'

**Solution**: Add null checks
```typescript
{page?.attributes?.sections?.map((section) => ...)}
```

### CORS errors

**Solution**: Configure Strapi CORS in `config/middlewares.ts`:
```typescript
export default [
  'strapi::cors',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'],
    },
  },
  // ... other middlewares
];
```

### FAQ items not populating

**Solution**: Ensure proper populate query:
```typescript
populate[faqSection][populate]=faqItems
// or for dynamic zones:
populate[sections][populate]=*
```

## Advanced Features

### Search Functionality

```typescript
const [searchTerm, setSearchTerm] = useState('');
const filteredItems = faqItems.filter(item => 
  item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.answer.toLowerCase().includes(searchTerm.toLowerCase())
);

<input 
  type="search" 
  placeholder="Zoek in FAQ..." 
  onChange={(e) => setSearchTerm(e.target.value)}
/>
<FAQAccordion items={filteredItems} />
```

### Analytics Tracking

```typescript
const toggleFAQ = (index: number) => {
  setOpenIndex(openIndex === index ? null : index);
  
  // Track with analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_open', {
      faq_question: items[index].question,
      faq_id: items[index].id,
    });
  }
};
```

### Rich Text Answers

Update the schema to use rich text:

```json
{
  "answer": {
    "type": "richtext",
    "required": true
  }
}
```

Then render with a markdown/rich text component.

## Testing

### Manual Testing Checklist

- [ ] FAQ items expand/collapse smoothly
- [ ] Only one item open at a time
- [ ] Background colors change correctly
- [ ] Icon rotates on open/close
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces expand/collapse

### Example Test Data

```json
[
  {
    "id": "1",
    "question": "Test vraag 1?",
    "answer": "Dit is een testantwoord met voldoende tekst om te zien of de styling correct is."
  },
  {
    "id": "2",
    "question": "Test vraag 2 met een langere titel om te testen hoe het reageert?",
    "answer": "Een ander antwoord om de functionaliteit te testen."
  }
]
```

## Support

For issues or questions:
- Check Strapi logs: `cd cms && npm run develop`
- Check browser console for frontend errors
- Verify API responses in Network tab

## Related Documentation

- [Strapi Dynamic Zones](https://docs.strapi.io/dev-docs/backend-customization/models#dynamic-zones)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Lucide Icons](https://lucide.dev/)



