"use client";
import React from 'react';

interface FeatureSectionProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick: () => void;
  imagePath: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
}

export default function FeatureSection({
  title,
  description,
  buttonText,
  onButtonClick,
  imagePath,
  imagePosition = 'left',
  backgroundColor = 'white',
}: FeatureSectionProps) {
  return (
    <section id="feature" style={{
      background: backgroundColor,
      padding: '8rem 2rem',
    }}>
      <div style={{ margin: '0 auto' }}>
        <div className="feature-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Image */}
          <div 
            className="feature-image" 
            style={{
              width: '100%',
              height: '100%',
              minHeight: '600px',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              background: `url('${imagePath}') center/cover`,
              order: imagePosition === 'left' ? 0 : 1,
            }}
          />

          {/* Text Content */}
          <div style={{
            padding: '2rem',
            order: imagePosition === 'left' ? 1 : 0,
          }}>
            <h2 style={{
              fontFamily: '"PP Neue Montreal", sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              {title}
            </h2>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: 300,
              color: 'var(--color-text)',
              lineHeight: 1.7,
              opacity: 0.85,
              marginBottom: '3rem',
            }}>
              {description}
            </p>
            {buttonText && (
              <div className="feature-button-wrapper" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button 
                  className="feature-button"
                  style={{
                    border: 'none',
                    backgroundColor: '#000000',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '10rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '14rem',
                    padding: '1.5rem 3rem',
                    fontFamily: 'Public Sans Variable, sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: '1rem',
                    transition: 'all .28s',
                    display: 'flex',
                    cursor: 'pointer',
                  }}
                  onClick={onButtonClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }}
                >
                  {buttonText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          /* Feature grid mobile */
          .feature-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          .feature-image {
            min-height: 350px !important;
            order: 0 !important;
          }
          
          .feature-grid > div:nth-child(2) {
            padding: 0 !important;
            order: 1 !important;
          }
          
          #feature {
            padding: 4rem 1rem !important;
          }
          
          /* Make button full width and centered on mobile */
          .feature-button-wrapper {
            justify-content: center !important;
          }
          
          .feature-button {
            width: 100% !important;
            max-width: 100% !important;
            min-width: auto !important;
            display: flex !important;
          }
        }
        
        @media (max-width: 480px) {
          .feature-image {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}

