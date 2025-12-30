import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

    // Check if token is configured
    if (!STRAPI_API_TOKEN) {
      console.error('STRAPI_API_TOKEN is not configured');
      return NextResponse.json(
        { 
          error: 'Server configuration error: STRAPI_API_TOKEN is not set',
          hint: 'Please configure STRAPI_API_TOKEN environment variable. See STRAPI_TOKEN_SETUP.md for instructions.'
        },
        { status: 500 }
      );
    }

    const url = `${STRAPI_URL}/api/navigation-items?filters[siteId][$eq]=${siteId}&sort=order:asc`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    };

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API error:', response.status, errorText);
      
      // Provide helpful error messages
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Authentication failed',
            message: 'Invalid or expired STRAPI_API_TOKEN. Please check your token in Strapi Admin.',
            hint: 'Go to Strapi Admin → Settings → API Tokens to create/verify your token. See STRAPI_TOKEN_SETUP.md for setup instructions.'
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Strapi API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation items' },
      { status: 500 }
    );
  }
}
