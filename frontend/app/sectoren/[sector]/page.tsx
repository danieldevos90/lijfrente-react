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
import { getSectorUnsplashImage, getUnsplashImage } from '@/lib/unsplash';
import { generateMetadata as generateSEOMetadata, generateServiceSchema, generateBreadcrumbSchema, buildCanonicalUrl, getBaseUrl } from '@/lib/seo';
import TestimonialsCarousel from '../../../components/TestimonialsCarousel';
import { getSectorTestimonials, convertToCarouselFormat } from '@/lib/sector-testimonials';
import { getSectorTestimonials as getStrapiSectorTestimonials } from '@/lib/strapi-cms';

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
  zzp: '/icons/SVG/interface/user.svg',
  starters: '/icons/SVG/interface/rocket.svg',
  franchise: '/icons/SVG/interface/grid.svg',
  medisch: '/icons/SVG/health/stethoscope.svg',
  tandarts: '/icons/SVG/health/stethoscope.svg',
  groothandel: '/icons/SVG/e-commerce/shop.svg',
  schoonheid: '/icons/SVG/interface/magic-wand.svg',
  kasstroom: '/icons/SVG/finance/wallet.svg',
};

// Common Dutch sectors for SEO fallback
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
        color: 'var(--color-sun)',
        textColor: 'var(--color-warning-dark)',
        buttonLabel: 'Vraag offerte aan',
        buttonHref: '/lead'
      },
      {
        title: 'Renovatie & Verbouwing',
        description: 'Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.',
        imageUrl: '/images/pexels-ketut-subiyanto-4559683.jpg',
        color: 'var(--color-sky500)',
        textColor: 'var(--color-text)',
        buttonLabel: 'Meer informatie',
        buttonHref: '/lead'
      },
      {
        title: 'Voorraad & Inventaris',
        description: 'Bekostig je voorraad en inventaris zonder zorgen. Investeer in kwaliteit zonder grote voorinvestering.',
        imageUrl: '/images/pexels-amina-filkins-5414025.jpg',
        color: 'var(--color-sun)',
        textColor: 'var(--color-warning-dark)',
        buttonLabel: 'Bekijk mogelijkheden',
        buttonHref: '/lead'
      },
      {
        title: 'Seizoensgebonden uitgaven',
        description: 'Overbrug rustige periodes met flexibele financiering. Perfect voor de horeca met wisselende inkomsten.',
        imageUrl: '/images/pexels-ketut-subiyanto-4473496.jpg',
        color: 'var(--color-sky500)',
        textColor: 'var(--color-text)',
        buttonLabel: 'Vraag financiering aan',
        buttonHref: '/lead'
      }
    ],
    benefits: [
      {
        title: 'Snelle goedkeuring',
        description: 'Binnen 24 uur weet je of je financiering is goedgekeurd.',
        iconPath: '/icons/SVG/interface/tick.svg',
        color: 'var(--color-sun)',
        textColor: 'var(--color-warning-dark)'
      },
      {
        title: 'Flexibele aflossing',
        description: 'Pas je aflossingen aan op je seizoensgebonden inkomsten.',
        iconPath: '/icons/SVG/finance/wallet.svg',
        color: 'var(--color-sky500)',
        textColor: 'var(--color-text)'
      },
      {
        title: 'Geen onderpand nodig',
        description: 'Voor bedragen tot €250.000 heb je geen onderpand nodig.',
        iconPath: '/icons/SVG/interface/shield.svg',
        color: 'var(--color-sun)',
        textColor: 'var(--color-warning-dark)'
      },
      {
        title: 'Specifiek voor horeca',
        description: 'Wij begrijpen de unieke behoeften van de horecasector.',
        iconPath: '/icons/SVG/food/cutlery.svg',
        color: 'var(--color-sky500)',
        textColor: 'var(--color-text)'
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
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.log('[SectorPage] Starting fetch for sector:', sector, 'siteId:', SITE_ID);
    console.log('[SectorPage] Environment:', {
      hasStrapiUrl: !!process.env.NEXT_PUBLIC_STRAPI_URL,
      hasStrapiToken: !!process.env.STRAPI_API_TOKEN,
      hasUnsplashKey: !!process.env.UNSPLASH_ACCESS_KEY,
    });
  }
  
  const sectorPage = await getSectorPage(sector, SITE_ID, {
    next: { revalidate: 3600 }
  });
  
  if (isDev) {
    console.log('[SectorPage] Result:', {
      hasSectorPage: !!sectorPage,
      hasAttributes: !!sectorPage?.attributes,
      sectorPageKeys: sectorPage ? Object.keys(sectorPage) : [],
      attributesKeys: sectorPage?.attributes ? Object.keys(sectorPage.attributes) : [],
      useCases: sectorPage?.attributes?.useCases ? sectorPage.attributes.useCases.length : 0,
      benefits: sectorPage?.attributes?.benefits ? sectorPage.attributes.benefits.length : 0,
    });
  }
  
  const sectorInfo = SECTOR_INFO[sector];
  
  // If no sector page found and no sector info, return 404
  if (!sectorPage && !sectorInfo) {
    return notFound();
  }

  // Handle both Strapi v4 (attributes) and v5 (flat) response structures
  const pageData = sectorPage?.attributes || sectorPage;
  const pageDataAny = pageData as any; // Type assertion for flexible structure

  if (isDev) {
    console.log('[SectorPage] Raw pageData:', {
      hasPageData: !!pageData,
      pageDataKeys: pageData ? Object.keys(pageData) : [],
      useCasesRaw: pageDataAny?.useCases,
      benefitsRaw: pageDataAny?.benefits,
      useCasesType: typeof pageDataAny?.useCases,
      benefitsType: typeof pageDataAny?.benefits,
      useCasesIsArray: Array.isArray(pageDataAny?.useCases),
      benefitsIsArray: Array.isArray(pageDataAny?.benefits),
    });
  }

  // Normalize component arrays - Strapi might return them as objects or arrays
  const normalizeComponents = async <T extends { title: string; description: string }>(
    components: T[] | undefined
  ): Promise<T[]> => {
    if (!components) {
      if (isDev) {
        console.log('[SectorPage] normalizeComponents: components is null/undefined');
      }
      return [];
    }
    
    if (!Array.isArray(components)) {
      if (isDev) {
        console.log('[SectorPage] normalizeComponents: components is not an array:', typeof components, components);
      }
      // Try to convert object to array
      if (typeof components === 'object' && components !== null) {
        const obj = components as any;
        // Check if it's a Strapi component structure
        if (obj.title || obj.description) {
          return [obj] as T[];
        }
        // Try to extract array from nested structure
        const data = obj.data || obj;
        if (Array.isArray(data)) {
          return data as T[];
        }
      }
      return [];
    }
    
    if (isDev) {
      console.log('[SectorPage] normalizeComponents: processing', components.length, 'items');
    }
    
    const normalizedPromises = components.map(async (comp, index) => {
      // Handle both flat objects and nested Strapi component structure
      if (typeof comp === 'object' && comp !== null) {
        // Extract imageUrl from Strapi nested structure (image.data.attributes.url)
        const strapiImageUrl = (comp as any).image?.data?.attributes?.url
          ? getStrapiImageUrl((comp as any).image.data.attributes.url)
          : undefined;
        
        // If no image from Strapi, try to get from Unsplash based on title/description
        let imageUrl = strapiImageUrl || (comp as any).imageUrl;
        if (!imageUrl && comp.title) {
          try {
            if (isDev) {
              console.log('[SectorPage] Fetching Unsplash image for:', comp.title, 'sector:', sector);
            }
            // Use sector and use case title to find relevant Unsplash image
            const unsplashImage = await getSectorUnsplashImage(sector, comp.title);
            imageUrl = unsplashImage || undefined;
            if (isDev) {
              if (unsplashImage) {
                console.log('[SectorPage] ✅ Got Unsplash image for:', comp.title, unsplashImage);
              } else {
                console.warn('[SectorPage] ❌ No Unsplash image found for:', comp.title);
              }
            }
          } catch (error) {
            // Log error if Unsplash API is unavailable
            if (isDev) {
              console.error('[SectorPage] Unsplash fetch failed for:', comp.title, error);
            }
          }
        } else if (isDev && imageUrl) {
          console.log('[SectorPage] Using existing image for:', comp.title, imageUrl);
        } else if (isDev && !comp.title) {
          console.warn('[SectorPage] No title for use case, cannot fetch Unsplash image');
        }
        
        const normalized = {
          title: comp.title || '',
          description: comp.description || '',
          iconPath: (comp as any).iconPath,
          imageUrl: imageUrl,
          color: (comp as any).color,
          textColor: (comp as any).textColor,
          buttonLabel: (comp as any).buttonLabel,
          buttonHref: (comp as any).buttonHref || '/lead',
        };
        
        if (isDev && index === 0) {
          console.log('[SectorPage] normalizeComponents: first item example:', normalized);
        }
        
        return normalized as unknown as T;
      }
      return comp;
    });
    
    return Promise.all(normalizedPromises);
  };

  const useCases = await normalizeComponents(pageDataAny?.useCases);
  const benefits = await normalizeComponents(pageDataAny?.benefits);
  
  if (isDev) {
    console.log('[SectorPage] Normalized:', {
      useCasesCount: useCases.length,
      benefitsCount: benefits.length,
    });
  }

  // Get fallback content for this sector (only used if Strapi has no data)
  const fallbackContent = FALLBACK_CONTENT[sector];

  // Determine which content to use (Strapi data takes precedence, then fallback)
  // Quote: Use Strapi quote if available, otherwise fallback
  const quoteData = pageDataAny?.quote 
    ? { quote: pageDataAny.quote, author: pageDataAny.quoteAuthor }
    : fallbackContent?.quote;
  
  // Use Cases: Use Strapi data if available and has items, otherwise fallback
  const finalUseCases = (useCases && useCases.length > 0) ? useCases : (fallbackContent?.useCases || []);
  
  // Benefits: Use Strapi data if available and has items, otherwise fallback
  const finalBenefits = (benefits && benefits.length > 0) ? benefits : (fallbackContent?.benefits || []);
  const ctaData = pageDataAny?.ctaTitle || pageDataAny?.ctaSubtitle 
    ? { 
        title: pageDataAny.ctaTitle, 
        subtitle: pageDataAny.ctaSubtitle, 
        label: pageDataAny.ctaLabel, 
        href: pageDataAny.ctaHref 
      }
    : fallbackContent?.cta;

  // Generate schema markup for sector page
  const baseUrl = getBaseUrl();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';
  const sectorName = pageDataAny?.sectorName || sectorInfo?.name || sector;
  const sectorDescription = pageDataAny?.metaDescription || sectorInfo?.description || '';
  
  const serviceSchema = generateServiceSchema({
    name: `Zakelijke financiering voor ${sectorName}`,
    description: sectorDescription,
    provider: {
      name: siteName,
      url: baseUrl,
    },
    areaServed: 'NL',
    serviceType: 'FinancialService',
    url: buildCanonicalUrl(`/sectoren/${sector}`),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Sectoren', url: `${baseUrl}/sectoren` },
    { name: sectorName, url: buildCanonicalUrl(`/sectoren/${sector}`) },
  ]);

  // Fetch sector-specific testimonials from Strapi, fallback to static testimonials
  let sectorTestimonials = [];
  try {
    const strapiTestimonials = await getStrapiSectorTestimonials(SITE_ID, sector, {
      next: { revalidate: 3600 }
    });
    
    if (strapiTestimonials.length > 0) {
      // Convert Strapi testimonials to carousel format
      sectorTestimonials = strapiTestimonials.map(t => {
        const attrs = t.attributes || (t as any);
        const imageUrl = (attrs.image as any)?.data?.attributes?.url 
          ? getStrapiImageUrl((attrs.image as any).data.attributes.url)
          : '/images/pexels-ketut-subiyanto-4559683.jpg';
        
        return {
          name: attrs.name,
          role: attrs.role || attrs.company || '',
          text: attrs.text,
          image: imageUrl,
          company: attrs.company,
          rating: attrs.rating || 5
        };
      });
    } else {
      // Fallback to static testimonials
      const staticTestimonials = getSectorTestimonials(sector);
      sectorTestimonials = convertToCarouselFormat(staticTestimonials);
    }
  } catch (error) {
    // Fallback to static testimonials on error
    if (isDev) {
      console.error('[SectorPage] Error fetching testimonials:', error);
    }
    const staticTestimonials = getSectorTestimonials(sector);
    sectorTestimonials = convertToCarouselFormat(staticTestimonials);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2),
        }}
      />
      <HeaderWithWidget />
      <main>
        {/* Hero Section - Always show SubpageHero */}
        <SubpageHero
          title={pageDataAny?.heroTitle || `Zakelijke financiering voor ${sectorInfo?.name || sector}`}
          subtitle={pageDataAny?.heroSubtitle || sectorInfo?.description || ''}
          backgroundColor="var(--color-bg)"
          iconPath={pageDataAny?.heroImage?.data?.attributes?.url 
            ? getStrapiImageUrl(pageDataAny.heroImage.data.attributes.url)
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
            title={pageDataAny?.useCasesTitle || "Waarvoor kun je de financiering gebruiken?"}
            subtitle={pageDataAny?.useCasesSubtitle || "Veelzijdige financieringsoplossingen voor jouw sector"}
            useCases={finalUseCases}
          />
        )}

        {/* Benefits Section */}
        {finalBenefits.length > 0 && (
          <BenefitsCarousel
            benefits={finalBenefits.map((benefit: any, index) => ({
              iconPath: benefit.iconPath || '/icons/SVG/finance/wallet.svg',
              title: benefit.title,
              desc: benefit.description,
              color: benefit.color || (index % 2 === 0 ? 'var(--color-sun)' : 'var(--color-sky500)'),
              textColor: benefit.textColor || (index % 2 === 0 ? 'var(--color-warning-dark)' : 'var(--color-text)')
            }))}
            title={pageDataAny?.benefitsTitle || "Waarom kiezen voor onze financiering?"}
            subtitle={pageDataAny?.benefitsSubtitle || "Voordelen speciaal voor jouw sector"}
          />
        )}

        {/* Testimonials Section */}
        {sectorTestimonials.length > 0 && (
          <TestimonialsCarousel
            title={`Wat ${sectorInfo?.name || sector} ondernemers zeggen`}
            subtitle={`Meer dan 500 tevreden ondernemers uit de ${sectorInfo?.name?.toLowerCase() || sector} sector gingen je voor`}
            testimonials={sectorTestimonials}
            backgroundColor="var(--color-bg-slate)"
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

        {/* How It Works Section for Sector */}
        <section style={{
          background: 'var(--color-bg-slate)',
          padding: '6rem 2rem',
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
            }}>
              Hoe werkt het voor {sectorInfo?.name || sector}?
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}>
              Het aanvraagproces is hetzelfde voor alle sectoren: simpel, snel en transparant. Ontdek hoe het werkt in 4 eenvoudige stappen.
            </p>
            <a
              href="/hoe-werkt-het"
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: 'var(--color-primary)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '1.125rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Bekijk hoe het aanvraagproces werkt voor ${sectorInfo?.name || sector}`}
            >
              Bekijk hoe het werkt
            </a>
          </div>
        </section>

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
    <section style={{ padding: '4rem 2rem', background: 'var(--color-bg)', marginTop: '4rem' }}>
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
                  border: '1px solid var(--color-border)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                  {pageData?.sectorName || sectorInfo?.name || sectorSlug}
                </h3>
                {(pageData?.metaDescription || sectorInfo?.description) && (
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
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
  
  const pageData = sectorPage?.attributes || sectorPage;
  const pageDataAny = pageData as any;
  const sectorName = sectorInfo?.name || sector;
  
  // SEO-optimized title: Primary keyword + value prop (following competitor patterns)
  // Format: "[Sector] Financiering - Value Prop" (e.g., "Horeca Financiering - Binnen 24 uur geregeld")
  const seoTitle = pageDataAny?.metaTitle || 
    pageDataAny?.heroTitle || 
    `${sectorName} Financiering - Binnen 24 uur geregeld`;
  
  const description = pageDataAny?.metaDescription || sectorInfo?.description || 
    `Zakelijke financiering speciaal voor ${sectorName}. Snel, flexibel en zonder gedoe. Binnen 24 uur reactie.`;
  const keywords = pageDataAny?.metaKeywords || sectorInfo?.keywords?.join(', ') || '';
  const canonicalUrl = buildCanonicalUrl(`/sectoren/${sector}`);

  return generateSEOMetadata({
    title: buildTitle(seoTitle),
    description: buildDescription(description),
    keywords: keywords,
    canonicalUrl: canonicalUrl,
    ogType: 'website',
  });
}

// Generate static params for common sectors
export async function generateStaticParams() {
  return Object.keys(SECTOR_INFO).map((sector) => ({
    sector,
  }));
}
