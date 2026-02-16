import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const page = await getPageBySlug('faq', SITE_ID);
  
  const pageData: any = page?.attributes || page;
  const sections = pageData?.sections as any;

  // No hardcoded fallback: FAQ must be served by Strapi.
  if (!page || !sections || !Array.isArray(sections)) {
    throw new Error('[FAQPage] Missing Strapi "faq" page content (no fallback enabled).');
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
