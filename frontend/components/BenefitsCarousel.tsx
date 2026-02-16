"use client";
import React from 'react';
import Image from 'next/image';

interface Benefit {
  iconPath: string;
  title: string;
  desc: string;
  color: string;
  textColor: string;
}

interface BenefitsCarouselProps {
  benefits: Benefit[];
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
}

export default function BenefitsCarousel({ 
  benefits,
  title = "Zakelijke lening zonder gedoe",
  subtitle = "Eenvoudig online aanvragen. Geen opstartkosten. Boetevrij aflossen.",
  backgroundColor = 'var(--color-bg)'
}: BenefitsCarouselProps) {
  return (
    <section id="benefits" style={{
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ margin: '0 auto', padding: '0 2rem' }}>
        <div className="benefits-header" style={{ 
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

        {/* Benefits Cards Carousel */}
        <div 
          className="benefits-scroll-container-outer"
          style={{
            position: 'relative',
            margin: '0 -2rem',
          }}
        >
          <div 
            className="benefits-scroll-container"
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
            gap: '1rem',
            paddingBottom: '1rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}>
            {benefits.map((item, index) => {
              const isColored = index % 2 === 0;
              const bgColor = isColored ? item.color : 'var(--color-white)';
              const textColorMain = isColored ? item.textColor : 'var(--color-text)';
              
              return (
                <div
                  key={index}
                  className="benefit-card-wrapper"
                  style={{
                    minWidth: '35rem',
                    maxWidth: '35rem',
                    flex: '0 0 auto',
                    scrollSnapAlign: 'center',
                  }}
                >
                  <div
                    className="benefit-card"
                    style={{
                      background: bgColor,
                      borderRadius: '.625rem',
                      padding: '5rem 5.625rem',
                      width: '100%',
                      height: '35rem',
                      display: 'flex',
                      flexFlow: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      marginBottom: '0',
                    }}
                  >
                    <div className="benefit-card-icon" style={{ 
                      width: '9rem', 
                      height: '9rem', 
                      marginBottom: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image 
                        src={item.iconPath} 
                        alt={item.title}
                        width={144}
                        height={144}
                        style={{
                          filter: 'brightness(0) saturate(100%)',
                          opacity: 1,
                        }}
                      />
                    </div>
                    <h3 className="benefit-card-title" style={{
                      fontFamily: 'PP Neue Montreal, sans-serif',
                      fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                      fontWeight: 400,
                      lineHeight: 1.1,
                      marginBottom: '1.5rem',
                      color: textColorMain,
                    }}>
                      {item.title}
                    </h3>
                    <p className="benefit-card-text" style={{
                      fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
                      fontWeight: 300,
                      color: textColorMain,
                      lineHeight: 1.6,
                      opacity: 0.85,
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      <style jsx>{`
        .benefits-scroll-container::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          #benefits {
            padding: 4rem 0 !important;
          }
          
          #benefits > div {
            padding: 0 !important;
          }
          
          .benefits-header {
            margin-bottom: 3rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .benefits-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .benefits-scroll-container > div {
            padding-left: calc(10vw) !important;
            padding-right: calc(10vw) !important;
            padding-bottom: 1rem !important;
            gap: 1rem !important;
          }
          
          .benefit-card-wrapper {
            min-width: 80vw !important;
            max-width: 80vw !important;
            scroll-snap-align: center !important;
          }
          
          .benefit-card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
            padding: 3rem 2rem !important;
            margin-bottom: 0 !important;
          }
          
          .benefit-card-icon {
            width: 7rem !important;
            height: 7rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .benefit-card-icon img {
            width: 112px !important;
            height: 112px !important;
          }
        }

        @media (max-width: 768px) and (min-width: 641px) {
          #benefits {
            padding: 5rem 0 !important;
          }
          
          #benefits > div {
            padding: 0 !important;
          }
          
          .benefits-header {
            margin-bottom: 3.5rem !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          .benefits-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .benefits-scroll-container > div {
            padding-left: calc(12.5vw) !important;
            padding-right: calc(12.5vw) !important;
            padding-bottom: 1rem !important;
            gap: 1rem !important;
          }
          
          .benefit-card-wrapper {
            min-width: 75vw !important;
            max-width: 75vw !important;
            scroll-snap-align: center !important;
          }
          
          .benefit-card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
            padding: 2.5rem 2rem !important;
            margin-bottom: 0 !important;
          }
          
          .benefit-card-icon {
            width: 7rem !important;
            height: 7rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .benefit-card-icon img {
            width: 112px !important;
            height: 112px !important;
          }
        }
      `}</style>
    </section>
  );
}

