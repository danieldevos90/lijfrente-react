export const runtime = 'nodejs';
import { getBaseUrl } from '@/lib/seo';

function buildLlmsTxt(): string {
  const baseUrl = getBaseUrl();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';

  // Keep this short, structured, and stable; many crawlers/LLMs cache aggressively.
  return [
    `# ${siteName}`,
    ``,
    `GeldGeregeld is een Nederlandse website voor zakelijke financiering.`,
    `Deze site bevat sector-specifieke informatiepagina's en een aanvraagflow.`,
    ``,
    `## Belangrijkste pagina's`,
    `- Home: ${baseUrl}/`,
    `- Sectoren (hub): ${baseUrl}/sectoren`,
    `- Financiering per doel (hub): ${baseUrl}/financiering`,
    `- Contact: ${baseUrl}/contact`,
    `- Hoe werkt het: ${baseUrl}/hoe-werkt-het`,
    `- FAQ: ${baseUrl}/faq`,
    ``,
    `## Programmatic / sector pagina's`,
    `- Sector template: ${baseUrl}/sectoren/{sector}`,
    `- Sitemap: ${baseUrl}/sitemap.xml`,
    ``,
    `## Beleid`,
    `- Privacy: ${baseUrl}/privacy`,
    `- Cookies: ${baseUrl}/cookies`,
    `- Disclaimer: ${baseUrl}/disclaimer`,
    `- Algemene voorwaarden: ${baseUrl}/algemene-voorwaarden`,
    ``,
    `## Indexering`,
    `- Conversiepagina's (zoals /lead en /bedankt) zijn bedoeld voor gebruikers, niet voor indexering.`,
    ``,
    `## Contact`,
    `- ${baseUrl}/contact`,
    ``,
    ``,
  ].join('\n');
}

export async function GET(): Promise<Response> {
  return new Response(buildLlmsTxt(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Safe caching: update deploys will refresh, but crawlers won't slam origin.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}

