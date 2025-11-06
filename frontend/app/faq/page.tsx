import FAQSection from '@/components/FAQSection';
import TransparentHeader from '@/components/TransparentHeader';
import Footer from '@/components/Footer';

export default function FAQDemo() {
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
              Veelgestelde vragen
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              margin: 0,
            }}>
              Heeft u een vraag? Bekijk hier de antwoorden op de meest gestelde vragen.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection 
          title="Veelgestelde vragen"
          subtitle="Vind snel antwoord op uw vraag"
          faqItems={sampleFAQs}
        />

        {/* CTA Section */}
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
            <h2 style={{
              fontFamily: "'Neue Montreal', sans-serif",
              fontSize: '36px',
              fontWeight: 500,
              marginBottom: '1.5rem',
              color: '#0f1720',
            }}>
              Staat uw vraag er niet bij?
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '2rem',
            }}>
              Neem contact met ons op. We helpen u graag verder met al uw vragen.
            </p>
            <button 
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
              }}
            >
              Contact opnemen
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

