import { getPageBySlug } from '@/lib/strapi';
import { Page, FAQSection as FAQSectionType } from '@/types/strapi';
import FAQSection from '@/components/FAQSection';
import TransparentHeader from '@/components/TransparentHeader';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

/**
 * Example: Dynamic page with FAQ section from Strapi
 * 
 * This page demonstrates how to:
 * 1. Fetch page data from Strapi
 * 2. Extract FAQ section data
 * 3. Render FAQ component with proper types
 */

// This function generates static paths for all pages at build time
export async function generateStaticParams() {
  // In production, you'd fetch all page slugs from Strapi
  return [
    { slug: 'faq-strapi-example' },
  ];
}

// This function generates metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.attributes.title,
    description: page.attributes.body?.substring(0, 160) || '',
  };
}

export default async function DynamicFAQPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Fetch page data from Strapi
  const page = await getPageBySlug(params.slug, 'sections.faqItems');
  
  if (!page) {
    notFound();
  }

  // Extract FAQ section from dynamic zones
  const faqSection = page.attributes.sections?.find(
    (section: any) => section.__component === 'sections.faq-section'
  ) as FAQSectionType | undefined;

  return (
    <>
      <TransparentHeader />
      <main>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #0f1720 0%, #1e293b 100%)',
          color: 'white',
          padding: '8rem 0 4rem',
          textAlign: 'center',
        }}>
          <div className="container" style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 2rem',
          }}>
            <h1 style={{
              fontFamily: "'Neue Montreal', sans-serif",
              fontSize: '56px',
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}>
              {page.attributes.title}
            </h1>
            {page.attributes.body && (
              <div 
                style={{
                  fontSize: '20px',
                  opacity: 0.9,
                }}
                dangerouslySetInnerHTML={{ __html: page.attributes.body }}
              />
            )}
          </div>
        </section>

        {/* Render FAQ Section if it exists */}
        {faqSection && (
          <FAQSection
            title={faqSection.title}
            subtitle={faqSection.subtitle}
            faqItems={faqSection.faqItems.map((item) => ({
              id: item.id.toString(),
              question: item.question,
              answer: item.answer,
            }))}
          />
        )}

        {/* Show message if no FAQ section exists */}
        {!faqSection && (
          <section style={{
            padding: '5rem 0',
            textAlign: 'center',
            background: 'rgb(244, 244, 239)',
          }}>
            <div className="container">
              <p style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: '18px',
                color: '#6b7280',
              }}>
                Er zijn momenteel geen veelgestelde vragen beschikbaar voor deze pagina.
              </p>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {page.attributes.primaryCtaLabel && page.attributes.primaryCtaHref && (
          <section style={{
            background: 'white',
            padding: '5rem 0',
            textAlign: 'center',
          }}>
            <div className="container" style={{
              maxWidth: '700px',
              margin: '0 auto',
              padding: '0 2rem',
            }}>
              <a
                href={page.attributes.primaryCtaHref}
                className="btn btn-primary"
                style={{
                  border: '1px solid #0f1720',
                  backgroundColor: '#0f1720',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '.25rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: '10.5rem',
                  padding: '1rem 2rem',
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 1,
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                {page.attributes.primaryCtaLabel}
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

