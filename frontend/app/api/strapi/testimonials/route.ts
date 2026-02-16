import { NextRequest, NextResponse } from 'next/server';
import { getStrapiImageUrl } from '@/lib/strapi-cms';

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || '';
if (!STRAPI_URL) {
  throw new Error('[API /api/strapi/testimonials] NEXT_PUBLIC_STRAPI_URL is required (no fallback enabled).');
}

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    if (!siteId) {
      return NextResponse.json({ testimonials: [] }, { status: 400 });
    }

    if (isDev) {
      console.log('[API /api/strapi/testimonials] Request:', {
        siteId,
        hasStrapiUrl: !!STRAPI_URL,
      });
    }

    // Fetch with image population - use simpler populate syntax
    const url = `${STRAPI_URL}/api/testimonials?filters[siteId][$eq]=${siteId}&populate=*&pagination[limit]=100`;

    if (isDev) {
      console.log('[API /api/strapi/testimonials] Fetching:', url);
    }

    // Testimonials endpoint is public - no auth token needed
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (isDev) {
      console.log('[API /api/strapi/testimonials] Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    if (!response.ok) {
      if (isDev) {
        const errorText = await response.text().catch(() => 'Could not read error');
        console.error('[API /api/strapi/testimonials] Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200),
        });
      }
      // Return empty data instead of error
      return NextResponse.json({ testimonials: [] });
    }

    const data = await response.json();
    const testimonials = data?.data || [];
    
    if (isDev) {
      console.log('[API /api/strapi/testimonials] Success:', {
        testimonialsCount: testimonials.length,
      });
    }
    
    return NextResponse.json({ testimonials });
  } catch (error) {
    if (isDev) {
      console.error('[API /api/strapi/testimonials] Exception:', error);
    }
    // Silently return empty data on error
    return NextResponse.json({ testimonials: [] });
  }
}
