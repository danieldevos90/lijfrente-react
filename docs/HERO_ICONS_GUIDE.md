# Hero Section Icons Guide

The `HeroSection` component now supports displaying custom icons that can be different for each page. This guide shows you how to use this feature.

## Overview

The `HeroSection` component accepts two icon-related props:
- `iconPath`: A single icon path (string)
- `icons`: An array of multiple icon paths (string[])

When you provide icons, they will be displayed above the title in the hero section with a beautiful card-style design that adapts to your hero variant (default, gradient, or image).

## Icon Display Features

- **Automatic styling**: Icons automatically adjust their appearance based on the hero variant
- **Multiple icons**: Display 1-4 icons to represent different features or benefits
- **Responsive design**: Icons stack properly on mobile devices
- **Glassmorphism effect**: Subtle backdrop blur and transparency for modern look
- **Color inversion**: Icons automatically turn white on gradient/image backgrounds

## Usage Examples

### Single Icon

```tsx
<HeroSection
  title="Your Title"
  subtitle="Your subtitle"
  iconPath="/icons/SVG/finance/wallet.svg"
/>
```

### Multiple Icons (Recommended)

```tsx
<HeroSection
  title="Zakelijke financiering zonder gedoe"
  subtitle="Van aanvraag tot uitbetaling in 24 uur"
  variant="image"
  backgroundImage="/images/hero-bg.jpg"
  icons={[
    '/icons/SVG/interface/zap.svg',        // Speed
    '/icons/SVG/finance/trend-up.svg',     // Growth
    '/icons/SVG/interface/shield.svg',     // Security
    '/icons/SVG/finance/wallet.svg'        // Money
  ]}
/>
```

## Page-Specific Icon Suggestions

### Homepage
Use icons that represent your core value propositions:
```tsx
icons={[
  '/icons/SVG/interface/zap.svg',        // Speed
  '/icons/SVG/interface/shield.svg',     // Trust
  '/icons/SVG/finance/trend-up.svg',     // Growth
  '/icons/SVG/interface/clock.svg'       // 24/7
]}
```

### About Page
Use icons that represent your company values:
```tsx
icons={[
  '/icons/SVG/interface/heart.svg',      // Care
  '/icons/SVG/interface/award.svg',      // Excellence
  '/icons/SVG/interface/users.svg',      // Team
  '/icons/SVG/interface/target.svg'      // Goals
]}
```

### Contact Page
Use communication-related icons:
```tsx
icons={[
  '/icons/SVG/interface/message.svg',    // Messages
  '/icons/SVG/interface/phone.svg',      // Phone
  '/icons/SVG/interface/mail.svg',       // Email
  '/icons/SVG/interface/map-pin.svg'     // Location
]}
```

### Services/Products Page
Use feature-related icons:
```tsx
icons={[
  '/icons/SVG/e-commerce/cart.svg',      // Shop
  '/icons/SVG/finance/dollar.svg',       // Pricing
  '/icons/SVG/interface/package.svg',    // Delivery
  '/icons/SVG/interface/star.svg'        // Quality
]}
```

### Financing/Loan Pages
Use finance-related icons:
```tsx
icons={[
  '/icons/SVG/finance/bank.svg',         // Banking
  '/icons/SVG/finance/wallet.svg',       // Wallet
  '/icons/SVG/finance/trend-up.svg',     // Growth
  '/icons/SVG/finance/safe.svg'          // Security
]}
```

## Available Icon Categories

All icons are located in `/public/icons/SVG/` with the following categories:

- **arrows/** - Directional indicators
- **currency/** - Money symbols
- **e-commerce/** - Shopping and commerce
- **emojis/** - Emotion expressions
- **files/** - Document types
- **finance/** - Banking and money
- **food/** - Food and beverage
- **health/** - Medical and wellness
- **interface/** - UI elements (most commonly used)
- **logos/** - Social media and brands
- **misc/** - Miscellaneous
- **objects/** - Physical items
- **weather/** - Weather conditions

## Best Practices

1. **Use 3-4 icons maximum** - More than 4 can look cluttered
2. **Choose icons that tell a story** - Pick icons that represent your page's key message
3. **Be consistent with style** - All icons should come from the same icon set
4. **Consider color contrast** - Icons work best on gradient/image backgrounds
5. **Test on mobile** - Ensure icons don't overwhelm small screens
6. **Semantic meaning** - Each icon should have a clear connection to your message

## Technical Details

### Props Interface

```typescript
interface HeroSectionProps {
  badge?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: string;
  variant?: 'default' | 'gradient' | 'image';
  iconPath?: string;              // Single icon
  icons?: string[];               // Multiple icons
}
```

### Styling

Icons are automatically styled with:
- 64x64px container
- 40x40px icon size
- Semi-transparent background
- Backdrop blur effect
- Drop shadow
- White color filter on gradient/image variants
- Responsive sizing on mobile

## Troubleshooting

**Icons not showing?**
- Check that icon paths are correct
- Ensure icons exist in `/public/icons/SVG/`
- Verify the file extension is `.svg`

**Icons look too small/large?**
- Icons are automatically sized - modify the component if needed
- Check responsive breakpoints in your CSS

**Wrong color?**
- Icons automatically invert to white on gradient/image backgrounds
- For default variant, icons keep their original color




