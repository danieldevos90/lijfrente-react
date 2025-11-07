/**
 * Strapi CMS API Utilities
 * Helper functions for fetching data from Strapi CMS
 * 
 * @see /cms/STRAPI_CMS_GUIDE.md for API documentation
 */

import {
  StrapiPage,
  StrapiSite,
  StrapiNavigationItem,
  StrapiTestimonial,
  StrapiTokenSet,
  StrapiResponse,
  StrapiCollectionResponse,
} from '@/types/strapi-cms';

// ============================================================================
// CONFIGURATION
// ============================================================================

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://bright-smile-1f47bc9d67.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717';

interface FetchOptions {
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

// ============================================================================
// CORE API FUNCTIONS
// ============================================================================

/**
 * Generic fetch function for Strapi API
 */
async function fetchStrapi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      headers,
      cache: options.cache || 'no-store',
      next: options.next,
    });

    if (!response.ok) {
      // Don't throw on 404, return null instead
      if (response.status === 404) {
        return null as T;
      }
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error('Strapi fetch error:', error);
    // Return null instead of throwing to allow graceful fallback
    return null as T;
  }
}

// ============================================================================
// PAGE FUNCTIONS
// ============================================================================

/**
 * Fetch a page by slug with all sections populated
 * 
 * @example
 * const page = await getPageBySlug('home', 'geldgeregeld');
 */
export async function getPageBySlug(
  slug: string,
  siteId: string,
  options?: FetchOptions
): Promise<StrapiPage | null> {
  const endpoint = `/pages?filters[slug][$eq]=${slug}&filters[siteId][$eq]=${siteId}&populate[sections][populate]=*`;
  
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<StrapiPage>>(
      endpoint,
      options
    );

    if (!response || !response.data) {
      return null;
    }

    return response.data[0] || null;
  } catch (error) {
    console.error('Error in getPageBySlug:', error);
    return null;
  }
}

/**
 * Fetch all pages for a site
 * 
 * @example
 * const pages = await getAllPages('geldgeregeld');
 */
export async function getAllPages(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiPage[]> {
  const endpoint = `/pages?filters[siteId][$eq]=${siteId}&populate[sections][populate]=*`;
  
  const response = await fetchStrapi<StrapiCollectionResponse<StrapiPage>>(
    endpoint,
    options
  );

  return response.data;
}

/**
 * Fetch page slugs for static generation
 * 
 * @example
 * const slugs = await getPageSlugs('geldgeregeld');
 */
export async function getPageSlugs(
  siteId: string
): Promise<string[]> {
  const endpoint = `/pages?filters[siteId][$eq]=${siteId}&fields[0]=slug`;
  
  const response = await fetchStrapi<StrapiCollectionResponse<StrapiPage>>(
    endpoint
  );

  return response.data.map((page) => page.attributes.slug);
}

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

/**
 * Fetch navigation items for a site
 * 
 * @example
 * const navItems = await getNavigationItems('geldgeregeld');
 */
export async function getNavigationItems(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiNavigationItem[]> {
  const endpoint = `/navigation-items?filters[siteId][$eq]=${siteId}&sort=order:asc`;
  
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<StrapiNavigationItem>>(
      endpoint,
      options
    );

    if (!response || !response.data) {
      return [];
    }

    // Deduplicate navigation items by href (keep first occurrence)
    const seen = new Set<string>();
    const deduplicated = response.data.filter((item) => {
      const itemData = (item.attributes || item) as any;
      const href = itemData.href;
      if (seen.has(href)) {
        return false;
      }
      seen.add(href);
      return true;
    });

    return deduplicated;
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    return [];
  }
}

/**
 * Fetch footer content from site configuration
 * 
 * @example
 * const footer = await getFooterContent('geldgeregeld');
 */
export async function getFooterContent(
  siteId: string,
  options?: FetchOptions
): Promise<any> {
  const endpoint = `/sites?filters[siteId][$eq]=${siteId}&populate=*`;
  
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<StrapiSite>>(
      endpoint,
      options
    );

    if (!response || !response.data || response.data.length === 0) {
      return null;
    }

    return response.data[0];
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return null;
  }
}

// ============================================================================
// TESTIMONIAL FUNCTIONS
// ============================================================================

/**
 * Fetch testimonials for a site
 * 
 * @example
 * const testimonials = await getTestimonials('geldgeregeld');
 */
export async function getTestimonials(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiTestimonial[]> {
  const endpoint = `/testimonials?filters[siteId][$eq]=${siteId}&populate=*`;
  
  const response = await fetchStrapi<StrapiCollectionResponse<StrapiTestimonial>>(
    endpoint,
    options
  );

  return response.data;
}

/**
 * Fetch a single testimonial by ID
 */
export async function getTestimonial(
  id: number,
  options?: FetchOptions
): Promise<StrapiTestimonial | null> {
  const endpoint = `/testimonials/${id}?populate=*`;
  
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiTestimonial>>(
      endpoint,
      options
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return null;
  }
}

// ============================================================================
// SITE FUNCTIONS
// ============================================================================

/**
 * Fetch site configuration
 * 
 * @example
 * const site = await getSiteConfig('geldgeregeld');
 */
export async function getSiteConfig(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiSite | null> {
  const endpoint = `/sites?filters[siteId][$eq]=${siteId}`;
  
  const response = await fetchStrapi<StrapiCollectionResponse<StrapiSite>>(
    endpoint,
    options
  );

  return response.data[0] || null;
}

// ============================================================================
// TOKEN SET FUNCTIONS
// ============================================================================

/**
 * Fetch design tokens for a site
 * 
 * @example
 * const tokens = await getTokenSet('geldgeregeld');
 */
export async function getTokenSet(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiTokenSet | null> {
  const endpoint = `/token-sets?filters[siteId][$eq]=${siteId}`;
  
  const response = await fetchStrapi<StrapiCollectionResponse<StrapiTokenSet>>(
    endpoint,
    options
  );

  return response.data[0] || null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get image URL (handles both relative and absolute URLs)
 */
export function getStrapiImageUrl(url: string): string {
  if (url.startsWith('http')) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}

/**
 * Format Strapi date to readable format
 */
export function formatStrapiDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if content is published
 */
export function isPublished(publishedAt?: string): boolean {
  if (!publishedAt) return false;
  return new Date(publishedAt) <= new Date();
}

// ============================================================================
// REVALIDATION UTILITIES
// ============================================================================

/**
 * Revalidate options for different content types
 */
export const revalidateOptions = {
  // Static content (rarely changes)
  static: {
    next: {
      revalidate: 3600, // 1 hour
      tags: ['static'],
    },
  },
  // Dynamic content (changes frequently)
  dynamic: {
    next: {
      revalidate: 60, // 1 minute
      tags: ['dynamic'],
    },
  },
  // Real-time content (always fresh)
  realtime: {
    cache: 'no-store' as RequestCache,
  },
} as const;

// ============================================================================
// CACHE TAGS
// ============================================================================

/**
 * Generate cache tags for content
 */
export function getCacheTags(
  contentType: string,
  siteId: string,
  id?: number
): string[] {
  const tags = [contentType, `${contentType}-${siteId}`];
  if (id) {
    tags.push(`${contentType}-${id}`);
  }
  return tags;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle Strapi API errors
 */
export class StrapiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

/**
 * Safe fetch with error handling
 */
export async function safeFetchStrapi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fetchStrapi<T>(endpoint, options);
    return { data, error: null };
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

