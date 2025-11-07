# Sections Overview

This document provides an overview of all section types defined in the Strapi CMS and their usage status in the frontend application.

## ✅ Active Sections (Implemented in render-section.tsx)

These sections are fully implemented and can be used in Strapi pages:

1. **`sections.hero-section`** ✅
   - Component: `HeroSection` / `SubpageHero`
   - Used for homepage heroes and subpage heroes
   - Supports variants: `default`, `gradient`, `image`

2. **`sections.benefits-carousel`** ✅
   - Component: `BenefitsCarousel`
   - Displays a carousel of benefit cards with icons

3. **`sections.feature-section`** ✅
   - Component: `FeatureSectionWrapper`
   - Image-text feature sections with configurable layout

4. **`sections.testimonials-carousel`** ✅
   - Component: `TestimonialsCarousel`
   - Displays customer testimonials in a carousel

5. **`sections.how-it-works-bento`** ✅
   - Component: `HowItWorksBento`
   - Bento grid layout showing how the service works

6. **`sections.process-steps`** ✅
   - Component: `ProcessSteps`
   - Step-by-step process visualization

7. **`sections.why-choose-section`** ✅
   - Component: `WhyChooseSection`
   - Benefits grid with icons

8. **`sections.content-section`** ✅
   - Component: `ContentSection` / `ContactDetailsSection`
   - Flexible content section with multiple variants
   - Special handling for "Contactgegevens" title → uses `ContactDetailsSection`
   - Skips "Openingstijden" sections (returns null)

9. **`sections.services-section`** ✅
   - Component: `ServicesSection` / `ContactOptionsSection`
   - Services grid display
   - Special handling for "Contactmogelijkheden" → uses `ContactOptionsSection`

10. **`sections.trust-section`** ✅
    - Component: `TrustSection`
    - Trust badges and certifications

11. **`sections.cta-section`** ✅
    - Component: `CTASection`
    - Call-to-action sections with customizable backgrounds

12. **`sections.faq-section`** ✅
    - Component: `FAQSection`
    - Frequently asked questions accordion

13. **`sections.feature-showcase`** ✅
    - Component: `FeatureShowcase`
    - Feature cards showcase

14. **`sections.two-column-support`** ✅
    - Component: `TwoColumnSupport`
    - Two-column layout for support content

15. **`sections.contact-form`** ✅
    - Component: `ContactForm`
    - Contact form section wrapper

## ❌ Unused Sections (Not Implemented)

These sections are defined in Strapi types but **NOT** handled in `render-section.tsx`:

1. **`sections.animated-stats`** ❌
   - **Status**: Defined in types but not implemented
   - **Component exists**: `AnimatedStatsCards.tsx` (but not imported/used)
   - **Type definition**: `StrapiAnimatedStats` in `types/strapi-cms.ts`
   - **Action needed**: 
     - Either implement support in `render-section.tsx`
     - Or remove from Strapi schema and types if not needed

## 📝 Notes

### Special Section Handling

- **`sections.content-section`**:
  - If title contains "Contactgegevens" → renders `ContactDetailsSection`
  - If title contains "Openingstijden" → skipped (returns null)
  - Otherwise → renders `ContentSection`

- **`sections.services-section`**:
  - If title contains "Contact" → renders `ContactOptionsSection` with color pattern
  - Otherwise → renders `ServicesSection`

- **`sections.hero-section`**:
  - If variant is `gradient` AND no `backgroundImage` → renders `SubpageHero`
  - Otherwise → renders `HeroSection`

### Component Locations

- Most section components are in `/components/sections/`
- Some are in `/components/` root (e.g., `BenefitsCarousel`, `TestimonialsCarousel`)
- `FeatureSectionWrapper` is in `/app/`

## 🔧 Recommendations

1. **Remove unused `sections.animated-stats`**:
   - If not needed, remove from:
     - `frontend/types/strapi-cms.ts` (type definition)
     - Strapi CMS schema files
     - `scripts/populate_strapi_content.py` (if referenced)

2. **Or implement `sections.animated-stats`**:
   - Import `AnimatedStatsCards` component
   - Add case in `render-section.tsx` switch statement
   - Map Strapi data to component props

3. **Consider consolidating**:
   - Move all section components to `/components/sections/` for consistency
   - Review if `ContactOptionsSection` and `ContactDetailsSection` should be in `/components/sections/`

## 📊 Summary

- **Total sections defined**: 16
- **Active/Implemented**: 15
- **Unused/Not implemented**: 1 (`sections.animated-stats`)

