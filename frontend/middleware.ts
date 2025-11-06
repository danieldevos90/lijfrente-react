import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disable all middleware functionality to debug
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|otf)).*)',
  ],
};
