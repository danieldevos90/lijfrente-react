"use client";
import { useEffect, useState } from 'react';
import { useWidget } from '../GlobalWidgetProvider';
import { getABTestVariant, trackABTestConversion } from '@/lib/ab-test';
import { CTA_BUTTON_TEST } from '@/lib/hero-ab-tests';
import { trackCTAClick } from '@/lib/analytics';

interface HeroCTAButtonProps {
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'default' | 'gradient' | 'image';
  enableABTesting?: boolean; // Enable A/B testing for CTA text
}

export default function HeroCTAButton({ 
  ctaLabel, 
  ctaHref, 
  variant = 'default',
  enableABTesting = true 
}: HeroCTAButtonProps) {
  const { openDrawer } = useWidget();
  const [displayLabel, setDisplayLabel] = useState(ctaLabel || '');
  const [variantId, setVariantId] = useState<string | null>(null);
  
  // A/B test CTA label if enabled and on homepage (variant === 'image')
  useEffect(() => {
    if (enableABTesting && variant === 'image' && typeof window !== 'undefined') {
      try {
        const ctaVariant = getABTestVariant(CTA_BUTTON_TEST);
        setDisplayLabel(ctaVariant.name);
        setVariantId(ctaVariant.id);
      } catch (error) {
        // Fallback to original label if A/B test fails
        console.warn('A/B test failed, using original CTA label:', error);
        setDisplayLabel(ctaLabel || '');
      }
    } else {
      setDisplayLabel(ctaLabel || '');
    }
  }, [ctaLabel, enableABTesting, variant]);
  
  if (!displayLabel) return null;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Track CTA click
    trackCTAClick(displayLabel, 'hero_section', {
      variant: variant,
      ab_test_enabled: enableABTesting,
    });
    
    // Track A/B test conversion if variant is assigned
    if (variantId && enableABTesting && variant === 'image') {
      trackABTestConversion(
        CTA_BUTTON_TEST.testId,
        CTA_BUTTON_TEST.testName,
        variantId,
        'cta_click',
        {
          cta_text: displayLabel,
          location: 'hero_section',
        }
      );
    }
    
    openDrawer('hero_primary');
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <a
        className="btn btn-primary"
        href={ctaHref || '#'}
        onClick={handleClick}
        style={{
          background: variant === 'gradient' || variant === 'image' ? 'var(--color-white)' : 'var(--color-charcoal)',
          color: variant === 'gradient' || variant === 'image' ? 'var(--color-charcoal)' : 'var(--color-white)',
          border: variant === 'gradient' || variant === 'image' ? '1px solid var(--color-white)' : '1px solid var(--color-charcoal)',
        }}
      >
        {displayLabel}
      </a>
    </div>
  );
}

