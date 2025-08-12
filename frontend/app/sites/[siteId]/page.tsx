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

export default async function SitePage({ params }: { params: { siteId: string } }) {
  const data = await fetchSite(params.siteId);
  if (!data) return notFound();

  const attrs = data.attributes ?? {};
  return (
    <section>
      <h1>{attrs.name ?? params.siteId}</h1>
      <p className="muted">Site ID: {params.siteId}</p>
      <div className="row">
        <a className="btn" href="/">Terug</a>
      </div>
    </section>
  );
}


