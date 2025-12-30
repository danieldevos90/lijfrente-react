import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import TeamSection from '../../components/sections/TeamSection';

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

  // Team members data
  const teamMembers = [
    {
      name: 'Erik de Vos',
      role: 'Oprichter & CEO',
      bio: 'Met meer dan 15 jaar ervaring in de financiële sector heeft Erik een diepgaand begrip van de uitdagingen waar MKB-ondernemers mee te maken hebben. Zijn visie is om zakelijke financiering toegankelijk, transparant en snel te maken voor elke ondernemer.',
      email: 'erik@geldgeregeld.nl',
      linkedin: 'https://linkedin.com/in/erikdevos',
    },
    {
      name: 'Jan Dijkerman',
      role: 'Mede-oprichter & CFO',
      bio: 'Jan brengt uitgebreide expertise in risicomanagement en financiële analyse. Zijn focus ligt op het ontwikkelen van innovatieve financieringsoplossingen die perfect aansluiten bij de behoeften van moderne ondernemers.',
      email: 'jan@geldgeregeld.nl',
      linkedin: 'https://linkedin.com/in/jandijkerman',
    },
  ];

  return (
    <>
      <HeaderWithWidget />
      <main>
        {sections.map((section: any, index: number) => {
          try {
            return renderSection(section, index);
          } catch (e) {
            console.error(`Error rendering section ${index}:`, e);
            return null;
          }
        })}
        {/* Team Section */}
        <TeamSection
          title="Ons team"
          subtitle="Ontmoet de mensen achter GeldGeregeld"
          members={teamMembers}
        />
      </main>
      <Footer />
    </>
  );
}
