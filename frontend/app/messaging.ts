export const messaging = {
  heroTitle: 'Zakelijke financiering zonder gedoe — snel geregeld, helder en flexibel.',
  heroSub: 'Van aanvraag tot uitbetaling in 24 uur.',
  usp: [
    'Direct geregeld',
    'Binnen 24 uur inzicht',
    'Supersnelle aanvraag',
    'Geen papieren gedoe',
    'Snel, simpel en online',
    'In enkele klikken aangevraagd',
    'Financiering zonder papierwerk',
  ],
  trust: [
    '100% transparant',
    'Heldere voorwaarden, geen verrassingen',
    'Gecertificeerd en betrouwbaar',
  ],
  flex: [
    'Op maat voor jouw onderneming',
    'Altijd boetevrij aflossen',
    'Jij bepaalt de looptijd',
    'Financiering die met je meebeweegt',
  ],
  ctaLabel: 'Vraag financiering aan',
  seoBrandName: process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld',
  seoMeta: 'Binnen 24 uur inzicht. Helder, flexibel en zonder papierwerk.',
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


