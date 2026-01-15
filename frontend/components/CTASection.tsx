"use client";
import React from 'react';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  subText?: string;
}

export default function CTASection({ 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  subText = 'Geen verplichtingen • Vrijblijvend aanbod • Binnen 24 uur reactie'
}: CTASectionProps) {
  return (
    <section id="cta" style={{
      background: 'var(--color-charcoal)',
      padding: '6rem 2rem',
    }}>
      <div style={{
        margin: '0 auto',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: 400,
          marginBottom: '1rem',
          color: 'white',
          fontFamily: 'PP Neue Montreal, sans-serif',
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--overlay-white-7)',
          marginBottom: '3rem',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className="btn btn-secondary cta-button"
        >
          {buttonText}
        </button>

        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--overlay-white-5)',
          marginTop: '2rem',
        }}>
          {subText}
        </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .cta-button {
            width: 100% !important;
            max-width: 100% !important;
            min-width: auto !important;
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
}

