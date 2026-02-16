import { MetadataRoute } from 'next';
import { getAllSectorPages } from '@/lib/strapi-cms';
import { getBaseUrl } from '@/lib/seo';
import { USE_CASE_SLUGS } from '@/lib/use-cases';

/**
 * Sitemap generation (seo-audit: crawlability)
 * 
 * Generates sitemap.xml at build time for search engine indexing.
 * Includes all important pages with proper priority and change frequency.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';
  
  // Static pages with their priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hoe-werkt-het`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sectoren`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/financiering`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/algemene-voorwaarden`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
  
  // Programmatic SEO: include all sector/market pages.
  // No fallback: sitemap sector URLs must come from Strapi.
  const sectorPages = await getAllSectorPages(siteId, { next: { revalidate: 3600 } });
  const uniqueSectorSlugs = Array.from(
    new Set(
      (sectorPages || [])
        .map((p: any) => {
          const a = p?.attributes || p;
          const raw = (a?.sectorSlug || a?.slug || '').toString();
          if (!raw) return '';
          return raw.startsWith('sector-') ? raw.replace(/^sector-/, '') : raw;
        })
        .filter(Boolean)
    )
  );

  const sectorUrls: MetadataRoute.Sitemap = uniqueSectorSlugs.map((slug) => ({
    url: `${baseUrl}/sectoren/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const sectorUseCaseUrls: MetadataRoute.Sitemap = uniqueSectorSlugs.flatMap((sector) =>
    USE_CASE_SLUGS.map((useCase) => ({
      url: `${baseUrl}/sectoren/${sector}/${useCase}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );

  const useCaseHubUrls: MetadataRoute.Sitemap = USE_CASE_SLUGS.map((useCase) => ({
    url: `${baseUrl}/financiering/${useCase}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Intentionally exclude conversion and internal routes from sitemap:
  // - /lead (form)
  // - /bedankt (thank you)
  // - /password, /admin, /api
  return [...staticPages, ...sectorUrls, ...sectorUseCaseUrls, ...useCaseHubUrls];
}
