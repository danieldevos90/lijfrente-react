import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const sitePassword = process.env.SITE_PASSWORD;

    // If no site password is set, allow access
    if (!sitePassword) {
      return NextResponse.json({ success: true });
    }

    // Check if password matches
    if (password === sitePassword) {
      const response = NextResponse.json({ success: true });
      
      // Set cookie that expires in 24 hours
      response.cookies.set('site-auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    // Invalid password
    return NextResponse.json(
      { success: false, message: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

