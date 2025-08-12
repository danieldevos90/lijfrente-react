import { notFound } from 'next/navigation';

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
  return Array.isArray(json?.data) ? json.data : [];
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

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const data = await fetchSite(params.siteId);
  if (!data) return notFound();
  const pages = await fetchPages(params.siteId);
  const nav = await fetchNav(params.siteId);

  const attrs = data.attributes ?? {};
  return (
    <section>
      <h1>{attrs.name ?? params.siteId}</h1>
      <p className="muted">Site ID: {params.siteId}</p>

      {nav?.length > 0 && (
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {nav.map((n: any) => (
            <a key={n.id} className="btn" href={n.attributes?.href || '#'}>{n.attributes?.label}</a>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 24 }}>Pagina’s</h2>
      <ul>
        {pages.map((p: any) => (
          <li key={p.id}>
            <a className="link" href={`/sites/${params.siteId}/${p.attributes?.slug}`}>{p.attributes?.title}</a>
          </li>
        ))}
      </ul>

      <div className="row" style={{ marginTop: 24 }}>
        <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Bereken aanbod</a>
        <a className="btn" href="/">Terug</a>
      </div>
    </section>
  );
}


