import { StrapiResponse, Page } from '@/types/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Generic Strapi fetch helper
 */
async function strapiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Build URL with query params
  const url = new URL(endpoint, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Add auth token if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all pages
 */
export async function getPages(populate: string = '*'): Promise<Page[]> {
  const response = await strapiRequest<StrapiResponse<Page>>('/api/pages', {
    params: { populate },
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  return Array.isArray(response.data) ? response.data : [response.data];
}

/**
 * Get page by slug
 */
export async function getPageBySlug(
  slug: string,
  populate: string = 'sections.faqItems,sections.faq-section'
): Promise<Page | null> {
  const response = await strapiRequest<StrapiResponse<Page>>('/api/pages', {
    params: {
      'filters[slug][$eq]': slug,
      populate,
    },
    next: { revalidate: 3600 },
  });

  const pages = Array.isArray(response.data) ? response.data : [response.data];
  return pages[0] || null;
}

/**
 * Get page by slug with deep population for dynamic zones
 */
export async function getPageWithSections(slug: string): Promise<Page | null> {
  return getPageBySlug(slug, 'sections.faqItems,sections.*');
}

/**
 * Get FAQ page specifically
 */
export async function getFAQPage(slug: string = 'faq'): Promise<Page | null> {
  const response = await strapiRequest<StrapiResponse<Page>>('/api/pages', {
    params: {
      'filters[slug][$eq]': slug,
      'populate[faqSection][populate]': 'faqItems',
    },
    next: { revalidate: 3600 },
  });

  const pages = Array.isArray(response.data) ? response.data : [response.data];
  return pages[0] || null;
}

/**
 * Search pages by title or content
 */
export async function searchPages(
  query: string,
  populate: string = '*'
): Promise<Page[]> {
  const response = await strapiRequest<StrapiResponse<Page>>('/api/pages', {
    params: {
      'filters[$or][0][title][$containsi]': query,
      'filters[$or][1][body][$containsi]': query,
      populate,
    },
    next: { revalidate: 60 },
  });

  return Array.isArray(response.data) ? response.data : [response.data];
}

/**
 * Get pages by site ID
 */
export async function getPagesBySiteId(
  siteId: string,
  populate: string = '*'
): Promise<Page[]> {
  const response = await strapiRequest<StrapiResponse<Page>>('/api/pages', {
    params: {
      'filters[siteId][$eq]': siteId,
      populate,
    },
    next: { revalidate: 3600 },
  });

  return Array.isArray(response.data) ? response.data : [response.data];
}

/**
 * Client-side fetch (no cache)
 */
export async function fetchPageClient(slug: string): Promise<Page | null> {
  const response = await strapiRequest<StrapiResponse<Page>>('/api/pages', {
    params: {
      'filters[slug][$eq]': slug,
      'populate': 'sections.faqItems,sections.*',
    },
    cache: 'no-store',
  });

  const pages = Array.isArray(response.data) ? response.data : [response.data];
  return pages[0] || null;
}

/**
 * Revalidate page cache
 * Call this from a Server Action or API route
 */
export async function revalidatePage(slug: string): Promise<void> {
  if (typeof window === 'undefined') {
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/${slug}`);
  }
}

export default {
  getPages,
  getPageBySlug,
  getPageWithSections,
  getFAQPage,
  searchPages,
  getPagesBySiteId,
  fetchPageClient,
  revalidatePage,
};

