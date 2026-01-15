"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
  company?: string;
  rating?: number;
}

interface TestimonialsCarouselProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  backgroundColor?: string;
}

export default function TestimonialsCarousel({
  title = "Wat MKB-ondernemers zeggen",
  subtitle = "Meer dan 500 tevreden ondernemers gingen je voor",
  testimonials,
  backgroundColor = 'var(--color-bg-slate)',
}: TestimonialsCarouselProps) {
  const testimonialsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Determine column count based on number of testimonials
  const useThreeColumns = testimonials.length < 4;

  const checkScroll = () => {
    const container = testimonialsScrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 10);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = testimonialsScrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [testimonials]);

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (testimonialsScrollRef.current) {
      const scrollAmount = testimonialsScrollRef.current.clientWidth * 0.8;
      testimonialsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": testimonials.map((testimonial, index) => ({
      "@type": "Review",
      "position": index + 1,
      "author": {
        "@type": "Person",
        "name": testimonial.name,
        "jobTitle": testimonial.role,
      },
      "reviewBody": testimonial.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating || 5,
        "bestRating": 5
      }
    }))
  };

  return (
    <section id="testimonials" style={{
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />
      <div style={{ margin: '0 auto', overflow: 'visible' }}>
        <div className="testimonials-header" style={{ 
          textAlign: 'center', 
          marginBottom: '5rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          maxWidth: '800px',
          margin: '0 auto 5rem'
        }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-muted)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        </div>

        {/* Horizontal scrolling cards */}
        <div 
          className="testimonials-scroll-container-outer"
          style={{
            position: 'relative',
            overflow: 'visible',
          }}
        >
            <div 
              ref={testimonialsScrollRef}
              className="testimonials-scroll-container"
              style={{
                position: 'relative',
                overflow: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                paddingBottom: '1rem',
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="testimonial-card-wrapper"
                  style={{
                    background: 'var(--color-white)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border-slate)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: useThreeColumns ? 'calc(33.333% - 1rem)' : 'calc(33.333% - 1rem)',
                    maxWidth: useThreeColumns ? 'calc(33.333% - 1rem)' : 'calc(33.333% - 1rem)',
                    flex: '0 0 auto',
                    scrollSnapAlign: 'start',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
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
                  {/* Profile Image */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '0.75rem',
                    gap: '0.625rem'
                  }}>
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--color-border-light)',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-slate-200)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-slate-500)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          flexShrink: 0,
                          border: '2px solid var(--color-border-light)'
                        }}
                      >
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: 'var(--color-text)', 
                        fontSize: '0.8125rem',
                        marginBottom: '0.125rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {testimonial.name}
                      </div>
                      <div style={{ 
                        fontSize: '0.6875rem', 
                        color: 'var(--color-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  {testimonial.rating && (
                    <div style={{ 
                      marginBottom: '0.625rem',
                      color: 'var(--color-warning-yellow)',
                      fontSize: '0.875rem',
                      letterSpacing: '0.5px'
                    }}>
                      {'★'.repeat(testimonial.rating)}
                      <span style={{ color: 'var(--color-gray-200)' }}>
                        {'★'.repeat(5 - testimonial.rating)}
                      </span>
                    </div>
                  )}
                  {!testimonial.rating && (
                    <div style={{ 
                      marginBottom: '0.625rem',
                      color: 'var(--color-warning-yellow)',
                      fontSize: '0.875rem',
                      letterSpacing: '0.5px'
                    }}>
                      {'★★★★★'}
                    </div>
                  )}

                  {/* Testimonial Text */}
                  <p style={{ 
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    margin: '0',
                    color: 'var(--color-text)',
                    fontSize: '0.75rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    "{testimonial.text}"
                  </p>

                  {/* Decorative quote mark */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.25rem',
                    right: '0.25rem',
                    fontSize: '2rem',
                    color: 'var(--color-bg-slate)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1,
                    pointerEvents: 'none'
                  }}>
                    "
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation arrows - below carousel */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
        }}>
          {canScrollLeft && (
            <button
              onClick={() => scrollTestimonials('left')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--color-charcoal)',
                color: 'var(--color-white)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-charcoal-hover)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-charcoal)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollTestimonials('right')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--color-charcoal)',
                color: 'var(--color-white)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-charcoal-hover)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-charcoal)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .testimonials-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        /* Desktop: Show 3-4 per view - dynamically set based on count */
        @media (min-width: 1201px) {
          .testimonial-card-wrapper {
            min-width: ${useThreeColumns ? 'calc(33.333% - 1rem)' : 'calc(25% - 1.125rem)'} !important;
            max-width: ${useThreeColumns ? 'calc(33.333% - 1rem)' : 'calc(25% - 1.125rem)'} !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1200px) {
          .testimonial-card-wrapper {
            min-width: calc(33.333% - 1rem) !important;
            max-width: calc(33.333% - 1rem) !important;
          }
        }
        
        /* Mobile: Full width cards */
        @media (max-width: 768px) {
          #testimonials {
            padding: 4rem 0 !important;
          }
          
          .testimonials-header {
            margin-bottom: 3rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .testimonials-scroll-container-outer {
            margin: 0 !important;
          }
          
          .testimonials-scroll-container > div {
            padding-left: 16px !important;
            padding-right: 16px !important;
            gap: 1rem !important;
          }
          
          .testimonial-card-wrapper {
            min-width: calc(100% - 4rem) !important;
            max-width: calc(100% - 4rem) !important;
            scroll-snap-align: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .testimonial-card-wrapper {
            min-width: calc(100% - 3rem) !important;
            max-width: calc(100% - 3rem) !important;
          }
        }
      `}</style>
    </section>
  );
}

