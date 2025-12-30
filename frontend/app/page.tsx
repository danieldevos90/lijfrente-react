import { getPageBySlug } from '@/lib/strapi-cms';
import { StrapiSection } from '@/types/strapi-cms';
import HeaderWithWidget from './HeaderWithWidget';
import Footer from '../components/Footer';
import { renderSection } from '@/lib/render-section';
import HomePageClient from './HomePageClient';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// Mark as dynamic to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch page from Strapi - try 'home' first, then fallback to 'home-geldgeregeld'
  let page = null;
  
  try {
    page = await getPageBySlug('home', SITE_ID);
    if (!page) {
      page = await getPageBySlug('home-geldgeregeld', SITE_ID);
    }
  } catch (e) {
    // Silently fallback - no logging to prevent console errors
  }
  
  // Handle both Strapi v4 (attributes) and v5 (flat) response structures
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;
  
  // Fallback to hardcoded content if Strapi is not available
  if (!page || !sections || !Array.isArray(sections)) {
    return <HomePageClient />;
  }

  const title = pageData?.title || 'GeldGeregeld';

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

// Note: Fallback component moved to HomePageClient.tsx
