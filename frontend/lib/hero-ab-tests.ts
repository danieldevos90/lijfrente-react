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
 * Based on competitor analysis and SEO best practices:
 * - Focus on speed: "binnen 24 uur"
 * - Focus on simplicity: "geen gedoe"
 * - Focus on benefits: "snel", "eenvoudig"
 * - Include keywords: "zakelijke financiering"
 */
export const HERO_TITLE_TEST: ABTest = {
  testId: 'hero_title',
  testName: 'Hero Title Text',
  variants: [
    {
      id: 'speed_focus',
      name: 'Zakelijke financiering binnen 24 uur. Geen gedoe met de bank.',
      weight: 1,
    },
    {
      id: 'simplicity_focus',
      name: 'Zakelijke financiering zonder gedoe. Binnen 24 uur geregeld.',
      weight: 1,
    },
    {
      id: 'benefit_focus',
      name: 'Snel, eenvoudig en flexibel. Zakelijke financiering binnen 24 uur.',
      weight: 1,
    },
    {
      id: 'direct_focus',
      name: 'Direct zakelijke financiering. Binnen 24 uur geld op je rekening.',
      weight: 1,
    },
    {
      id: 'trust_focus',
      name: 'Zakelijke financiering die werkt. Sneller dan de bank, zonder gedoe.',
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
      name: 'Eenvoudig online aanvragen. Geen opstartkosten. Boetevrij aflossen.',
      weight: 1,
    },
    {
      id: 'speed_focus',
      name: 'Binnen 2 minuten aangevraagd. Aanbod binnen 24 uur.',
      weight: 1,
    },
    {
      id: 'benefit_focus',
      name: 'Sneller dan de bank. Transparant en flexibel.',
      weight: 1,
    },
    {
      id: 'trust_focus',
      name: 'Geen gedoe met papierwerk. Heldere voorwaarden.',
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
