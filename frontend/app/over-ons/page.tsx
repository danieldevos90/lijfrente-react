"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import SubpageHero from '../../components/SubpageHero';
import Footer from '../../components/Footer';
import CTASection from '../../components/CTASection';
import FAQAccordion from '../../components/FAQAccordion';
import ImageTextBlock from '../../components/templates/ImageTextBlock';
import { useWidget } from '../../components/GlobalWidgetProvider';
import Image from 'next/image';

// Mark as dynamic to prevent build-time prerendering issues with event handlers
export const dynamic = 'force-dynamic';

export default function OverOnsPage() {
  const { openDrawer } = useWidget();

  const handleCtaClick = () => {
    openDrawer('over_ons_page');
  };

  const benefits = [
    {
      title: 'Razendsnel',
      description: 'Binnen 24 uur reactie op uw aanvraag. Geen weken wachten zoals bij traditionele banken. Aanvraag gedaan in 2 minuten, geld op uw rekening binnen 1-2 werkdagen.',
      iconPath: '/icons/SVG/interface/zap.svg',
      color: '#fff2b2',
      textColor: '#5e5515'
    },
    {
      title: '100% Transparant',
      description: 'Geen verborgen kosten of verrassingen. Wat u ziet is wat u krijgt. Heldere voorwaarden, eerlijke tarieven en boetevrij vervroegd aflossen mogelijk.',
      iconPath: '/icons/SVG/interface/shield.svg',
      color: '#bbe7be',
      textColor: '#114e0b'
    },
    {
      title: 'Voor Elke Ondernemer',
      description: 'Of u nu net bent begonnen of al jaren actief bent – wij hebben de juiste financieringsoplossing. Van ZZP tot MKB, van €5.000 tot €500.000.',
      iconPath: '/icons/SVG/interface/user-add.svg',
      color: '#f8e4e4',
      textColor: '#3b0b0b'
    },
    {
      title: 'Veilig & Vertrouwd',
      description: 'Uw gegevens zijn bij ons in goede handen. We werken volgens de hoogste veiligheidsstandaarden en zijn volledig AVG-compliant.',
      iconPath: '/icons/SVG/interface/lock.svg',
      color: '#d7d0ff',
      textColor: '#3b0b5e'
    },
    {
      title: 'Eenvoudig Online',
      description: 'Alles 100% online geregeld. Geen onnodig papierwerk, geen fysieke afspraken. Aanvraag doen waar en wanneer het u uitkomt.',
      iconPath: '/icons/SVG/interface/tablet.svg',
      color: '#aad5fc',
      textColor: '#0f1720'
    },
    {
      title: 'Persoonlijke Service',
      description: 'Een vast contactpersoon die begrijpt waar uw bedrijf voor staat. Bereikbaar via telefoon, e-mail of chat. Persoonlijk advies op maat.',
      iconPath: '/icons/SVG/interface/message.svg',
      color: '#fcf8d8',
      textColor: '#5e5515'
    },
  ];

  const coreValues = [
    {
      id: '1',
      question: 'Eerlijkheid & Transparantie',
      answer: 'We geloven in open communicatie. Geen kleine lettertjes, geen verborgen agenda\'s. Wat we beloven, maken we waar. U krijgt altijd het complete plaatje voordat u een beslissing neemt.',
    },
    {
      id: '2',
      question: 'Snelheid & Efficiëntie',
      answer: 'Als ondernemer is tijd geld. Daarom hebben we onze processen geoptimaliseerd voor maximale snelheid zonder concessies te doen aan kwaliteit. Moderne technologie maakt het mogelijk om binnen 24 uur reactie te geven.',
    },
    {
      id: '3',
      question: 'Toegankelijkheid',
      answer: 'Zakelijke financiering moet voor iedereen toegankelijk zijn. Of u nu een beginnend eenmanszaak bent of een gevestigd MKB-bedrijf – bij ons krijgt u de aandacht en het maatwerk dat u verdient.',
    },
    {
      id: '4',
      question: 'Innovatie',
      answer: 'We omarmen technologie om betere financiële oplossingen te bieden. Door slimme automatisering en data-analyse kunnen we sneller beslissingen nemen en u beter van dienst zijn.',
    },
  ];

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <SubpageHero
        title="Zakelijke financiering zoals het zou moeten zijn"
        subtitle="Snel, simpel en transparant. Voor elke ondernemer die vooruit wil."
        iconPath="/icons/SVG/interface/heart.svg"
        backgroundColor="#f9f9f8"
      />

      {/* Mission Section */}
      <MissionSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection benefits={benefits} />

      {/* Our Values Section with Accordion */}
      <CoreValuesSection coreValues={coreValues} />

      {/* How We Work Section */}
      <HowWeWorkSection />

      {/* Trust & Security Section */}
      <TrustSection />

      {/* CTA Section */}
      <CTASection
        title="Klaar om uw financiering te regelen?"
        description="Doe vandaag nog een vrijblijvende aanvraag en ontvang binnen 24 uur een persoonlijk voorstel."
        buttonText="Start uw aanvraag"
        onButtonClick={handleCtaClick}
      />

      <Footer />
    </>
  );
}

// Mission Section Component
function MissionSection() {
  return (
    <section style={{ 
      padding: '8rem 2rem', 
      background: 'white',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'PP Neue Montreal, sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.75rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: '2rem',
          color: 'var(--color-text)',
        }}>
          Onze missie
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 300,
          color: 'var(--color-text)',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
        }}>
          Bij GeldGeregeld geloven we dat elke ondernemer toegang moet hebben tot eerlijke, 
          snelle en transparante financiering. Geen verborgen kosten, geen eindeloze wachttijden, 
          geen onduidelijke voorwaarden.
        </p>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 300,
          color: 'var(--color-text)',
          lineHeight: 1.7,
        }}>
          We maken zakelijke financiering toegankelijk voor iedereen – van ZZP'er tot gevestigd 
          MKB-bedrijf. Met onze moderne aanpak krijgt u binnen 24 uur reactie, zodat u zich 
          kunt focussen op wat echt belangrijk is: uw bedrijf laten groeien.
        </p>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 4rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

// Why Choose Us Section Component
interface Benefit {
  title: string;
  description: string;
  iconPath: string;
  color: string;
  textColor: string;
}

function WhyChooseUsSection({ benefits }: { benefits: Benefit[] }) {
  return (
    <section style={{ 
      padding: '8rem 2rem', 
      background: 'var(--color-bg)',
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '5rem',
        }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            Waarom GeldGeregeld?
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}>
            Wij maken het verschil met persoonlijke service en moderne technologie
          </p>
        </div>
        
        <div className="benefits-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        }}>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card"
              style={{
                background: benefit.color,
                borderRadius: '.625rem',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                minHeight: '350px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                width: '6rem', 
                height: '6rem', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image 
                  src={benefit.iconPath} 
                  alt={benefit.title}
                  width={96}
                  height={96}
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                    opacity: 1,
                  }}
                />
              </div>
              <h3 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: '1rem',
                color: benefit.textColor,
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                fontWeight: 300,
                color: benefit.textColor,
                lineHeight: 1.7,
                opacity: 0.85,
                margin: 0,
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 4rem 1.5rem !important;
          }
          
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
          
          .benefit-card {
            min-height: 300px !important;
          }
        }

        @media (max-width: 640px) {
          .benefit-card {
            padding: 2rem 1.5rem !important;
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Core Values Section with Accordion
interface CoreValue {
  id: string;
  question: string;
  answer: string;
}

function CoreValuesSection({ coreValues }: { coreValues: CoreValue[] }) {
  return (
    <section style={{ 
      padding: '8rem 2rem', 
      background: 'white',
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            Onze kernwaarden
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}>
            De principes die ons werk en onze beslissingen bepalen
          </p>
        </div>
        
        <FAQAccordion 
          items={coreValues}
          defaultBackground="white"
          activeBackground="#e4f2ff"
          maxWidth="900px"
        />
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 4rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

// How We Work Section Component
function HowWeWorkSection() {
  const workSteps = [
    {
      title: 'Uw aanvraag in 2 minuten',
      description: 'Vul het online formulier in met uw basisgegevens. Door onze slimme automatisering hebben we maar weinig gegevens nodig om u een eerste indicatie te kunnen geven. Geen urenlange formulieren invullen.',
      imageUrl: '/images/pexels-ketut-subiyanto-4559683.jpg',
      layout: 'image-left' as const,
    },
    {
      title: 'Binnen 24 uur reactie',
      description: 'Ons team beoordeelt uw aanvraag en neemt binnen één werkdag contact met u op. U krijgt een persoonlijk voorstel op maat, inclusief alle voorwaarden en kosten. Geen weken wachten op onduidelijke antwoorden.',
      imageUrl: '/images/pexels-yankrukov-4458386.jpg',
      layout: 'image-right' as const,
    },
    {
      title: 'Geld op uw rekening',
      description: 'Na uw akkoord zorgen we dat het geld snel op uw rekening staat – meestal binnen 1-2 werkdagen. U kunt meteen aan de slag met uw plannen. Dát is pas geld geregeld!',
      imageUrl: '/images/pexels-tima-miroshnichenko-5198239.jpg',
      layout: 'image-left' as const,
    },
  ];

  return (
    <section style={{ 
      padding: '8rem 2rem', 
      background: 'var(--color-bg)',
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            Hoe we werken
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--color-text-muted)',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            Bij GeldGeregeld combineren we de snelheid en efficiëntie van moderne technologie 
            met de persoonlijke benadering waar u als ondernemer recht op heeft.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {workSteps.map((step, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: step.layout === 'image-left' ? '1fr 1fr' : '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
            }}
            className="work-step-image-text">
              {step.layout === 'image-left' && (
                <div style={{
                  width: '100%',
                  height: '500px',
                  borderRadius: '.625rem',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img
                    src={step.imageUrl}
                    alt={step.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.75rem',
                  fontWeight: 400,
                  marginBottom: '1rem',
                }}>
                  {index + 1}
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 400,
                  color: 'var(--color-text)',
                  fontFamily: 'PP Neue Montreal, sans-serif',
                  margin: 0,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                  lineHeight: 1.7,
                  color: 'var(--color-text-muted)',
                  fontWeight: 300,
                  margin: 0,
                }}>
                  {step.description}
                </p>
              </div>

              {step.layout === 'image-right' && (
                <div style={{
                  width: '100%',
                  height: '500px',
                  borderRadius: '.625rem',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img
                    src={step.imageUrl}
                    alt={step.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 4rem 1.5rem !important;
          }
          
          .work-step-image-text {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          .work-step-image-text > div:first-child {
            order: 1;
          }
          
          .work-step-image-text > div:last-child {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
}

// Trust & Security Section Component
function TrustSection() {
  const trustItems = [
    {
      iconPath: '/icons/SVG/interface/lock.svg',
      title: 'SSL Versleuteling',
      description: 'Al uw gegevens worden veilig versleuteld verstuurd',
      color: '#d7d0ff',
      textColor: '#3b0b5e'
    },
    {
      iconPath: '/icons/SVG/interface/shield.svg',
      title: 'AVG-Compliant',
      description: 'We voldoen aan alle Europese privacywetgeving',
      color: '#bbe7be',
      textColor: '#114e0b'
    },
    {
      iconPath: '/icons/SVG/finance/bank.svg',
      title: 'Veilige Banking',
      description: 'Samenwerking met gerenommeerde financiële partners',
      color: '#f8e4e4',
      textColor: '#3b0b0b'
    },
  ];

  return (
    <section style={{ 
      padding: '8rem 2rem', 
      background: 'white',
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            Veiligheid & vertrouwen
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--color-text-muted)',
          }}>
            Uw privacy en de veiligheid van uw gegevens staan bij ons voorop.
          </p>
        </div>

        <div className="trust-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        }}>
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="trust-card"
              style={{
                background: item.color,
                borderRadius: '.625rem',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                minHeight: '280px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                width: '6rem', 
                height: '6rem', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image 
                  src={item.iconPath} 
                  alt={item.title}
                  width={96}
                  height={96}
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                    opacity: 1,
                  }}
                />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                fontWeight: 400,
                marginBottom: '1rem',
                color: item.textColor,
                fontFamily: 'PP Neue Montreal, sans-serif',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                color: item.textColor,
                lineHeight: 1.7,
                fontWeight: 300,
                opacity: 0.85,
                margin: 0,
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .trust-grid {
            grid-template-columns: 1fr !important;
          }
          
          .trust-card {
            min-height: 240px !important;
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 4rem 1.5rem !important;
          }
          
          .trust-card {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
