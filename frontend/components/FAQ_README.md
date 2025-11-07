# FAQ Section Component

## Overview

The FAQ Section component is a fully interactive accordion-style FAQ section that integrates with Strapi CMS. It features smooth animations, clean design, and follows the brand's design system using Neue Montreal font.

## Features

- ✅ **Strapi Integration**: Pull FAQ data directly from Strapi CMS
- ✅ **Accordion Functionality**: Smooth expand/collapse animations
- ✅ **Custom Styling**: 
  - Background: `rgb(244, 244, 239)` (default state)
  - Active state: `rgb(228, 242, 255)` (when opened)
  - Neue Montreal font family
  - Lucide Plus icon with rotation animation
- ✅ **Responsive Design**: Works perfectly on all screen sizes
- ✅ **Accessible**: Keyboard navigation support

## Component Structure

### Strapi Components

Two new Strapi components have been created:

#### 1. FAQ Section (`sections/faq-section.json`)
Located: `/cms/src/components/sections/faq-section.json`

```json
{
  "title": "string (required)",
  "subtitle": "text (optional)",
  "faqItems": "component (repeatable)"
}
```

#### 2. FAQ Item (`shared/faq-item.json`)
Located: `/cms/src/components/shared/faq-item.json`

```json
{
  "question": "string (required)",
  "answer": "text (required)"
}
```

### Frontend Component

Location: `/frontend/components/FAQSection.tsx`

## Usage

### Basic Usage

```tsx
import FAQSection from '@/components/FAQSection';

const faqData = [
  {
    id: '1',
    question: 'Hoe lang duurt het voordat ik een beslissing krijg?',
    answer: 'In de meeste gevallen ontvangt u binnen 24 uur een eerste reactie...'
  },
  // More FAQ items...
];

export default function Page() {
  return (
    <FAQSection 
      title="Veelgestelde vragen"
      subtitle="Vind snel antwoord op uw vraag"
      faqItems={faqData}
    />
  );
}
```

### With Strapi Data

```tsx
import FAQSection from '@/components/FAQSection';

export default async function Page() {
  // Fetch from Strapi
  const response = await fetch('https://your-strapi.com/api/pages/faq?populate=*');
  const data = await response.json();
  
  return (
    <FAQSection 
      title={data.faqSection.title}
      subtitle={data.faqSection.subtitle}
      faqItems={data.faqSection.faqItems}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | No | "Veelgestelde vragen" | Section heading |
| `subtitle` | string | No | undefined | Optional subtitle text |
| `faqItems` | FAQItem[] | Yes | - | Array of FAQ items |

### FAQItem Interface

```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
```

## Styling Details

### Colors
- **Background**: `rgb(244, 244, 239)` - Light warm grey
- **Active Background**: `rgb(228, 242, 255)` - Light blue
- **Text**: `#0f1720` - Dark charcoal
- **Secondary Text**: `#6b7280` - Medium grey

### Typography
- **Font Family**: Neue Montreal
- **Title**: 48px, font-weight 500
- **Question**: 18px, font-weight 500
- **Answer**: 16px, line-height 1.7

### Spacing
- Section padding: 5rem vertical
- Card gap: 1rem
- Header padding: 2rem 1rem 2rem 2rem
- Grid gaps: 3rem (as specified)

### Animations
- Background color transition: 0.3s ease
- Icon rotation: 0.3s ease (0deg → 45deg)
- Max-height accordion: 0.4s ease

## Demo Page

A fully functional demo page is available at:
- **Path**: `/frontend/app/faq/page.tsx`
- **URL**: `/faq`

The demo includes:
- Hero section with gradient background
- FAQ Section with 6 sample questions
- CTA section for additional support

## Setting up in Strapi

1. **Restart Strapi** after adding the component schemas:
   ```bash
   cd cms
   npm run develop
   ```

2. **Add FAQ Section to Page**:
   - Go to Content-Type Builder
   - Edit your "Page" content type
   - Add a new field: "FAQ Section" (component)
   - Choose "sections.faq-section"
   - Save and restart Strapi

3. **Create FAQ Content**:
   - Go to Content Manager
   - Select Pages
   - Add/Edit a page
   - Add FAQ Section component
   - Fill in title, subtitle
   - Add FAQ items with questions and answers

## Best Practices

1. **Question Length**: Keep questions concise (max 100 characters)
2. **Answer Length**: Aim for 2-4 sentences per answer
3. **Number of FAQs**: 5-8 FAQs per section is optimal
4. **Organization**: Group related questions together
5. **Accessibility**: Use clear, simple language

## Customization

### Changing Colors

Edit the `background` style props in `FAQSection.tsx`:

```tsx
// Section background
background: 'rgb(244, 244, 239)', // Change this

// Active card background
background: openIndex === index ? 'rgb(228, 242, 255)' : 'white', // Change this
```

### Changing Icon

Replace the Lucide `Plus` icon with another icon:

```tsx
import { Plus, ChevronDown } from 'lucide-react';

// Then use in JSX:
<ChevronDown size={24} color="#0f1720" strokeWidth={2} />
```

### Animation Speed

Adjust transition durations:

```tsx
transition: 'all 0.3s ease', // Make faster: 0.2s, slower: 0.5s
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Troubleshooting

### FAQs not showing
- Check that `faqItems` prop has data
- Verify the data structure matches `FAQItem` interface

### Styling issues
- Ensure Neue Montreal font is loaded in `globals.css`
- Check that parent containers don't have conflicting styles

### Animation not working
- Verify `"use client"` directive is present at top of component
- Check browser console for JavaScript errors

## Future Enhancements

Potential improvements:
- [ ] Search functionality
- [ ] Category filtering
- [ ] Rich text support for answers
- [ ] Open multiple accordions at once option
- [ ] Print-friendly view
- [ ] Social sharing for individual FAQs
- [ ] Analytics tracking for most-clicked questions

## Related Components

- `SubpageHero` - For page headers
- `TwoColumnSupport` - For additional support sections
- `Footer` - Contains contact information

## Support

For questions or issues, please contact the development team.



