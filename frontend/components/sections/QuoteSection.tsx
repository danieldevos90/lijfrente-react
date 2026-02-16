"use client";
import React from 'react';

interface QuoteSectionProps {
  quote: string;
  author?: string;
  backgroundColor?: string;
}

export default function QuoteSection({
  quote,
  author,
  backgroundColor = 'var(--color-bg)'
}: QuoteSectionProps) {
  return (
    <section style={{
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
    }}>
      <div style={{ 
        margin: '0 auto', 
        padding: '0 2rem', 
        maxWidth: '1600px' 
      }}>
        <div style={{
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Quote mark decoration */}
          <div
            className="quote-mark"
            aria-hidden="true"
            style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            lineHeight: 1,
            color: 'var(--color-brand)',
            opacity: 0.15,
            fontFamily: 'Georgia, serif',
            marginBottom: '-2rem',
            userSelect: 'none',
          }}
          />
          
          {/* Quote text */}
          <blockquote style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--color-text)',
            margin: '0 auto 2rem',
            maxWidth: '1400px',
            fontStyle: 'normal',
            position: 'relative',
            padding: '0 2rem',
          }}>
            {quote}
          </blockquote>

          {/* Author (optional) */}
          {author && (
            <cite style={{
              display: 'block',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              fontStyle: 'normal',
            }}>
              — {author}
            </cite>
          )}
        </div>
      </div>

      <style jsx>{`
        .quote-mark::before {
          content: '"';
          display: block;
        }

        @media (max-width: 768px) {
          blockquote {
            padding: 0 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}

