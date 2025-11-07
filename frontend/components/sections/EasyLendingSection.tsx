"use client";
import React from 'react';
import Image from 'next/image';

interface EasyLendingSectionProps {
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right' | 'top';
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EasyLendingSection({
  title,
  content,
  imageUrl,
  imageAlt = '',
  imagePosition = 'left',
  ctaLabel,
  ctaHref
}: EasyLendingSectionProps) {
  // Convert richtext HTML to plain text
  const plainContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .trim();

  const isImageLeft = imagePosition === 'left';
  const isImageRight = imagePosition === 'right';
  const isImageTop = imagePosition === 'top';

  return (
    <section style={{
      background: 'var(--color-bg)',
      padding: '8rem 0',
      position: 'relative',
    }}>
      <div style={{ 
        margin: '0 auto', 
        padding: '0 2rem', 
        maxWidth: '1200px' 
      }}>
        <div style={{
          display: isImageTop ? 'block' : (imageUrl ? 'grid' : 'block'),
          gridTemplateColumns: isImageLeft ? '1fr 1.5fr' : isImageRight ? '1.5fr 1fr' : '1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Image */}
          {imageUrl && (
            <div style={{
              order: isImageLeft ? 1 : isImageRight ? 2 : 0,
              marginBottom: isImageTop ? '3rem' : '0',
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '.625rem',
                overflow: 'hidden',
                aspectRatio: '4/3',
              }}>
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{
            order: isImageLeft ? 2 : isImageRight ? 1 : 0,
            maxWidth: !imageUrl ? '800px' : '100%',
            margin: !imageUrl ? '0 auto' : '0',
            textAlign: !imageUrl ? 'center' as const : 'left' as const,
          }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
            }}>
              {title}
            </h2>
            <div style={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              marginBottom: ctaLabel ? '2rem' : '0',
              opacity: 0.85,
            }}>
              {plainContent}
            </div>
            {ctaLabel && ctaHref && (
              <div style={{ marginTop: '2rem' }}>
                <a 
                  className="btn btn-primary" 
                  href={ctaHref}
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

