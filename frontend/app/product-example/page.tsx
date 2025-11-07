import TransparentHeader from '@/components/TransparentHeader';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import FAQAccordion from '@/components/FAQAccordion';

export default function ProductPage() {
  const productFAQs = [
    {
      id: '1',
      question: 'Wat is de minimale leningbedrag?',
      answer: 'Het minimale leningbedrag is €10.000. Voor kleinere financieringen verwijzen we u graag door naar onze partners die gespecialiseerd zijn in microfinanciering.'
    },
    {
      id: '2',
      question: 'Hoe hoog is de rente?',
      answer: 'De rente is afhankelijk van verschillende factoren, waaronder uw kredietwaardigheid, de looptijd van de lening, en het bedrag. Onze rentepercentages variëren tussen 4% en 12% per jaar. Na het invullen van uw aanvraag ontvangt u een persoonlijk voorstel.'
    },
    {
      id: '3',
      question: 'Is er een BKR-registratie nodig?',
      answer: 'Ja, bij het afsluiten van een zakelijke lening wordt er een BKR-registratie gemaakt. Dit is wettelijk verplicht en helpt u ook om overzicht te houden over uw financiële verplichtingen.'
    },
    {
      id: '4',
      question: 'Wat zijn de aflossingsmogelijkheden?',
      answer: 'U kunt kiezen tussen verschillende aflossingsvormen: annuïteit (maandelijks gelijk bedrag), lineair (dalende maandlasten), of aflossingsvrij (alleen rente betalen). We adviseren u graag over de beste optie voor uw situatie.'
    }
  ];

  return (
    <>
      <TransparentHeader />
      <main>
        {/* Hero */}
        <SubpageHero 
          title="Zakelijke lening"
          subtitle="Flexibele financiering voor uw bedrijf"
          backgroundImage="/hero-business.jpg"
        />

        {/* Product Information */}
        <section style={{
          padding: '5rem 0',
          background: 'white',
        }}>
          <div className="container" style={{
            maxWidth: '900px',
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
              Kenmerken
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
            }}>
              <div style={{
                padding: '2rem',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <h3 style={{
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>
                  Bedrag
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: 0,
                }}>
                  €10.000 - €250.000
                </p>
              </div>
              <div style={{
                padding: '2rem',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <h3 style={{
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>
                  Looptijd
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: 0,
                }}>
                  1 - 10 jaar
                </p>
              </div>
              <div style={{
                padding: '2rem',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                <h3 style={{
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>
                  Beslissing
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: 0,
                }}>
                  Binnen 24 uur
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section with custom background */}
        <section style={{
          padding: '5rem 0',
          background: 'rgb(244, 244, 239)',
        }}>
          <div className="container" style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 2rem',
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
            }}>
              <h2 style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: '36px',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#0f1720',
              }}>
                Veelgestelde vragen
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                margin: 0,
              }}>
                Alles wat u moet weten over deze zakelijke lening
              </p>
            </div>
            
            {/* Using FAQAccordion component */}
            <FAQAccordion 
              items={productFAQs}
              defaultBackground="white"
              activeBackground="rgb(228, 242, 255)"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '5rem 0',
          background: 'white',
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
              Klaar om te starten?
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '2rem',
            }}>
              Vraag vrijblijvend een offerte aan en ontvang binnen 24 uur een reactie.
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
              Offerte aanvragen
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}



