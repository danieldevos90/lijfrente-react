"use client";
import React from 'react';
import { trackCTAClick } from '@/lib/analytics';
import EligibilityRequirements from '../EligibilityRequirements';
import '../EligibilityRequirements.css';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref?: string;
  background?: 'white' | 'gray' | 'blue' | 'dark';
  trustBullets?: string[];
  trackingLocation?: string;
  showEligibility?: boolean;
}

function sanitizeHref(href: string | undefined, fallback: string) {
  const trimmed = (href || '').trim();
  return trimmed && trimmed !== '#' ? trimmed : fallback;
}

export default function CTASection({ 
  title, 
  subtitle, 
  ctaLabel, 
  ctaHref,
  background = 'dark',
  trustBullets = [],
  trackingLocation = 'cta_section',
  showEligibility = true,
}: CTASectionProps) {
  const backgroundColor = background === 'dark' ? 'var(--color-charcoal)' : background === 'gray' ? 'var(--color-bg)' : background === 'blue' ? 'var(--color-sky500)' : 'var(--color-white)';
  const textColor = background === 'dark' ? 'var(--color-white)' : 'var(--color-text)';
  const textColorMuted = background === 'dark' ? 'var(--overlay-white-75)' : 'var(--color-text-muted)';
  const resolvedHref = sanitizeHref(ctaHref, '/lead');
  
  return (
    <section style={{ 
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
    }}>
      <div style={{ margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem', 
          paddingLeft: '2rem', 
          paddingRight: '2rem', 
          maxWidth: '800px', 
          margin: '0 auto 3rem' 
        }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: textColor,
          }}>
          {title}
        </h2>
        {subtitle && (
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: textColorMuted,
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
            {subtitle}
          </p>
        )}
        </div>
        {trustBullets.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {trustBullets.map((t) => (
              <span
                key={t}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '999px',
                  border: `1px solid ${background === 'dark' ? 'rgba(255,255,255,0.25)' : 'var(--color-border)'}`,
                  color: textColorMuted,
                  fontSize: '0.95rem',
                }}
              >
                <span aria-hidden="true">✓</span>
                {t}
              </span>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <a 
            href={resolvedHref}
            className={background === 'dark' ? "btn btn-secondary" : "btn btn-primary"}
            style={background === 'dark' ? {
              background: 'var(--color-white)',
              color: 'var(--color-charcoal)',
              borderColor: 'var(--color-white)'
            } : undefined}
            onClick={() => {
              trackCTAClick(ctaLabel, trackingLocation, { href: resolvedHref });
            }}
          >
            {ctaLabel}
          </a>
        </div>
        {showEligibility && (
          <div style={{ marginTop: '2rem' }}>
            <EligibilityRequirements
              variant="banner"
              theme={background === 'dark' ? 'dark' : 'light'}
            />
          </div>
        )}
      </div>
    </section>
  );
}
