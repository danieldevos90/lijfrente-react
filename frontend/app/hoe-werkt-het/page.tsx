import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import SectorsPreviewSection from '../../components/sections/SectorsPreviewSection';
import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, buildCanonicalUrl } from '@/lib/seo';
import { buildTitle, buildDescription } from '../messaging';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let page = null;
  
  try {
    page = await getPageBySlug('hoe-werkt-het', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for hoe-werkt-het metadata');
  }
  
  const pageData = page?.attributes || page;
  // SEO-optimized: Primary keyword + value prop
  const title = pageData?.metaTitle || pageData?.title || 'Zakelijke Financiering Aanvragen - Hoe Werkt Het';
  const description = pageData?.metaDescription || 'Van aanvraag tot uitbetaling in 4 eenvoudige stappen. Wij maken zakelijke financiering toegankelijk, transparant en snel. Binnen 24 uur reactie.';
  const keywords = pageData?.metaKeywords || 'hoe werkt het, aanvraagproces, zakelijke lening proces, financiering aanvragen';
  const canonicalUrl = buildCanonicalUrl('/hoe-werkt-het');

  return generateSEOMetadata({
    title: buildTitle(title),
    description: buildDescription(description),
    keywords: keywords,
    canonicalUrl: canonicalUrl,
    ogType: 'website',
  });
}

export default async function HoeWerktHetPage() {
  let page = null;
  
  try {
    page = await getPageBySlug('hoe-werkt-het', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for hoe-werkt-het page');
  }
  
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;

  if (!page || !sections || !Array.isArray(sections)) {
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Hoe werkt het?"
            subtitle="Laden..."
            backgroundColor="#f9f9f8"
          />
        </main>
        <Footer />
      </>
    );
  }

  // Separate CTA sections from other sections
  const regularSections: any[] = [];
  const ctaSections: any[] = [];

  sections.forEach((section: any, index: number) => {
    const sectionData = section.attributes || section;
    if (sectionData.__component === 'sections.cta-section') {
      ctaSections.push({ section, index });
    } else {
      regularSections.push({ section, index });
    }
  });

  return (
    <>
      <HeaderWithWidget />
      <main>
        {regularSections.map(({ section, index }) => {
          try {
            return renderSection(section, index);
          } catch (e) {
            console.error(`Error rendering section ${index}:`, e);
            return null;
          }
        })}
        {/* Sectors Preview Section - before CTA */}
        <SectorsPreviewSection
          title="Hoe werkt het voor jouw sector?"
          subtitle="Ontdek hoe het aanvraagproces werkt voor jouw specifieke branche. Elke sector heeft zijn eigen behoeften en wij passen ons proces daarop aan."
          maxItems={6}
          showViewAll={true}
        />
        {/* Render all CTA sections at the end */}
        {ctaSections.map(({ section, index }) => {
          try {
            return renderSection(section, index);
          } catch (e) {
            console.error(`Error rendering CTA section ${index}:`, e);
            return null;
          }
        })}
      </main>
      <Footer />
    </>
  );
}
