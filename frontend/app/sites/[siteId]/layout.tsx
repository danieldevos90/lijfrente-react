import type { ReactNode, CSSProperties } from 'react';

async function fetchNav(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return [] as any[];
  const res = await fetch(
    `${base}/api/navigation-items?filters[siteId][$eq]=${encodeURIComponent(siteId)}&sort=order:asc`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 60 },
    }
  );
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data : [];
}

async function fetchTokenSet(siteId: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  if (!base) return null;
  const res = await fetch(
    `${base}/api/token-sets?filters[siteId][$eq]=${encodeURIComponent(siteId)}&pagination[pageSize]=1`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 300 },
    }
  );
  const json = await res.json().catch(() => ({ data: [] }));
  return Array.isArray(json?.data) ? json.data[0] : null;
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
      {nav?.length > 0 && (
        <div className="row" style={{ justifyContent: 'flex-start', gap: '8px' }}>
          {nav.map((n: any) => {
            const label = n.label || n.attributes?.label || '';
            const hrefRaw = n.href || n.attributes?.href || '#';
            const href = label.toLowerCase() === 'home' ? `/sites/${params.siteId}/home` : hrefRaw;
            return (
              <a key={n.id} className="btn" href={href}>
                {label}
              </a>
            );
          })}
        </div>
      )}
      {children}
    </div>
  );
}


