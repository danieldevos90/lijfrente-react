import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import TeamSectionServer from '../../components/sections/TeamSectionServer';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

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

  return (
    <>
      <HeaderWithWidget />
      <main>
        {sections.map((section: any, index: number) => {
          try {
            const rendered = renderSection(section, index);
            
            // Insert TeamSectionServer right after "Ervaren adviseurs" section
            if (index === advisorsSectionIndex && advisorsSectionIndex !== -1) {
              return (
                <>
                  {rendered}
                  <TeamSectionServer
                    key={`team-${index}`}
                    title="Ons team"
                    subtitle="Ontmoet de mensen achter GeldGeregeld"
                  />
                </>
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
