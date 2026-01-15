# A/B Testing Implementation Guide

## Overview

This project implements A/B testing for hero section elements (title and CTA button) with GA4 tracking. The tests are based on competitor analysis and SEO best practices.

## Features

1. **Hero Title A/B Testing** - Tests 5 different title variations
2. **CTA Button Text A/B Testing** - Tests 5 different CTA button text variations
3. **Unsplash Image Rotation** - Randomizes initial image on each page refresh
4. **GA4 Event Tracking** - Tracks test assignments and conversions

## Implementation Details

### A/B Test Utility (`frontend/lib/ab-test.ts`)

- Consistent variant assignment using localStorage
- Persistent assignments per user
- Automatic GA4 tracking of test assignments
- Conversion tracking support

### Hero A/B Test Configurations (`frontend/lib/hero-ab-tests.ts`)

#### CTA Button Test Variants:
1. "Start aanvraag" (baseline)
2. "Vrijblijvend aanvragen"
3. "Direct aanvragen"
4. "Gratis aanvraag"
5. "Binnen 24 uur geregeld"

#### Hero Title Test Variants:
1. "Zakelijke financiering binnen 24 uur. Geen gedoe met de bank." (speed focus)
2. "Zakelijke financiering zonder gedoe. Binnen 24 uur geregeld." (simplicity focus)
3. "Snel, eenvoudig en flexibel. Zakelijke financiering binnen 24 uur." (benefit focus)
4. "Direct zakelijke financiering. Binnen 24 uur geld op je rekening." (direct focus)
5. "Zakelijke financiering die werkt. Sneller dan de bank, zonder gedoe." (trust focus)

### Component Updates

#### HeroSlide (`frontend/components/templates/HeroSlide.tsx`)
- Randomizes initial Unsplash image on refresh
- Applies A/B test to hero title (when `enableABTesting={true}` and `variant="image"`)
- Tracks title variant assignment to GA4

#### HeroCTAButton (`frontend/components/templates/HeroCTAButton.tsx`)
- Applies A/B test to CTA button text (when `enableABTesting={true}` and `variant="image"`)
- Tracks CTA clicks and conversions to GA4
- Includes A/B test variant information in tracking

## GA4 Events

### Test Assignment Events
- **Event Name**: `ab_test_assignment`
- **Parameters**:
  - `test_id`: Test identifier (e.g., "hero_cta_button", "hero_title")
  - `test_name`: Human-readable test name
  - `variant_id`: Assigned variant ID
  - `variant_name`: Assigned variant name
  - `event_category`: "A/B Testing"

### Conversion Events
- **Event Name**: `ab_test_conversion`
- **Parameters**:
  - `test_id`: Test identifier
  - `test_name`: Human-readable test name
  - `variant_id`: Variant that converted
  - `conversion_type`: Type of conversion (e.g., "cta_click")
  - `event_category`: "A/B Testing"
  - Additional context parameters

### CTA Click Events
- **Event Name**: `cta_click`
- **Parameters**:
  - `event_label`: CTA text
  - `cta_location`: "hero_section"
  - `variant`: Hero variant
  - `ab_test_enabled`: Boolean

## Usage

### Enabling A/B Tests

A/B tests are automatically enabled for homepage hero sections (`variant="image"`). To disable:

```tsx
<HeroSection
  title="Your Title"
  ctaLabel="Your CTA"
  variant="image"
  enableABTesting={false} // Disable A/B testing
/>
```

### Viewing Results in GA4

1. Go to Google Analytics 4
2. Navigate to **Events**
3. Filter for:
   - `ab_test_assignment` - See which variants were assigned
   - `ab_test_conversion` - See which variants converted
   - `cta_click` - See CTA click performance

### Creating Custom Reports

Create custom reports in GA4 to compare:
- Conversion rates by variant
- Click-through rates by CTA text
- Engagement metrics by title variant

## Best Practices

1. **Test Duration**: Run tests for at least 2-4 weeks to gather statistical significance
2. **Sample Size**: Ensure sufficient traffic before making decisions
3. **Statistical Significance**: Use GA4's built-in statistical significance tools
4. **One Test at a Time**: Don't run multiple tests simultaneously on the same element
5. **Monitor Performance**: Regularly check GA4 for test performance

## Competitor Analysis Basis

The A/B test variations are based on analysis of:
- Floryn.com
- Qeld.nl
- Capitalbox.nl
- Swishfund.nl
- New10.com

Key insights incorporated:
- Speed messaging ("binnen 24 uur")
- Simplicity messaging ("geen gedoe")
- Trust building ("sneller dan de bank")
- Clear value propositions

## Technical Notes

- Variant assignments are stored in localStorage for consistency
- Tests only run on client-side (server-side returns first variant)
- Image rotation randomizes on each page refresh
- All tracking respects user consent (GDPR compliant)
