import FAQSection from '@/components/FAQSection';
import TransparentHeader from '@/components/TransparentHeader';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';

// Mark as dynamic to prevent build-time prerendering issues with event handlers
export const dynamic = 'force-dynamic';

export default function FAQDemo() {
  const handleCtaClick = () => {
    // Note: For server component compatibility, we'd typically use a client component wrapper
    // For now, keeping the link approach
    window.location.href = '/lead';
  };

  // Sample FAQ data - in production this would come from Strapi
  const sampleFAQs = [
    {
      id: '1',
      question: 'Hoe lang duurt het voordat ik een beslissing krijg?',
      answer: 'In de meeste gevallen ontvangt u binnen 24 uur een eerste reactie op uw aanvraag. De complete beoordeling en beslissing duurt gemiddeld 2-3 werkdagen, afhankelijk van de volledigheid van uw aanvraag en de beschikbaarheid van aanvullende informatie.'
    },
    {
      id: '2',
      question: 'Wat zijn de voorwaarden voor een zakelijke lening?',
      answer: 'De voorwaarden variëren per type lening en uw specifieke situatie. Over het algemeen kijken we naar uw bedrijfsresultaten van de afgelopen jaren, uw kredietwaardigheid, en het doel van de financiering. We werken graag samen met ondernemers die al minimaal 1 jaar actief zijn.'
    },
    {
      id: '3',
      question: 'Kan ik een lening aanvragen als ik een startende ondernemer ben?',
      answer: 'Ja, ook startende ondernemers kunnen bij ons terecht. Voor starters hebben we speciale programma\'s en voorwaarden. We kijken dan bijvoorbeeld naar uw businessplan, eventuele persoonlijke zekerheden, en uw ervaring in de branche. Het is belangrijk dat u een goed doordacht plan heeft.'
    },
    {
      id: '4',
      question: 'Welke documenten heb ik nodig voor mijn aanvraag?',
      answer: 'Voor een complete aanvraag hebben we doorgaans nodig: uw laatste jaarrekening, BTW-aangiftes van het afgelopen jaar, een recent bankoverzicht, en een kopie van uw identiteitsbewijs. Afhankelijk van uw situatie kunnen er aanvullende documenten nodig zijn.'
    },
    {
      id: '5',
      question: 'Zijn er kosten verbonden aan het aanvragen?',
      answer: 'Nee, het aanvragen van een offerte is volledig kosteloos en vrijblijvend. U betaalt alleen als u daadwerkelijk een lening afsluit. Alle kosten en voorwaarden worden vooraf helder met u gecommuniceerd, zodat u precies weet waar u aan toe bent.'
    },
    {
      id: '6',
      question: 'Kan ik vervroegd aflossen?',
      answer: 'Ja, vervroegd aflossen is mogelijk. Afhankelijk van het type lening en de afspraken kunnen hier kosten aan verbonden zijn. We adviseren u graag over de mogelijkheden en eventuele kosten van vervroegd aflossen bij uw specifieke lening.'
    }
  ];

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <SubpageHero
        title="Veelgestelde vragen"
        subtitle="Heeft u een vraag? Bekijk hier de antwoorden op de meest gestelde vragen."
        backgroundColor="var(--color-bg)"
        iconPath="/icons/SVG/interface/question.svg"
      />
      
      <main style={{
        background: 'var(--color-bg)',
      }}>
        {/* FAQ Section */}
        <FAQSection 
          title="Veelgestelde vragen"
          subtitle="Vind snel antwoord op uw vraag"
          faqItems={sampleFAQs}
        />

        {/* CTA Section */}
        <section style={{
          background: 'white',
          padding: '5rem 2rem',
          textAlign: 'center',
        }}>
          <div className="container" style={{
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 400,
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
            }}>
              Staat uw vraag er niet bij?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              marginBottom: '2rem',
            }}>
              Neem contact met ons op. We helpen u graag verder met al uw vragen.
            </p>
            <a
              href="/contact"
              style={{
                border: 'none',
                backgroundColor: 'var(--color-charcoal)',
                color: 'white',
                textAlign: 'center',
                borderRadius: 'var(--radius-full)',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '14rem',
                padding: '1.25rem 2.5rem',
                fontFamily: 'Public Sans Variable, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: '1rem',
                transition: 'all 0.28s',
                display: 'inline-flex',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
              }}
            >
              Contact opnemen
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

