# Technical Multi-Domain Implementation Guide
## Zakelijke Financiering Platform - Technical Architecture

### 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    Multi-Domain Frontend                     │
├─────────────────────────────────────────────────────────────┤
│  zakelijk-lening.nl  │  werkkapitaal.nl  │  snelle-lening.nl │
│  ondernemers.nl      │  bedrijfskrediet.nl │  mkb-financ.nl   │
├─────────────────────────────────────────────────────────────┤
│                 Shared Next.js Application                  │
├─────────────────────────────────────────────────────────────┤
│                    Strapi Cloud CMS                         │
│              (Multi-tenant Content Management)              │
├─────────────────────────────────────────────────────────────┤
│                   Shared Backend Services                   │
│         (KvK API, PSD2, Analytics, Lead Processing)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Next.js Multi-Domain Configuration**

### **1. Domain Detection & Routing**

#### **middleware.ts** - Domain-based routing
```typescript
import { NextRequest, NextResponse } from 'next/server';

const DOMAIN_MAPPINGS = {
  'zakelijk-lening.nl': 'zakelijk-lening',
  'werkkapitaal.nl': 'werkkapitaal', 
  'ondernemersfinanciering.nl': 'ondernemers',
  'bedrijfskrediet.nl': 'bedrijfskrediet',
  'mkb-financiering.nl': 'mkb',
  'snelle-zakelijke-lening.nl': 'snelle-lening'
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const siteId = DOMAIN_MAPPINGS[hostname] || 'demo';
  
  // Rewrite to site-specific path
  const url = request.nextUrl.clone();
  url.pathname = `/sites/${siteId}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

#### **Dynamic Site Layout** - `app/sites/[siteId]/layout.tsx`
```typescript
import { getDomainConfig } from '@/lib/domain-config';
import { fetchSiteData } from '@/lib/strapi';

interface SiteLayoutProps {
  children: React.ReactNode;
  params: { siteId: string };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const domainConfig = getDomainConfig(params.siteId);
  const siteData = await fetchSiteData(params.siteId);
  
  return (
    <div style={{ 
      '--color-brand': domainConfig.colors.primary,
      '--color-brand-dark': domainConfig.colors.secondary 
    } as React.CSSProperties}>
      <header className="site-header">
        <div className="container">
          <div className="brand" style={{ color: domainConfig.colors.primary }}>
            {siteData.name || domainConfig.defaultName}
          </div>
          <nav className="nav">
            {domainConfig.navigation.map((item) => (
              <a key={item.href} className="link" href={item.href}>
                {item.label}
              </a>
            ))}
            <a className="btn btn-primary" href={`/lead`}>
              {domainConfig.ctaLabel}
            </a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container">
          <div>© 2025 {siteData.name}</div>
          <div>{domainConfig.tagline}</div>
        </div>
      </footer>
    </div>
  );
}
```

### **2. Domain Configuration System**

#### **lib/domain-config.ts** - Centralized domain settings
```typescript
export interface DomainConfig {
  id: string;
  domain: string;
  defaultName: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
  };
  messaging: {
    heroTitle: string;
    heroSubtitle: string;
    primaryCTA: string;
  };
  navigation: Array<{
    label: string;
    href: string;
  }>;
  seo: {
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
  analytics: {
    gtmId?: string;
    plausibleDomain?: string;
  };
}

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  'zakelijk-lening': {
    id: 'zakelijk-lening',
    domain: 'zakelijk-lening.nl',
    defaultName: 'Zakelijk Lening',
    tagline: 'Zakelijke financiering zonder gedoe',
    colors: {
      primary: '#000000',
      secondary: '#1a1a1a'
    },
    messaging: {
      heroTitle: 'Zakelijke financiering zonder gedoe',
      heroSubtitle: 'Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk.',
      primaryCTA: 'Vraag je lening aan'
    },
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Zakelijke Lening', href: '/zakelijke-lening' },
      { label: 'Voorwaarden', href: '/voorwaarden' },
      { label: 'Over Ons', href: '/over-ons' },
      { label: 'Contact', href: '/contact' }
    ],
    seo: {
      titleTemplate: '%s | Zakelijk Lening - Snelle zakelijke financiering',
      description: 'Zakelijke lening aanvragen? ✓ Binnen 24 uur uitbetaald ✓ Transparante voorwaarden ✓ Geen papierwerk. Start je aanvraag nu!',
      keywords: ['zakelijke lening', 'bedrijfsfinanciering', 'ondernemingslening', 'zakelijk geld lenen']
    },
    analytics: {
      gtmId: 'GTM-ZAKELIJK1',
      plausibleDomain: 'zakelijk-lening.nl'
    }
  },
  
  'werkkapitaal': {
    id: 'werkkapitaal',
    domain: 'werkkapitaal.nl',
    defaultName: 'Werkkapitaal Financiering',
    tagline: 'Werkkapitaal dat werkt voor jouw bedrijf',
    colors: {
      primary: '#1e3a8a', // Navy blue
      secondary: '#1e40af'
    },
    messaging: {
      heroTitle: 'Werkkapitaal financiering op maat',
      heroSubtitle: 'Flexibele cashflow oplossingen voor jouw bedrijf. Geen vaste maandlasten.',
      primaryCTA: 'Los je cashflow op'
    },
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Werkkapitaal', href: '/werkkapitaal' },
      { label: 'Cashflow Lening', href: '/cashflow-lening' },
      { label: 'Seizoensfinanciering', href: '/seizoensfinanciering' },
      { label: 'Contact', href: '/contact' }
    ],
    seo: {
      titleTemplate: '%s | Werkkapitaal - Cashflow financiering',
      description: 'Werkkapitaal financiering nodig? ✓ Flexibele terugbetaling ✓ Geen vaste maandlasten ✓ Snel geregeld. Vraag nu aan!',
      keywords: ['werkkapitaal financiering', 'cashflow lening', 'seizoensfinanciering', 'voorraad financieren']
    },
    analytics: {
      gtmId: 'GTM-WERKKAPITAAL1',
      plausibleDomain: 'werkkapitaal.nl'
    }
  },

  'ondernemers': {
    id: 'ondernemers',
    domain: 'ondernemersfinanciering.nl',
    defaultName: 'Ondernemers Financiering',
    tagline: 'Financiering voor ambitieuze ondernemers',
    colors: {
      primary: '#166534', // Dark green
      secondary: '#15803d'
    },
    messaging: {
      heroTitle: 'Financiering voor jouw ondernemersdroom',
      heroSubtitle: 'Van startup tot groei - wij financieren jouw ambities. Snel, flexibel en persoonlijk.',
      primaryCTA: 'Start je aanvraag'
    },
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Startup Financiering', href: '/startup-financiering' },
      { label: 'Groeifinanciering', href: '/groeifinanciering' },
      { label: 'Innovatie Krediet', href: '/innovatie-krediet' },
      { label: 'Contact', href: '/contact' }
    ],
    seo: {
      titleTemplate: '%s | Ondernemers Financiering - Voor ambitieuze ondernemers',
      description: 'Ondernemers financiering voor startup en groei ✓ Flexibele voorwaarden ✓ Persoonlijke begeleiding ✓ Snel proces. Vraag nu aan!',
      keywords: ['ondernemers financiering', 'startup lening', 'groeifinanciering', 'innovatie krediet']
    },
    analytics: {
      gtmId: 'GTM-ONDERNEMERS1',
      plausibleDomain: 'ondernemersfinanciering.nl'
    }
  }
  
  // ... Additional domain configs
};

export function getDomainConfig(siteId: string): DomainConfig {
  return DOMAIN_CONFIGS[siteId] || DOMAIN_CONFIGS['zakelijk-lening'];
}
```

---

## 🎨 **Dynamic Styling System**

### **CSS Custom Properties per Domain**
```css
/* app/globals.css */
:root {
  /* Default values - will be overridden by domain config */
  --color-brand: #000000;
  --color-brand-dark: #1a1a1a;
  --color-text: #0F172A;
  --color-muted: #64748B;
  --color-bg: #FFFFFF;
  --color-border: #E2E8F0;
}

/* Domain-specific overrides applied via inline styles */
.domain-werkkapitaal {
  --color-brand: #1e3a8a;
  --color-brand-dark: #1e40af;
}

.domain-ondernemers {
  --color-brand: #166534;
  --color-brand-dark: #15803d;
}

/* Components use CSS variables for consistent theming */
.btn-primary {
  background: var(--color-brand);
  border-color: var(--color-brand);
}

.btn-primary:hover {
  background: var(--color-brand-dark);
  border-color: var(--color-brand-dark);
}
```

### **Component Theming**
```typescript
// components/templates/HeroSlide.tsx
export default function HeroSlide({ siteId, ...props }: HeroSlideProps & { siteId: string }) {
  const domainConfig = getDomainConfig(siteId);
  
  return (
    <div 
      className="hero-slide"
      style={{
        '--hero-brand-color': domainConfig.colors.primary,
        '--hero-brand-dark': domainConfig.colors.secondary
      } as React.CSSProperties}
    >
      <div className="container">
        <h1>{domainConfig.messaging.heroTitle}</h1>
        <p>{domainConfig.messaging.heroSubtitle}</p>
        <a className="btn btn-primary" href="/lead">
          {domainConfig.messaging.primaryCTA}
        </a>
      </div>
    </div>
  );
}
```

---

## 📊 **Strapi Multi-Site Content Management**

### **Content Type: Site Configuration**
```json
{
  "kind": "collectionType",
  "collectionName": "sites",
  "info": {
    "singularName": "site",
    "pluralName": "sites",
    "displayName": "Site Configuration"
  },
  "attributes": {
    "siteId": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "name": {
      "type": "string",
      "required": true
    },
    "domain": {
      "type": "string",
      "required": true
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "brandColors": {
      "type": "json"
    },
    "messaging": {
      "type": "json"
    },
    "seoConfig": {
      "type": "json"
    },
    "analyticsConfig": {
      "type": "json"
    },
    "pages": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::page.page",
      "mappedBy": "site"
    }
  }
}
```

### **Content Type: Page (Site-Specific)**
```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "site": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::site.site",
      "inversedBy": "pages"
    },
    "content": {
      "type": "dynamiczone",
      "components": [
        "blocks.hero-slide",
        "blocks.feature-grid", 
        "blocks.image-text-block",
        "blocks.service-grid",
        "blocks.testimonial-section",
        "blocks.trust-badges"
      ]
    },
    "seo": {
      "type": "component",
      "component": "shared.seo",
      "required": true
    }
  }
}
```

### **Dynamic Content Components**
```json
{
  "collectionName": "components_blocks_hero_slides",
  "info": {
    "displayName": "Hero Slide",
    "description": "Hero section with customizable content"
  },
  "attributes": {
    "badge": {
      "type": "string"
    },
    "title": {
      "type": "string",
      "required": true
    },
    "subtitle": {
      "type": "text"
    },
    "ctaLabel": {
      "type": "string"
    },
    "ctaHref": {
      "type": "string"
    },
    "variant": {
      "type": "enumeration",
      "enum": ["default", "gradient", "image"],
      "default": "default"
    },
    "backgroundImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    }
  }
}
```

---

## 🔍 **SEO Implementation**

### **Dynamic Meta Tags**
```typescript
// app/sites/[siteId]/page.tsx
import { getDomainConfig } from '@/lib/domain-config';
import { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: { siteId: string } 
}): Promise<Metadata> {
  const domainConfig = getDomainConfig(params.siteId);
  const siteData = await fetchSiteData(params.siteId);
  
  return {
    title: domainConfig.seo.titleTemplate.replace('%s', siteData.name || domainConfig.defaultName),
    description: domainConfig.seo.description,
    keywords: domainConfig.seo.keywords.join(', '),
    openGraph: {
      title: siteData.name || domainConfig.defaultName,
      description: domainConfig.seo.description,
      url: `https://${domainConfig.domain}`,
      siteName: siteData.name || domainConfig.defaultName,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: siteData.name || domainConfig.defaultName,
      description: domainConfig.seo.description
    },
    alternates: {
      canonical: `https://${domainConfig.domain}`
    }
  };
}
```

### **Structured Data per Domain**
```typescript
// lib/structured-data.ts
export function generateStructuredData(siteId: string, siteData: any) {
  const domainConfig = getDomainConfig(siteId);
  
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": siteData.name || domainConfig.defaultName,
    "description": domainConfig.seo.description,
    "url": `https://${domainConfig.domain}`,
    "serviceType": getServiceType(siteId),
    "areaServed": {
      "@type": "Country",
      "name": "Netherlands"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Business Financing Services",
      "itemListElement": getServiceOfferings(siteId)
    }
  };
}

function getServiceType(siteId: string): string {
  const serviceTypes = {
    'zakelijk-lening': 'Business Loan',
    'werkkapitaal': 'Working Capital Financing',
    'ondernemers': 'Entrepreneur Financing',
    'bedrijfskrediet': 'Business Credit Line',
    'mkb': 'SME Financing',
    'snelle-lening': 'Express Business Loan'
  };
  return serviceTypes[siteId] || 'Business Financing';
}
```

---

## 📈 **Analytics & Tracking**

### **Domain-Specific Analytics Setup**
```typescript
// lib/analytics.ts
export function initializeAnalytics(siteId: string) {
  const domainConfig = getDomainConfig(siteId);
  
  // Google Analytics 4
  if (domainConfig.analytics.gtmId) {
    gtag('config', domainConfig.analytics.gtmId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'site_id'
      }
    });
  }
  
  // Plausible Analytics
  if (domainConfig.analytics.plausibleDomain) {
    window.plausible = window.plausible || function() {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }
}

// Track domain-specific events
export function trackLeadSubmission(siteId: string, leadData: any) {
  const domainConfig = getDomainConfig(siteId);
  
  // Google Analytics
  gtag('event', 'lead_submission', {
    site_id: siteId,
    domain: domainConfig.domain,
    financing_amount: leadData.amount,
    business_type: leadData.businessType
  });
  
  // Plausible
  if (window.plausible) {
    window.plausible('Lead Submission', {
      props: {
        site_id: siteId,
        amount: leadData.amount
      }
    });
  }
}
```

---

## 🚀 **Deployment Strategy**

### **Vercel Multi-Domain Setup**
```json
// vercel.json
{
  "version": 2,
  "domains": [
    "zakelijk-lening.nl",
    "werkkapitaal.nl", 
    "ondernemersfinanciering.nl",
    "bedrijfskrediet.nl",
    "mkb-financiering.nl",
    "snelle-zakelijke-lening.nl"
  ],
  "build": {
    "env": {
      "NEXT_PUBLIC_STRAPI_URL": "@strapi-url",
      "STRAPI_TOKEN": "@strapi-token"
    }
  },
  "env": {
    "NEXT_PUBLIC_STRAPI_URL": {
      "production": "https://your-strapi-instance.strapiapp.com"
    }
  }
}
```

### **Environment Configuration**
```bash
# .env.production
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.strapiapp.com
STRAPI_TOKEN=your-production-token

# Domain-specific GTM IDs
NEXT_PUBLIC_GTM_ZAKELIJK_LENING=GTM-ZAKELIJK1
NEXT_PUBLIC_GTM_WERKKAPITAAL=GTM-WERKKAPITAAL1
NEXT_PUBLIC_GTM_ONDERNEMERS=GTM-ONDERNEMERS1

# Plausible domains
NEXT_PUBLIC_PLAUSIBLE_ZAKELIJK_LENING=zakelijk-lening.nl
NEXT_PUBLIC_PLAUSIBLE_WERKKAPITAAL=werkkapitaal.nl
```

---

## 🔒 **Security & Performance**

### **Domain Validation Middleware**
```typescript
// middleware/domain-validation.ts
const ALLOWED_DOMAINS = [
  'zakelijk-lening.nl',
  'werkkapitaal.nl',
  'ondernemersfinanciering.nl',
  'bedrijfskrediet.nl', 
  'mkb-financiering.nl',
  'snelle-zakelijke-lening.nl',
  'localhost:3000', // Development
  'localhost:3001',
  'localhost:3002'
];

export function validateDomain(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  if (!ALLOWED_DOMAINS.some(domain => hostname.includes(domain))) {
    return new Response('Domain not allowed', { status: 403 });
  }
  
  return null; // Continue processing
}
```

### **Performance Optimization**
```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization for better performance
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['your-strapi-instance.strapiapp.com'],
    formats: ['image/webp', 'image/avif']
  },
  
  // Compression
  compress: true,
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

---

This technical implementation guide provides the foundation for deploying the multi-domain strategy with proper architecture, performance, and maintainability considerations.
