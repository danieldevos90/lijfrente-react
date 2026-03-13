import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.geldgeregeld.nl';

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (isDev) {
      console.log('[API /api/strapi/footer] Request:', {
        siteId,
        hasStrapiUrl: !!STRAPI_URL,
      });
    }

    if (!siteId) {
      if (isDev) {
        console.warn('[API /api/strapi/footer] Missing siteId');
      }
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    const url = `${STRAPI_URL}/api/sites?filters[siteId][$eq]=${siteId}&populate=*`;

    if (isDev) {
      console.log('[API /api/strapi/footer] Fetching:', url);
    }

    // Sites endpoint is public - no auth token needed
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (isDev) {
      console.log('[API /api/strapi/footer] Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    if (!response.ok) {
      if (isDev) {
        const errorText = await response.text().catch(() => 'Could not read error');
        console.error('[API /api/strapi/footer] Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200),
        });
      }
      // Return empty data instead of error
      return NextResponse.json({ data: null });
    }

    const data = await response.json();
    if (isDev) {
      console.log('[API /api/strapi/footer] Success:', {
        dataCount: data?.data?.length || 0,
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    if (isDev) {
      console.error('[API /api/strapi/footer] Exception:', error);
    }
    // Silently return empty data on error
    return NextResponse.json({ data: null });
  }
}
