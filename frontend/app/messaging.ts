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
  seoTitleSuffix: process.env.NEXT_PUBLIC_SITE_NAME || 'Zakelijk Lening Project',
  seoMeta: 'Binnen 24 uur inzicht. Helder, flexibel en zonder papierwerk.',
};

export function buildTitle(prefix?: string) {
  const suffix = messaging.seoTitleSuffix;
  return prefix ? `${prefix} | ${suffix}` : suffix;
}

export function buildDescription(extra?: string) {
  return extra || messaging.seoMeta;
}


