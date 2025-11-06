"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '../theme';

interface TwoColumnSupportProps {
  leftTitle?: string;
  leftDescription?: string;
  leftButtonLabel?: string;
  leftButtonUrl?: string;
  leftBackgroundColor?: string;
  testimonialName?: string;
  testimonialRole?: string;
  testimonialText?: string;
  testimonialImage?: string;
  showCarousel?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function TwoColumnSupport({
  leftTitle = "Betrouwbare ondersteuning",
  leftDescription = "Krijg 24/7 ondersteuning van GeldGeregeld. Ons toegewijde klantenserviceteam staat voor u klaar om te helpen, dag en nacht, zodat uw financieel beheer probleemloos en efficiënt verloopt.",
  leftButtonLabel = "Neem contact op",
  leftButtonUrl = "#contact",
  leftBackgroundColor,
  testimonialName = "Sarah L.",
  testimonialRole = "Operations Director",
  testimonialText = "Het beheren van salarissen met GeldGeregeld is een game-changer voor onze organisatie. Ons personeel houdt van de flexibiliteit en transparantie die het biedt.",
  testimonialImage,
  showCarousel = true,
  onPrevious,
  onNext,
}: TwoColumnSupportProps) {
  // Use theme color if not provided
  const bgColor = leftBackgroundColor || theme.colors.secondaryLight;
  
  return (
    <section style={{
      background: theme.colors.white,
      padding: '8rem 2rem',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '3rem',
          alignItems: 'stretch',
        }}>
          {/* Left Column - Support Info */}
          <div style={{
            background: bgColor,
            borderRadius: theme.radius.xl,
            padding: '4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '500px',
          }}>
            <div style={{
              maxWidth: '500px',
            }}>
              <h2 style={{
                fontSize: '3rem',
                fontWeight: 500,
                marginBottom: '2rem',
                color: theme.colors.black,
                lineHeight: 1.2,
              }}>
                {leftTitle}
              </h2>
              
              {/* Decorative underline */}
              <div style={{
                width: '80px',
                height: '3px',
                background: theme.colors.black,
                margin: '0 auto 2.5rem',
              }} />
              
              <p style={{
                fontSize: '1.125rem',
                color: theme.colors.gray700,
                lineHeight: 1.7,
                marginBottom: '3rem',
              }}>
                {leftDescription}
              </p>
              
              <button
                onClick={() => window.location.href = leftButtonUrl}
                style={{
                  background: theme.colors.black,
                  color: theme.colors.white,
                  border: 'none',
                  padding: '1rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: theme.radius.sm,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.colors.gray800;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.colors.black;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {leftButtonLabel}
              </button>
            </div>
          </div>

          {/* Right Column - Testimonial */}
          <div style={{
            background: theme.colors.backgroundAlt,
            borderRadius: theme.radius.xl,
            padding: '4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            minHeight: '500px',
          }}>
            {/* Profile Image */}
            {testimonialImage ? (
              <img
                src={testimonialImage}
                alt={testimonialName}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '2rem',
                  border: `4px solid ${theme.colors.white}`,
                  boxShadow: theme.shadows.lg,
                }}
              />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: theme.colors.primary,
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 600,
                color: theme.colors.white,
                boxShadow: theme.shadows.lg,
              }}>
                {testimonialName.charAt(0)}
              </div>
            )}
            
            {/* Name and Role */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: theme.colors.text,
                marginBottom: '0.5rem',
              }}>
                {testimonialName}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: theme.colors.textMuted,
                fontWeight: 500,
              }}>
                {testimonialRole}
              </p>
            </div>
            
            {/* Testimonial Text */}
            <p style={{
              fontSize: '1.25rem',
              lineHeight: 1.7,
              color: theme.colors.text,
              maxWidth: '500px',
              fontStyle: 'italic',
            }}>
              {testimonialText}
            </p>
            
            {/* Navigation Buttons */}
            {showCarousel && (
              <>
                <button
                  onClick={onPrevious}
                  style={{
                    position: 'absolute',
                    left: '1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: theme.colors.black,
                    border: 'none',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: theme.shadows.md,
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                >
                  <ChevronLeft size={24} color={theme.colors.white} />
                </button>

                <button
                  onClick={onNext}
                  style={{
                    position: 'absolute',
                    right: '1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: theme.colors.black,
                    border: 'none',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: theme.shadows.md,
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                >
                  <ChevronRight size={24} color={theme.colors.white} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          section > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

