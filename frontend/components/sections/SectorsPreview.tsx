"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Sector {
  slug: string;
  name: string;
  description: string;
  iconPath?: string;
  heroImage?: {
    data?: {
      attributes?: {
        url: string;
      };
    };
  };
}

interface SectorsPreviewProps {
  sectors: Sector[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  backgroundColor?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function SectorsPreview({
  sectors,
  title = "Financiering voor elke sector",
  subtitle = "Ontdek hoe wij jouw branche specifiek kunnen helpen",
  maxItems = 6,
  backgroundColor = 'var(--color-bg)',
  showViewAll = true,
  viewAllHref = '/sectoren'
}: SectorsPreviewProps) {
  // Limit sectors to maxItems
  const displayedSectors = sectors.slice(0, maxItems);

  // Sector icon mapping fallback
  const getSectorIcon = (slug: string): string => {
    const iconMap: Record<string, string> = {
      horeca: '/icons/SVG/food/cutlery.svg',
      retail: '/icons/SVG/e-commerce/shop.svg',
      transport: '/icons/SVG/e-commerce/truck.svg',
      bouw: '/icons/SVG/interface/home.svg',
      ecommerce: '/icons/SVG/e-commerce/shopping-cart.svg',
      zorg: '/icons/SVG/health/stethoscope.svg',
      consultants: '/icons/SVG/interface/bulb.svg',
      schoonmaak: '/icons/SVG/interface/magic-wand.svg',
      automotive: '/icons/SVG/e-commerce/truck.svg',
      productie: '/icons/SVG/e-commerce/factory.svg',
    };
    return iconMap[slug] || '/icons/SVG/finance/wallet.svg';
  };

  // Get image URL from Strapi structure
  const getImageUrl = (sector: Sector): string | null => {
    if (sector.heroImage?.data?.attributes?.url) {
      const imageUrl = sector.heroImage.data.attributes.url;
      // Handle both absolute and relative URLs
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://bright-smile-1f47bc9d67.strapiapp.com';
      return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    return null;
  };

  return (
    <section style={{
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
    }}>
      <div style={{ margin: '0 auto', padding: '0 2rem', maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ 
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
          {subtitle && (
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Sectors Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: showViewAll ? '4rem' : '0',
        }}>
          {displayedSectors.map((sector, index) => {
            const imageUrl = getImageUrl(sector);
            const iconPath = sector.iconPath || getSectorIcon(sector.slug);
            
            return (
              <Link
                key={sector.slug}
                href={`/sectoren/${sector.slug}`}
                style={{
                  display: 'block',
                  background: 'white',
                  borderRadius: '.625rem',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                className="sector-preview-card"
              >
                {/* Image or Icon */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #f9f9f8 0%, #ffffff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={sector.name}
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                      unoptimized={imageUrl.includes('strapiapp.com')}
                    />
                  ) : (
                    <Image
                      src={iconPath}
                      alt={sector.name}
                      width={80}
                      height={80}
                      style={{
                        objectFit: 'contain',
                        opacity: 0.8,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{
                  padding: '2rem',
                }}>
                  <h3 style={{
                    fontFamily: 'PP Neue Montreal, sans-serif',
                    fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    marginBottom: '1rem',
                    color: 'var(--color-text)',
                  }}>
                    {sector.name}
                  </h3>
                  <p style={{
                    fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)',
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted)',
                    marginBottom: '1.5rem',
                  }}>
                    {sector.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#457fff',
                    fontWeight: '600',
                    fontSize: '0.9375rem',
                  }}>
                    Lees meer
                    <span style={{ marginLeft: '0.5rem' }}>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        {showViewAll && sectors.length > maxItems && (
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
          }}>
            <Link
              href={viewAllHref}
              className="btn btn-primary"
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                textDecoration: 'none',
              }}
            >
              Bekijk alle sectoren
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .sector-preview-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #457fff;
        }

        @media (max-width: 768px) {
          .sector-preview-card {
            min-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
