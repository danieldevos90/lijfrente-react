import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import SectorsPreviewSection from '../../components/sections/SectorsPreviewSection';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

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
        {/* Sectors Preview Section */}
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
