"use client";
import React from 'react';
import Image from 'next/image';
import HeroCTAButton from './HeroCTAButton';

interface HeroSlideProps {
  badge?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: string;
  variant?: 'default' | 'gradient' | 'image';
  iconPath?: string;
  icons?: string[]; // Array of icon paths for multiple icons
}

export default function HeroSlide({
  badge,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  backgroundImage,
  variant = 'default',
  iconPath,
  icons
}: HeroSlideProps) {
  const bgStyle = variant === 'image' && backgroundImage 
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : variant === 'gradient' 
    ? { background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-dark))' }
    : { background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.02))' };

  const textColor = variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-text)';
  const displayIcons = icons || (iconPath ? [iconPath] : []);
  const isSubpageHero = variant === 'gradient' && !backgroundImage;

    return (
    <div className="hero-slide" style={{ 
      color: textColor,
      ...bgStyle,
      marginTop: 0,
    }} data-subpage={isSubpageHero ? "true" : undefined}>
      <div className="container" style={{ 
        paddingTop: 'calc(80px + 2rem)',
      }}>
        {badge && (
          <div className="badge" style={{ 
            background: variant === 'gradient' || variant === 'image' ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            color: variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-brand)',
            border: variant === 'gradient' || variant === 'image' ? '1px solid rgba(255,255,255,0.3)' : '1px solid #e5e5e5'
          }}>
            {badge}
          </div>
        )}
        
        {/* Icons Display */}
        {displayIcons.length > 0 && (
          <div 
            className="hero-icons"
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {displayIcons.map((icon, index) => (
              <div
                key={index}
                className="hero-icon"
                style={{
                  width: '64px',
                  height: '64px',
                  background: variant === 'gradient' || variant === 'image' 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: variant === 'gradient' || variant === 'image'
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <Image
                  src={icon}
                  alt=""
                  width={40}
                  height={40}
                  style={{
                    objectFit: 'contain',
                    filter: variant === 'gradient' || variant === 'image' 
                      ? 'brightness(0) invert(1)' 
                      : 'none',
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        <h1>{title}</h1>
        {subtitle && (
          <p style={{ color: variant === 'gradient' || variant === 'image' ? '#fff' : textColor }}>
            {subtitle}
          </p>
        )}
        {ctaLabel && <HeroCTAButton ctaLabel={ctaLabel} ctaHref={ctaHref} variant={variant} />}
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-icons {
            gap: 1rem !important;
          }
          
          .hero-icon {
            width: 48px !important;
            height: 48px !important;
          }
          
          .hero-icon img {
            width: 32px !important;
            height: 32px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-icons {
            gap: 0.75rem !important;
          }
          
          .hero-icon {
            width: 40px !important;
            height: 40px !important;
            padding: 8px !important;
          }
          
          .hero-icon img {
            width: 24px !important;
            height: 24px !important;
          }
        }
        
        .hero-icon:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
