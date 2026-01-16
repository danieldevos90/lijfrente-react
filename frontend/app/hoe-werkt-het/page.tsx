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
    // Fallback: Show hoe-werkt-het page with default content
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Hoe werkt het?"
            subtitle="Van aanvraag tot uitbetaling in 4 eenvoudige stappen. Wij maken zakelijke financiering toegankelijk, transparant en snel."
            backgroundColor="#f9f9f8"
          />
          
          {/* Process Steps Section */}
          <section style={{ padding: '4rem 2rem', background: 'var(--color-bg)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}>
                Het aanvraagproces
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {[
                  { step: '1', title: 'Aanvraag indienen', desc: 'Vul het online formulier in met uw bedrijfsgegevens en financieringswensen.' },
                  { step: '2', title: 'Persoonlijk advies', desc: 'Een adviseur neemt contact met u op om uw situatie te bespreken.' },
                  { step: '3', title: 'Offerte ontvangen', desc: 'U ontvangt een passend voorstel met duidelijke voorwaarden.' },
                  { step: '4', title: 'Financiering geregeld', desc: 'Na goedkeuring wordt het bedrag snel uitbetaald.' },
                ].map((item) => (
                  <div key={item.step} style={{ padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                      {item.step}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <SectorsPreviewSection
            title="Hoe werkt het voor jouw sector?"
            subtitle="Ontdek hoe het aanvraagproces werkt voor jouw specifieke branche."
            maxItems={6}
            showViewAll={true}
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
