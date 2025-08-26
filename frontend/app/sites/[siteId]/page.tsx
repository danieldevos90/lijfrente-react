import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { messaging, buildTitle, buildDescription } from '../../messaging';
import dynamic from 'next/dynamic';
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
    <section>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>{messaging.heroTitle}</h1>
        <p className="muted" style={{ marginTop: 8 }}>{messaging.heroSub}</p>
        <div className="row" style={{ marginTop: 12 }}>
          <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>{messaging.ctaLabel}</a>
        </div>
      </div>

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
    </section>
  );
}

export async function generateMetadata({ params }: { params: { siteId: string } }): Promise<Metadata> {
  return {
    title: buildTitle('Zakelijke financiering — snel geregeld'),
    description: buildDescription(),
  };
}


