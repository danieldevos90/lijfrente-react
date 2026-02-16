import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Vraag je aanbod aan | GeldGeregeld',
  description: 'Vraag in een paar minuten een vrijblijvend aanbod aan voor zakelijke financiering.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Prefer: homepage + drawer open (better continuity + higher conversion).
  // Keep /lead as an entrypoint for ads and direct links.
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams || {})) {
    if (typeof value === 'string') sp.set(key, value);
    else if (Array.isArray(value)) sp.set(key, value[0] || '');
  }
  sp.set('drawer', 'lead');
  if (!sp.get('source')) sp.set('source', 'lead_page');
  redirect(`/?${sp.toString()}`);
}


