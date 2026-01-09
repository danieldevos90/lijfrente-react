/**
 * Strapi CMS API Utilities
 * Helper functions for fetching data from Strapi CMS
 * 
 * ⚠️ IMPORTANT: These functions are SERVER-ONLY.
 * Do NOT import or use these functions in client components ("use client").
 * For client components, use API routes (e.g., /api/strapi/*) instead.
 * 
 * @see /cms/STRAPI_CMS_GUIDE.md for API documentation
 */

import {
  StrapiPage,
  StrapiSite,
  StrapiNavigationItem,
  StrapiTestimonial,
  StrapiTokenSet,
  StrapiTeamMember,
  StrapiResponse,
  StrapiCollectionResponse,
} from '@/types/strapi-cms';

// ============================================================================
// CONFIGURATION
// ============================================================================

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://bright-smile-1f47bc9d67.strapiapp.com';
// NOTE: STRAPI_API_TOKEN should be set as an environment variable.
// The fallback token below may be expired. Set STRAPI_API_TOKEN in your .env.local or Vercel environment variables.
// For client-side calls, use API routes (e.g., /api/strapi/*) that proxy requests server-side.
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
  // Prevent client-side usage - STRAPI_API_TOKEN is not available in browser
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      console.error('[fetchStrapi] ERROR: Called from client-side! This function is server-only.');
      console.error('[fetchStrapi] Use API routes (e.g., /api/strapi/*) for client components.');
    }
    // Return null instead of making the call
    return null as T;
  }
  
  const url = `${STRAPI_URL}/api${endpoint}`;
  const isDev = process.env.NODE_ENV === 'development';
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  if (isDev) {
    console.log('[fetchStrapi] DEBUG:', {
      endpoint,
      url,
      hasToken: !!STRAPI_API_TOKEN,
      tokenLength: STRAPI_API_TOKEN?.length || 0,
    });
  }

  try {
    // Don't set cache: 'no-store' if revalidate is specified (they conflict)
    const fetchOptions: RequestInit = {
      headers,
      next: options.next,
    };
    
    // Only set cache if no revalidate is specified
    if (!options.next?.revalidate) {
      fetchOptions.cache = options.cache || 'no-store';
    } else if (options.cache) {
      // Allow explicit cache override even with revalidate
      fetchOptions.cache = options.cache;
    }
    
    if (isDev) {
      console.log('[fetchStrapi] Making request to:', url);
    }
    
    const response = await fetch(url, fetchOptions);

    if (isDev) {
      console.log('[fetchStrapi] Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    if (!response.ok) {
      // Don't throw on 404 or 401, return null instead for graceful fallback
      if (response.status === 404) {
        if (isDev) {
          console.log('[fetchStrapi] 404 - returning null');
        }
        return null as T;
      }
      
      // Handle 401 errors gracefully - don't throw, just return null
      if (response.status === 401) {
        if (isDev) {
          const errorText = await response.text().catch(() => 'Could not read error');
          console.error('[fetchStrapi] 401 ERROR:', {
            endpoint,
            url,
            errorBody: errorText.substring(0, 200),
            hasToken: !!STRAPI_API_TOKEN,
            tokenLength: STRAPI_API_TOKEN?.length || 0,
          });
        }
        return null as T;
      }
      
      // For other errors, silently return null for graceful fallback
      if (isDev) {
        console.warn('[fetchStrapi] Error response:', {
          status: response.status,
          statusText: response.statusText,
          endpoint,
        });
      }
      return null as T;
    }

    const data = await response.json();
    if (isDev) {
      console.log('[fetchStrapi] Success:', {
        endpoint,
        hasData: !!data,
      });
    }
    return data;
  } catch (error: any) {
    if (isDev) {
      console.error('[fetchStrapi] Exception:', {
        endpoint,
        errorName: error?.name,
        errorMessage: error?.message,
        errorStack: error?.stack?.substring(0, 200),
      });
    }
    // Silently return null - no logging to avoid client console errors
    // All errors are handled gracefully with fallback content
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
    // Silently return null on error
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
    // Silently return empty array on error
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
    // Silently return null on error
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
    // Silently return null on error
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
    // Silently return null on error
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

// ============================================================================
// TEAM MEMBER FUNCTIONS
// ============================================================================

/**
 * Fetch all team members for a site
 * 
 * @example
 * const teamMembers = await getTeamMembers('geldgeregeld');
 */
export async function getTeamMembers(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiTeamMember[]> {
  const isDev = process.env.NODE_ENV === 'development';
  const endpoint = `/team-members?filters[siteId][$eq]=${siteId}&populate[image][populate]=*&sort=order:asc`;
  
  if (isDev) {
    console.log('[getTeamMembers] Fetching:', {
      siteId,
      endpoint,
      hasToken: !!STRAPI_API_TOKEN,
    });
  }
  
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<StrapiTeamMember>>(
      endpoint,
      options
    );

    if (isDev) {
      console.log('[getTeamMembers] Response:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        dataLength: response?.data?.length || 0,
      });
    }

    if (!response || !response.data) {
      return [];
    }

    // Filter out unpublished items and ensure we have valid data
    const published = response.data.filter((member) => {
      const memberData = member.attributes || member;
      const memberAny = memberData as any;
      
      // Check if published
      if (memberAny.publishedAt) {
        const isPublished = new Date(memberAny.publishedAt) <= new Date();
        if (!isPublished) {
          return false;
        }
      }
      
      // Ensure we have at least a name
      if (!memberAny.name) {
        return false;
      }
      
      return true;
    });

    if (isDev) {
      console.log('[getTeamMembers] Published members:', published.length);
      published.forEach((member: any) => {
        const memberData = member.attributes || member;
        const image = memberData.image;
        console.log(`  - ${memberData.name}: hasImage=${!!image?.url}, email=${memberData.email || 'none'}, linkedin=${memberData.linkedin || 'none'}`);
      });
    }

    return published;
  } catch (error) {
    if (isDev) {
      console.error('[getTeamMembers] ❌ Exception:', error);
    }
    // Silently return empty array on error
    return [];
  }
}

// ============================================================================
// SECTOR PAGE FUNCTIONS
// ============================================================================

/**
 * Sector Page Type
 */
export interface StrapiSectorPage {
  id: number;
  attributes: {
    siteId: string;
    sectorSlug: string;
    sectorName: string;
    metaDescription?: string;
    metaKeywords?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    quote?: string;
    quoteAuthor?: string;
    easyLendingTitle?: string;
    easyLendingContent?: string;
    easyLendingImage?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    easyLendingImagePosition?: 'left' | 'right' | 'top';
    useCasesTitle?: string;
    useCasesSubtitle?: string;
    useCases?: Array<{
      title: string;
      description: string;
      iconPath?: string;
      image?: {
        data?: {
          attributes?: {
            url: string;
            alternativeText?: string;
          };
        };
      };
      color?: string;
      textColor?: string;
      buttonLabel?: string;
      buttonHref?: string;
    }>;
    benefitsTitle?: string;
    benefitsSubtitle?: string;
    benefits?: Array<{
      title: string;
      description: string;
      iconPath?: string;
      color?: string;
      textColor?: string;
    }>;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Fetch a sector page by sector slug
 */
export async function getSectorPage(
  sectorSlug: string,
  siteId: string,
  options?: FetchOptions
): Promise<StrapiSectorPage | null> {
  const isDev = process.env.NODE_ENV === 'development';
  // Populate all fields including nested components and images
  // Note: useCases and benefits are component arrays, populate them deeply
  const endpoint = `/sector-pages?filters[sectorSlug][$eq]=${sectorSlug}&filters[siteId][$eq]=${siteId}&populate[heroImage][populate]=*&populate[easyLendingImage][populate]=*&populate[useCases][populate]=*&populate[benefits][populate]=*`;
  
  if (isDev) {
    console.log('[getSectorPage] Fetching:', {
      sectorSlug,
      siteId,
      endpoint,
      hasToken: !!STRAPI_API_TOKEN,
    });
  }
  
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<StrapiSectorPage>>(
      endpoint,
      options
    );

    if (isDev) {
      console.log('[getSectorPage] Response:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        dataLength: response?.data?.length || 0,
      });
    }

    if (!response || !response.data || response.data.length === 0) {
      if (isDev) {
        console.log('[getSectorPage] No data found - returning null');
      }
      return null;
    }

    const sectorPage = response.data[0];
    
    if (isDev) {
      console.log('[getSectorPage] ✅ Success - found sector page');
      console.log('[getSectorPage] Sector page structure:', {
        hasId: !!sectorPage?.id,
        hasAttributes: !!sectorPage?.attributes,
        attributesKeys: sectorPage?.attributes ? Object.keys(sectorPage.attributes) : [],
        useCases: sectorPage?.attributes?.useCases,
        useCasesType: typeof sectorPage?.attributes?.useCases,
        useCasesIsArray: Array.isArray(sectorPage?.attributes?.useCases),
        useCasesLength: Array.isArray(sectorPage?.attributes?.useCases) ? sectorPage.attributes.useCases.length : 'N/A',
        benefits: sectorPage?.attributes?.benefits,
        benefitsType: typeof sectorPage?.attributes?.benefits,
        benefitsIsArray: Array.isArray(sectorPage?.attributes?.benefits),
        benefitsLength: Array.isArray(sectorPage?.attributes?.benefits) ? sectorPage.attributes.benefits.length : 'N/A',
        rawSectorPage: JSON.stringify(sectorPage, null, 2).substring(0, 1000), // First 1000 chars
      });
    }
    
    return sectorPage || null;
  } catch (error) {
    if (isDev) {
      console.error('[getSectorPage] ❌ Exception:', error);
    }
    // Silently return null on error
    return null;
  }
}

/**
 * Fetch all sector pages for a site
 */
export async function getAllSectorPages(
  siteId: string,
  options?: FetchOptions
): Promise<StrapiSectorPage[]> {
  const endpoint = `/sector-pages?filters[siteId][$eq]=${siteId}&populate=*`;
  
  const response = await fetchStrapi<StrapiCollectionResponse<StrapiSectorPage>>(
    endpoint,
    options
  );

  return response?.data || [];
}

