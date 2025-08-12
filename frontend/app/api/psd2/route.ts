import { NextRequest } from 'next/server';

// Stub endpoints for initiating a PSD2 consent with a provider like Tink/Yapily
export async function POST(req: NextRequest) {
  const provider = process.env.PSD2_PROVIDER || 'tink';
  const clientId = process.env.PSD2_CLIENT_ID;
  const redirect = process.env.PSD2_REDIRECT_URL || 'http://localhost:3000/psd2/callback';
  if (!clientId) return new Response(JSON.stringify({ error: 'PSD2 not configured' }), { status: 500 });
  // Normally: create a link token / consent session via provider API and return the redirect URL
  return new Response(JSON.stringify({ ok: true, provider, redirectUrl: redirect }), { status: 200 });
}


