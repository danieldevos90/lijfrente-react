"use client";
import React, { useRef, useState, useEffect } from 'react';

interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating?: number;
}

interface TestimonialSectionProps {
  title?: string;
  testimonials: Testimonial[];
}

export default function TestimonialSection({ title, testimonials }: TestimonialSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Determine column count based on number of testimonials
  const useThreeColumns = testimonials.length < 4;

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section style={{ 
      padding: 'var(--space-xl) 0',
      background: '#F8FAFC'
    }}>
      {title && (
        <h2 style={{ 
          textAlign: 'center',
          fontSize: '28px',
          margin: '0 0 var(--space-xl)',
          color: 'var(--color-text)'
        }}>
          {title}
        </h2>
      )}
      
      <div style={{ position: 'relative' }}>
        <div 
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '1rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            padding: '0 var(--space-md)',
          }}
          className="hide-scrollbar testimonial-section-scroll"
        >
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            
            .testimonial-section-card {
              min-width: ${useThreeColumns ? 'calc(33.333% - 0.67rem)' : 'calc(25% - 0.75rem)'};
              max-width: ${useThreeColumns ? 'calc(33.333% - 0.67rem)' : 'calc(25% - 0.75rem)'};
            }
            
            @media (max-width: 1200px) and (min-width: 769px) {
              .testimonial-section-card {
                min-width: calc(33.333% - 0.67rem) !important;
                max-width: calc(33.333% - 0.67rem) !important;
              }
            }
            
            @media (max-width: 768px) {
              .testimonial-section-card {
                min-width: calc(50% - 0.5rem) !important;
                max-width: calc(50% - 0.5rem) !important;
              }
            }
            
            @media (max-width: 480px) {
              .testimonial-section-card {
                min-width: calc(100% - 2rem) !important;
                max-width: calc(100% - 2rem) !important;
              }
            }
          `}</style>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-section-card"
              style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                cursor: 'default',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              {testimonial.rating && (
                <div style={{ 
                  marginBottom: '0.625rem',
                  color: '#fbbf24',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px'
                }}>
                  {'★'.repeat(testimonial.rating)}
                  <span style={{ color: '#e5e7eb' }}>
                    {'★'.repeat(5 - testimonial.rating)}
                  </span>
                </div>
              )}
              <p style={{ 
                fontStyle: 'italic',
                lineHeight: 1.4,
                margin: '0 0 auto',
                color: 'var(--color-text)',
                fontSize: '0.75rem',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                "{testimonial.text}"
              </p>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.8125rem' }}>
                  {testimonial.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                  {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows - below carousel on mobile, side on desktop */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem',
          padding: '0 var(--space-md)',
        }}>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              opacity: canScrollLeft ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontSize: '20px',
              color: 'var(--color-text)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              if (canScrollLeft) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              opacity: canScrollRight ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontSize: '20px',
              color: 'var(--color-text)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              if (canScrollRight) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
