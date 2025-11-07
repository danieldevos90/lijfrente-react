import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildTitle, buildDescription } from '../../messaging';
import { getSectorPage, getAllSectorPages } from '@/lib/strapi-cms';
import HeaderWithWidget from '../../HeaderWithWidget';
import Footer from '../../../components/Footer';
import SubpageHero from '../../../components/SubpageHero';
import QuoteSection from '../../../components/sections/QuoteSection';
import UseCasesSection from '../../../components/sections/UseCasesSection';
import BenefitsCarousel from '../../../components/BenefitsCarousel';
import CTASection from '../../../components/sections/CTASection';
import { getStrapiImageUrl } from '@/lib/strapi-cms';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// Sector-specific icons mapping
const SECTOR_ICONS: Record<string, string> = {
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

// Common Dutch sectors for SEO fallback
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

// Fallback content for sectors when Strapi data is not available
const FALLBACK_CONTENT: Record<string, {
  quote?: { quote: string; author?: string };
  useCases?: Array<{ title: string; description: string; iconPath?: string; imageUrl?: string; color: string; textColor: string; buttonLabel?: string; buttonHref?: string }>;
  benefits?: Array<{ title: string; description: string; iconPath: string; color: string; textColor: string }>;
  cta?: { title: string; subtitle: string; label: string; href: string };
}> = {
  horeca: {
    quote: {
      quote: 'Financiering die meegroeit met je horecazaak. Of je nu investeert in nieuwe keukenapparatuur, verbouwingen plant, of seizoensgebonden uitgaven moet overbruggen – wij begrijpen de unieke behoeften van de horecasector en bieden flexibele oplossingen die passen bij jouw bedrijf.',
    },
    useCases: [
      {
        title: 'Keukenapparatuur',
        description: 'Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.',
        imageUrl: '/images/pexels-tima-miroshnichenko-6693637.jpg',
        color: '#fff2b2',
        textColor: '#5e5515',
        buttonLabel: 'Vraag offerte aan',
        buttonHref: '/lead'
      },
      {
        title: 'Renovatie & Verbouwing',
        description: 'Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.',
        imageUrl: '/images/pexels-ketut-subiyanto-4559683.jpg',
        color: '#e4f2ff',
        textColor: '#0f1720',
        buttonLabel: 'Meer informatie',
        buttonHref: '/lead'
      },
      {
        title: 'Voorraad & Inventaris',
        description: 'Bekostig je voorraad en inventaris zonder zorgen. Investeer in kwaliteit zonder grote voorinvestering.',
        imageUrl: '/images/pexels-amina-filkins-5414025.jpg',
        color: '#fff2b2',
        textColor: '#5e5515',
        buttonLabel: 'Bekijk mogelijkheden',
        buttonHref: '/lead'
      },
      {
        title: 'Seizoensgebonden uitgaven',
        description: 'Overbrug rustige periodes met flexibele financiering. Perfect voor de horeca met wisselende inkomsten.',
        imageUrl: '/images/pexels-ketut-subiyanto-4473496.jpg',
        color: '#e4f2ff',
        textColor: '#0f1720',
        buttonLabel: 'Vraag financiering aan',
        buttonHref: '/lead'
      }
    ],
    benefits: [
      {
        title: 'Snelle goedkeuring',
        description: 'Binnen 24 uur weet je of je financiering is goedgekeurd.',
        iconPath: '/icons/SVG/interface/tick.svg',
        color: '#fff2b2',
        textColor: '#5e5515'
      },
      {
        title: 'Flexibele aflossing',
        description: 'Pas je aflossingen aan op je seizoensgebonden inkomsten.',
        iconPath: '/icons/SVG/finance/wallet.svg',
        color: '#e4f2ff',
        textColor: '#0f1720'
      },
      {
        title: 'Geen onderpand nodig',
        description: 'Voor bedragen tot €250.000 heb je geen onderpand nodig.',
        iconPath: '/icons/SVG/interface/shield.svg',
        color: '#fff2b2',
        textColor: '#5e5515'
      },
      {
        title: 'Specifiek voor horeca',
        description: 'Wij begrijpen de unieke behoeften van de horecasector.',
        iconPath: '/icons/SVG/food/cutlery.svg',
        color: '#e4f2ff',
        textColor: '#0f1720'
      }
    ],
    cta: {
      title: 'Klaar om te beginnen?',
      subtitle: 'Vraag binnen 2 minuten een vrijblijvend aanbod aan.',
      label: 'Vraag financiering aan',
      href: '/lead'
    }
  }
};

export const dynamic = 'force-dynamic';

async function fetchRelatedSectorPages(currentSector: string) {
  try {
    const allSectorPages = await getAllSectorPages(SITE_ID, {
      next: { revalidate: 3600 }
    });
    
    // Filter for other sector pages
    const relatedPages = allSectorPages.filter((page) => {
      const sectorSlug = page.attributes?.sectorSlug || '';
      return sectorSlug && sectorSlug !== currentSector;
    });
    
    // Return up to 3 related sectors
    return relatedPages.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related sector pages:', error);
    return [];
  }
}

export default async function SectorPage({ params }: { params: { sector: string } }) {
  const { sector } = params;
  const sectorPage = await getSectorPage(sector, SITE_ID, {
    next: { revalidate: 3600 }
  });
  
  const sectorInfo = SECTOR_INFO[sector];
  
  // If no sector page found and no sector info, return 404
  if (!sectorPage && !sectorInfo) {
    return notFound();
  }

  const pageData = sectorPage?.attributes;

  // Normalize component arrays - Strapi might return them as objects or arrays
  const normalizeComponents = <T extends { title: string; description: string }>(
    components: T[] | undefined
  ): T[] => {
    if (!components) return [];
    if (!Array.isArray(components)) return [];
    return components.map((comp) => {
      // Handle both flat objects and nested Strapi component structure
      if (typeof comp === 'object' && comp !== null) {
        // Extract imageUrl from Strapi nested structure (image.data.attributes.url)
        const strapiImageUrl = (comp as any).image?.data?.attributes?.url
          ? getStrapiImageUrl((comp as any).image.data.attributes.url)
          : undefined;
        
        return {
          title: comp.title || '',
          description: comp.description || '',
          iconPath: (comp as any).iconPath,
          imageUrl: strapiImageUrl || (comp as any).imageUrl,
          color: (comp as any).color,
          textColor: (comp as any).textColor,
          buttonLabel: (comp as any).buttonLabel,
          buttonHref: (comp as any).buttonHref,
        } as unknown as T;
      }
      return comp;
    });
  };

  const useCases = normalizeComponents(pageData?.useCases);
  const benefits = normalizeComponents(pageData?.benefits);

  // Get fallback content for this sector
  const fallbackContent = FALLBACK_CONTENT[sector];

  // Determine which content to use (Strapi data takes precedence, then fallback)
  const quoteData = pageData?.quote || fallbackContent?.quote;
  const finalUseCases = (useCases && useCases.length > 0) ? useCases : (fallbackContent?.useCases || []);
  const finalBenefits = (benefits && benefits.length > 0) ? benefits : (fallbackContent?.benefits || []);
  const ctaData = pageData?.ctaTitle || pageData?.ctaSubtitle 
    ? { 
        title: pageData.ctaTitle, 
        subtitle: pageData.ctaSubtitle, 
        label: pageData.ctaLabel, 
        href: pageData.ctaHref 
      }
    : fallbackContent?.cta;

  return (
    <>
      <HeaderWithWidget />
      <main>
        {/* Hero Section - Always show SubpageHero */}
        <SubpageHero
          title={pageData?.heroTitle || `Zakelijke financiering voor ${sectorInfo?.name || sector}`}
          subtitle={pageData?.heroSubtitle || sectorInfo?.description || ''}
          backgroundColor="#f9f9f8"
          iconPath={pageData?.heroImage?.data?.attributes?.url 
            ? getStrapiImageUrl(pageData.heroImage.data.attributes.url)
            : SECTOR_ICONS[sector] || '/icons/SVG/finance/wallet.svg'}
        />

        {/* Quote Section */}
        {quoteData && (
          <QuoteSection
            quote={quoteData.quote}
            author={quoteData.author}
          />
        )}

        {/* Use Cases Section */}
        {finalUseCases.length > 0 && (
          <UseCasesSection
            title={pageData?.useCasesTitle || "Waarvoor kun je de financiering gebruiken?"}
            subtitle={pageData?.useCasesSubtitle || "Veelzijdige financieringsoplossingen voor jouw sector"}
            useCases={finalUseCases}
          />
        )}

        {/* Benefits Section */}
        {finalBenefits.length > 0 && (
          <BenefitsCarousel
            benefits={finalBenefits.map((benefit, index) => ({
              iconPath: benefit.iconPath || '/icons/SVG/finance/wallet.svg',
              title: benefit.title,
              desc: benefit.description,
              color: benefit.color || (index % 2 === 0 ? '#fff2b2' : '#e4f2ff'),
              textColor: benefit.textColor || (index % 2 === 0 ? '#5e5515' : '#0f1720')
            }))}
            title={pageData?.benefitsTitle || "Waarom kiezen voor onze financiering?"}
            subtitle={pageData?.benefitsSubtitle || "Voordelen speciaal voor jouw sector"}
          />
        )}

        {/* CTA Section */}
        {ctaData && (
          <CTASection
            title={ctaData.title || "Klaar om te beginnen?"}
            subtitle={ctaData.subtitle || "Vraag binnen 2 minuten een vrijblijvend aanbod aan."}
            ctaLabel={ctaData.label || "Vraag financiering aan"}
            ctaHref={ctaData.href || "/lead"}
          />
        )}

        {/* Related sectors section */}
        <RelatedSectors currentSector={sector} />
      </main>
      <Footer />
    </>
  );
}

async function RelatedSectors({ currentSector }: { currentSector: string }) {
  const relatedPages = await fetchRelatedSectorPages(currentSector);
  
  if (relatedPages.length === 0) return null;

  return (
    <section style={{ padding: '4rem 2rem', background: '#f9f9f8', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Andere sectoren</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {relatedPages.map((page) => {
            const pageData = page.attributes;
            const sectorSlug = pageData?.sectorSlug || '';
            const sectorInfo = SECTOR_INFO[sectorSlug];
            
            return (
              <a
                key={page.id || sectorSlug}
                href={`/sectoren/${sectorSlug}`}
                className="sector-card-link"
                style={{
                  display: 'block',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                  {pageData?.sectorName || sectorInfo?.name || sectorSlug}
                </h3>
                {(pageData?.metaDescription || sectorInfo?.description) && (
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {pageData?.metaDescription || sectorInfo?.description}
                  </p>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: { params: { sector: string } }): Promise<Metadata> {
  const { sector } = params;
  const sectorPage = await getSectorPage(sector, SITE_ID, {
    next: { revalidate: 3600 }
  });
  const sectorInfo = SECTOR_INFO[sector];
  
  const pageData = sectorPage?.attributes;
  const title = pageData?.heroTitle || pageData?.sectorName || `Zakelijke financiering voor ${sectorInfo?.name || sector}`;
  const description = pageData?.metaDescription || sectorInfo?.description || 
    `Zakelijke financiering speciaal voor ${sectorInfo?.name || sector}. Snel, flexibel en zonder gedoe.`;
  const keywords = pageData?.metaKeywords || sectorInfo?.keywords?.join(', ') || '';

  return {
    title: buildTitle(title),
    description: buildDescription(description),
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      type: 'website',
    },
  };
}

// Generate static params for common sectors
export async function generateStaticParams() {
  return Object.keys(SECTOR_INFO).map((sector) => ({
    sector,
  }));
}
