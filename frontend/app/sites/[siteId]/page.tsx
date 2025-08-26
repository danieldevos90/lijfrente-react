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
  if (!data) return notFound();
  const pages = (await fetchPages(params.siteId)).filter((p: any) => (
    ['zakelijke-financiering','corporate-financing','small-business-financing','werkkapitaal','veelgestelde-vragen']
      .includes((p.slug || '').toLowerCase())
  ));
  const nav = await fetchNav(params.siteId);
  const home = await fetchHome(params.siteId);

  return (
    <div>
      <HeroSlide
        badge="Snel & Transparant"
        title="Zakelijke financiering zonder gedoe"
        subtitle="Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk."
        ctaLabel="Start aanvraag"
        ctaHref={`/sites/${params.siteId}/lead`}
        variant="image"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop"
      />

      <TrustBadges
        variant="centered"
        badges={[
          { icon: "✓", text: "Gecertificeerd en betrouwbaar" },
          { icon: "⚡", text: "Binnen 24 uur inzicht" },
          { icon: "🔒", text: "100% transparant" },
          { icon: "📋", text: "Geen papieren gedoe" }
        ]}
      />

      <ImageTextBlock
        title="Goed geregeld, zo'n extra pensioenpoortje"
        content="Zakelijke financiering die écht werkt voor jouw onderneming. Geen ingewikkelde procedures, geen verrassingen achteraf. Gewoon duidelijke afspraken en snelle service."
        layout="image-right"
        ctaLabel="Lees meer"
        ctaHref={`/sites/${params.siteId}/over-ons`}
        variant="default"
      />

      <ServiceGrid
        title="Waar begin ik?"
        subtitle="De eerste stap is vaak het moeilijkst. Wij maken het je gemakkelijk."
        services={[
          { 
            icon: "💼", 
            title: "Ik ben werkgever", 
            description: "Financiering voor bedrijfsuitgaven en groei",
            href: `/sites/${params.siteId}/werkgever`
          },
          { 
            icon: "🏢", 
            title: "Ik ben werkgever", 
            description: "Zakelijke leningen en kredietfaciliteiten",
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
            title: "Voor mijn kind", 
            description: "Investeren in de toekomst van je bedrijf",
            href: `/sites/${params.siteId}/investeren`
          }
        ]}
      />

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

      {home && (
        <div style={{
          marginTop: 12,
          padding: '16px',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          background: '#fff'
        }}>
          <h2 style={{ marginTop: 0 }}>{home.title}</h2>
          <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>{home.body}</p>
          <div className="row" style={{ marginTop: 12 }}>
            <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Vraag financiering aan</a>
            <a className="btn" href={`/sites/${params.siteId}/home`}>Lees verder</a>
          </div>
        </div>
      )}

      {nav?.length > 0 && (
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {nav
            .filter((n: any) => {
              const label = (n.label || '').toLowerCase();
              const href = (n.href || '').toLowerCase();
              return label !== 'btw' && !href.startsWith('/btw');
            })
            .map((n: any) => {
              const href = n.href || '#';
              const label = n.label || '';
              const finalHref = label.toLowerCase() === 'home' ? `/sites/${params.siteId}/home` : href;
              return <a key={n.id} className="btn" href={finalHref}>{label}</a>;
            })}
          <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Aanvragen</a>
        </div>
      )}

      <h2 style={{ marginTop: 24 }}>Pagina’s</h2>
      <ul>
        {pages.map((p: any) => (
          <li key={p.id}>
            <a className="link" href={`/sites/${params.siteId}/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>

      <div className="row" style={{ marginTop: 24 }}>
        <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Vraag financiering aan</a>
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


