"use client";
import React from 'react';

interface SubpageHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  backgroundColor?: string;
}

export default function SubpageHero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  onCtaClick,
  backgroundColor = '#f5f5f5',
}: SubpageHeroProps) {
  return (
    <section style={{
      background: backgroundColor,
      padding: '12rem 2rem 8rem',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'PP Neue Montreal, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          marginBottom: subtitle ? '2rem' : '3rem',
          color: 'var(--color-text)',
        }}>
          {title}
        </h1>
        
        {subtitle && (
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.6,
            opacity: 0.75,
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
          }}>
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onCtaClick}
              style={{
                border: '1px solid var(--color-charcoal)',
                backgroundColor: 'var(--color-charcoal)',
                color: 'white',
                textAlign: 'center',
                borderRadius: '.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '10.5rem',
                maxHeight: '2.75rem',
                padding: '1rem 1.5rem',
                fontFamily: 'Public Sans Variable, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                lineHeight: 1,
                transition: 'border-color .28s, background-color .28s',
                display: 'flex',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 32, 0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
              }}
            >
              {ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

