"use client";
import React from 'react';

interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating?: number;
}

interface TestimonialSectionProps {
  title?: string;
  testimonials: Testimonial[];
}

export default function TestimonialSection({ title, testimonials }: TestimonialSectionProps) {
  return (
    <section style={{ 
      padding: 'var(--space-xl) 0',
      background: '#F8FAFC'
    }}>
      {title && (
        <h2 style={{ 
          textAlign: 'center',
          fontSize: '28px',
          margin: '0 0 var(--space-xl)',
          color: 'var(--color-text)'
        }}>
          {title}
        </h2>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-lg)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            style={{
              background: '#fff',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            {testimonial.rating && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                {'★'.repeat(testimonial.rating)}
                {'☆'.repeat(5 - testimonial.rating)}
              </div>
            )}
            <p style={{ 
              fontStyle: 'italic',
              lineHeight: 1.6,
              margin: '0 0 var(--space-md)',
              color: 'var(--color-text)'
            }}>
              "{testimonial.text}"
            </p>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                {testimonial.name}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                {testimonial.company}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
