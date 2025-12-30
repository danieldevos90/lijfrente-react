import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildTitle, buildDescription } from '../../../messaging';
import dynamic from 'next/dynamic';
const StickyCTA = dynamic(() => import('../../../../components/StickyCTA'), { ssr: false });

async function fetchPage(siteId: string, slug: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base || !token) return null;
  try {
    const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&filters[slug][$eq]=${encodeURIComponent(slug)}`, {
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

async function fetchPages(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base || !token) return [] as any[];
  try {
    const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=title:asc&pagination[pageSize]=100`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      // Don't try to parse JSON if response is not OK
      return [];
    }
    const json = await res.json().catch(() => ({ data: [] }));
    const items = Array.isArray(json?.data) ? json.data : [];
    return items.filter((p: any) => typeof p?.slug === 'string' ? !p.slug.toLowerCase().startsWith('btw') : true);
  } catch (error) {
    // Silently return empty array on error - prevent unhandled promise rejection
    return [];
  }
}

export default async function Page({ params }: { params: { siteId: string, slug: string } }) {
  const [page, all] = await Promise.all([
    fetchPage(params.siteId, params.slug),
    fetchPages(params.siteId),
  ]);
  if (!page) return notFound();
  const a = page || {};
  const kw = (String(a.title || '') + ' ' + String(a.body || ''))
    .toLowerCase();
  // Sitemap-driven mapping: prefer items whose path appears in our sitemap data (excluding BTW)
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/app/data/sitemap.md`).catch(() => null);
  const smText = await response?.text().catch(() => '') || '';
  const sitemapPaths = smText.split('\n')
    .map(l => (l.match(/`([^`]+)`/)?.[1] || '').trim())
    .filter(p => p && !p.startsWith('/btw'));
  const curatedSlugs = new Set([
    'wat-is-lijfrente',
    'lijfrente-berekenen',
    'direct-ingaande-lijfrente',
    'lijfrente-voor-dga',
    'veelgestelde-vragen',
  ]);

  const related = all
    .filter((p: any) => p.slug !== a.slug)
    .filter((p: any) => curatedSlugs.has((p.slug || '').toLowerCase()))
    .map((p: any) => {
      const text = (String(p.title || '') + ' ' + String(p.body || '')).toLowerCase();
      let score = 0;
      for (const token of ['lijfrente','pensioen','rente','uitkering','annuiteit']) {
        if (text.includes(token)) score += 2;
        if (kw.includes(token)) score += 1;
      }
      // sitemap path preference
      const inSitemap = sitemapPaths.some(pth => pth.endsWith(`/${p.slug}`));
      if (inSitemap) score += 3;
      return { p, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.p);

  return (
    <section>
      <h1>{a.title}</h1>
      <p className="muted">{a.slug}</p>
      <div style={{ whiteSpace: 'pre-wrap' }}>{a.body}</div>
      {(a.primaryCtaLabel || a.primaryCtaHref) && (
        <div className="row" style={{ marginTop: 12 }}>
          <a className="btn btn-primary" href={a.primaryCtaHref || `/sites/${params.siteId}/lead`}>
            {a.primaryCtaLabel || 'Bereken aanbod'}
          </a>
        </div>
      )}
      <div className="row" style={{ marginTop: 24 }}>
        <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Vraag financiering aan</a>
        <a className="btn" href={`/sites/${params.siteId}`}>Terug</a>
      </div>
      {related?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Verder lezen</h3>
          <ul>
            {related.map((r: any) => (
              <li key={r.id}><a className="link" href={`/sites/${params.siteId}/${r.slug}`}>{r.title}</a></li>
            ))}
          </ul>
        </div>
      )}
      <StickyCTA href={`/sites/${params.siteId}/lead`} label="Vraag financiering aan" />
    </section>
  );
}

export async function generateMetadata({ params }: { params: { siteId: string, slug: string } }): Promise<Metadata> {
  const pg = await fetchPage(params.siteId, params.slug);
  const titlePrefix = (pg?.title as string) || 'Zakelijke financiering';
  return {
    title: buildTitle(titlePrefix),
    description: buildDescription('Zakelijke financiering zonder gedoe — snel geregeld, helder en flexibel.'),
  };
}


