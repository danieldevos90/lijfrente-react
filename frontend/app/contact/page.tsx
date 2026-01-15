import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import ContactDetailsSection from '../../components/sections/ContactDetailsSection';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let page = null;
  
  try {
    page = await getPageBySlug('contact', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for contact page');
  }
  
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;

  if (!page || !sections || !Array.isArray(sections)) {
    // Fallback: Show contact page with default content
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Contact"
            subtitle="Heeft u vragen of wilt u meer weten over onze diensten? We helpen u graag verder."
            backgroundColor="var(--color-bg)"
          />
          <ContactDetailsSection 
            title="Contactgegevens"
            content="Bereik ons via telefoon of e-mail. We zijn bereikbaar van maandag tot vrijdag tussen 09:00 en 18:00."
          />
        </main>
        <Footer />
      </>
    );
  }

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
      </main>
      <Footer />
    </>
  );
}
