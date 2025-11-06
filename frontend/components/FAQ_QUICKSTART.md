# FAQ Section - Quick Start Guide

## 🚀 What's Been Created

### Backend (Strapi CMS)
✅ **FAQ Section Component** (`sections/faq-section.json`)  
✅ **FAQ Item Component** (`shared/faq-item.json`)

### Frontend (React/Next.js)
✅ **FAQSection.tsx** - Full section with header and background  
✅ **FAQAccordion.tsx** - Compact accordion for embedding  
✅ **Strapi utilities** (`lib/strapi.ts`) - API helpers  
✅ **TypeScript types** (`types/strapi.ts`) - Type definitions

### Demo Pages
✅ **`/faq`** - Standalone FAQ page demo  
✅ **`/product-example`** - FAQ embedded in product page  
✅ **`/faq-strapi-example/[slug]`** - Dynamic Strapi-powered page

---

## 📦 Installation

### 1. Restart Strapi
```bash
cd cms
npm run develop
```

The FAQ components will now be available in Strapi's Content-Type Builder.

### 2. Add Environment Variable (Optional)
```bash
# .env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## 🎨 Usage Examples

### Option 1: Standalone FAQ Page (Hardcoded Data)

```tsx
import FAQSection from '@/components/FAQSection';

const faqs = [
  {
    id: '1',
    question: 'Hoe werkt het?',
    answer: 'Het is heel simpel...'
  }
];

export default function Page() {
  return <FAQSection faqItems={faqs} />;
}
```

### Option 2: Embedded Accordion

```tsx
import FAQAccordion from '@/components/FAQAccordion';

export default function ProductPage() {
  return (
    <section style={{ padding: '5rem 0', background: 'rgb(244, 244, 239)' }}>
      <h2>Veelgestelde vragen</h2>
      <FAQAccordion items={faqs} />
    </section>
  );
}
```

### Option 3: From Strapi (Dynamic)

```tsx
import { getPageBySlug } from '@/lib/strapi';
import FAQSection from '@/components/FAQSection';

export default async function Page() {
  const page = await getPageBySlug('faq');
  const faqSection = page?.attributes.faqSection;
  
  if (!faqSection) return <div>No FAQ found</div>;
  
  return (
    <FAQSection
      title={faqSection.title}
      subtitle={faqSection.subtitle}
      faqItems={faqSection.faqItems}
    />
  );
}
```

---

## 🎯 Create FAQ Content in Strapi

### Step-by-Step

1. **Go to Strapi Admin** (`http://localhost:1337/admin`)

2. **Navigate to Content Manager → Pages**

3. **Create or Edit a Page**

4. **Add FAQ Section Component**
   - Click "+ Add component"
   - Select "FAQ Section"
   
5. **Fill in the Details**
   - **Title**: "Veelgestelde vragen"
   - **Subtitle**: "Vind snel antwoord op uw vraag"
   
6. **Add FAQ Items**
   - Click "+ Add component" under FAQ Items
   - **Question**: "Hoe lang duurt het?"
   - **Answer**: "Meestal binnen 24 uur..."
   - Repeat for more Q&As

7. **Save and Publish**

---

## 📝 Component Props

### FAQSection

| Prop | Type | Required | Default |
|------|------|----------|---------|
| `title` | string | No | "Veelgestelde vragen" |
| `subtitle` | string | No | undefined |
| `faqItems` | FAQItem[] | Yes | - |

### FAQAccordion

| Prop | Type | Required | Default |
|------|------|----------|---------|
| `items` | FAQItem[] | Yes | - |
| `defaultBackground` | string | No | "white" |
| `activeBackground` | string | No | "rgb(228, 242, 255)" |
| `maxWidth` | string | No | "900px" |

### FAQItem Type

```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
```

---

## 🎨 Styling

### Colors
- **Section Background**: `rgb(244, 244, 239)` (light warm grey)
- **Active Card**: `rgb(228, 242, 255)` (light blue)
- **Default Card**: `white`

### Font
- **Neue Montreal** throughout
- Already configured in `globals.css`

### Icons
- **Plus icon** from Lucide
- Rotates 45° when active

---

## 🧪 Test the Demo Pages

### View Demo Pages
```bash
cd frontend
npm run dev
```

Then visit:
- http://localhost:3000/faq
- http://localhost:3000/product-example

---

## 🔧 Customization

### Change Background Colors

```tsx
<FAQAccordion 
  items={faqs}
  defaultBackground="#f5f5f5"
  activeBackground="#e3f2fd"
/>
```

### Change Icon

```tsx
// In FAQSection.tsx or FAQAccordion.tsx
import { ChevronDown } from 'lucide-react';

// Replace Plus with ChevronDown
<ChevronDown size={24} color="#0f1720" />
```

### Change Animation Speed

```tsx
// In component style
transition: 'all 0.2s ease' // Faster
// or
transition: 'all 0.5s ease' // Slower
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `FAQ_README.md` | Complete component documentation |
| `FAQ_STRAPI_INTEGRATION.md` | Detailed Strapi setup guide |
| `FAQ_QUICKSTART.md` | This file - quick reference |

---

## ✅ Features

- ✅ Smooth accordion animations
- ✅ One item open at a time
- ✅ Plus icon rotates on open
- ✅ Background color changes on active
- ✅ Fully responsive
- ✅ Keyboard accessible
- ✅ Type-safe with TypeScript
- ✅ Strapi CMS integration
- ✅ ISR support (hourly revalidation)

---

## 🐛 Common Issues

### FAQ section not showing in Strapi
**Solution**: Restart Strapi after creating component schemas
```bash
cd cms && npm run develop
```

### Can't fetch FAQ data
**Solution**: Check populate parameter
```typescript
getPageBySlug('faq', 'sections.faqItems')
```

### Accordion not animating
**Solution**: Ensure `"use client"` is at top of component file

---

## 📞 Support

Need help? Check the detailed documentation:
- **FAQ_README.md** - Component details
- **FAQ_STRAPI_INTEGRATION.md** - Strapi setup
- **Frontend code** - See demo pages for examples

---

## 🎯 Next Steps

1. ✅ Components created
2. ⏭️ Restart Strapi (`cd cms && npm run develop`)
3. ⏭️ Create FAQ content in Strapi admin
4. ⏭️ Use in your pages (see examples above)
5. ⏭️ Customize styling to match your brand

---

**That's it! You're ready to use the FAQ section.** 🎉

