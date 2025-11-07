"use client";
import React from 'react';
import ContactForm from '../ContactForm';

interface ContactDetailsSectionProps {
  title?: string;
  content?: string;
}

export default function ContactDetailsSection({ 
  title = "Contactgegevens",
  content = "Bereik ons via telefoon, e-mail of bezoek ons op kantoor. We zijn bereikbaar van maandag tot vrijdag tussen 09:00 en 18:00."
}: ContactDetailsSectionProps) {
  return (
    <section id="contact-details" style={{
      background: 'var(--color-bg)',
      padding: '8rem 2rem',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
          }}>
            {content}
          </p>
        </div>

        {/* Form */}
        <div style={{
          marginTop: '3rem',
        }}>
          <ContactForm />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          #contact-details {
            padding: 4rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}

