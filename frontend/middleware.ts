import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Backoffice auth gate: /backoffice/leads (and deeper) require bo-auth cookie.
  // The login page at /backoffice itself is always accessible.
  if (url.pathname.startsWith('/backoffice/') && url.pathname !== '/backoffice') {
    const pw = req.cookies.get('bo-auth')?.value;
    const expected =
      (process.env.BACKOFFICE_PASSWORD || process.env.SITE_PASSWORD || 'geldgeregeld2026').trim();
    if (pw !== expected) {
      const login = url.clone();
      login.pathname = '/backoffice';
      login.search = '';
      return NextResponse.redirect(login, 307);
    }
  }

  // Short partner links: /p/{partner} -> /partners/{partner}?partner=...&source=partner
  if (url.pathname.startsWith('/p')) {
    const parts = url.pathname.split('/').filter(Boolean);
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

  // /lead -> homepage with drawer open
  if (url.pathname.startsWith('/lead')) {
    const next = url.clone();
    next.pathname = '/';
    if (!next.searchParams.get('drawer') && !next.searchParams.get('openDrawer')) {
      next.searchParams.set('drawer', 'lead');
    }
    if (!next.searchParams.get('source')) {
      next.searchParams.set('source', 'lead_page');
    }
    return NextResponse.redirect(next, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/lead/:path*', '/p/:path*', '/backoffice/:path*'],
};

