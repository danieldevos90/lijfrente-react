import { NextRequest, NextResponse } from 'next/server';

// Ensure /lead behaves as: homepage + drawer open.
// This makes ad landings faster than a client-side redirect.
export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Short partner links: /p/{partner} -> /partners/{partner}?partner=...&source=partner
  if (url.pathname.startsWith('/p')) {
    const parts = url.pathname.split('/').filter(Boolean); // ["p", "{partner}", ...]
    const partner = parts[1] || '';
    const next = url.clone();
    next.pathname = partner ? `/partners/${partner}` : '/partners';

    if (partner && !next.searchParams.get('partner')) {
      next.searchParams.set('partner', partner);
    }
    if (!next.searchParams.get('source')) {
      next.searchParams.set('source', 'partner');
    }
    return NextResponse.redirect(next, 307);
  }

  // Only handle /lead (and any trailing segments).
  if (!url.pathname.startsWith('/lead')) return NextResponse.next();

  const next = url.clone();
  next.pathname = '/';

  // Preserve existing query params (amount/purpose/sector/source/draft/etc.)
  // and add drawer=lead if not present.
  if (!next.searchParams.get('drawer') && !next.searchParams.get('openDrawer')) {
    next.searchParams.set('drawer', 'lead');
  }
  if (!next.searchParams.get('source')) {
    next.searchParams.set('source', 'lead_page');
  }

  return NextResponse.redirect(next, 307);
}

export const config = {
  matcher: ['/lead/:path*', '/p/:path*'],
};

