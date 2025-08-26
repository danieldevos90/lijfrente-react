"use client";
import React from 'react';

interface HeroSlideProps {
  badge?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: string;
  variant?: 'default' | 'gradient' | 'image';
}

export default function HeroSlide({
  badge,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  backgroundImage,
  variant = 'default'
}: HeroSlideProps) {
  const bgStyle = variant === 'image' && backgroundImage 
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : variant === 'gradient' 
    ? { background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-dark))' }
    : { background: 'linear-gradient(180deg, rgba(14,165,233,0.08), rgba(14,165,233,0.02))' };

  const textColor = variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-text)';

  return (
    <div className="hero-slide" style={{ 
      padding: 'var(--space-xl)', 
      borderRadius: 'var(--radius-lg)', 
      border: '1px solid var(--color-border)',
      color: textColor,
      ...bgStyle 
    }}>
      {badge && (
        <div className="badge" style={{ 
          background: variant === 'gradient' || variant === 'image' ? 'rgba(255,255,255,0.2)' : '#EFF6FF',
          color: variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-brand)',
          border: variant === 'gradient' || variant === 'image' ? '1px solid rgba(255,255,255,0.3)' : '1px solid #DBEAFE'
        }}>
          {badge}
        </div>
      )}
      <h1 style={{ fontSize: '36px', margin: '0 0 var(--space-sm)', lineHeight: 1.2 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ 
          margin: '0 0 var(--space-md)', 
          fontSize: '18px', 
          opacity: variant === 'gradient' || variant === 'image' ? 0.9 : 0.8 
        }}>
          {subtitle}
        </p>
      )}
      {ctaLabel && ctaHref && (
        <div className="row" style={{ marginTop: 'var(--space-md)' }}>
          <a 
            className="btn btn-primary" 
            href={ctaHref}
            style={{
              background: variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-brand)',
              color: variant === 'gradient' || variant === 'image' ? 'var(--color-brand)' : '#fff',
              border: variant === 'gradient' || variant === 'image' ? '1px solid #fff' : '1px solid var(--color-brand)'
            }}
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
