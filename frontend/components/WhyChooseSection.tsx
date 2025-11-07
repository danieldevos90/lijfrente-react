"use client";
import React from 'react';
import Image from 'next/image';

interface Benefit {
  title: string;
  description: string;
  iconPath: string;
  color: string;
  textColor: string;
}

interface WhyChooseSectionProps {
  benefits: Benefit[];
  title?: string;
  subtitle?: string;
}

export default function WhyChooseSection({ 
  benefits, 
  title = "Waarom GeldGeregeld?",
  subtitle = "Wij maken het verschil met persoonlijke service en jarenlange ervaring"
}: WhyChooseSectionProps) {
  return (
    <section id="why-choose" style={{
      background: 'var(--color-bg)',
      padding: '8rem 2rem',
    }}>
      <div style={{
        margin: '0 auto',
      }}>
        <div className="why-choose-header" style={{
          textAlign: 'center',
          marginBottom: '5rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          maxWidth: '800px',
          margin: '0 auto 5rem',
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

        <div 
          className="why-choose-scroll-container-outer"
          style={{
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <div
            className="why-choose-scroll-container"
            style={{
              position: 'relative',
              overflow: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="why-choose-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              margin: '0 auto',
            }}>
              {benefits.map((benefit, index) => {
                const isColored = index % 2 === 0;
                const bgColor = isColored ? benefit.color : 'white';
                const textColorMain = isColored ? benefit.textColor : 'var(--color-text)';
                
                return (
                  <div
                    key={index}
                    className="why-choose-card-wrapper"
                  >
                    <div
                      className="why-choose-card"
                      style={{
                        background: bgColor,
                        borderRadius: '1.5rem',
                        padding: '3rem 2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        minHeight: '350px',
                        cursor: 'pointer',
                        border: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="why-choose-card-icon" style={{ 
                        width: '6rem', 
                        height: '6rem', 
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Image 
                          src={benefit.iconPath} 
                          alt={benefit.title}
                          width={96}
                          height={96}
                          style={{
                            filter: 'brightness(0) saturate(100%)',
                            opacity: 1,
                          }}
                        />
                      </div>
                      <h3 className="why-choose-card-title" style={{
                        fontFamily: 'PP Neue Montreal, sans-serif',
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginBottom: '1rem',
                        color: textColorMain,
                      }}>
                        {benefit.title}
                      </h3>
                      <p className="why-choose-card-text" style={{
                        fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                        fontWeight: 300,
                        color: textColorMain,
                        lineHeight: 1.7,
                        opacity: 0.85,
                        margin: 0,
                      }}>
                        {benefit.description}
                      </p>
                    </div>
                    
                    {/* Mobile: Text below card */}
                    <div className="why-choose-card-content-mobile" style={{ display: 'none' }}>
                      <h3 style={{
                        fontFamily: 'PP Neue Montreal, sans-serif',
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginBottom: '0.75rem',
                        color: 'var(--color-text)',
                        marginTop: '1.5rem',
                      }}>
                        {benefit.title}
                      </h3>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: 300,
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                      }}>
                        {benefit.description}
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
        .why-choose-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .why-choose-scroll-container-outer {
          margin: 0;
        }

        @media (max-width: 1024px) {
          .why-choose-card {
            min-height: 280px !important;
          }
          
          .why-choose-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          #why-choose {
            padding: 4rem 0 !important;
          }
          
          #why-choose > div {
            padding: 0 !important;
          }
          
          .why-choose-header {
            margin-bottom: 3rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .why-choose-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .why-choose-scroll-container {
            padding-left: calc(10vw) !important;
            padding-right: calc(10vw) !important;
            padding-bottom: 1rem !important;
            scroll-padding: calc(10vw) !important;
          }
          
          .why-choose-grid {
            display: flex !important;
            gap: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .why-choose-card-wrapper {
            min-width: 80vw !important;
            max-width: 80vw !important;
            flex: 0 0 auto !important;
            scroll-snap-align: center !important;
          }
          
          .why-choose-card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
            padding: 3rem 2rem !important;
            margin-bottom: 0 !important;
            min-height: unset !important;
          }
          
          /* Hide text inside card on mobile */
          .why-choose-card-title,
          .why-choose-card-text {
            display: none !important;
          }
          
          /* Show only icon centered in card */
          .why-choose-card {
            justify-content: center !important;
          }
          
          .why-choose-card-icon {
            width: 7rem !important;
            height: 7rem !important;
            margin-bottom: 0 !important;
          }
          
          .why-choose-card-icon img {
            width: 112px !important;
            height: 112px !important;
          }
          
          /* Show text below card on mobile */
          .why-choose-card-content-mobile {
            display: block !important;
            text-align: center;
            padding: 0 0.5rem;
          }
        }

        @media (max-width: 768px) and (min-width: 641px) {
          #why-choose {
            padding: 5rem 0 !important;
          }
          
          #why-choose > div {
            padding: 0 !important;
          }
          
          .why-choose-header {
            margin-bottom: 3.5rem !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          .why-choose-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .why-choose-scroll-container {
            padding-left: calc(12.5vw) !important;
            padding-right: calc(12.5vw) !important;
            padding-bottom: 1rem !important;
            scroll-padding: calc(12.5vw) !important;
          }
          
          .why-choose-grid {
            display: flex !important;
            gap: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .why-choose-card-wrapper {
            min-width: 75vw !important;
            max-width: 75vw !important;
            flex: 0 0 auto !important;
            scroll-snap-align: center !important;
          }
          
          .why-choose-card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
            padding: 2.5rem 2rem !important;
            margin-bottom: 0 !important;
            min-height: unset !important;
          }
          
          /* Hide text inside card on tablet */
          .why-choose-card-title,
          .why-choose-card-text {
            display: none !important;
          }
          
          /* Show only icon centered in card */
          .why-choose-card {
            justify-content: center !important;
          }
          
          .why-choose-card-icon {
            width: 7rem !important;
            height: 7rem !important;
            margin-bottom: 0 !important;
          }
          
          .why-choose-card-icon img {
            width: 112px !important;
            height: 112px !important;
          }
          
          /* Show text below card on tablet */
          .why-choose-card-content-mobile {
            display: block !important;
            text-align: center;
            padding: 0 1rem;
          }
        }
      `}</style>
    </section>
  );
}

