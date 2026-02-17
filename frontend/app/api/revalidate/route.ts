import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const secret = (process.env.REVALIDATE_SECRET || '').trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET not configured' },
      { status: 500 }
    );
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    // Allow empty body
  }

  const provided = String(body?.secret || '').trim();
  const path = String(body?.path || '').trim() || '/';

  if (!provided || provided !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Normalize path to be safe.
  const normalized = path.startsWith('/') ? path : `/${path}`;
  revalidatePath(normalized);

  return NextResponse.json({ ok: true, revalidated: normalized });
}

