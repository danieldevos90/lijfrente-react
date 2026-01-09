/**
 * SEO Utilities
 * Comprehensive SEO helpers including schema markup, metadata, and structured data
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  nofollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Get base URL from environment or construct from request
 * Prioritizes production domain over Vercel preview URLs
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Prioritize NEXT_PUBLIC_BASE_URL, then use production domain as default
  // Don't use VERCEL_URL for production sitemaps (it's a preview URL)
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://geldgeregeld.nl';
  
  // Only use VERCEL_URL in development/preview environments
  if (!process.env.NEXT_PUBLIC_BASE_URL && process.env.NODE_ENV === 'development') {
    baseUrl = process.env.VERCEL_URL || baseUrl;
  }
  
  // Ensure URL has protocol (https://)
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }
  
  return baseUrl;
}

/**
 * Build full canonical URL
 */
export function buildCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate comprehensive metadata for pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = getBaseUrl();
  const canonicalUrl = config.canonicalUrl || baseUrl;
  const ogImage = config.ogImage || `${baseUrl}/og-image.jpg`;
  const siteName = config.siteName || process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    robots: {
      index: !config.noindex,
      follow: !config.nofollow,
      googleBot: {
        index: !config.noindex,
        follow: !config.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'nl_NL',
      ...(config.ogType === 'article' ? {
        type: 'article' as const,
        ...(config.publishedTime && { publishedTime: config.publishedTime }),
        ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
      } : {
        type: (config.ogType || 'website') as 'website' | 'product',
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImage],
    },
    ...(config.author && { authors: [{ name: config.author }] }),
  };
}

/**
 * Generate Organization schema (JSON-LD)
 */
export function generateOrganizationSchema(config: OrganizationSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    ...(config.logo && {
      logo: {
        '@type': 'ImageObject',
        url: config.logo,
      },
    }),
    ...(config.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(config.contactPoint.telephone && {
          telephone: config.contactPoint.telephone,
        }),
        ...(config.contactPoint.contactType && {
          contactType: config.contactPoint.contactType,
        }),
        ...(config.contactPoint.email && {
          email: config.contactPoint.email,
        }),
      },
    }),
    ...(config.sameAs && config.sameAs.length > 0 && {
      sameAs: config.sameAs,
    }),
  };
}

/**
 * Generate WebSite schema with search action (JSON-LD)
 */
export function generateWebSiteSchema(baseUrl: string, searchUrl?: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld',
    url: baseUrl,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

/**
 * Generate BreadcrumbList schema (JSON-LD)
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Service schema for sector pages (JSON-LD)
 */
export function generateServiceSchema(config: {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
  url?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.name,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: config.provider.name,
      url: config.provider.url,
    },
    ...(config.areaServed && {
      areaServed: {
        '@type': 'Country',
        name: config.areaServed,
      },
    }),
    ...(config.serviceType && { serviceType: config.serviceType }),
    ...(config.url && { url: config.url }),
  };
}

/**
 * Generate FAQPage schema (JSON-LD)
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema (JSON-LD)
 */
export function generateArticleSchema(config: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
  url: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    ...(config.image && {
      image: {
        '@type': 'ImageObject',
        url: config.image,
      },
    }),
    datePublished: config.datePublished,
    ...(config.dateModified && { dateModified: config.dateModified }),
    ...(config.author && {
      author: {
        '@type': 'Person',
        name: config.author.name,
        ...(config.author.url && { url: config.author.url }),
      },
    }),
    ...(config.publisher && {
      publisher: {
        '@type': 'Organization',
        name: config.publisher.name,
        ...(config.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: config.publisher.logo,
          },
        }),
      },
    }),
    url: config.url,
  };
}

/**
 * Generate LocalBusiness schema (JSON-LD)
 */
export function generateLocalBusinessSchema(config: {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.name,
    description: config.description,
    url: config.url,
    ...(config.telephone && { telephone: config.telephone }),
    ...(config.address && {
      address: {
        '@type': 'PostalAddress',
        ...(config.address.streetAddress && {
          streetAddress: config.address.streetAddress,
        }),
        ...(config.address.addressLocality && {
          addressLocality: config.address.addressLocality,
        }),
        ...(config.address.postalCode && {
          postalCode: config.address.postalCode,
        }),
        ...(config.address.addressCountry && {
          addressCountry: config.address.addressCountry,
        }),
      },
    }),
    ...(config.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: config.geo.latitude,
        longitude: config.geo.longitude,
      },
    }),
    ...(config.openingHours && config.openingHours.length > 0 && {
      openingHours: config.openingHours,
    }),
    ...(config.priceRange && { priceRange: config.priceRange }),
  };
}

/**
 * Generate FinancialProduct schema (JSON-LD)
 */
export function generateFinancialProductSchema(config: {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  interestRate?: string;
  loanTerm?: string;
  amountRange?: {
    min: number;
    max: number;
    currency: string;
  };
  url: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: config.name,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: config.provider.name,
      url: config.provider.url,
    },
    ...(config.interestRate && { interestRate: config.interestRate }),
    ...(config.loanTerm && { loanTerm: config.loanTerm }),
    ...(config.amountRange && {
      amountRange: {
        '@type': 'MonetaryAmount',
        minValue: config.amountRange.min,
        maxValue: config.amountRange.max,
        currency: config.amountRange.currency,
      },
    }),
    url: config.url,
  };
}

/**
 * Render JSON-LD script tag
 */
export function renderJsonLd(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}
