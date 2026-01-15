"use client";
import React from 'react';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  background?: 'white' | 'gray' | 'blue' | 'dark';
}

export default function CTASection({ 
  title, 
  subtitle, 
  ctaLabel, 
  ctaHref,
  background = 'dark' 
}: CTASectionProps) {
  const backgroundColor = background === 'dark' ? 'var(--color-charcoal)' : background === 'gray' ? 'var(--color-bg)' : background === 'blue' ? 'var(--color-sky500)' : 'var(--color-white)';
  const textColor = background === 'dark' ? 'var(--color-white)' : 'var(--color-text)';
  const textColorMuted = background === 'dark' ? 'var(--overlay-white-75)' : 'var(--color-text-muted)';
  
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
        <div style={{ textAlign: 'center' }}>
          <a 
            href={ctaHref}
            className={background === 'dark' ? "btn btn-secondary" : "btn btn-primary"}
            style={background === 'dark' ? {
              background: 'var(--color-white)',
              color: 'var(--color-charcoal)',
              borderColor: 'var(--color-white)'
            } : undefined}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
