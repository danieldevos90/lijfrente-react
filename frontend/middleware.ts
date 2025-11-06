import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if password protection is enabled
  const passwordProtectionEnabled = process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'true';
  
  if (!passwordProtectionEnabled) {
    return NextResponse.next();
  }

  // Skip password check for the password page itself and static assets
  const pathname = request.nextUrl.pathname;
  if (
    pathname === '/password' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
