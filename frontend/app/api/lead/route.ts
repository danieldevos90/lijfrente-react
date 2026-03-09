import { NextRequest } from 'next/server';
import { createHash } from 'crypto';

function getCookieFromHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((p) => p.trim());
  const kv = parts.find((p) => p.startsWith(name + '='));
  if (!kv) return null;
  const v = kv.split('=').slice(1).join('=');
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function normalizeAndHashEmail(email: string | undefined): string | undefined {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
}

function normalizeAndHashExternalId(id: string | undefined): string | undefined {
  const normalized = String(id || '').trim();
  if (!normalized) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
}

function getMetaPixelIds(): string[] {
  const value = process.env.META_PIXEL_IDS || process.env.NEXT_PUBLIC_META_PIXEL_IDS || '';
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function sendMetaLeadEvent(req: NextRequest, body: any) {
  const accessToken = process.env.META_PIXEL?.trim();
  const pixelIds = getMetaPixelIds();
  if (!accessToken || pixelIds.length === 0) return;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.geldgeregeld.nl').trim();

  const eventId = String(body?.meta_event_id || `lead_${Date.now()}`);
  const email = body?.email ? normalizeAndHashEmail(String(body.email)) : undefined;
  const sessionId = getCookieFromHeader(req.headers.get('cookie'), 'gg_session_id') || undefined;
  const fbp = getCookieFromHeader(req.headers.get('cookie'), '_fbp') || undefined;
  const fbc = getCookieFromHeader(req.headers.get('cookie'), '_fbc') || undefined;
  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined;

  const value = Number(body?.amount_requested_eur);

  const capiBody = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: req.headers.get('referer') || baseUrl,
        user_data: {
          em: email,
          external_id: normalizeAndHashExternalId(sessionId || undefined),
          fbp,
          fbc,
          client_ip_address: ip,
          client_user_agent: req.headers.get('user-agent') || 'server-side-unknown',
        },
        custom_data: {
          currency: 'EUR',
          value: Number.isFinite(value) ? value : undefined,
          content_name: 'lead_form',
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  await Promise.all(
    pixelIds.map(async (pixelId) => {
      const res = await fetch(`https://graph.facebook.com/v25.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiBody),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => '');
        console.error(`Meta CAPI (/api/lead) failed for pixel ${pixelId}:`, res.status, err);
      }
    })
  );
}

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
    await sendMetaLeadEvent(req, body);
    const json = await res.json();
    return new Response(JSON.stringify({ ok: true, id: json?.data?.id }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'Unknown error' }), { status: 400 });
  }
}


