import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Ensure middleware runs on edge runtime
export const runtime = 'edge';

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    
    // Always skip these paths
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname === '/favicon.ico' ||
      pathname.startsWith('/fonts') ||
      pathname.startsWith('/icons') ||
      pathname.startsWith('/images') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.otf') ||
      pathname === '/password'
    ) {
      return NextResponse.next();
    }

    // Check if password protection is enabled
    const passwordProtectionEnabled = process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'true';
    
    if (!passwordProtectionEnabled) {
      return NextResponse.next();
    }

    // Check if user has valid password cookie
    const passwordCookie = request.cookies.get('site-password-verified');
    
    if (!passwordCookie || passwordCookie.value !== 'true') {
      // Redirect to password page
      const url = request.nextUrl.clone();
      url.pathname = '/password';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    // If middleware fails, allow the request through to avoid breaking the site
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|otf)).*)',
  ],
};
