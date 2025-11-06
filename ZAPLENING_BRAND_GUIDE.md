# ⚡ ZapLening - Brand Identity & Design System

## Project Name: **ZapLening**

**Betekenis:** "Zap" = bliksemsnelle actie + "Lening" = zakelijke lening
**Tagline:** "Razendsnel zakelijke financiering"

---

## 🎨 Color Palette

### Primary Colors (Emerald Green)
```css
--color-primary: #10b981        /* Fresh, growth, money */
--color-primary-dark: #059669   /* Deeper trust */
--color-primary-light: #34d399  /* Light accents */
```

**Why Emerald Green?**
- ✅ Represents growth and prosperity
- ✅ Fresh and modern (not traditional banking blue)
- ✅ Positive psychological association with money and success
- ✅ Stands out in fintech space

### Secondary Colors (Cyan)
```css
--color-secondary: #06b6d4      /* Trust, clarity */
--color-secondary-dark: #0891b2
--color-secondary-light: #22d3ee
```

### Semantic Colors
```css
--color-success: #10b981  /* Same as primary */
--color-warning: #f59e0b  /* Orange for caution */
--color-error: #ef4444    /* Red for errors */
--color-info: #06b6d4     /* Cyan for information */
```

### Neutrals
```css
--color-gray-50: #f9fafb   /* Lightest */
--color-gray-200: #e5e7eb  /* Borders */
--color-gray-500: #6b7280  /* Muted text */
--color-gray-900: #111827  /* Dark text */
```

---

## 🎯 Logo

### Design Elements
- **Icon:** Lightning bolt (⚡) in circular badge
- **Colors:** Gradient from primary to primary-dark
- **Shape:** Clean, modern, minimal
- **Symbolism:**
  - ⚡ Lightning = Speed, energy, instant action
  - 🔵 Circle = Trust, completeness, security
  
### Logo Variations
1. **Full Logo** - Icon + "ZapLening" text
2. **Icon Only** - For favicons, app icons
3. **Text Only** - For minimal contexts

### Usage
```tsx
import Logo from './components/Logo';

// Full logo
<Logo size={40} showText={true} />

// Icon only
<Logo size={32} showText={false} />

// Large version
<Logo size={64} showText={true} />
```

---

## 📏 Design System

### Spacing Scale
```css
--space-xs: 0.25rem   /* 4px */
--space-sm: 0.5rem    /* 8px */
--space-md: 1rem      /* 16px */
--space-lg: 1.5rem    /* 24px */
--space-xl: 2rem      /* 32px */
--space-2xl: 3rem     /* 48px */
--space-3xl: 4rem     /* 64px */
```

### Border Radius
```css
--radius-sm: 6px     /* Buttons, inputs */
--radius-md: 8px     /* Cards */
--radius-lg: 12px    /* Large containers */
--radius-xl: 16px    /* Hero sections */
--radius-full: 9999px /* Circles, pills */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)      /* Subtle */
--shadow-base: 0 1px 3px rgba(0,0,0,0.1)     /* Default */
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)       /* Elevated */
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)     /* Cards */
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1)     /* Modals */
--shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)   /* Drawer */
```

### Typography
```css
--font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...
--font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...
```

**Font Scale:**
- Headings: 48px → 36px → 24px → 20px
- Body: 16px (base), 18px (large), 14px (small), 13px (tiny)
- Weight: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

---

## 🎨 Component Styles

### Buttons

**Primary Button (Green Gradient)**
```css
background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
color: white;
padding: 0.75rem 1.5rem;
border-radius: var(--radius-sm);
font-weight: 600;
```

**Secondary Button**
```css
background: white;
color: var(--color-gray-700);
border: 1px solid var(--color-gray-300);
```

### Form Inputs
```css
border: 1px solid var(--color-gray-300);
border-radius: var(--radius-sm);
padding: 0.75rem;
font-size: 16px;

/* Focus state */
border-color: var(--color-primary);
box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
```

### Cards
```css
background: var(--color-bg-alt);
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
padding: 2rem;
```

---

## 🚀 Brand Personality

**Tone of Voice:**
- ⚡ **Energetic** - "Razendsnel", "Direct", "Nu"
- 🎯 **Direct** - No jargon, straight to the point
- 🤝 **Friendly** - "u" instead of "je", maar wel toegankelijk
- ✨ **Transparent** - Clear pricing, no hidden fees

**Key Messages:**
1. Binnen 24 uur reactie
2. Transparante voorwaarden
3. Geen verborgen kosten
4. Voor elke ondernemer

**Emoji Usage:**
- ⚡ Speed/Energy
- ✓ Confirmation/Benefits
- 🔒 Security/Trust
- 💼 Business/Professional

---

## 📱 Responsive Breakpoints

```css
--mobile: 640px
--tablet: 768px
--desktop: 1024px
--wide: 1280px
```

**Drawer Behavior:**
- Desktop: 440px wide, slides from right
- Mobile: 100vw wide, full screen

---

## 🎯 Animation & Transitions

```css
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
```

**Common Animations:**
- Drawer slide: `transform 300ms ease-out`
- Button hover: `all 200ms ease`
- Focus rings: `box-shadow 200ms ease`

---

## 📋 File Structure

```
frontend/
├── theme.ts                 # Theme configuration object
├── app/
│   └── tokens.css          # CSS custom properties
├── components/
│   ├── Logo.tsx            # Brand logo component
│   ├── DrawerWidget.tsx    # Main conversion component
│   └── StickyCTA.tsx       # Sticky CTA button
└── public/
    └── favicon.ico         # (needs update to match logo)
```

---

## ✅ Implementation Checklist

- [x] Created theme.ts with all design tokens
- [x] Updated tokens.css with consistent colors
- [x] Created Logo component with lightning bolt
- [x] Updated DrawerWidget to use theme colors
- [x] Updated homepage with new branding
- [x] Updated page titles and meta descriptions
- [x] Ensured all components use CSS custom properties
- [ ] Create favicon from logo
- [ ] Add logo to email templates (future)
- [ ] Update Open Graph images (future)

---

## 🎨 Usage Examples

### Using Theme Colors in CSS
```css
/* Instead of: */
color: #10b981;

/* Use: */
color: var(--color-primary);
```

### Using Theme in Components
```tsx
import { theme } from '../theme';

const MyComponent = () => (
  <div style={{ 
    color: theme.colors.primary,
    padding: theme.spacing.lg 
  }}>
    Content
  </div>
);
```

---

**Last Updated:** November 2025  
**Status:** ✅ Complete and production-ready

