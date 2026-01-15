"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import HeroCTAButton from './HeroCTAButton';
import { getABTestVariant } from '@/lib/ab-test';
import { HERO_TITLE_TEST } from '@/lib/hero-ab-tests';

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
  enableABTesting?: boolean; // Enable A/B testing for title
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
  icons,
  enableABTesting = true
}: HeroSlideProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [displayTitle, setDisplayTitle] = useState(title);
  const heroImagesRef = useRef<string[]>([]);
  
  // Local hero images for carousel
  const localHeroImages = [
    '/images/hero/getty-images-nMg-6GrzKQ8-unsplash.jpg',
    '/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg',
    '/images/hero/getty-images-sZchWleKlPc-unsplash.jpg',
    '/images/hero/getty-images-t7TuquKSttU-unsplash.jpg',
    '/images/hero/getty-images-74Kc2Ck7lhY-unsplash.jpg',
    '/images/hero/getty-images-NBIYjNRPkzg-unsplash.jpg',
    '/images/hero/brooke-cagle-RIUyV78hnwY-unsplash.jpg',
    '/images/hero/getty-images-eS7zaVvNpEg-unsplash.jpg',
  ];
  
  // A/B test title if enabled and on homepage (variant === 'image')
  useEffect(() => {
    if (enableABTesting && variant === 'image' && typeof window !== 'undefined') {
      try {
        const titleVariant = getABTestVariant(HERO_TITLE_TEST);
        setDisplayTitle(titleVariant.name);
      } catch (error) {
        // Fallback to original title if A/B test fails
        console.warn('A/B test failed, using original title:', error);
        setDisplayTitle(title);
      }
    } else {
      setDisplayTitle(title);
    }
  }, [title, enableABTesting, variant]);
  
  // Load local hero images for carousel rotation
  useEffect(() => {
    // Enable carousel for all 'image' variant heroes (homepage heroes)
    if (variant === 'image') {
      // Use local hero images, shuffle them for variety
      const shuffledImages = [...localHeroImages];
      for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
      }
      
      heroImagesRef.current = shuffledImages;
      setHeroImages(shuffledImages);
      
      // Preload all images for smooth transitions
      shuffledImages.forEach((img) => {
        const imageLoader = new window.Image();
        imageLoader.src = img;
      });
      
      // Randomize initial image index on refresh
      const randomIndex = Math.floor(Math.random() * shuffledImages.length);
      setCurrentImageIndex(randomIndex);
    } else if (backgroundImage) {
      // For non-image variants, use the provided background image
      heroImagesRef.current = [backgroundImage];
      setHeroImages([backgroundImage]);
      setCurrentImageIndex(0);
    }
  }, [variant, backgroundImage]);

  // Auto-rotate images every 8 seconds with smooth fade
  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const imageCount = heroImagesRef.current.length;
        return (prev + 1) % imageCount;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const currentImage = heroImages[currentImageIndex] || backgroundImage;
  
  const baseBgStyle = variant === 'gradient' 
    ? { background: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-dark))' }
    : { background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.02))' };

  const textColor = variant === 'gradient' || variant === 'image' ? 'var(--color-white)' : 'var(--color-text)';
  const displayIcons = icons || (iconPath ? [iconPath] : []);
  const isSubpageHero = variant === 'gradient' && !backgroundImage;
  const hasMultipleImages = heroImages.length > 1;

    return (
    <div className="hero-slide" style={{ 
      color: textColor,
      ...baseBgStyle,
      marginTop: 0,
      position: 'relative',
    }} data-subpage={isSubpageHero ? "true" : undefined}>
      {/* Background image layers for smooth rotation */}
      {variant === 'image' && heroImages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}>
          {heroImages.map((img, index) => (
            <div
              key={`hero-img-${index}-${img}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: hasMultipleImages ? 'opacity 2s ease-in-out' : 'none',
                pointerEvents: index === currentImageIndex ? 'auto' : 'none',
                willChange: 'opacity',
              }}
              aria-hidden={index !== currentImageIndex}
            />
          ))}
        </div>
      )}
      <div className="container" style={{ 
        paddingTop: 'calc(80px + 2rem)',
        position: 'relative',
        zIndex: 2,
      }}>
        {badge && (
          <div className="badge" style={{ 
            background: variant === 'gradient' || variant === 'image' ? 'var(--overlay-white-2)' : 'var(--color-bg-light)',
            color: variant === 'gradient' || variant === 'image' ? 'var(--color-white)' : 'var(--color-brand)',
            border: variant === 'gradient' || variant === 'image' ? '1px solid var(--overlay-white-3)' : '1px solid var(--color-border-gray)'
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
                    ? 'var(--overlay-white-15)' 
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
        
        <h1>{displayTitle}</h1>
        {subtitle && (
          <p style={{ color: variant === 'gradient' || variant === 'image' ? 'var(--color-white)' : textColor }}>
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
