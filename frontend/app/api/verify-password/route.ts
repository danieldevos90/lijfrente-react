import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Get the password from environment variable
    const correctPassword = process.env.SITE_PASSWORD || 'demo';

    if (password === correctPassword) {
      // Set a cookie to remember the user has entered the correct password
      const cookieStore = await cookies();
      cookieStore.set('site-password-verified', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

