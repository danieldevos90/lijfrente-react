import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://bright-smile-1f47bc9d67.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId is required' },
        { status: 400 }
      );
    }

    if (!STRAPI_API_TOKEN) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      );
    }

    const url = `${STRAPI_URL}/api/sites?filters[siteId][$eq]=${siteId}&populate=*`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    };

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return empty data instead of error
      return NextResponse.json({ data: null });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Silently return empty data on error
    return NextResponse.json({ data: null });
  }
}
