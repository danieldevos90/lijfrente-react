"use client";
import React from 'react';
import Image from 'next/image';

interface SubpageHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  backgroundColor?: string;
  backgroundImage?: string;
  iconPath?: string;
}

export default function SubpageHero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  onCtaClick,
  backgroundColor = '#f5f5f5',
  backgroundImage,
  iconPath,
}: SubpageHeroProps) {
  // Debug: log iconPath
  console.log('SubpageHero received iconPath:', iconPath);
  
  return (
    <section 
      className="subpage-hero"
      style={{
        background: backgroundColor,
        padding: 'calc(80px + 4rem) 2rem 4rem',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div style={{ margin: '0 auto' }}>
        {/* Icon */}
        {iconPath && (
          <div 
            className="subpage-hero-icon-wrapper"
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
            <div 
              className="subpage-hero-icon"
              style={{
                width: '80px',
                height: '80px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                src={iconPath}
                alt={title}
                width={80}
                height={80}
                style={{
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  console.error('Failed to load icon:', iconPath);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        <h1 
          className="subpage-hero-title"
          style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: subtitle ? '2rem' : '3rem',
            color: 'var(--color-text)',
          }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <p 
            className="subpage-hero-subtitle"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 300,
              color: 'var(--color-text)',
              lineHeight: 1.6,
              opacity: 0.75,
              marginBottom: '3rem',
              maxWidth: '800px',
              margin: '0 auto 3rem',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .subpage-hero {
            padding: 8rem 1.5rem 4rem !important;
            min-height: 40vh !important;
          }
          
          .subpage-hero-icon-wrapper {
            margin-bottom: 1.5rem !important;
          }
          
          .subpage-hero-icon {
            width: 60px !important;
            height: 60px !important;
          }
          
          .subpage-hero-icon img {
            width: 60px !important;
            height: 60px !important;
          }
          
          .subpage-hero-title {
            margin-bottom: 1.5rem !important;
          }
          
          .subpage-hero-subtitle {
            margin-bottom: 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .subpage-hero {
            padding: 7rem 1rem 3rem !important;
            min-height: 35vh !important;
          }
          
          .subpage-hero-icon {
            width: 50px !important;
            height: 50px !important;
          }
          
          .subpage-hero-icon img {
            width: 50px !important;
            height: 50px !important;
          }
          
          .subpage-hero-title {
            margin-bottom: 1rem !important;
          }
          
          .subpage-hero-subtitle {
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

