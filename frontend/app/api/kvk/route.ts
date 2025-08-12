import { NextRequest } from 'next/server';

// Thin proxy for KvK search (requires your own API key and base URL)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ items: [] }), { status: 200 });
  }
  const base = process.env.KVK_API_BASE;
  const key = process.env.KVK_API_KEY;
  if (!base || !key) {
    return new Response(JSON.stringify({ error: 'KVK not configured' }), { status: 500 });
  }
  const res = await fetch(`${base}?q=${encodeURIComponent(q)}`, {
    headers: { apikey: key },
    next: { revalidate: 60 },
  });
  const json = await res.json().catch(() => ({ items: [] }));
  return new Response(JSON.stringify(json), { status: 200 });
}


