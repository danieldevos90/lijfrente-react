import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://bright-smile-1f47bc9d67.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (isDev) {
      console.log('[API /api/strapi/navigation] Request:', {
        siteId,
        hasStrapiUrl: !!STRAPI_URL,
        hasStrapiToken: !!STRAPI_API_TOKEN,
        tokenLength: STRAPI_API_TOKEN?.length || 0,
      });
    }

    if (!siteId) {
      if (isDev) {
        console.warn('[API /api/strapi/navigation] Missing siteId');
      }
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    const url = `${STRAPI_URL}/api/navigation-items?filters[siteId][$eq]=${siteId}&sort=order:asc`;

    if (isDev) {
      console.log('[API /api/strapi/navigation] Fetching:', url);
    }

    // Navigation-items is a public endpoint in Strapi, no auth needed
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Don't send auth token for public endpoints (navigation-items is public)

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (isDev) {
      console.log('[API /api/strapi/navigation] Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    if (!response.ok) {
      if (isDev) {
        const errorText = await response.text().catch(() => 'Could not read error');
        console.error('[API /api/strapi/navigation] Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200),
        });
      }
      // Return empty data instead of error
      return NextResponse.json({ data: [] });
    }

    const data = await response.json();
    if (isDev) {
      console.log('[API /api/strapi/navigation] Success:', {
        dataCount: data?.data?.length || 0,
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    if (isDev) {
      console.error('[API /api/strapi/navigation] Exception:', error);
    }
    // Silently return empty data on error
    return NextResponse.json({ data: [] });
  }
}
