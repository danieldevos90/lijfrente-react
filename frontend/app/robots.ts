import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration (seo-audit: crawlability)
 * 
 * Controls search engine crawling behavior.
 * Generates robots.txt at build time.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://geldgeregeld.nl';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/password/',
          '/sites/',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
