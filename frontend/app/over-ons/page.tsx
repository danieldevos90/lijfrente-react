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

  // If no Strapi content, render empty page with header/footer
  if (!page || !sections || !Array.isArray(sections)) {
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Over ons"
            subtitle="Laden..."
            backgroundColor="#f9f9f8"
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
