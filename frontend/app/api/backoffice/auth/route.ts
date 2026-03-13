import { NextRequest, NextResponse } from 'next/server';

const BACKOFFICE_PASSWORD =
  (process.env.BACKOFFICE_PASSWORD || process.env.SITE_PASSWORD || 'geldgeregeld2026').trim();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === BACKOFFICE_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('bo-auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
