"use client";
import React from 'react';
import Image from 'next/image';

interface UseCase {
  title: string;
  description: string;
  iconPath?: string;
  imageUrl?: string; // Strapi image URL or local image path
  color?: string;
  textColor?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

interface UseCasesSectionProps {
  title?: string;
  subtitle?: string;
  useCases: UseCase[];
  backgroundColor?: string;
}

export default function UseCasesSection({
  title = "Waarvoor kun je de financiering gebruiken?",
  subtitle = "Veelzijdige financieringsoplossingen voor jouw sector",
  useCases,
  backgroundColor = 'var(--color-bg)'
}: UseCasesSectionProps) {
  return (
    <section style={{
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
    }}>
      <div style={{ margin: '0 auto', padding: '0 2rem', maxWidth: '1400px' }}>
        {/* Header */}
        <div className="use-cases-header" style={{ 
          textAlign: 'center', 
          marginBottom: '6rem', 
          paddingLeft: '2rem', 
          paddingRight: '2rem', 
          maxWidth: '800px', 
          margin: '0 auto 6rem' 
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

        {/* Use Cases - Alternating Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8rem',
        }}>
          {useCases.map((useCase, index) => {
            const isImageLeft = index % 2 === 0; // Alternate: even = left, odd = right
            const bgColor = useCase.color || (index % 2 === 0 ? '#fff2b2' : '#e4f2ff');
            const textColorMain = useCase.textColor || (index % 2 === 0 ? '#5e5515' : '#0f1720');
            
            // Prioritize imageUrl (Strapi) over iconPath
            const imageSource = useCase.imageUrl || useCase.iconPath;
            const isImage = useCase.imageUrl || (useCase.iconPath && useCase.iconPath.includes('/images/'));
            
            return (
              <div
                key={index}
                className="use-case-item"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isImageLeft ? '1.2fr 1.5fr' : '1.5fr 1.2fr',
                  gap: '5rem',
                  alignItems: 'center',
                  minHeight: '500px',
                }}
              >
                {/* Image */}
                <div style={{
                  order: isImageLeft ? 1 : 2,
                  height: '100%',
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: '500px',
                    borderRadius: '.625rem',
                    overflow: 'hidden',
                    background: bgColor,
                  }}>
                    {imageSource ? (
                      <Image
                        src={imageSource}
                        alt={useCase.title}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8rem',
                        color: textColorMain,
                        opacity: 0.3,
                      }}>
                        📋
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  order: isImageLeft ? 2 : 1,
                  padding: '2rem 0',
                }}>
                  <h3 style={{
                    fontFamily: 'PP Neue Montreal, sans-serif',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    marginBottom: '2rem',
                    color: 'var(--color-text)',
                  }}>
                    {useCase.title}
                  </h3>
                  <p style={{
                    fontSize: 'clamp(1.125rem, 1.75vw, 1.25rem)',
                    lineHeight: 1.8,
                    color: 'var(--color-text)',
                    marginBottom: useCase.buttonLabel ? '2.5rem' : '0',
                    opacity: 0.85,
                  }}>
                    {useCase.description}
                  </p>
                  {useCase.buttonLabel && (
                    <div style={{ marginTop: '2.5rem' }}>
                      <a 
                        className="btn btn-primary" 
                        href={useCase.buttonHref || '/lead'}
                      >
                        {useCase.buttonLabel}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .use-cases-header {
            margin-bottom: 4rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .use-case-item {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            min-height: auto !important;
          }
          
          .use-case-item > div:first-child {
            order: 1 !important;
            min-height: 350px !important;
          }
          
          .use-case-item > div:last-child {
            order: 2 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

