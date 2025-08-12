import { notFound } from 'next/navigation';

async function fetchPage(siteId: string, slug: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return null;
  const res = await fetch(`${base}/api/pages?filters[siteId][$eq]=${encodeURIComponent(siteId)}&filters[slug][$eq]=${encodeURIComponent(slug)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  });
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data[0] : null;
}

export default async function Page({ params }: { params: { siteId: string, slug: string } }) {
  const page = await fetchPage(params.siteId, params.slug);
  if (!page) return notFound();
  const a = page.attributes || {};
  return (
    <section>
      <h1>{a.title}</h1>
      <p className="muted">{a.slug}</p>
      <div style={{ whiteSpace: 'pre-wrap' }}>{a.body}</div>
      <div className="row" style={{ marginTop: 24 }}>
        <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Bereken aanbod</a>
        <a className="btn" href={`/sites/${params.siteId}`}>Terug</a>
      </div>
    </section>
  );
}


