/**
 * A/B Testing Utility
 * Provides consistent A/B test assignment and tracking to GA4
 * Uses localStorage to persist test assignments per user
 */

import { trackEvent } from './analytics';

export interface ABTestVariant {
  id: string;
  name: string;
  weight?: number; // Default: equal weight
}

export interface ABTest {
  testId: string;
  testName: string;
  variants: ABTestVariant[];
}

/**
 * Get or assign a variant for an A/B test
 * Uses consistent assignment based on test ID and user
 */
export function getABTestVariant(test: ABTest): ABTestVariant {
  if (typeof window === 'undefined') {
    // Server-side: return first variant
    return test.variants[0];
  }

  const storageKey = `ab_test_${test.testId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const storedData = JSON.parse(stored);
      // Check if test config matches (if variants changed, reassign)
      const variant = test.variants.find(v => v.id === storedData.variantId);
      if (variant) {
        return variant;
      }
    } catch {
      // Invalid stored data, reassign
    }
  }

  // Assign new variant based on weights
  const totalWeight = test.variants.reduce((sum, v) => sum + (v.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  let selectedVariant = test.variants[0];
  for (const variant of test.variants) {
    const weight = variant.weight || 1;
    if (random < weight) {
      selectedVariant = variant;
      break;
    }
    random -= weight;
  }

  // Store assignment
  localStorage.setItem(storageKey, JSON.stringify({
    variantId: selectedVariant.id,
    assignedAt: Date.now(),
    testName: test.testName,
  }));

  // Track assignment to GA4
  trackEvent('ab_test_assignment', {
    test_id: test.testId,
    test_name: test.testName,
    variant_id: selectedVariant.id,
    variant_name: selectedVariant.name,
    event_category: 'A/B Testing',
  });

  return selectedVariant;
}

/**
 * Track an A/B test conversion event
 */
export function trackABTestConversion(
  testId: string,
  testName: string,
  variantId: string,
  conversionType: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('ab_test_conversion', {
    test_id: testId,
    test_name: testName,
    variant_id: variantId,
    conversion_type: conversionType,
    event_category: 'A/B Testing',
    ...additionalParams,
  });
}

/**
 * Get stored variant for a test (without reassigning)
 */
export function getStoredVariant(testId: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const storageKey = `ab_test_${testId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    try {
      const storedData = JSON.parse(stored);
      return storedData.variantId || null;
    } catch {
      return null;
    }
  }
  
  return null;
}
