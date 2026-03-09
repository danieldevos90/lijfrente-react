import { NextRequest, NextResponse } from 'next/server';

function getMetaPixelIds(): string[] {
  const value = process.env.META_PIXEL_IDS || process.env.NEXT_PUBLIC_META_PIXEL_IDS || '';
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.META_DATASET_QUALITY_KEY?.trim();
  if (!expected) return true;
  const provided = request.headers.get('x-meta-dataset-quality-key') || '';
  return provided === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = process.env.META_PIXEL?.trim();
  const configuredPixels = getMetaPixelIds();

  if (!accessToken || configuredPixels.length === 0) {
    return NextResponse.json(
      { error: 'Missing META_PIXEL token or META_PIXEL_IDS/NEXT_PUBLIC_META_PIXEL_IDS' },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const datasetIdQuery = url.searchParams.get('dataset_id');
  const fields =
    url.searchParams.get('fields') ||
    'web{event_name,event_match_quality,event_coverage,dedupe_key_feedback,data_freshness,acr,event_potential_aly_acr_increase}';
  const datasetIds = datasetIdQuery ? [datasetIdQuery] : configuredPixels;

  const results = await Promise.all(
    datasetIds.map(async (datasetId) => {
      const endpoint = new URL('https://graph.facebook.com/v25.0/dataset_quality');
      endpoint.searchParams.set('dataset_id', datasetId);
      endpoint.searchParams.set('access_token', accessToken);
      endpoint.searchParams.set('fields', fields);

      const response = await fetch(endpoint.toString(), { method: 'GET' });
      const data = await response.json().catch(() => null);

      return {
        dataset_id: datasetId,
        ok: response.ok,
        status: response.status,
        data,
      };
    })
  );

  return NextResponse.json({ results }, { status: 200 });
}
