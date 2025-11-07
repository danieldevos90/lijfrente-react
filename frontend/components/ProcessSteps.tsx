"use client";
import React from 'react';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Step {
  number: string;
  title: string;
  description: string;
  details: string[];
  imagePath?: string;
}

interface ProcessStepsProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
}

export default function ProcessSteps({ 
  steps, 
  title = "Het proces",
  subtitle = "Simpel, transparant en snel"
}: ProcessStepsProps) {
  return (
    <>
      {/* Header Section */}
      <section id="process-steps-header" style={{
        background: 'var(--color-bg)',
        padding: '8rem 2rem 0',
      }}>
        <div style={{
          margin: '0 auto',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '5rem',
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
            {subtitle && (
              <p style={{
                fontSize: '1.25rem',
                color: 'var(--color-text-muted)',
                maxWidth: '700px',
                margin: '0 auto',
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="process-steps" style={{
        background: 'var(--color-bg)',
        padding: '0 2rem 8rem',
      }}>
        <div style={{
          margin: '0 auto',
        }}>
        {steps.map((step, index) => {
          const isEven = index % 2 === 1; // Even cards (0-indexed, so odd index numbers)
          
          return (
            <div
              key={index}
              className="process-step-card"
              style={{
                position: 'sticky',
                top: `calc(${index * 20}px + var(--sticky-top-offset, 40px))`,
                marginBottom: '2rem',
                zIndex: index + 1,
              }}
            >
              <div
                style={{
                  minHeight: '600px',
                  background: 'white',
                  borderRadius: '24px',
                  padding: '0',
                  display: 'flex',
                  flexDirection: isEven ? 'row-reverse' : 'row',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Image Side */}
                {step.imagePath && (
                  <div style={{
                    width: '45%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <Image
                      src={step.imagePath}
                      alt={step.title}
                      fill
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  </div>
                )}

                {/* Content Side */}
                <div style={{
                  width: step.imagePath ? '55%' : '100%',
                  padding: '4rem 3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                {/* Number */}
                <div style={{
                  fontSize: '8rem',
                  fontWeight: 300,
                  color: '#f1f5f9',
                  lineHeight: 1,
                  fontFamily: 'PP Neue Montreal, sans-serif',
                  marginBottom: '2rem',
                }}>
                  {step.number}
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 400,
                    marginBottom: '1.5rem',
                    color: 'var(--color-text)',
                    fontFamily: 'PP Neue Montreal, sans-serif',
                    lineHeight: 1.1,
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: '1.125rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-muted)',
                    marginBottom: '2rem',
                  }}>
                    {step.description}
                  </p>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: '1rem',
                  }}>
                    {step.details.map((detail, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          fontSize: '1rem',
                          color: 'var(--color-text)',
                        }}
                      >
                        <CheckCircle 
                          size={20} 
                          color="#457fff" 
                          strokeWidth={2}
                          style={{ marginTop: '2px', flexShrink: 0 }}
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Extra space for last card to be visible */}
        <div style={{ height: '100px' }} />
      </div>
      
      <style jsx>{`
        #process-steps-header {
          padding-top: 8rem;
          padding-bottom: 0;
        }
        
        #process-steps {
          --sticky-top-offset: 40px;
          padding-top: 0;
          padding-bottom: 8rem;
        }
        
        @media (max-width: 768px) {
          #process-steps-header {
            padding-top: 4rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          #process-steps {
            --sticky-top-offset: 20px;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-bottom: 4rem;
          }
          
          .process-step-card {
            position: sticky !important;
            top: calc(var(--sticky-top-offset) + 10px) !important;
          }
          
          .process-step-card > div {
            min-height: 450px !important;
            flex-direction: column !important;
          }
          
          .process-step-card > div > div:first-child {
            width: 100% !important;
            height: 250px !important;
          }
          
          .process-step-card > div > div:last-child {
            width: 100% !important;
            padding: 3rem 2rem !important;
          }
          
          .process-step-card h3 {
            font-size: 2rem !important;
          }
          
          .process-step-card div[style*="fontSize: '8rem'"] {
            font-size: 5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          #process-steps-header {
            padding-top: 3rem;
          }
          
          #process-steps {
            --sticky-top-offset: 10px;
            padding-bottom: 3rem;
          }
          
          .process-step-card {
            top: calc(var(--sticky-top-offset) + 5px) !important;
          }
          
          .process-step-card > div {
            min-height: 400px !important;
          }
          
          .process-step-card > div > div:first-child {
            height: 200px !important;
          }
          
          .process-step-card > div > div:last-child {
            padding: 2rem 1.5rem !important;
          }
          
          .process-step-card h3 {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
      </section>
    </>
  );
}

