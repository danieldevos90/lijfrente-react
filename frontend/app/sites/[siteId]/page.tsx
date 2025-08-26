import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { messaging, buildTitle, buildDescription } from '../../messaging';
import dynamic from 'next/dynamic';
import HeroSlide from '../../../components/templates/HeroSlide';
import FeatureGrid from '../../../components/templates/FeatureGrid';
import ImageTextBlock from '../../../components/templates/ImageTextBlock';
import ColumnLayout from '../../../components/templates/ColumnLayout';
import TrustBadges from '../../../components/templates/TrustBadges';
import ServiceGrid from '../../../components/templates/ServiceGrid';
import TestimonialSection from '../../../components/templates/TestimonialSection';
const StickyCTA = dynamic(() => import('../../../components/StickyCTA'), { ssr: false });

async function fetchSite(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return null;
  const res = await fetch(`${base}/api/sites?filters[siteId][$eq]=${encodeURIComponent(siteId)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.[0] ?? null;
}

async function fetchPages(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return [] as any[];
  const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=title:asc`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  });
  const json = await res.json().catch(() => ({ data: [] }));
  const pages = Array.isArray(json?.data) ? json.data : [];
  // Filter out non-lijfrente hubs like BTW to keep focus
  return pages.filter((p: any) => typeof p?.slug === 'string' ? !p.slug.toLowerCase().startsWith('btw') : true);
}

async function fetchNav(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return [] as any[];
  const res = await fetch(`${base}/api/navigation-items?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=order:asc`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  });
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data : [];
}

async function fetchHome(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return null;
  const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&filters[slug][$eq]=home`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  });
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data[0] : null;
}

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const data = await fetchSite(params.siteId);
  // Fallback for demo site if no Strapi data
  const siteData = data || { name: 'Zakelijk Lening Project', siteId: params.siteId };
  const pages = (await fetchPages(params.siteId)).filter((p: any) => (
    ['zakelijke-financiering','corporate-financing','small-business-financing','werkkapitaal','veelgestelde-vragen']
      .includes((p.slug || '').toLowerCase())
  ));
  const nav = await fetchNav(params.siteId);
  const home = await fetchHome(params.siteId);

  return (
    <div>
      {/* Hero Section - Full width */}
      <div className="full-width">
        <HeroSlide
          badge="Snel & Transparant"
          title="Zakelijke financiering zonder gedoe"
          subtitle="Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk."
          ctaLabel="Start aanvraag"
          ctaHref={`/sites/${params.siteId}/lead`}
          variant="image"
          backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop"
        />
      </div>

      {/* Trust Badges - White section */}
      <div className="full-width section-white py-16">
        <div className="container">
          <TrustBadges
            variant="centered"
            badges={[
              { icon: "✓", text: "Gecertificeerd en betrouwbaar" },
              { icon: "⚡", text: "Binnen 24 uur inzicht" },
              { icon: "🔒", text: "100% transparant" },
              { icon: "📋", text: "Geen papieren gedoe" }
            ]}
          />
        </div>
      </div>

      {/* Image Text Block - Gray section */}
      <div className="full-width section-gray py-24">
        <div className="container">
          <ImageTextBlock
            title="Zakelijke financiering die écht werkt"
            content="Geen ingewikkelde procedures, geen verrassingen achteraf. Gewoon duidelijke afspraken en snelle service. Wij begrijpen dat ondernemers snel willen handelen en daarom zorgen wij voor een proces dat net zo dynamisch is als jouw bedrijf."
            layout="image-right"
            ctaLabel="Lees meer"
            ctaHref={`/sites/${params.siteId}/over-ons`}
            variant="default"
          />
        </div>
      </div>

      {/* Service Grid - White section */}
      <div className="full-width section-white py-24">
        <div className="container">
          <ServiceGrid
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
        </div>
      </div>

      {/* Testimonials - Blue section */}
      <div className="full-width section-blue py-24">
        <div className="container">
          <TestimonialSection
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
        </div>
      </div>

      {/* CTA Section - Dark section */}
      <div className="full-width section-dark py-20">
        <div className="container text-center">
          <h2 className="text-white">Klaar om te starten?</h2>
          <p className="text-white" style={{ fontSize: '20px', marginBottom: '2rem' }}>
            Vraag binnen 2 minuten je zakelijke financiering aan
          </p>
          <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`} style={{ fontSize: '18px', padding: '20px 40px' }}>
            Start je aanvraag nu
          </a>
        </div>
      </div>

      <StickyCTA href={`/sites/${params.siteId}/lead`} label="Vraag financiering aan" />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { siteId: string } }): Promise<Metadata> {
  return {
    title: buildTitle('Zakelijke financiering — snel geregeld'),
    description: buildDescription(),
  };
}


