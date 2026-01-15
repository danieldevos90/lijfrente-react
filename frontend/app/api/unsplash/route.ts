import { NextRequest, NextResponse } from 'next/server';
import { getUnsplashImages } from '@/lib/unsplash';

/**
 * API route to fetch Unsplash images for client-side components
 * This proxies Unsplash API requests since we can't expose the API key to the client
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || 'business finance professional office';
  const count = parseInt(searchParams.get('count') || '5', 10);
  const useFullSize = searchParams.get('useFullSize') !== 'false';
  const randomize = searchParams.get('randomize') === 'true';

  try {
    const images = await getUnsplashImages(query, count, useFullSize, randomize);
    
    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });
  } catch (error) {
    console.error('[API /api/unsplash] Error:', error);
    return NextResponse.json(
      {
        success: false,
        images: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
