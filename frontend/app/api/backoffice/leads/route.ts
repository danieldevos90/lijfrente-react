import { NextRequest, NextResponse } from 'next/server';
import { isBackofficeAuthed, getStrapiConfig } from '@/lib/backoffice-auth';

export async function GET(request: NextRequest) {
  if (!(await isBackofficeAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, token } = getStrapiConfig();
  if (!url) {
    return NextResponse.json({ error: 'Strapi not configured' }, { status: 500 });
  }

  const page = request.nextUrl.searchParams.get('page') || '1';
  const pageSize = request.nextUrl.searchParams.get('pageSize') || '50';
  const sort = request.nextUrl.searchParams.get('sort') || 'createdAt:desc';

  const endpoint = `${url}/api/leads?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=${sort}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Strapi leads fetch failed:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
