import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

/**
 * Robots.txt configuration (seo-audit: crawlability)
 * 
 * Controls search engine crawling behavior.
 * Generates robots.txt at build time.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/backoffice/',
          '/_next/',
          '/password/',
          '/bedankt',
          '/tools/',
          '/partners/',
          '/p/',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
