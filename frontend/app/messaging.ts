export const messaging = {
  heroTitle: 'Wij regelen uw zakelijke financiering. Tot €2.500.000.',
  heroSub: 'Eén aanvraag, de beste match. Wij vergelijken en regelen de financiering die past bij uw bedrijf.',
  usp: [
    'Wij regelen het voor u',
    'Binnen 24 uur een voorstel',
    'Eén aanvraag, beste match',
    'Geen papieren gedoe',
    'Persoonlijk advies op maat',
    'In enkele klikken aangevraagd',
    'Vrijblijvend en kosteloos',
  ],
  trust: [
    '100% transparant',
    'Heldere voorwaarden, geen verrassingen',
    'Uw gegevens veilig bij ons',
  ],
  flex: [
    'Op maat voor jouw onderneming',
    'Flexibele aflossingsmogelijkheden',
    'Jij kiest de voorwaarden',
    'Financiering die met je meebeweegt',
  ],
  ctaLabel: 'Vraag financiering aan',
  seoBrandName: process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld',
  seoMeta: 'Wij vergelijken en regelen de beste zakelijke financiering voor uw bedrijf. Binnen 24 uur een voorstel.',
};

/**
 * Build SEO-optimized title following competitor best practices
 * Format: "Primary Keyword - Value Prop | Brand"
 * Max length: 60 characters for optimal display
 * 
 * Examples from competitors:
 * - Qeld: "Zakelijke lening aanvragen - Uitbetaling dezelfde dag | Qeld"
 * - Floryn: "Zakelijke financiering aanvragen - Sneller dan de bank."
 */
export function buildTitle(prefix?: string): string {
  const brandName = messaging.seoBrandName;
  
  if (!prefix) {
    // Default homepage title: Primary keyword + value prop + brand
    return `Zakelijke Financiering - Binnen 24 uur geregeld | ${brandName}`;
  }
  
  // If prefix is provided, use it as primary keyword
  // Format: "Primary Keyword | Brand" (keep under 60 chars)
  const title = `${prefix} | ${brandName}`;
  
  // Truncate if too long (max 60 chars for optimal SEO)
  if (title.length > 60) {
    const maxPrefixLength = 60 - brandName.length - 3; // 3 for " | "
    const truncatedPrefix = prefix.substring(0, maxPrefixLength).trim();
    return `${truncatedPrefix}... | ${brandName}`;
  }
  
  return title;
}

export function buildDescription(extra?: string): string {
  return extra || messaging.seoMeta;
}


