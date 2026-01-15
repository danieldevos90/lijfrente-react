import type { Metadata } from 'next';
import { buildTitle, buildDescription } from '../messaging';
import { getAllPages } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';
import CTASection from '../../components/sections/CTASection';
import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata as generateSEOMetadata, generateBreadcrumbSchema, buildCanonicalUrl, getBaseUrl } from '@/lib/seo';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// Common Dutch sectors for SEO
const SECTOR_INFO: Record<string, { name: string; description: string; keywords: string[] }> = {
  horeca: {
    name: 'Horeca',
    description: 'Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafés en hotels.',
    keywords: ['horeca financiering', 'restaurant lening', 'café financiering', 'hotel financiering', 'horeca krediet', 'horeca ondernemer financiering', 'horeca lening zonder bkr']
  },
  retail: {
    name: 'Retail',
    description: 'Financiering voor retailbedrijven. Van webshops tot fysieke winkels.',
    keywords: ['retail financiering', 'winkel financiering', 'webshop lening', 'retail lening', 'retail krediet', 'winkelier financiering', 'retail ondernemer lening']
  },
  transport: {
    name: 'Transport & Logistiek',
    description: 'Zakelijke lening voor transport- en logistiekbedrijven.',
    keywords: ['transport financiering', 'logistiek lening', 'vrachtwagen financiering', 'transportbedrijf lening', 'transport krediet', 'logistiek krediet', 'vrachtwagen lening']
  },
  bouw: {
    name: 'Bouw & Installatie',
    description: 'Financiering voor bouwbedrijven en installateurs.',
    keywords: ['bouw financiering', 'installatie lening', 'bouwbedrijf financiering', 'aannemer lening', 'bouw krediet', 'installateur financiering', 'bouwondernemer lening']
  },
  ecommerce: {
    name: 'E-commerce',
    description: 'Zakelijke financiering voor online ondernemers en webshops.',
    keywords: ['e-commerce financiering', 'webshop lening', 'online ondernemer financiering', 'e-commerce lening', 'webshop krediet', 'online winkel financiering', 'e-commerce krediet']
  },
  zorg: {
    name: 'Zorg & Welzijn',
    description: 'Financiering voor zorginstellingen en welzijnsorganisaties.',
    keywords: ['zorg financiering', 'welzijn lening', 'zorginstelling financiering', 'zorgondernemer lening', 'zorg krediet', 'welzijnsorganisatie financiering', 'zorgondernemer krediet']
  },
  consultants: {
    name: 'Advies & Consultancy',
    description: 'Financiering voor adviesbureaus en consultants.',
    keywords: ['consultancy financiering', 'adviesbureau lening', 'consultant financiering', 'advies lening', 'consultancy krediet', 'adviesbureau krediet', 'consultant krediet']
  },
  schoonmaak: {
    name: 'Schoonmaak',
    description: 'Zakelijke financiering voor schoonmaakbedrijven.',
    keywords: ['schoonmaak financiering', 'schoonmaakbedrijf lening', 'schoonmaak lening', 'schoonmaak krediet', 'schoonmaakbedrijf krediet', 'reinigingsbedrijf financiering']
  },
  automotive: {
    name: 'Automotive',
    description: 'Financiering voor automotive bedrijven en garages.',
    keywords: ['automotive financiering', 'garage lening', 'autobedrijf financiering', 'automotive lening', 'garage krediet', 'autobedrijf krediet', 'autowerkplaats financiering']
  },
  productie: {
    name: 'Productie & Industrie',
    description: 'Zakelijke lening voor productiebedrijven en industriële ondernemingen.',
    keywords: ['productie financiering', 'industrie lening', 'productiebedrijf financiering', 'industrieel lening', 'productie krediet', 'industrie krediet', 'maakindustrie financiering']
  },
  zzp: {
    name: 'ZZP',
    description: 'Zakelijke financiering voor zelfstandigen zonder personeel. Flexibele lening voor ZZP\'ers.',
    keywords: ['zzp lening', 'zzp financiering', 'zzp krediet', 'zelfstandige lening', 'zzp ondernemer financiering', 'zzp lening zonder bkr']
  },
  starters: {
    name: 'Starters & Startups',
    description: 'Financiering voor startende ondernemers en startups. Snel geregeld zonder jarenlange historie.',
    keywords: ['starterslening', 'startup financiering', 'startende ondernemer lening', 'nieuwe onderneming financiering', 'starters krediet']
  },
  franchise: {
    name: 'Franchise',
    description: 'Zakelijke financiering voor franchisenemers. Investeer in je franchise zonder gedoe.',
    keywords: ['franchise lening', 'franchise financiering', 'franchisenemer lening', 'franchise krediet', 'franchise ondernemer financiering']
  },
  medisch: {
    name: 'Medische Praktijken',
    description: 'Financiering voor medische praktijken en artsen. Speciaal voor de zorgsector.',
    keywords: ['medische praktijk lening', 'arts financiering', 'praktijk financiering', 'medisch centrum lening', 'huisarts financiering']
  },
  tandarts: {
    name: 'Tandartspraktijken',
    description: 'Zakelijke financiering voor tandartspraktijken. Investeer in apparatuur en verbouwingen.',
    keywords: ['tandartspraktijk lening', 'tandarts financiering', 'tandarts krediet', 'tandartspraktijk krediet', 'tandheelkunde financiering']
  },
  groothandel: {
    name: 'Groothandel',
    description: 'Financiering voor groothandels en distributiebedrijven. Werkkapitaal voor voorraad en groei.',
    keywords: ['groothandel financiering', 'groothandel lening', 'wholesale financiering', 'distributie financiering', 'groothandel krediet']
  },
  schoonheid: {
    name: 'Schoonheidsindustrie',
    description: 'Zakelijke financiering voor kappers, schoonheidssalons en wellnesscentra.',
    keywords: ['kapper lening', 'schoonheidssalon financiering', 'schoonheidsindustrie lening', 'kapperszaak financiering', 'beauty salon lening']
  },
  kasstroom: {
    name: 'Kasstroom & Werkkapitaal',
    description: 'Werkkapitaalfinanciering voor bedrijven. Overbrug betalingsachterstanden en investeer in groei.',
    keywords: ['kasstroom lening', 'werkkapitaal financiering', 'liquiditeitsfinanciering', 'werkkapitaal krediet', 'cashflow financiering']
  },
};

export const dynamic = 'force-dynamic';

async function fetchSectorPages() {
  try {
    const allPages = await getAllPages(SITE_ID, {
      next: { revalidate: 3600 }
    });
    
    // Filter for sector pages
    const sectorPages = allPages.filter((page: any) => {
      const pageData = page.attributes || page;
      const slug = pageData?.slug || '';
      return slug.startsWith('sector-');
    });
    
    return sectorPages;
  } catch (error) {
    console.error('Error fetching sector pages:', error);
    return [];
  }
}

export default async function SectorenPage() {
  const sectorPages = await fetchSectorPages();
  
  // Create a map of existing sector pages
  const existingSectors = new Map<string, any>();
  sectorPages.forEach((page: any) => {
    const pageData = page.attributes || page;
    const slug = pageData?.slug || '';
    const sectorSlug = slug.replace('sector-', '');
    existingSectors.set(sectorSlug, pageData);
  });

  // Combine Strapi pages with predefined sector info
  const allSectors = Object.keys(SECTOR_INFO).map((sectorSlug) => {
    const sectorInfo = SECTOR_INFO[sectorSlug];
    const strapiPage = existingSectors.get(sectorSlug);
    
    return {
      slug: sectorSlug,
      name: strapiPage?.title || sectorInfo.name,
      description: strapiPage?.metaDescription || sectorInfo.description,
      keywords: strapiPage?.metaKeywords || sectorInfo.keywords.join(', '),
      hasContent: !!strapiPage,
    };
  });

  // Generate breadcrumb schema
  const baseUrl = getBaseUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Sectoren', url: buildCanonicalUrl('/sectoren') },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2),
        }}
      />
      <HeaderWithWidget />
      <main>
        {/* Hero Section */}
        <SubpageHero
          title="Zakelijke financiering per sector"
          subtitle="Elke sector heeft zijn eigen uitdagingen en kansen. Ontdek hoe wij jouw branche specifiek kunnen helpen met zakelijke financiering."
          iconPath="/icons/SVG/interface/grid.svg"
          backgroundColor="var(--color-bg)"
        />

        {/* Sectors Grid */}
        <section style={{
          background: 'var(--color-bg)',
          padding: '8rem 0',
          position: 'relative',
        }}>
          <div style={{ margin: '0 auto', padding: '0 2rem', maxWidth: '1400px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}>
              {allSectors.map((sector) => {
                // Sector icon mapping
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
                    zzp: '/icons/SVG/interface/user.svg',
                    starters: '/icons/SVG/interface/rocket.svg',
                    franchise: '/icons/SVG/interface/grid.svg',
                    medisch: '/icons/SVG/health/stethoscope.svg',
                    tandarts: '/icons/SVG/health/stethoscope.svg',
                    groothandel: '/icons/SVG/e-commerce/shop.svg',
                    schoonheid: '/icons/SVG/interface/magic-wand.svg',
                    kasstroom: '/icons/SVG/finance/wallet.svg',
                  };
                  return iconMap[slug] || '/icons/SVG/finance/wallet.svg';
                };

                const iconPath = getSectorIcon(sector.slug);

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
                      border: '1px solid var(--color-border)',
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
                      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-white) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {sector.hasContent && (
                        <span style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'var(--color-primary)',
                          color: 'var(--color-white)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          zIndex: 1,
                        }}>
                          Beschikbaar
                        </span>
                      )}
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
                );
              })}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .sector-preview-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
              border-color: var(--color-primary);
            }

            @media (max-width: 768px) {
              .sector-preview-card {
                min-width: 100%;
              }
            }
          `}} />
        </section>

        {/* CTA Section */}
        <CTASection
          title="Klaar om te beginnen?"
          subtitle="Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe."
          ctaLabel="Vraag financiering aan"
          ctaHref="/lead"
          background="dark"
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    // SEO-optimized: Primary keyword + value prop
    title: buildTitle('Zakelijke Financiering per Sector - Op Maat voor Elke Branche'),
    description: buildDescription(
      'Ontdek zakelijke financiering op maat voor jouw sector. Van horeca tot retail, transport tot e-commerce. Elke branche heeft zijn eigen oplossing. Binnen 24 uur reactie.'
    ),
    keywords: 'zakelijke financiering, sector financiering, horeca financiering, retail financiering, transport financiering',
    canonicalUrl: buildCanonicalUrl('/sectoren'),
    ogType: 'website',
  });
}

