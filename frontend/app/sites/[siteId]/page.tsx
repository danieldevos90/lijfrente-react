import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { messaging, buildTitle, buildDescription } from '../../messaging';
import dynamic from 'next/dynamic';

// Section Components
import HeroSection from '../../../components/sections/HeroSection';
import TrustSection from '../../../components/sections/TrustSection';
import ContentSection from '../../../components/sections/ContentSection';
import ServicesSection from '../../../components/sections/ServicesSection';
import TestimonialsSection from '../../../components/sections/TestimonialsSection';
import CTASection from '../../../components/sections/CTASection';

const StickyCTA = dynamic(() => import('../../../components/StickyCTA'), { ssr: false });

async function fetchSite(siteId: string) {
  // Use API route to proxy Strapi request (server-side only)
  // In server components, we can use the Strapi API directly with proper error handling
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  
  // Early return if token is missing - prevents 401 attempts
  if (!base || !token) {
    return null;
  }
  
  try {
    // Use AbortController to handle timeouts and prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(`${base}/api/sites?filters[siteId][$eq]=${encodeURIComponent(siteId)}&populate=*`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    
    if (!res.ok) {
      // Don't log or throw - just return null
      return null;
    }
    
    const json = await res.json().catch(() => ({ data: null }));
    return json?.data?.[0] ?? null;
  } catch (error: any) {
    // Suppress all errors - including AbortError, network errors, etc.
    // Don't log anything to prevent console noise
    if (error.name === 'AbortError') {
      return null;
    }
    return null;
  }
}

async function fetchPages(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base || !token) return [] as any[];
  try {
    const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=title:asc`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      // Don't try to parse JSON if response is not OK
      return [];
    }
    const json = await res.json().catch(() => ({ data: [] }));
    const pages = Array.isArray(json?.data) ? json.data : [];
    // Filter out non-lijfrente hubs like BTW to keep focus
    return pages.filter((p: any) => typeof p?.slug === 'string' ? !p.slug.toLowerCase().startsWith('btw') : true);
  } catch (error) {
    // Silently return empty array on error - prevent unhandled promise rejection
    return [];
  }
}

async function fetchNav(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base || !token) return [] as any[];
  try {
    const res = await fetch(`${base}/api/navigation-items?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=order:asc`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      // Don't try to parse JSON if response is not OK
      return [];
    }
    const json = await res.json().catch(() => ({ data: [] }));
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    // Silently return empty array on error - prevent unhandled promise rejection
    return [];
  }
}

async function fetchHome(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base || !token) return null;
  try {
    const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&filters[slug][$eq]=home`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      // Don't try to parse JSON if response is not OK
      return null;
    }
    const json = await res.json().catch(() => ({ data: [] }));
    return Array.isArray(json?.data) ? json.data[0] : null;
  } catch (error) {
    // Silently return null on error - prevent unhandled promise rejection
    return null;
  }
}

export default async function SitePage({ params }: { params: { siteId: string } }) {
  // Use Promise.allSettled to prevent unhandled promise rejections
  // Add .catch() to each promise to ensure no rejections escape
  let siteResult, pagesResult, navResult, homeResult;
  
  try {
    [siteResult, pagesResult, navResult, homeResult] = await Promise.allSettled([
      fetchSite(params.siteId).catch(() => null),
      fetchPages(params.siteId).catch(() => []),
      fetchNav(params.siteId).catch(() => []),
      fetchHome(params.siteId).catch(() => null),
    ]);
  } catch (error) {
    // If Promise.allSettled itself fails, use defaults
    siteResult = { status: 'rejected' as const };
    pagesResult = { status: 'rejected' as const };
    navResult = { status: 'rejected' as const };
    homeResult = { status: 'rejected' as const };
  }
  
  const data = siteResult.status === 'fulfilled' ? siteResult.value : null;
  // Fallback for demo site if no Strapi data
  const siteData = data || { name: 'Zakelijk Lening Project', siteId: params.siteId };
  const pages = (pagesResult.status === 'fulfilled' ? pagesResult.value : []).filter((p: any) => (
    ['zakelijke-financiering','corporate-financing','small-business-financing','werkkapitaal','veelgestelde-vragen']
      .includes((p.slug || '').toLowerCase())
  ));
  const nav = navResult.status === 'fulfilled' ? navResult.value : [];
  const home = homeResult.status === 'fulfilled' ? homeResult.value : null;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        badge="Snel & Transparant"
        title="Zakelijke financiering zonder gedoe"
        subtitle="Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk."
        ctaLabel="Start aanvraag"
        ctaHref={`/sites/${params.siteId}/lead`}
        variant="image"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop"
        icons={[
          '/icons/SVG/interface/zap.svg',
          '/icons/SVG/finance/trend-up.svg',
          '/icons/SVG/interface/shield.svg',
          '/icons/SVG/finance/wallet.svg'
        ]}
      />

      {/* Trust Badges */}
      <TrustSection
        badges={[
          { icon: "✓", text: "Gecertificeerd en betrouwbaar" },
          { icon: "⚡", text: "Binnen 24 uur inzicht" },
          { icon: "🔒", text: "100% transparant" },
          { icon: "📋", text: "Geen papieren gedoe" }
        ]}
      />

      {/* Content Section */}
      <ContentSection
        title="Zakelijke financiering die écht werkt"
        content="Geen ingewikkelde procedures, geen verrassingen achteraf. Gewoon duidelijke afspraken en snelle service. Wij begrijpen dat ondernemers snel willen handelen en daarom zorgen wij voor een proces dat net zo dynamisch is als jouw bedrijf."
        layout="image-right"
        ctaLabel="Lees meer"
        ctaHref={`/sites/${params.siteId}/over-ons`}
        background="gray"
      />

      {/* Services Section */}
      <ServicesSection
        title="Waar begin ik?"
        subtitle="De eerste stap is vaak het moeilijkst. Wij maken het je gemakkelijk."
        services={[
          { 
            icon: "💼", 
            title: "Ik ben werkgever", 
            description: "Financiering voor bedrijfsuitgaven en groei van je team",
            href: `/sites/${params.siteId}/werkgever`
          },
          { 
            icon: "🏢", 
            title: "Ik heb een bedrijf", 
            description: "Zakelijke leningen en kredietfaciliteiten op maat",
            href: `/sites/${params.siteId}/zakelijk`
          },
          { 
            icon: "👔", 
            title: "Ik ben ondernemer", 
            description: "Financiering voor zelfstandigen en DGA's",
            href: `/sites/${params.siteId}/ondernemer`
          },
          { 
            icon: "🎯", 
            title: "Ik wil investeren", 
            description: "Investeren in de toekomst van je bedrijf",
            href: `/sites/${params.siteId}/investeren`
          }
        ]}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Bekijk wat anderen zeggen"
        testimonials={[
          {
            name: "Petra Jongkind",
            company: "Eco Film B.V.",
            text: "Supersnelle service en heldere communicatie. Binnen een dag wisten we waar we aan toe waren.",
            rating: 5
          },
          {
            name: "Simone Brandt",
            company: "Creative Solutions",
            text: "Eindelijk een financieringspartner die begrijpt wat ondernemers nodig hebben. Aanrader!",
            rating: 5
          }
        ]}
      />

      {/* CTA Section */}
      <CTASection
        title="Klaar om te starten?"
        subtitle="Vraag binnen 2 minuten je zakelijke financiering aan"
        ctaLabel="Start je aanvraag nu"
        ctaHref={`/sites/${params.siteId}/lead`}
        background="dark"
      />

                <StickyCTA href={`/sites/${params.siteId}/lead`} label="Vraag financiering aan" useDrawer={true} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { siteId: string } }): Promise<Metadata> {
  return {
    title: buildTitle('Zakelijke financiering — snel geregeld'),
    description: buildDescription(),
  };
}


