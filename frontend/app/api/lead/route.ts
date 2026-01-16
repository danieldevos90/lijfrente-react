import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const base = process.env.NEXT_PUBLIC_STRAPI_URL?.trim();
    if (!base) {
      console.error('Lead submission misconfigured: NEXT_PUBLIC_STRAPI_URL not set');
      return new Response(JSON.stringify({ ok: false, error: 'Server misconfigured' }), { status: 500 });
    }
    // Create lead in Strapi Cloud (public create enabled - no auth needed)
    const res = await fetch(`${base}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: body }),
    });
    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ ok: false, error: err }), { status: 400 });
    }
    const json = await res.json();
    return new Response(JSON.stringify({ ok: true, id: json?.data?.id }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'Unknown error' }), { status: 400 });
  }
}


