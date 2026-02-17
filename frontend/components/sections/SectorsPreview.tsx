"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Keep SSR + hydration deterministic; randomize after mount on the homepage only.
  const [displayedSectors, setDisplayedSectors] = React.useState<Sector[]>(
    () => sectors.slice(0, maxItems)
  );

  React.useEffect(() => {
    if (!Array.isArray(sectors) || sectors.length === 0) {
      setDisplayedSectors([]);
      return;
    }

    if (!isHomePage) {
      setDisplayedSectors(sectors.slice(0, maxItems));
      return;
    }

    // Shuffle sectors so the homepage selection/order changes each visit/refresh.
    const shuffled = [...sectors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDisplayedSectors(shuffled.slice(0, maxItems));
  }, [sectors, maxItems, isHomePage]);

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
    <section 
      aria-labelledby="sectors-preview-title"
      style={{
        background: backgroundColor,
        padding: '8rem 0',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ 
        margin: '0 auto', 
        padding: '0 2rem', 
        maxWidth: '1400px',
        marginBottom: '5rem',
      }}>
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '800px', 
          margin: '0 auto' 
        }}>
          <h2 
            id="sectors-preview-title"
            style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}
          >
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
      </div>

      {/* Sectors Carousel - Full Width */}
      <div 
        className="sectors-scroll-container-outer"
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <div 
          className="sectors-scroll-container"
          style={{
            position: 'relative',
            overflow: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100%',
          }}
        >
          <nav aria-label="Sectoren overzicht" style={{
            display: 'flex',
            gap: '1rem',
            paddingBottom: '1rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}>
              {displayedSectors.map((sector) => {
                const imageUrl = getImageUrl(sector);
                const iconPath = sector.iconPath || getSectorIcon(sector.slug);
                
                return (
                  <div
                    key={sector.slug}
                    className="sector-card-wrapper"
                    style={{
                      minWidth: '320px',
                      maxWidth: '320px',
                      flex: '0 0 auto',
                      scrollSnapAlign: 'center',
                    }}
                  >
                    <Link
                      href={`/sectoren/${sector.slug}`}
                      aria-label={`Bekijk financiering voor ${sector.name}`}
                      style={{
                        display: 'block',
                        background: 'white',
                        borderRadius: '.625rem',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        color: 'inherit',
                        border: '1px solid var(--color-border)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        height: '100%',
                      }}
                      className="sector-preview-card"
                    >
                      {/* Image or Icon */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-white) 100%)',
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
                        textAlign: 'center',
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
                          justifyContent: 'center',
                          color: 'var(--color-primary)',
                          fontWeight: '600',
                          fontSize: '0.9375rem',
                        }}>
                          Lees meer
                          <span style={{ marginLeft: '0.5rem' }}>→</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* View All Link */}
        {showViewAll && sectors.length > maxItems && (
          <div style={{
            margin: '0 auto',
            padding: '0 2rem',
            maxWidth: '1400px',
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

      <style jsx>{`
        .sectors-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .sector-preview-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: var(--color-primary);
        }

        @media (max-width: 640px) {
          .sectors-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .sectors-scroll-container {
            padding-left: calc(10vw) !important;
            padding-right: calc(10vw) !important;
            padding-bottom: 1rem !important;
            scroll-padding: calc(10vw) !important;
          }
          
          .sectors-scroll-container nav {
            padding-left: 0 !important;
            padding-right: 0 !important;
            gap: 1rem !important;
          }
          
          .sector-card-wrapper {
            min-width: 80vw !important;
            max-width: 80vw !important;
            scroll-snap-align: center !important;
          }
        }

        @media (max-width: 768px) and (min-width: 641px) {
          .sectors-scroll-container-outer {
            margin: 0 !important;
            overflow: visible !important;
          }
          
          .sectors-scroll-container {
            padding-left: calc(12.5vw) !important;
            padding-right: calc(12.5vw) !important;
            padding-bottom: 1rem !important;
            scroll-padding: calc(12.5vw) !important;
          }
          
          .sectors-scroll-container nav {
            padding-left: 0 !important;
            padding-right: 0 !important;
            gap: 1rem !important;
          }
          
          .sector-card-wrapper {
            min-width: 75vw !important;
            max-width: 75vw !important;
            scroll-snap-align: center !important;
          }
        }
      `}</style>
    </section>
  );
}
