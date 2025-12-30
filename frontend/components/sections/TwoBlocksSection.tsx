"use client";
import React from 'react';
import Section from '../ui/Section';
import { getStrapiImageUrl } from '@/lib/strapi-cms';

interface BlockItem {
  image?: {
    data?: {
      attributes?: {
        url: string;
        alternativeText?: string;
      };
    };
  } | string;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
}

interface TwoBlocksSectionProps {
  title?: string;
  subtitle?: string;
  blocks?: BlockItem[];
  backgroundColor?: 'white' | 'gray' | 'blue' | 'dark';
}

export default function TwoBlocksSection({
  title,
  subtitle,
  blocks = [],
  backgroundColor = 'white'
}: TwoBlocksSectionProps) {
  // Extract image URL from Strapi structure
  const getImageUrl = (image: BlockItem['image']): string | undefined => {
    if (!image) return undefined;
    
    // Handle string URL (already processed)
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : getStrapiImageUrl(image);
    }
    
    // Handle Strapi media structure
    const url = image?.data?.attributes?.url;
    if (url) {
      return getStrapiImageUrl(url);
    }
    
    return undefined;
  };

  // Get image alt text from Strapi structure
  const getImageAlt = (image: BlockItem['image'], title: string): string => {
    if (!image || typeof image === 'string') {
      return title;
    }
    return image?.data?.attributes?.alternativeText || title;
  };

  // Ensure we have exactly 2 blocks
  const displayBlocks = blocks.slice(0, 2);

  return (
    <Section background={backgroundColor} padding="xl">
      {(title || subtitle) && (
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          maxWidth: '800px',
          margin: '0 auto 4rem',
        }}>
          {title && (
            <h2 style={{
              fontFamily: '"PP Neue Montreal", sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: subtitle ? '1rem' : '0',
              color: 'var(--color-text)'
            }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'stretch',
      }}>
        {displayBlocks.map((block, index) => {
          const imageUrl = getImageUrl(block.image);
          const imageAlt = getImageAlt(block.image, block.title);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Image */}
              {imageUrl && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  background: 'var(--color-border)',
                }}>
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div style={{
                padding: '2.5rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h3 style={{
                  fontFamily: '"PP Neue Montreal", sans-serif',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  color: 'var(--color-text)'
                }}>
                  {block.title}
                </h3>

                <div style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  marginBottom: block.buttonLabel ? '1.5rem' : '0',
                  flex: 1,
                }}>
                  {block.description}
                </div>

                {block.buttonLabel && block.buttonHref && (
                  <a
                    href={block.buttonHref}
                    className="btn btn-primary"
                    style={{
                      marginTop: 'auto',
                      display: 'inline-block',
                      width: 'fit-content',
                    }}
                  >
                    {block.buttonLabel}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
