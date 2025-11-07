import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  let page = null;
  
  try {
    page = await getPageBySlug('faq', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for FAQ page');
  }
  
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;

  if (!page || !sections || !Array.isArray(sections)) {
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Veelgestelde vragen"
            subtitle="Laden..."
            backgroundColor="var(--color-bg)"
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
