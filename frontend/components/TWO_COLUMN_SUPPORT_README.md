# Two Column Support Section

A Strapi-based two-column section component with support information and testimonials, styled with your GeldGeregeld theme.

## Features

- **Left Column**: Support/assistance information with customizable background color
- **Right Column**: Testimonial with profile image, name, role, and quote
- **Carousel Navigation**: Optional previous/next buttons for multiple testimonials
- **Fully Responsive**: Adapts to mobile, tablet, and desktop screens
- **Themed**: Uses GeldGeregeld colors (emerald green primary, cyan secondary)

## Component Structure

### Strapi Schema
Located at: `/cms/src/components/sections/two-column-support.json`

Fields:
- `leftTitle` (string, required): Main heading for left column
- `leftDescription` (text, required): Description text for left column
- `leftButtonLabel` (string): CTA button text
- `leftButtonUrl` (string): Button destination URL
- `leftBackgroundColor` (string): Hex color for left column background (defaults to theme secondary light)
- `testimonialName` (string, required): Person's name
- `testimonialRole` (string, required): Person's job title
- `testimonialText` (text, required): The testimonial quote
- `testimonialImage` (media): Profile photo (optional, shows initial if not provided)
- `showCarousel` (boolean): Whether to show navigation arrows

### React Component
Located at: `/frontend/components/TwoColumnSupport.tsx`

## Usage Example

### Basic Usage

```tsx
import TwoColumnSupport from '../components/TwoColumnSupport';

export default function Page() {
  return (
    <TwoColumnSupport
      leftTitle="Betrouwbare ondersteuning"
      leftDescription="Krijg 24/7 ondersteuning van GeldGeregeld. Ons toegewijde klantenserviceteam staat voor u klaar."
      leftButtonLabel="Neem contact op"
      leftButtonUrl="#contact"
      testimonialName="Sarah van der Berg"
      testimonialRole="Eigenaar Café de Hoek"
      testimonialText="Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De service was uitstekend!"
      testimonialImage="https://example.com/photo.jpg"
      showCarousel={false}
    />
  );
}
```

### With Carousel Navigation

```tsx
"use client";

import { useState } from 'react';
import TwoColumnSupport from '../components/TwoColumnSupport';

export default function Page() {
  const testimonials = [
    {
      name: 'Sarah van der Berg',
      role: 'Eigenaar Café de Hoek',
      text: 'Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Mark Jansen',
      role: 'Directeur Transport BV',
      text: 'Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
  ];

  const [current, setCurrent] = useState(0);

  const handlePrevious = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <TwoColumnSupport
      leftTitle="Betrouwbare ondersteuning"
      leftDescription="Krijg 24/7 ondersteuning van GeldGeregeld."
      leftButtonLabel="Neem contact op"
      leftButtonUrl="#contact"
      testimonialName={testimonials[current].name}
      testimonialRole={testimonials[current].role}
      testimonialText={testimonials[current].text}
      testimonialImage={testimonials[current].image}
      showCarousel={true}
      onPrevious={handlePrevious}
      onNext={handleNext}
    />
  );
}
```

## Customization

### Colors

The component uses the GeldGeregeld theme:

- **Primary Green**: `#10b981` (emerald)
- **Secondary Cyan**: `#06b6d4`
- **Text**: `#111827` (charcoal)
- **Background Alt**: `#f9fafb` (light gray)

You can override the left column background:

```tsx
<TwoColumnSupport
  leftBackgroundColor="#bfdbfe"  // Custom blue tint
  // ... other props
/>
```

### Styling

The component automatically:
- Adapts to screen sizes (stacks on mobile)
- Uses theme spacing, shadows, and transitions
- Includes hover effects on buttons
- Shows decorative underline under left title

## Strapi Setup

1. **Create the component** in Strapi admin:
   - Go to Content-Type Builder
   - Create new Component: "Two Column Support"
   - Add all fields as defined in the schema

2. **Add to Page content type**:
   - Edit "Page" content type
   - Add Dynamic Zone field named "sections"
   - Allow "Two Column Support" component

3. **Create content**:
   - Edit a page
   - Add "Two Column Support" section
   - Fill in the fields
   - Publish

## Notes

- If no `testimonialImage` is provided, it shows an initial (first letter of name) in a colored circle
- The carousel buttons are only shown if `showCarousel` is `true` AND you provide `onPrevious`/`onNext` handlers
- The component has a minimum height of 500px for visual balance
- All transitions use the theme's ease timing for consistent feel

## Mobile Responsiveness

- On screens < 1024px: Columns stack vertically
- Button and text sizes remain readable
- Images scale appropriately
- Navigation buttons remain accessible



