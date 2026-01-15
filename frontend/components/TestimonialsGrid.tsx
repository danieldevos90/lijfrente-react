"use client";
import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
  company?: string;
  rating?: number;
}

interface TestimonialsGridProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  backgroundColor?: string;
}

export default function TestimonialsGrid({
  title = "Wat MKB-ondernemers zeggen",
  subtitle = "Meer dan 500 tevreden ondernemers gingen je voor",
  testimonials,
  backgroundColor = 'var(--color-bg-slate)',
}: TestimonialsGridProps) {
  // Ensure we have exactly 6 testimonials
  const displayTestimonials = testimonials.slice(0, 6);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": displayTestimonials.map((testimonial, index) => ({
      "@type": "Review",
      "position": index + 1,
      "author": {
        "@type": "Person",
        "name": testimonial.name,
        "jobTitle": testimonial.role,
        ...(testimonial.company && {
          "worksFor": {
            "@type": "Organization",
            "name": testimonial.company
          }
        })
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
      overflow: 'visible',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />
      <div style={{ margin: '0 auto', maxWidth: '1400px', padding: '0 2rem', minHeight: 'auto' }}>
        <div className="testimonials-header" style={{ 
          textAlign: 'center', 
          marginBottom: '5rem',
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

        {/* Grid Layout - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          minHeight: 'auto',
        }}>
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card"
              style={{
                background: 'var(--color-white)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border-slate)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
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
                marginBottom: '1rem',
                gap: '0.75rem'
              }}>
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--color-border-light)',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-slate-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-slate-500)',
                      fontSize: '1.125rem',
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
                    fontSize: '0.9375rem',
                    marginBottom: '0.25rem',
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.8125rem', 
                    color: 'var(--color-text-muted)',
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              {testimonial.rating && (
                <div style={{ 
                  marginBottom: '0.75rem',
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
                  marginBottom: '0.75rem',
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
                lineHeight: 1.5,
                margin: '0',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                flex: 1,
              }}>
                "{testimonial.text}"
              </p>

              {/* Decorative quote mark */}
              <div style={{
                position: 'absolute',
                bottom: '0.5rem',
                right: '0.5rem',
                fontSize: '3rem',
                color: 'var(--color-bg-slate)',
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
                pointerEvents: 'none',
                opacity: 0.3
              }}>
                "
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Tablet: 2 columns */
        @media (max-width: 1024px) {
          #testimonials > div > div[style*="grid"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Mobile: 1 column */
        @media (max-width: 768px) {
          #testimonials {
            padding: 4rem 0 !important;
          }
          
          .testimonials-header {
            margin-bottom: 3rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          #testimonials > div {
            padding: 0 1rem !important;
          }
          
          #testimonials > div > div[style*="grid"] {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
