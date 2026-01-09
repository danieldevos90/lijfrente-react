import { MetadataRoute } from 'next';
import { getAllPages, getAllSectorPages } from '@/lib/strapi-cms';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// Production domain for sitemap - always use the canonical domain
const PRODUCTION_DOMAIN = 'https://geldgeregeld.nl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use production domain for sitemap URLs
  // This ensures Google Search Console accepts the sitemap
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || PRODUCTION_DOMAIN;
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sectoren`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hoe-werkt-het`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
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
      url: `${baseUrl}/lead`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
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
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic pages from Strapi
  let dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    const allPages = await getAllPages(SITE_ID, {
      next: { revalidate: 3600 }
    });

    dynamicPages = allPages
      .map((page) => {
        const pageData = page.attributes || (page as any);
        const slug = pageData?.slug || '';
        
        // Skip if no slug or if it's a sector page (handled separately)
        if (!slug || slug.startsWith('sector-')) {
          return null;
        }
        
        const updatedAt = pageData?.updatedAt || currentDate;
        
        return {
          url: `${baseUrl}/${slug}`,
          lastModified: updatedAt,
          changeFrequency: 'weekly' as const,
          priority: slug === 'home' ? 1.0 : 0.8,
        };
      })
      .filter((page): page is NonNullable<typeof page> => page !== null);
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
  }

  // Sector pages
  let sectorPages: MetadataRoute.Sitemap = [];
  
  try {
    const allSectorPages = await getAllSectorPages(SITE_ID, {
      next: { revalidate: 3600 }
    });

    sectorPages = allSectorPages.map((sectorPage) => {
      const pageData = sectorPage.attributes || (sectorPage as any);
      const sectorSlug = pageData?.sectorSlug || '';
      const updatedAt = pageData?.updatedAt || currentDate;
      
      if (!sectorSlug) {
        return null;
      }
      
      return {
        url: `${baseUrl}/sectoren/${sectorSlug}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    }).filter((page): page is NonNullable<typeof page> => page !== null);

    // Also add predefined sectors that might not be in Strapi yet
    const predefinedSectors = [
      'horeca',
      'retail',
      'transport',
      'bouw',
      'ecommerce',
      'zorg',
      'consultants',
      'schoonmaak',
      'automotive',
      'productie',
    ];

    predefinedSectors.forEach((sector) => {
      const exists = sectorPages.some(
        (page) => page.url === `${baseUrl}/sectoren/${sector}`
      );
      if (!exists) {
        sectorPages.push({
          url: `${baseUrl}/sectoren/${sector}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        });
      }
    });
  } catch (error) {
    console.error('Error fetching sector pages for sitemap:', error);
    
    // Fallback: add predefined sectors even if API fails
    const predefinedSectors = [
      'horeca',
      'retail',
      'transport',
      'bouw',
      'ecommerce',
      'zorg',
      'consultants',
      'schoonmaak',
      'automotive',
      'productie',
    ];

    sectorPages = predefinedSectors.map((sector) => ({
      url: `${baseUrl}/sectoren/${sector}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  }

  return [...staticPages, ...dynamicPages, ...sectorPages];
}
