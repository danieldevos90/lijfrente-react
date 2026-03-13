/**
 * Hero Section A/B Test Configurations
 * Based on competitor analysis and SEO best practices
 */

import { ABTest, ABTestVariant } from './ab-test';

/**
 * CTA Button Text A/B Test
 * Based on competitor analysis:
 * - Floryn: "Start aanvraag", "Binnen 24 uur geregeld"
 * - Qeld: "Zakelijke lening aanvragen"
 * - Swishfund: "Binnen 1 dag geld op je rekening"
 * - New10: "Vrijblijvend aanbod binnen 15 minuten"
 */
export const CTA_BUTTON_TEST: ABTest = {
  testId: 'hero_cta_button',
  testName: 'Hero CTA Button Text',
  variants: [
    {
      id: 'start_aanvraag',
      name: 'Start aanvraag',
      weight: 1,
    },
    {
      id: 'vrijblijvend_aanvragen',
      name: 'Vrijblijvend aanvragen',
      weight: 1,
    },
    {
      id: 'direct_aanvragen',
      name: 'Direct aanvragen',
      weight: 1,
    },
    {
      id: 'gratis_aanvraag',
      name: 'Gratis aanvraag',
      weight: 1,
    },
    {
      id: 'binnen_24_uur',
      name: 'Binnen 24 uur geregeld',
      weight: 1,
    },
  ],
};

/**
 * Hero Title A/B Test
 * GeldGeregeld tone: broker/intermediary value, "wij regelen", matching
 */
export const HERO_TITLE_TEST: ABTest = {
  testId: 'hero_title',
  testName: 'Hero Title Text',
  variants: [
    {
      id: 'regelen',
      name: 'Wij regelen uw zakelijke financiering. Tot €2.500.000.',
      weight: 2,
    },
    {
      id: 'match',
      name: 'De juiste financiering voor uw bedrijf. Wij regelen het.',
      weight: 1,
    },
    {
      id: 'vergelijken',
      name: 'Zakelijke financiering tot €2.500.000. Wij zoeken de beste match.',
      weight: 1,
    },
    {
      id: 'eenvoudig',
      name: 'Zakelijke financiering geregeld. Snel, persoonlijk en tot €2.500.000.',
      weight: 1,
    },
  ],
};

/**
 * Get CTA button text variant
 */
export function getCTAButtonVariant(): ABTestVariant {
  const { getABTestVariant } = require('./ab-test');
  return getABTestVariant(CTA_BUTTON_TEST);
}

/**
 * Get hero title variant
 */
export function getHeroTitleVariant(): ABTestVariant {
  const { getABTestVariant } = require('./ab-test');
  return getABTestVariant(HERO_TITLE_TEST);
}

/**
 * Hero Button Text A/B Test
 * Tests different button text variations
 */
export const HERO_BUTTON_TEST: ABTest = {
  testId: 'hero_button_text',
  testName: 'Hero Button Text',
  variants: [
    {
      id: 'start_aanvraag',
      name: 'Start aanvraag',
      weight: 1,
    },
    {
      id: 'vrijblijvend_aanvragen',
      name: 'Vrijblijvend aanvragen',
      weight: 1,
    },
    {
      id: 'direct_aanvragen',
      name: 'Direct aanvragen',
      weight: 1,
    },
    {
      id: 'gratis_aanvraag',
      name: 'Gratis aanvraag',
      weight: 1,
    },
    {
      id: 'binnen_24_uur',
      name: 'Binnen 24 uur geregeld',
      weight: 1,
    },
  ],
};

/**
 * Hero Subtitle Content Test
 * Different subtitle variations for A/B testing
 */
export const HERO_SUBTITLE_TEST: ABTest = {
  testId: 'hero_subtitle',
  testName: 'Hero Subtitle Text',
  variants: [
    {
      id: 'default',
      name: 'Eén aanvraag, de beste match. Wij vergelijken en regelen de financiering die past bij uw bedrijf.',
      weight: 2,
    },
    {
      id: 'speed_focus',
      name: 'Aanvraag in 2 minuten. Binnen 24 uur een voorstel op maat. Vrijblijvend en kosteloos.',
      weight: 1,
    },
    {
      id: 'personal',
      name: 'Persoonlijk advies, scherpe voorwaarden. Van €10.000 tot €2.500.000.',
      weight: 1,
    },
  ],
};

/**
 * Get hero button text variant
 */
export function getHeroButtonVariant(): ABTestVariant {
  const { getABTestVariant } = require('./ab-test');
  return getABTestVariant(HERO_BUTTON_TEST);
}

/**
 * Get hero subtitle variant (for content testing)
 */
export function getHeroSubtitleVariant(): ABTestVariant {
  const { getABTestVariant } = require('./ab-test');
  return getABTestVariant(HERO_SUBTITLE_TEST);
}
