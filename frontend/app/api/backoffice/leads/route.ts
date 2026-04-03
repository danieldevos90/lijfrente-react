import { NextRequest, NextResponse } from 'next/server';
import { isBackofficeAuthed, getStrapiConfig } from '@/lib/backoffice-auth';

const ALLOWED_SORT = new Set([
  'createdAt:desc',
  'createdAt:asc',
  'amount_requested_eur:desc',
  'amount_requested_eur:asc',
  'company_name:asc',
  'company_name:desc',
  'status:asc',
  'status:desc',
  'email:asc',
  'email:desc',
]);

const MAX_PAGE_SIZE = 100;

function buildStrapiLeadsUrl(
  baseUrl: string,
  incoming: URLSearchParams
): string {
  const page = incoming.get('page') || '1';
  let pageSize = parseInt(incoming.get('pageSize') || '25', 10);
  if (Number.isNaN(pageSize) || pageSize < 1) pageSize = 25;
  pageSize = Math.min(pageSize, MAX_PAGE_SIZE);

  const sortParam = incoming.get('sort') || 'createdAt:desc';
  const sort = ALLOWED_SORT.has(sortParam) ? sortParam : 'createdAt:desc';

  const params = new URLSearchParams();
  params.set('pagination[page]', page);
  params.set('pagination[pageSize]', String(pageSize));
  params.set('sort', sort);

  const status = incoming.get('status')?.trim();
  if (status) {
    params.set('filters[status][$eq]', status);
  }

  const leadQuality = incoming.get('lead_quality')?.trim();
  if (leadQuality) {
    params.set('filters[lead_quality][$eq]', leadQuality);
  }

  const source = incoming.get('source')?.trim();
  if (source) {
    params.set('filters[source][$eq]', source);
  }

  const siteId = incoming.get('siteId')?.trim();
  if (siteId) {
    params.set('filters[siteId][$eq]', siteId);
  }

  const q = incoming.get('q')?.trim();
  if (q) {
    params.append('filters[$or][0][company_name][$containsi]', q);
    params.append('filters[$or][1][email][$containsi]', q);
    params.append('filters[$or][2][kvk_number][$containsi]', q);
    params.append('filters[$or][3][firstName][$containsi]', q);
    params.append('filters[$or][4][lastName][$containsi]', q);
  }

  return `${baseUrl}/api/leads?${params.toString()}`;
}

export async function GET(request: NextRequest) {
  if (!(await isBackofficeAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, token } = getStrapiConfig();
  if (!url) {
    return NextResponse.json({ error: 'Strapi not configured' }, { status: 500 });
  }

  const endpoint = buildStrapiLeadsUrl(url, request.nextUrl.searchParams);

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
