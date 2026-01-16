import React from 'react';
import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import TeamSectionServer from '../../components/sections/TeamSectionServer';
import SectorsPreviewSection from '../../components/sections/SectorsPreviewSection';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always fetch fresh data

export default async function OverOnsPage() {
  let page = null;
  
  try {
    page = await getPageBySlug('over-ons', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for over-ons page');
  }
  
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;

  // Fallback: Show over-ons page with default content
  if (!page || !sections || !Array.isArray(sections)) {
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Over ons"
            subtitle="GeldGeregeld is een Nederlandse financiële dienstverlener die ondernemers helpt bij het verkrijgen van passende zakelijke financiering."
            backgroundColor="#f9f9f8"
          />
          
          {/* About Section */}
          <section style={{ padding: '4rem 2rem', background: 'var(--color-bg)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, marginBottom: '1.5rem' }}>
                Wie wij zijn
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                GeldGeregeld is opgericht met één doel: zakelijke financiering toegankelijk maken voor elke ondernemer. 
                Wij geloven dat elke ondernemer toegang verdient tot eerlijke en transparante financieringsoplossingen.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                Ons team van ervaren adviseurs staat klaar om u te helpen bij het vinden van de juiste financiering 
                voor uw bedrijf. We werken samen met een netwerk van gerenommeerde kredietverstrekkers om u de 
                beste opties te bieden.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section style={{ padding: '4rem 2rem', background: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}>
                Onze waarden
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {[
                  { title: 'Transparantie', desc: 'Duidelijke voorwaarden, geen verborgen kosten. U weet altijd waar u aan toe bent.' },
                  { title: 'Snelheid', desc: 'Binnen 24 uur reactie op uw aanvraag. Wij begrijpen dat tijd kostbaar is.' },
                  { title: 'Persoonlijk', desc: 'Een vaste contactpersoon die uw situatie begrijpt en meedenkt.' },
                ].map((item) => (
                  <div key={item.title} style={{ padding: '2rem', background: 'var(--color-bg)', borderRadius: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <TeamSectionServer
            title="Ons team"
            subtitle="Ontmoet de mensen achter GeldGeregeld"
          />

          <SectorsPreviewSection
            title="Financiering voor elke sector"
            subtitle="Ontdek hoe wij jouw branche specifiek kunnen helpen met zakelijke financiering"
            maxItems={6}
            showViewAll={true}
          />
        </main>
        <Footer />
      </>
    );
  }

  // Find the index of "Ervaren adviseurs met oog voor uw situatie" section
  const advisorsSectionIndex = sections.findIndex((section: any) => {
    const sectionData = section.attributes || section;
    return sectionData.title === 'Ervaren adviseurs met oog voor uw situatie' ||
           sectionData.title?.toLowerCase().includes('ervaren adviseurs');
  });

  // Find the index of "Waarom kiezen voor geldgeregeld.nl" section
  const whyChooseIndex = sections.findIndex((section: any) => {
    const sectionData = section.attributes || section;
    return sectionData.__component === 'sections.why-choose-section' &&
           (sectionData.title === 'Waarom kiezen voor geldgeregeld.nl' ||
            sectionData.title?.toLowerCase().includes('waarom kiezen'));
  });

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
            const rendered = renderSection(section, index);
            
            // Insert SectorsPreviewSection right before "Waarom kiezen" section
            if (index === whyChooseIndex && whyChooseIndex !== -1) {
              return (
                <React.Fragment key={`section-wrapper-${index}`}>
                  <SectorsPreviewSection
                    key={`sectors-${index}`}
                    title="Financiering voor elke sector"
                    subtitle="Ontdek hoe wij jouw branche specifiek kunnen helpen met zakelijke financiering"
                    maxItems={6}
                    showViewAll={true}
                  />
                  {rendered}
                </React.Fragment>
              );
            }
            
            // Insert TeamSectionServer right after "Ervaren adviseurs" section
            if (index === advisorsSectionIndex && advisorsSectionIndex !== -1) {
              return (
                <React.Fragment key={`section-wrapper-${index}`}>
                  {rendered}
                  <TeamSectionServer
                    key={`team-${index}`}
                    title="Ons team"
                    subtitle="Ontmoet de mensen achter GeldGeregeld"
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
