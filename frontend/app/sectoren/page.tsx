import type { Metadata } from 'next';
import { buildTitle, buildDescription } from '../../messaging';
import { getAllPages } from '@/lib/strapi-cms';
import HeaderWithWidget from '../../HeaderWithWidget';
import Footer from '../../../components/Footer';
import Link from 'next/link';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// Common Dutch sectors for SEO
const SECTOR_INFO: Record<string, { name: string; description: string; keywords: string[] }> = {
  horeca: {
    name: 'Horeca',
    description: 'Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafés en hotels.',
    keywords: ['horeca financiering', 'restaurant lening', 'café financiering', 'hotel financiering']
  },
  retail: {
    name: 'Retail',
    description: 'Financiering voor retailbedrijven. Van webshops tot fysieke winkels.',
    keywords: ['retail financiering', 'winkel financiering', 'webshop lening', 'retail lening']
  },
  transport: {
    name: 'Transport & Logistiek',
    description: 'Zakelijke lening voor transport- en logistiekbedrijven.',
    keywords: ['transport financiering', 'logistiek lening', 'vrachtwagen financiering', 'transportbedrijf lening']
  },
  bouw: {
    name: 'Bouw & Installatie',
    description: 'Financiering voor bouwbedrijven en installateurs.',
    keywords: ['bouw financiering', 'installatie lening', 'bouwbedrijf financiering', 'aannemer lening']
  },
  ecommerce: {
    name: 'E-commerce',
    description: 'Zakelijke financiering voor online ondernemers en webshops.',
    keywords: ['e-commerce financiering', 'webshop lening', 'online ondernemer financiering', 'e-commerce lening']
  },
  zorg: {
    name: 'Zorg & Welzijn',
    description: 'Financiering voor zorginstellingen en welzijnsorganisaties.',
    keywords: ['zorg financiering', 'welzijn lening', 'zorginstelling financiering', 'zorgondernemer lening']
  },
  consultants: {
    name: 'Advies & Consultancy',
    description: 'Financiering voor adviesbureaus en consultants.',
    keywords: ['consultancy financiering', 'adviesbureau lening', 'consultant financiering', 'advies lening']
  },
  schoonmaak: {
    name: 'Schoonmaak',
    description: 'Zakelijke financiering voor schoonmaakbedrijven.',
    keywords: ['schoonmaak financiering', 'schoonmaakbedrijf lening', 'schoonmaak lening']
  },
  automotive: {
    name: 'Automotive',
    description: 'Financiering voor automotive bedrijven en garages.',
    keywords: ['automotive financiering', 'garage lening', 'autobedrijf financiering', 'automotive lening']
  },
  productie: {
    name: 'Productie & Industrie',
    description: 'Zakelijke lening voor productiebedrijven en industriële ondernemingen.',
    keywords: ['productie financiering', 'industrie lening', 'productiebedrijf financiering', 'industrieel lening']
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

  return (
    <>
      <HeaderWithWidget />
      <main>
        {/* Hero Section */}
        <section style={{ 
          padding: '6rem 2rem', 
          background: 'linear-gradient(135deg, #f9f9f8 0%, #ffffff 100%)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              Zakelijke financiering per sector
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: '1.6' }}>
              Elke sector heeft zijn eigen uitdagingen en kansen. Ontdek hoe wij jouw branche specifiek kunnen helpen met zakelijke financiering.
            </p>
          </div>
        </section>

        {/* Sectors Grid */}
        <section className="sectoren-page" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {allSectors.map((sector) => (
              <Link
                key={sector.slug}
                href={`/sectoren/${sector.slug}`}
                style={{
                  display: 'block',
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="sector-card-link"
              >
                {sector.hasContent && (
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#457fff',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}>
                    Beschikbaar
                  </span>
                )}
                <h2 style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#0f1720'
                }}>
                  {sector.name}
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: '#666', 
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  {sector.description}
                </p>
                <div style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#457fff',
                  fontWeight: '600',
                }}>
                  Lees meer
                  <span style={{ marginLeft: '0.5rem' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          padding: '4rem 2rem', 
          background: '#f9f9f8',
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Klaar om te beginnen?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
              Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.
            </p>
            <a 
              href="/lead" 
              className="btn btn-primary"
              style={{ 
                display: 'inline-block', 
                padding: '1rem 2rem', 
                fontSize: '1.1rem',
                textDecoration: 'none'
              }}
            >
              Vraag financiering aan
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: buildTitle('Zakelijke financiering per sector'),
    description: buildDescription(
      'Ontdek zakelijke financiering op maat voor jouw sector. Van horeca tot retail, transport tot e-commerce. Elke branche heeft zijn eigen oplossing.'
    ),
    keywords: 'zakelijke financiering, sector financiering, horeca financiering, retail financiering, transport financiering',
    openGraph: {
      title: 'Zakelijke financiering per sector',
      description: 'Ontdek zakelijke financiering op maat voor jouw sector.',
      type: 'website',
    },
  };
}

