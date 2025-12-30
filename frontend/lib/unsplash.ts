/**
 * Unsplash API Utilities
 * Helper functions for fetching images from Unsplash
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

/**
 * Search for images on Unsplash
 * @param query - Search query (e.g., "restaurant kitchen", "construction site")
 * @param perPage - Number of results per page (default: 10, max: 30)
 * @returns Array of Unsplash images
 */
export async function searchUnsplashImages(
  query: string,
  perPage: number = 10
): Promise<UnsplashImage[]> {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!UNSPLASH_ACCESS_KEY) {
    if (isDev) {
      console.warn('[Unsplash] ⚠️ UNSPLASH_ACCESS_KEY not set. Skipping image fetch.');
      console.warn('[Unsplash] Add UNSPLASH_ACCESS_KEY to .env.local to enable Unsplash images.');
    }
    return [];
  }
  
  if (isDev) {
    console.log('[Unsplash] Searching for:', query);
  }

  try {
    const url = new URL(`${UNSPLASH_API_URL}/search/photos`);
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', Math.min(perPage, 30).toString());
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`[Unsplash] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: UnsplashSearchResponse = await response.json();
    const results = data.results || [];
    if (isDev) {
      console.log('[Unsplash] Found', results.length, 'images for query:', query);
    }
    return results;
  } catch (error) {
    if (isDev) {
      console.error('[Unsplash] Error fetching images:', error);
    }
    return [];
  }
}

/**
 * Get a random image from Unsplash based on a query
 * @param query - Search query
 * @param useFullSize - Whether to return full-size image (default: true for use cases)
 * @returns Single Unsplash image URL or null
 */
export async function getUnsplashImage(query: string, useFullSize: boolean = true): Promise<string | null> {
  try {
    const images = await searchUnsplashImages(query, 1);
    if (images.length === 0) {
      return null;
    }
    // Return full size for use cases (high quality), or regular for other uses
    return useFullSize ? images[0].urls.full : images[0].urls.regular;
  } catch (error) {
    console.warn('[Unsplash] Error getting image for query:', query, error);
    return null;
  }
}

/**
 * Get multiple Unsplash images for a query
 * @param query - Search query
 * @param count - Number of images to fetch
 * @param useFullSize - Whether to return full-size images (default: true for use cases)
 * @returns Array of image URLs
 */
export async function getUnsplashImages(
  query: string,
  count: number = 3,
  useFullSize: boolean = true
): Promise<string[]> {
  const images = await searchUnsplashImages(query, count);
  return images.map((img) => useFullSize ? img.urls.full : img.urls.regular);
}

/**
 * Get Unsplash image URL with proper attribution
 * @param image - Unsplash image object
 * @param useFullSize - Whether to return full-size image (default: true for use cases)
 * @returns Object with image URL and attribution info
 */
export function getUnsplashImageWithAttribution(image: UnsplashImage, useFullSize: boolean = true) {
  return {
    url: useFullSize ? image.urls.full : image.urls.regular,
    attribution: {
      photographer: image.user.name,
      username: image.user.username,
      link: image.links.html,
    },
  };
}

/**
 * Sector-specific Unsplash search queries
 */
export const SECTOR_UNSPLASH_QUERIES: Record<string, string> = {
  horeca: 'restaurant kitchen professional',
  retail: 'retail store shop',
  transport: 'truck logistics delivery',
  bouw: 'construction building site',
  ecommerce: 'online shopping warehouse',
  zorg: 'healthcare medical',
  consultants: 'business meeting office',
  schoonmaak: 'cleaning service professional',
  automotive: 'car repair garage automotive',
  productie: 'factory manufacturing production',
};

/**
 * Get Unsplash image for a specific sector
 * @param sector - Sector slug
 * @param useCase - Optional use case description for more specific search
 * @param useFullSize - Whether to return full-size image (default: true for use cases)
 * @returns Unsplash image URL or null
 */
export async function getSectorUnsplashImage(
  sector: string,
  useCase?: string,
  useFullSize: boolean = true
): Promise<string | null> {
  const baseQuery = SECTOR_UNSPLASH_QUERIES[sector] || sector;
  const query = useCase ? `${baseQuery} ${useCase}` : baseQuery;
  return getUnsplashImage(query, useFullSize);
}
