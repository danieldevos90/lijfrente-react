import type { ReactNode, CSSProperties } from 'react';

async function fetchNav(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base) return [] as any[];
  try {
    const res = await fetch(
      `${base}/api/navigation-items?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=order:asc`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json().catch(() => ({ data: [] }));
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    // Silently return empty array on error
    return [];
  }
}

async function fetchTokenSet(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base) return null;
  try {
    const res = await fetch(
      `${base}/api/token-sets?filters[siteId][$eq]=${encodeURIComponent(siteId)}&pagination[pageSize]=1`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json().catch(() => ({ data: [] }));
    return Array.isArray(json?.data) ? json.data[0] : null;
  } catch (error) {
    // Silently return null on error
    return null;
  }
}

function buildCssVars(tokenSet: any | null): CSSProperties {
  const colors = tokenSet?.colors || {};
  const typography = tokenSet?.typography || {};
  const vars: Record<string, string> = {};
  if (colors.brand) vars['--color-brand'] = String(colors.brand);
  if (colors.brandDark) vars['--color-brand-dark'] = String(colors.brandDark);
  if (colors.text) vars['--color-text'] = String(colors.text);
  if (colors.muted) vars['--color-muted'] = String(colors.muted);
  if (colors.bg) vars['--color-bg'] = String(colors.bg);
  if (colors.border) vars['--color-border'] = String(colors.border);
  if (typography.fontBase) vars['--font-base'] = String(typography.fontBase);
  return vars as CSSProperties;
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { siteId: string };
}) {
  const nav = await fetchNav(params.siteId);
  const tokenSet = await fetchTokenSet(params.siteId);
  const style = buildCssVars(tokenSet);

  return (
    <div style={style as any}>
      <header className="site-header">
        <div className="container">
          <div className="brand">Zakelijk Lening Project</div>
          <nav className="nav">
            <a className="link" href={`/sites/${params.siteId}`}>Home</a>
            <a className="link" href={`/sites/${params.siteId}/zakelijke-financiering`}>Zakelijke Financiering</a>
            <a className="link" href={`/sites/${params.siteId}/werkkapitaal`}>Werkkapitaal</a>
            <a className="link" href={`/sites/${params.siteId}/veelgestelde-vragen`}>FAQ</a>
            <a className="btn btn-primary" href={`/sites/${params.siteId}/lead`}>Offerte Aanvragen</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container">
          <div>© 2025 Zakelijk Lening Project</div>
          <div>Betrouwbare zakelijke financiering</div>
        </div>
      </footer>
    </div>
  );
}


