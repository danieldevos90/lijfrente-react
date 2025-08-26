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
    : { background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.02))' };

  const textColor = variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-text)';

  return (
    <div className="hero-slide" style={{ 
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      padding: '6rem 0',
      color: textColor,
      ...bgStyle 
    }}>
      <div className="container" style={{ textAlign: 'left' }}>
        {badge && (
          <div className="badge" style={{ 
            background: variant === 'gradient' || variant === 'image' ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            color: variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-brand)',
            border: variant === 'gradient' || variant === 'image' ? '1px solid rgba(255,255,255,0.3)' : '1px solid #e5e5e5',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem'
          }}>
            {badge}
          </div>
        )}
        <h1 style={{ 
          fontSize: '64px', 
          margin: '0 0 1.5rem', 
          lineHeight: 1.1,
          fontWeight: 700,
          maxWidth: '800px'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ 
            margin: '0 0 2.5rem', 
            fontSize: '22px', 
            opacity: variant === 'gradient' || variant === 'image' ? 0.9 : 0.8,
            maxWidth: '600px',
            lineHeight: 1.5
          }}>
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaHref && (
          <div>
            <a 
              className="btn btn-primary" 
              href={ctaHref}
              style={{
                background: variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-brand)',
                color: variant === 'gradient' || variant === 'image' ? 'var(--color-brand)' : '#fff',
                border: variant === 'gradient' || variant === 'image' ? '1px solid #fff' : '1px solid var(--color-brand)',
                fontSize: '18px',
                padding: '20px 40px',
                fontWeight: 600
              }}
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
