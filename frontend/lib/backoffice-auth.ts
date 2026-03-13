import { cookies } from 'next/headers';

const BACKOFFICE_PASSWORD =
  (process.env.BACKOFFICE_PASSWORD || process.env.SITE_PASSWORD || 'geldgeregeld2026').trim();

export async function isBackofficeAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('bo-auth')?.value;
  return token === BACKOFFICE_PASSWORD;
}

export function getStrapiConfig() {
  const url = (process.env.NEXT_PUBLIC_STRAPI_URL || '').trim();
  const token = (process.env.STRAPI_API_TOKEN || '').trim();
  return { url, token };
}
