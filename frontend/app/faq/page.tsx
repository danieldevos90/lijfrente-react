import { getPageBySlug } from '@/lib/strapi-cms';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import { renderSection } from '@/lib/render-section';
import SubpageHero from '../../components/SubpageHero';
import FAQAccordion from '../../components/FAQAccordion';
import CTASection from '../../components/sections/CTASection';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export const dynamic = 'force-dynamic';

// Default FAQ items for fallback
const DEFAULT_FAQ_ITEMS = [
  {
    id: '1',
    question: 'Hoe lang duurt het om financiering te krijgen?',
    answer: 'Na het indienen van uw aanvraag ontvangt u binnen 24 uur een reactie. Bij goedkeuring kan het bedrag binnen enkele werkdagen op uw rekening staan.'
  },
  {
    id: '2',
    question: 'Welke bedragen kan ik lenen?',
    answer: 'U kunt bij ons terecht voor bedragen vanaf €5.000 tot €250.000. Het exacte bedrag dat voor u beschikbaar is, hangt af van uw bedrijfssituatie en financiële gegevens.'
  },
  {
    id: '3',
    question: 'Wat zijn de kosten van financiering?',
    answer: 'De kosten zijn afhankelijk van het bedrag, de looptijd en uw bedrijfsprofiel. U ontvangt altijd een transparant overzicht van alle kosten voordat u een beslissing neemt.'
  },
  {
    id: '4',
    question: 'Welke documenten heb ik nodig?',
    answer: 'Voor de aanvraag hebben we basisgegevens nodig zoals uw KVK-nummer, jaarrekeningen en bankafschriften. Onze adviseurs helpen u graag bij het verzamelen van de juiste documenten.'
  },
  {
    id: '5',
    question: 'Is er een BKR-toetsing?',
    answer: 'Bij zakelijke financiering voeren wij een krediettoets uit. Een BKR-registratie hoeft geen belemmering te zijn voor uw aanvraag. We kijken naar het totaalbeeld van uw onderneming.'
  },
  {
    id: '6',
    question: 'Kan ik vervroegd aflossen?',
    answer: 'Ja, vervroegd aflossen is bij de meeste financieringsvormen mogelijk. De voorwaarden hiervoor verschillen per product. We bespreken dit graag met u tijdens het adviesgesprek.'
  },
  {
    id: '7',
    question: 'Voor welke sectoren bieden jullie financiering?',
    answer: 'Wij bieden financiering voor diverse sectoren, waaronder horeca, retail, transport, bouw, e-commerce, zorg en meer. Bekijk onze sectorpagina\'s voor specifieke informatie over uw branche.'
  },
  {
    id: '8',
    question: 'Wat als mijn aanvraag wordt afgewezen?',
    answer: 'Als uw aanvraag niet direct kan worden goedgekeurd, zoeken wij samen naar alternatieven. We hebben een breed netwerk van financiers en kunnen vaak alsnog een passende oplossing vinden.'
  }
];

export default async function FAQPage() {
  let page = null;
  
  try {
    page = await getPageBySlug('faq', SITE_ID);
  } catch (e) {
    console.warn('Strapi fetch failed for FAQ page');
  }
  
  const pageData = page?.attributes || page;
  const sections = pageData?.sections;

  // Fallback: Show FAQ page with default content
  if (!page || !sections || !Array.isArray(sections)) {
    return (
      <>
        <HeaderWithWidget />
        <main>
          <SubpageHero
            title="Veelgestelde vragen"
            subtitle="Vind snel antwoord op de meest gestelde vragen over zakelijke financiering."
            backgroundColor="var(--color-bg)"
            iconPath="/icons/SVG/interface/question.svg"
          />
          
          {/* FAQ Section */}
          <section style={{
            padding: '4rem 2rem',
            background: 'white',
          }}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
            }}>
              <FAQAccordion
                items={DEFAULT_FAQ_ITEMS}
                defaultBackground="var(--color-bg)"
                activeBackground="var(--color-sky500)"
              />
            </div>
          </section>

          {/* Additional Info Section */}
          <section style={{
            padding: '4rem 2rem',
            background: 'var(--color-bg)',
          }}>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                marginBottom: '1.5rem',
              }}>
                Uw vraag niet gevonden?
              </h2>
              <p style={{
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                fontSize: '1.125rem',
                marginBottom: '2rem',
              }}>
                Neem gerust contact met ons op. Onze adviseurs staan klaar om al uw vragen te beantwoorden en u te helpen met uw financieringsvraagstuk.
              </p>
              <a
                href="/contact"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: 'var(--color-primary)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                Neem contact op
              </a>
            </div>
          </section>

          <CTASection
            title="Klaar om te beginnen?"
            subtitle="Vraag binnen 2 minuten een vrijblijvend aanbod aan."
            ctaLabel="Vraag financiering aan"
            ctaHref="/lead"
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
