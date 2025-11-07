"use client";
import React from 'react';
import Image from 'next/image';

interface ContactOption {
  title: string;
  description: string;
  iconPath: string;
  color: string;
  textColor: string;
  href?: string;
}

interface ContactOptionsSectionProps {
  options: ContactOption[];
  title?: string;
  subtitle?: string;
}

export default function ContactOptionsSection({ 
  options, 
  title = "Contactmogelijkheden",
  subtitle = "Kies de manier die het beste bij u past"
}: ContactOptionsSectionProps) {
  return (
    <section id="contact-options" style={{
      background: 'var(--color-bg)',
      padding: '8rem 2rem',
    }}>
      <div style={{
        margin: '0 auto',
      }}>
        <div className="contact-options-header" style={{
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
          className="contact-options-scroll-container-outer"
          style={{
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <div
            className="contact-options-scroll-container"
            style={{
              position: 'relative',
              overflow: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="contact-options-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              margin: '0 auto',
            }}>
              {options.map((option, index) => {
                const bgColor = option.color;
                const textColorMain = option.textColor;
                
                const cardContent = (
                  <>
                    <div className="contact-options-card-icon" style={{ 
                      width: '6rem', 
                      height: '6rem', 
                      marginBottom: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image 
                        src={option.iconPath} 
                        alt={option.title}
                        width={96}
                        height={96}
                        style={{
                          filter: 'brightness(0) saturate(100%)',
                          opacity: 1,
                        }}
                      />
                    </div>
                    <h3 className="contact-options-card-title" style={{
                      fontFamily: 'PP Neue Montreal, sans-serif',
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      marginBottom: '1rem',
                      color: textColorMain,
                    }}>
                      {option.title}
                    </h3>
                    <p className="contact-options-card-text" style={{
                      fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                      fontWeight: 300,
                      color: textColorMain,
                      lineHeight: 1.7,
                      opacity: 0.85,
                      margin: 0,
                      whiteSpace: 'pre-line',
                    }}>
                      {option.description}
                    </p>
                  </>
                );
                
                return (
                  <div
                    key={index}
                    className="contact-options-card-wrapper"
                  >
                    {option.href ? (
                      <a
                        href={option.href}
                        className="contact-options-card"
                        style={{
                          background: bgColor,
                          borderRadius: '1.5rem',
                          padding: '3rem 2.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          minHeight: '350px',
                          border: 'none',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          boxShadow: 'none',
                          WebkitBoxShadow: 'none',
                          MozBoxShadow: 'none',
                        }}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <div
                        className="contact-options-card"
                        style={{
                          background: bgColor,
                          borderRadius: '1.5rem',
                          padding: '3rem 2.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          minHeight: '350px',
                          border: 'none',
                          boxShadow: 'none',
                          WebkitBoxShadow: 'none',
                          MozBoxShadow: 'none',
                        }}
                      >
                        {cardContent}
                      </div>
                    )}
                    
                    {/* Mobile: Text below card */}
                    <div className="contact-options-card-content-mobile" style={{ display: 'none' }}>
                      <h3 style={{
                        fontFamily: 'PP Neue Montreal, sans-serif',
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        marginBottom: '0.75rem',
                        color: 'var(--color-text)',
                        marginTop: '1.5rem',
                      }}>
                        {option.title}
                      </h3>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: 300,
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                      }}>
                        {option.description}
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
        .contact-options-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .contact-options-scroll-container-outer {
          margin: 0;
        }
        
        .contact-options-card {
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
          -moz-box-shadow: none !important;
        }
        
        .contact-options-card img {
          filter: drop-shadow(none) !important;
          box-shadow: none !important;
        }

        @media (max-width: 1024px) {
          .contact-options-card {
            min-height: 280px !important;
          }
          
          .contact-options-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          #contact-options {
            padding: 4rem 0 !important;
          }
          
          #contact-options > div {
            padding: 0 !important;
          }
          
          .contact-options-header {
            margin-bottom: 3rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .contact-options-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .contact-options-scroll-container {
            padding-left: calc(10vw) !important;
            padding-right: calc(10vw) !important;
            padding-bottom: 1rem !important;
            scroll-padding: calc(10vw) !important;
          }
          
          .contact-options-grid {
            display: flex !important;
            gap: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .contact-options-card-wrapper {
            min-width: 80vw !important;
            max-width: 80vw !important;
            flex: 0 0 auto !important;
            scroll-snap-align: center !important;
          }
          
          .contact-options-card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
            padding: 3rem 2rem !important;
            margin-bottom: 0 !important;
            min-height: unset !important;
          }
          
          /* Hide text inside card on mobile */
          .contact-options-card-title,
          .contact-options-card-text {
            display: none !important;
          }
          
          /* Show only icon centered in card */
          .contact-options-card {
            justify-content: center !important;
          }
          
          .contact-options-card-icon {
            width: 7rem !important;
            height: 7rem !important;
            margin-bottom: 0 !important;
          }
          
          .contact-options-card-icon img {
            width: 112px !important;
            height: 112px !important;
          }
          
          /* Show text below card on mobile */
          .contact-options-card-content-mobile {
            display: block !important;
            text-align: center;
            padding: 0 0.5rem;
          }
        }

        @media (max-width: 768px) and (min-width: 641px) {
          #contact-options {
            padding: 5rem 0 !important;
          }
          
          #contact-options > div {
            padding: 0 !important;
          }
          
          .contact-options-header {
            margin-bottom: 3.5rem !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          .contact-options-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .contact-options-scroll-container {
            padding-left: calc(12.5vw) !important;
            padding-right: calc(12.5vw) !important;
            padding-bottom: 1rem !important;
            scroll-padding: calc(12.5vw) !important;
          }
          
          .contact-options-grid {
            display: flex !important;
            gap: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .contact-options-card-wrapper {
            min-width: 75vw !important;
            max-width: 75vw !important;
            flex: 0 0 auto !important;
            scroll-snap-align: center !important;
          }
          
          .contact-options-card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 !important;
            padding: 2.5rem 2rem !important;
            margin-bottom: 0 !important;
            min-height: unset !important;
          }
          
          /* Hide text inside card on tablet */
          .contact-options-card-title,
          .contact-options-card-text {
            display: none !important;
          }
          
          /* Show only icon centered in card */
          .contact-options-card {
            justify-content: center !important;
          }
          
          .contact-options-card-icon {
            width: 7rem !important;
            height: 7rem !important;
            margin-bottom: 0 !important;
          }
          
          .contact-options-card-icon img {
            width: 112px !important;
            height: 112px !important;
          }
          
          /* Show text below card on tablet */
          .contact-options-card-content-mobile {
            display: block !important;
            text-align: center;
            padding: 0 1rem;
          }
        }
      `}</style>
    </section>
  );
}

