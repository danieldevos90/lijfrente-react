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
 * @param noCache - Whether to disable caching (default: false)
 * @returns Array of Unsplash images
 */
export async function searchUnsplashImages(
  query: string,
  perPage: number = 10,
  noCache: boolean = false
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
    // Add random seed to vary results when noCache is true
    if (noCache) {
      url.searchParams.set('order_by', 'latest'); // Use latest instead of relevance for more variety
    }

    const fetchOptions: RequestInit = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    };
    
    // Only cache if noCache is false
    if (!noCache) {
      fetchOptions.next = { revalidate: 3600 }; // Cache for 1 hour
    } else {
      fetchOptions.cache = 'no-store'; // Disable caching for randomization
    }

    const response = await fetch(url.toString(), fetchOptions);

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
 * Fetches multiple images and selects a good one
 * @param query - Search query
 * @param useFullSize - Whether to return full-size image (default: true for use cases)
 * @returns Single Unsplash image URL or null
 */
export async function getUnsplashImage(query: string, useFullSize: boolean = true): Promise<string | null> {
  try {
    // Fetch multiple images to have better selection
    // Unsplash returns results sorted by relevance, so first few are usually best
    const images = await searchUnsplashImages(query, 5);
    if (images.length === 0) {
      return null;
    }
    
    // Prefer images with good descriptions/alt text (indicates quality)
    // But for now, just use the first result as it's already sorted by relevance
    // and filtered by content_filter: 'high'
    const selectedImage = images[0];
    
    // Return full size for use cases (high quality), or regular for other uses
    return useFullSize ? selectedImage.urls.full : selectedImage.urls.regular;
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
 * @param randomize - Whether to randomize the order (default: false)
 * @returns Array of image URLs
 */
export async function getUnsplashImages(
  query: string,
  count: number = 3,
  useFullSize: boolean = true,
  randomize: boolean = false
): Promise<string[]> {
  // Fetch more images if randomizing to ensure variety
  const fetchCount = randomize ? Math.max(count * 3, 15) : count;
  // Disable caching when randomizing to get fresh results each time
  const images = await searchUnsplashImages(query, fetchCount, randomize);
  let imageUrls = images.map((img) => useFullSize ? img.urls.full : img.urls.regular);
  
  // Shuffle if randomize is true
  if (randomize && imageUrls.length > 1) {
    // Fisher-Yates shuffle
    for (let i = imageUrls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imageUrls[i], imageUrls[j]] = [imageUrls[j], imageUrls[i]];
    }
    // Return only the requested count after shuffling
    imageUrls = imageUrls.slice(0, count);
  }
  
  return imageUrls;
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
 * Improved queries for better image quality and relevance
 */
export const SECTOR_UNSPLASH_QUERIES: Record<string, string> = {
  horeca: 'restaurant kitchen modern professional',
  retail: 'retail store modern shop interior',
  transport: 'truck logistics delivery professional',
  bouw: 'construction building site modern',
  ecommerce: 'online shopping warehouse modern',
  zorg: 'healthcare medical professional modern',
  consultants: 'business meeting office modern',
  schoonmaak: 'cleaning service professional modern',
  automotive: 'car repair garage automotive professional',
  productie: 'factory manufacturing production modern',
};

/**
 * Use case title to Unsplash query mapping
 * Maps Dutch use case titles to English Unsplash queries for better results
 */
export const USE_CASE_UNSPLASH_QUERIES: Record<string, Record<string, string>> = {
  horeca: {
    'Keukenapparatuur': 'professional restaurant kitchen equipment modern',
    'Renovatie & Verbouwing': 'restaurant renovation modern interior design',
    'Voorraad & Inventaris': 'restaurant inventory food storage professional',
    'Seizoensgebonden uitgaven': 'restaurant terrace outdoor dining modern',
    'Terras & Uitbreiding': 'restaurant terrace outdoor dining modern',
    'Werkkapitaal': 'restaurant business professional modern',
  },
  retail: {
    'Winkelinrichting': 'retail store interior modern design',
    'Voorraad': 'retail inventory warehouse modern',
    'Renovatie': 'retail store renovation modern',
    'Uitbreiding': 'retail store expansion modern',
  },
  transport: {
    'Vrachtwagen': 'truck logistics professional modern',
    'Vlootuitbreiding': 'truck fleet logistics modern',
    'Onderhoud': 'truck maintenance garage professional',
  },
  bouw: {
    'Materieel': 'construction equipment tools modern',
    'Renovatie': 'construction renovation building modern',
    'Uitbreiding': 'construction building expansion modern',
  },
  ecommerce: {
    'Voorraad': 'warehouse inventory ecommerce modern',
    'Logistiek': 'warehouse logistics modern',
    'Uitbreiding': 'ecommerce business expansion modern',
  },
  zorg: {
    'Apparatuur': 'medical equipment healthcare modern',
    'Renovatie': 'healthcare facility modern interior',
    'Uitbreiding': 'healthcare facility expansion modern',
  },
  consultants: {
    'Kantoorinrichting': 'modern office interior design',
    'Uitbreiding': 'business office expansion modern',
    'Technologie': 'modern office technology business',
  },
  schoonmaak: {
    'Apparatuur': 'professional cleaning equipment modern',
    'Vlootuitbreiding': 'cleaning service vehicle fleet',
    'Uitbreiding': 'cleaning service business modern',
  },
  automotive: {
    'Apparatuur': 'car repair garage equipment modern',
    'Renovatie': 'automotive garage renovation modern',
    'Uitbreiding': 'automotive garage expansion modern',
  },
  productie: {
    'Machines': 'factory manufacturing equipment modern',
    'Uitbreiding': 'factory expansion manufacturing modern',
    'Renovatie': 'factory renovation manufacturing modern',
  },
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
  // First, try to find a specific query for this use case
  let query: string;
  
  if (useCase && USE_CASE_UNSPLASH_QUERIES[sector]?.[useCase]) {
    // Use the specific use case query
    query = USE_CASE_UNSPLASH_QUERIES[sector][useCase];
  } else {
    // Fall back to sector base query
    const baseQuery = SECTOR_UNSPLASH_QUERIES[sector] || sector;
    // If useCase is provided but not in mapping, try to combine intelligently
    if (useCase) {
      // For better results, use just the base query instead of combining with Dutch text
      query = baseQuery;
    } else {
      query = baseQuery;
    }
  }
  
  // Fetch multiple images and pick a good one (first result is usually best)
  // But we can improve by fetching more and selecting
  return getUnsplashImage(query, useFullSize);
}
