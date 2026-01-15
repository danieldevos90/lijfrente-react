import React from 'react';
import { getPageBySlug } from '@/lib/strapi-cms';
import { StrapiSection } from '@/types/strapi-cms';
import HeaderWithWidget from './HeaderWithWidget';
import Footer from '../components/Footer';
import { renderSection } from '@/lib/render-section';
import HomePageClient from './HomePageClient';
import SectorsPreviewSection from '../components/sections/SectorsPreviewSection';
import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateFinancialProductSchema, buildCanonicalUrl, getBaseUrl } from '@/lib/seo';
import { buildTitle, buildDescription } from './messaging';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// Mark as dynamic to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  return generateSEOMetadata({
    // SEO-optimized title: Primary keyword + value prop + brand (under 60 chars)
    title: buildTitle('Zakelijke Financiering - Binnen 24 uur geregeld'),
    description: buildDescription('Snel en simpel zakelijke financiering regelen – binnen 24 uur reactie en transparante voorwaarden. Geen papierwerk, flexibele voorwaarden.'),
    keywords: 'zakelijke financiering, zakelijke lening, bedrijfsfinanciering, snel geld lenen, zakelijk krediet, bedrijfslening',
    canonicalUrl: buildCanonicalUrl('/'),
    ogImage: `${baseUrl}/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg`, // Professional business image for social preview
    ogType: 'website',
  });
}

export default async function HomePage() {
  // Fetch page from Strapi - try 'home' first, then fallback to 'home-geldgeregeld'
  let page = null;
  
  try {
    page = await getPageBySlug('home', SITE_ID);
    if (!page) {
      page = await getPageBySlug('home-geldgeregeld', SITE_ID);
    }
  } catch (e) {
    // Silently fallback - no logging to prevent console errors
  }
  
  // Handle both Strapi v4 (attributes) and v5 (flat) response structures
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;
  
  // Fallback to hardcoded content if Strapi is not available
  if (!page || !sections || !Array.isArray(sections)) {
    return <HomePageClient />;
  }

  const title = pageData?.title || 'GeldGeregeld';

  // Find the index of the benefits-carousel section
  const benefitsIndex = sections.findIndex((section: any) => {
    const sectionData = section.attributes || section;
    return sectionData.__component === 'sections.benefits-carousel';
  });

  // Generate FinancialProduct schema for homepage
  const baseUrl = getBaseUrl();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';
  
  const financialProductSchema = generateFinancialProductSchema({
    name: 'Zakelijke Financiering',
    description: 'Snel en simpel zakelijke financiering regelen – binnen 24 uur reactie en transparante voorwaarden.',
    provider: {
      name: siteName,
      url: baseUrl,
    },
    amountRange: {
      min: 1000,
      max: 250000,
      currency: 'EUR',
    },
    url: buildCanonicalUrl('/'),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(financialProductSchema, null, 2),
        }}
      />
      <HeaderWithWidget />
      <main>
        {sections.map((section: any, index: number) => {
          try {
            const rendered = renderSection(section, index);
            
            // Insert SectorsPreviewSection right after benefits-carousel
            if (index === benefitsIndex && benefitsIndex !== -1) {
              return (
                <React.Fragment key={`section-wrapper-${index}`}>
                  {rendered}
                  <SectorsPreviewSection
                    key={`sectors-${index}`}
                    title="Financiering voor elke sector"
                    subtitle="Ontdek hoe wij jouw branche specifiek kunnen helpen met zakelijke financiering"
                    maxItems={6}
                    showViewAll={true}
                  />
                </React.Fragment>
              );
            }
            
            return rendered;
          } catch (e) {
            console.error(`Error rendering section ${index}:`, e);
            return null;
          }
        })}
      </main>
      <Footer />
    </>
  );
}

// Note: Fallback component moved to HomePageClient.tsx
