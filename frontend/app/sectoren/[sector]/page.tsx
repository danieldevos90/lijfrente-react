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
import { getSectorUnsplashImage } from '@/lib/unsplash';
import { generateMetadata as generateSEOMetadata, generateServiceSchema, generateBreadcrumbSchema, generateFAQPageSchema, buildCanonicalUrl, getBaseUrl } from '@/lib/seo';
import DirectAnswerSection from '../../../components/sections/DirectAnswerSection';
import FAQSection, { type FAQItem } from '../../../components/sections/FAQSection';
import { USE_CASE_SLUGS, getUseCase } from '@/lib/use-cases';
import { getSectorIcon } from '@/lib/sector-icons';
import { SECTOR_INFO } from '@/lib/sectors';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

function getSectorFaqs(sectorSlug: string, sectorName: string): FAQItem[] {
  // Keep answers short and specific; this is used both for on-page AEO and FAQPage schema.
  const name = sectorName || sectorSlug;
  const lower = name.toLowerCase();

  const common: FAQItem[] = [
    {
      question: `Kan ik als ${lower} ondernemer snel een financiering aanvragen?`,
      answer:
        `Ja. Je kunt online een aanvraag starten en ontvangt doorgaans snel duidelijkheid. We houden het proces bewust simpel en transparant.`,
    },
    {
      question: `Waarvoor kan ik financiering gebruiken als ${lower}?`,
      answer:
        `Voor werkkapitaal, investeringen (apparatuur, voorraad, marketing), groei of het overbruggen van seizoenspieken. De beste inzet hangt af van je cashflow en plannen.`,
    },
    {
      question: `Heb ik onderpand nodig?`,
      answer:
        `Niet altijd. Dat hangt af van je situatie en het bedrag. Je krijgt een helder voorstel met voorwaarden voordat je beslist.`,
    },
    {
      question: `Hoe flexibel is aflossen?`,
      answer:
        `Aflossen is flexibel ingericht zodat het beter aansluit op je omzet. Vervroegd aflossen is vaak mogelijk; de exacte voorwaarden staan in het voorstel.`,
    },
  ];

  // Add 2 sector-flavored questions to reduce template similarity.
  const sectorSpecific: Record<string, FAQItem[]> = {
    horeca: [
      {
        question: 'Wat is horeca financiering (en wanneer past een horeca lening)?',
        answer:
          'Horeca financiering is zakelijke financiering voor restaurants, cafes en hotels. Het kan passen bij investeringen (inventaris/verbouwing) of werkkapitaal om seizoensschommelingen op te vangen.',
      },
      {
        question: 'Kan ik een zakelijke lening voor horeca gebruiken voor verbouwing, inventaris of voorraad?',
        answer:
          'Vaak wel. Veel horeca ondernemers financieren keukenapparatuur, terras/verbouwing, inventaris en voorraad. Je kiest een oplossing die past bij je omzet en cashflow.',
      },
    ],
    ecommerce: [
      { question: 'Kan ik voorraad en marketing voor mijn webshop financieren?', answer: 'Ja. Veel e-commerce ondernemers gebruiken financiering voor voorraadinkoop en marketing om groei te versnellen.' },
      { question: 'Is financiering mogelijk bij wisselende omzet?', answer: 'Vaak wel. Belangrijk is dat je een passend voorstel krijgt dat rekening houdt met schommelingen in je cashflow.' },
    ],
    zzp: [
      { question: 'Kan ik als ZZP’er apparatuur of tools financieren?', answer: 'Ja. Denk aan laptop, gereedschap, camera, software of opleidingen die je direct productiever maken.' },
      { question: 'Werkt dit ook met wisselende opdrachten?', answer: 'Ja, juist dan is flexibiliteit belangrijk. We kijken naar een oplossing die meebeweegt met je inkomsten.' },
    ],
    transport: [
      { question: 'Kan ik voertuigen of onderhoud financieren?', answer: 'Dat kan. Veel transportbedrijven financieren voertuiggerelateerde investeringen en werkkapitaal om brandstof/onderhoud te spreiden.' },
      { question: 'Helpt dit bij grotere opdrachten of contracten?', answer: 'Financiering kan helpen om vooruit te investeren in capaciteit en cashflow te overbruggen tot facturen betaald zijn.' },
    ],
    bouw: [
      { question: 'Kan ik materialen en apparatuur voor projecten financieren?', answer: 'Ja. In de bouw gaat financiering vaak naar materialen, machines, gereedschap of het opvangen van projectkosten.' },
      { question: 'Wat als betalingen laat binnenkomen?', answer: 'Werkkapitaal kan helpen om de periode tussen werk en betaling te overbruggen.' },
    ],
  };

  const extras = sectorSpecific[sectorSlug] || [
    { question: `Hoe snel ontvang ik een voorstel voor ${lower}?`, answer: 'Na je aanvraag beoordelen we je situatie en ontvang je een transparant voorstel met voorwaarden.' },
    { question: `Is dit geschikt voor zowel starters als bestaande bedrijven in ${lower}?`, answer: 'Vaak wel. We kijken naar je actuele situatie en wat je nodig hebt om te groeien.' },
  ];

  return [...common, ...extras].slice(0, 6);
}

function getSectorSeoIntro(
  sectorSlug: string,
  sectorName: string
): { title: string; body: string; bullets: string[] } | null {
  if (sectorSlug !== 'horeca') return null;

  // Intent-matching copy for the exact queries we see in Search Console.
  // Keep it short to avoid "template bloat" while increasing topical clarity.
  return {
    title: 'Horeca financiering: mogelijkheden voor restaurants, cafes en hotels',
    body:
      'Zoek je horeca financiering, financieringsmogelijkheden voor horeca of een zakelijke lening horeca? Dit draait meestal om 3 dingen: investeren in inventaris/verbouwing, werkkapitaal voor rustige periodes, of voorraad/personeel tijdens piekmaanden. Je krijgt een voorstel dat past bij je situatie en cashflow.',
    bullets: [
      'Werkkapitaal om seizoenspieken op te vangen',
      'Investeren in verbouwing, keukenapparatuur of inventaris',
      'Voorraad en personeelskosten beter spreiden',
    ],
  };
}

// Common Dutch sectors for SEO fallback
/* const SECTOR_INFO: Record<string, { name: string; description: string; keywords: string[] }> = {
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
}; */

export const revalidate = 3600;

async function fetchRelatedSectorPages(currentSector: string) {
  const allSectorPages = await getAllSectorPages(SITE_ID, {
    next: { revalidate: 3600 },
  });

  // Filter for other sector pages
  const relatedPages = (allSectorPages || []).filter((page) => {
    const sectorSlug = page.attributes?.sectorSlug || '';
    return sectorSlug && sectorSlug !== currentSector;
  });

  // Return up to 9 related sectors for stronger internal linking.
  return relatedPages.slice(0, 9);
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
  
  // No fallback: sector page must exist in Strapi.
  if (!sectorPage) {
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
        const extractMediaUrl = (media: any): string | undefined => {
          if (!media) return undefined;
          // Strapi v4: { data: { attributes: { url } } }
          const v4 = media?.data?.attributes?.url;
          if (typeof v4 === 'string' && v4) return getStrapiImageUrl(v4);
          // Strapi v5: { url, formats: { large: { url } } }
          // Prefer the original file URL first; derivatives can occasionally 404 on the CDN.
          const v5Any =
            media?.url ||
            media?.formats?.large?.url ||
            media?.formats?.medium?.url ||
            media?.formats?.small?.url;
          if (typeof v5Any === 'string' && v5Any) return getStrapiImageUrl(v5Any);
          // Sometimes a string URL is stored directly
          if (typeof media === 'string' && media) return getStrapiImageUrl(media);
          return undefined;
        };

        // Extract imageUrl from Strapi (v4 or v5 media shapes).
        const strapiImageUrl = extractMediaUrl((comp as any).image);
        
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

  // No fallback: use Strapi content as-is (sections can be empty, but we won't substitute hardcoded copy).
  const quoteData = pageDataAny?.quote
    ? { quote: pageDataAny.quote, author: pageDataAny.quoteAuthor }
    : undefined;

  const finalUseCases = useCases || [];
  const finalBenefits = benefits || [];
  const ctaData =
    pageDataAny?.ctaTitle || pageDataAny?.ctaSubtitle
      ? {
          title: pageDataAny.ctaTitle,
          subtitle: pageDataAny.ctaSubtitle,
          label: pageDataAny.ctaLabel,
          href: pageDataAny.ctaHref,
        }
      : undefined;

  // Generate schema markup for sector page
  const baseUrl = getBaseUrl();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';
  const sectorName = pageDataAny?.sectorName || sector;
  const sectorDescription = pageDataAny?.metaDescription || '';
  const isHoreca = sector === 'horeca';
  
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

  const faqs = getSectorFaqs(sector, sectorName);
  const faqSchema = generateFAQPageSchema(faqs);

  // Deep link to /lead with prefill to reduce friction.
  const leadHref = `/lead?source=sector_page&sector=${encodeURIComponent(sector)}&purpose=werkkapitaal&amount=50000`;
  const seoIntro = getSectorSeoIntro(sector, sectorName);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema, null, 2),
        }}
      />
      <HeaderWithWidget />
      <main>
        {/* Hero Section - Always show SubpageHero */}
        <SubpageHero
          title={pageDataAny?.heroTitle}
          subtitle={pageDataAny?.heroSubtitle}
          backgroundColor="var(--color-bg)"
          // Always use the vector sector icon in the hero (never a photo heroImage).
          iconPath={getSectorIcon(sector)}
        />

        <DirectAnswerSection
          title={
            isHoreca
              ? 'Horeca financiering: wanneer past het bij je bedrijf?'
              : `Zakelijke financiering voor ${sectorName}: wat is het en wanneer is het slim?`
          }
          answer={
            isHoreca
              ? 'Horeca financiering (zakelijke lening horeca) kan helpen om werkkapitaal te overbruggen, te investeren in inventaris/verbouwing of kosten te spreiden. Je krijgt een transparant voorstel en kiest een oplossing die past bij je omzet en cashflow.'
              : `Als ${sectorName.toLowerCase()} ondernemer kan financiering helpen om werkkapitaal te overbruggen, te investeren in groei of kosten te spreiden. Je krijgt een transparant voorstel en kiest een oplossing die past bij je cashflow.`
          }
          bullets={[
            { label: 'Doel', value: 'Werkkapitaal, groei, investeringen' },
            { label: 'Snelheid', value: 'Aanvraag online, snel duidelijkheid' },
            { label: 'Aflossen', value: 'Flexibel, afgestemd op cashflow' },
          ]}
          primaryHref={leadHref}
        />

        {seoIntro && (
          <section style={{ background: 'var(--color-bg)', padding: '4rem 2rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>{seoIntro.title}</h2>
              <p
                style={{
                  marginTop: '1rem',
                  maxWidth: '90ch',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.7,
                  fontSize: '1.125rem',
                }}
              >
                {seoIntro.body}
              </p>
              <ul style={{ marginTop: '1rem', lineHeight: 1.8, color: 'var(--color-text)' }}>
                {seoIntro.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Use-case deep links for stronger pSEO architecture */}
        <section style={{ background: 'var(--color-bg)', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                margin: 0,
                color: 'var(--color-text)',
              }}
            >
              Populaire doelen in {sectorName}
            </h2>
            <p
              style={{
                marginTop: '1rem',
                maxWidth: '80ch',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                fontSize: '1.125rem',
              }}
            >
              Klik door naar het doel dat het beste past. Elke pagina geeft een kort antwoord, veelgestelde vragen en een snelle start naar je aanvraag.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '2rem',
              }}
            >
              {USE_CASE_SLUGS.map((slug) => {
                const cfg = getUseCase(slug);
                return (
                  <a
                    key={slug}
                    href={`/sectoren/${sector}/${slug}`}
                    style={{
                      display: 'block',
                      padding: '1.25rem',
                      background: 'var(--color-white)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{cfg.label}</h3>
                    <p
                      style={{
                        margin: '0.75rem 0 0',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.7,
                        // Make the description visually subordinate to the title.
                        fontSize: '0.95rem',
                      }}
                    >
                      {cfg.heroSubtitleTemplate(sectorName)}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

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
            title={pageDataAny?.useCasesTitle}
            subtitle={pageDataAny?.useCasesSubtitle}
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
            title={pageDataAny?.benefitsTitle}
            subtitle={pageDataAny?.benefitsSubtitle}
          />
        )}

        {/* CTA Section */}
        {ctaData && (
          <CTASection
            title={ctaData.title}
            subtitle={ctaData.subtitle}
            ctaLabel={ctaData.label}
            ctaHref={ctaData.href || leadHref}
            trustBullets={[
              'Binnen 24 uur duidelijkheid',
              'Transparante voorwaarden',
              'Flexibel aflossen',
            ]}
            trackingLocation={`sector_cta_${sector}`}
          />
        )}

        <FAQSection
          title={`Veelgestelde vragen over financiering voor ${sectorName}`}
          subtitle="Korte antwoorden op vragen die ondernemers meestal als eerste stellen."
          faqs={faqs}
          backgroundColor="var(--color-bg)"
        />

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
              Hoe werkt het voor {sectorName}?
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
              className="btn btn-primary"
              aria-label={`Bekijk hoe het aanvraagproces werkt voor ${sectorName}`}
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

  if (!relatedPages || relatedPages.length === 0) return null;

  const pagesToShow = relatedPages.slice(0, 9);

  return (
    <section style={{ padding: '4rem 2rem', background: 'var(--color-bg)', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Andere sectoren</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {pagesToShow.map((page: any) => {
            const pageData = page.attributes || page;
            const sectorSlug = pageData?.sectorSlug || '';
            
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
                  {pageData?.sectorName || sectorSlug}
                </h3>
                {pageData?.metaDescription && (
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {pageData?.metaDescription}
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
  const canonicalUrl = buildCanonicalUrl(`/sectoren/${sector}`);

  // If the CMS is missing content, we still want stable metadata (avoid 500s during crawling).
  if (!sectorPage) {
    const name = sectorInfo?.name || sector;
    const title = `${name} financiering - Binnen 24 uur duidelijkheid`;
    const description =
      sectorInfo?.description ||
      `Zakelijke financiering voor ${name}. Binnen 24 uur duidelijkheid, transparante voorwaarden en flexibel aflossen.`;
    const keywords = (sectorInfo?.keywords || []).join(', ');

    return generateSEOMetadata({
      title: buildTitle(title),
      description: buildDescription(description),
      keywords,
      canonicalUrl,
      ogType: 'website',
    });
  }

  const pageData = sectorPage?.attributes || sectorPage;
  const pageDataAny = pageData as any;
  
  const sectorName = pageDataAny?.sectorName || sectorInfo?.name || sector;

  // Prefer Strapi meta fields, but enforce an intent-matching format when editors leave it too generic.
  const rawTitle: string =
    pageDataAny?.metaTitle ||
    pageDataAny?.heroTitle ||
    `${sectorName} financiering - Binnen 24 uur duidelijkheid`;

  const titleLower = rawTitle.toLowerCase();
  const wants = sectorName.toLowerCase();
  const hasSector = titleLower.includes(wants);
  const hasFinancingWord = titleLower.includes('financier');
  const seoTitle =
    hasSector && hasFinancingWord
      ? rawTitle
      : `${sectorName} financiering - Binnen 24 uur duidelijkheid`;

  const description: string =
    pageDataAny?.metaDescription ||
    sectorInfo?.description ||
    `Zakelijke financiering voor ${sectorName}. Binnen 24 uur duidelijkheid, transparante voorwaarden en flexibel aflossen.`;

  const keywords: string =
    pageDataAny?.metaKeywords ||
    (sectorInfo?.keywords ? sectorInfo.keywords.join(', ') : '');

  return generateSEOMetadata({
    title: buildTitle(seoTitle),
    description: buildDescription(description),
    keywords: keywords,
    canonicalUrl: canonicalUrl,
    ogType: 'website',
  });
}

export async function generateStaticParams() {
  const pages = await getAllSectorPages(SITE_ID, { next: { revalidate: 3600 } });
  return (pages || [])
    .map((p: any) => {
      const a = p?.attributes || p;
      return a?.sectorSlug ? { sector: a.sectorSlug } : null;
    })
    .filter(Boolean) as Array<{ sector: string }>;
}
