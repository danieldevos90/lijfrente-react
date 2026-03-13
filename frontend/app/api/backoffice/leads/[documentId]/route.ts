import { NextRequest, NextResponse } from 'next/server';
import { isBackofficeAuthed, getStrapiConfig } from '@/lib/backoffice-auth';

type RouteContext = { params: Promise<{ documentId: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isBackofficeAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { documentId } = await context.params;
  const { url, token } = getStrapiConfig();
  if (!url) {
    return NextResponse.json({ error: 'Strapi not configured' }, { status: 500 });
  }

  const body = await request.json();
  const endpoint = `${url}/api/leads/${documentId}`;

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data: body }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Strapi lead update failed:', res.status, text);
      return NextResponse.json({ error: 'Update failed', detail: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!(await isBackofficeAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { documentId } = await context.params;
  const { url, token } = getStrapiConfig();
  if (!url) {
    return NextResponse.json({ error: 'Strapi not configured' }, { status: 500 });
  }

  const endpoint = `${url}/api/leads/${documentId}`;

  try {
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Delete failed', detail: text }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
