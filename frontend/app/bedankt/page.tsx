import { Check, Phone, Mail, Calendar, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import HeaderWithWidget from '../HeaderWithWidget';
import Footer from '../../components/Footer';
import CTASection from '../../components/sections/CTASection';
import type { Metadata } from 'next';
import { getSiteContactInfo } from '@/lib/get-site-contact-info';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bedankt voor uw aanvraag | GeldGeregeld',
  description: 'Uw financieringsaanvraag is ontvangen. We nemen binnen 24 uur contact met u op.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ThankYouPage() {
  const contact = await getSiteContactInfo().catch(() => null);
  const phone = String(contact?.phone || '085-0480881');
  const email = String(contact?.email || 'info@geldgeregeld.nl');
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  const docsMailto = `mailto:${email}?subject=${encodeURIComponent('Documenten voor financieringsaanvraag')}&body=${encodeURIComponent(
    'Hi,\n\nHierbij stuur ik documenten voor mijn financieringsaanvraag.\n\nBedrijfsnaam:\nKvK:\nTelefoon:\n\nDank!'
  )}`;
  return (
    <>
      <HeaderWithWidget />
      <main>
        {/* Hero Section */}
        <section 
          style={{
            background: 'var(--background-color--background-tertiary)',
            padding: 'calc(80px + 4rem) 2rem 4rem',
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Success Icon */}
            <div 
              style={{
                width: '100px',
                height: '100px',
                background: 'var(--base-color-system--success-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 8px 24px rgba(0, 200, 0, 0.15)',
              }}
            >
              <Check size={48} strokeWidth={3} color="var(--base-color-neutral--charcoal)" />
            </div>

            <h1 
              style={{
                fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: 'var(--color-text)',
              }}
            >
              Bedankt voor uw aanvraag!
            </h1>
            
            <p 
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontWeight: 300,
                color: 'var(--color-text)',
                lineHeight: 1.6,
                opacity: 0.75,
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Uw financieringsaanvraag is succesvol ontvangen. We nemen binnen 24 uur contact met u op.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a className="btn btn-primary" href={phoneHref}>
                Bel direct: {phone}
              </a>
              <a className="btn btn-secondary" href={`mailto:${email}`}>
                Mail: {email}
              </a>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section 
          style={{
            background: 'var(--background-color--background-white)',
            padding: '5rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 
              style={{
                fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: '3rem',
                textAlign: 'center',
                color: 'var(--color-text)',
              }}
            >
              Wat gebeurt er nu?
            </h2>
            
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Step 1 */}
              <div 
                style={{
                  background: 'var(--base-color-brand--sky)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-charcoal)',
                    color: 'var(--color-white)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '1rem',
                  }}
                >
                  1
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Beoordeling
                </h3>
                <p 
                  style={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    margin: 0,
                  }}
                >
                  Onze specialisten beoordelen uw aanvraag binnen 4 uur
                </p>
              </div>

              {/* Step 2 */}
              <div 
                style={{
                  background: 'var(--base-color-brand--mint)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-charcoal)',
                    color: 'var(--color-white)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '1rem',
                  }}
                >
                  2
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Contact
                </h3>
                <p 
                  style={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    margin: 0,
                  }}
                >
                  We bellen u binnen 24 uur voor een persoonlijk gesprek
                </p>
              </div>

              {/* Step 3 */}
              <div 
                style={{
                  background: 'var(--base-color-brand--sun)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-charcoal)',
                    color: 'var(--color-white)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '1rem',
                  }}
                >
                  3
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Voorstel
                </h3>
                <p 
                  style={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    margin: 0,
                  }}
                >
                  U ontvangt een concreet financieringsvoorstel op maat
                </p>
              </div>

              {/* Step 4 */}
              <div 
                style={{
                  background: 'var(--base-color-brand--pink-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-charcoal)',
                    color: 'var(--color-white)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '1rem',
                  }}
                >
                  4
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Uitbetaling
                </h3>
                <p 
                  style={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    margin: 0,
                  }}
                >
                  Bij akkoord wordt het geld snel naar u overgemaakt
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options Section */}
        <section 
          style={{
            background: 'var(--background-color--background-alternate)',
            padding: '5rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 
              style={{
                fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: '3rem',
                textAlign: 'center',
                color: 'var(--color-text)',
              }}
            >
              Vragen? Neem direct contact op
            </h2>
            
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Phone */}
              <div 
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--base-color-brand--sky500)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Phone size={28} color="var(--color-primary)" />
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Bel ons
                </h3>
                <a 
                  href={phoneHref}
                  style={{
                    display: 'block',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    textDecoration: 'none',
                    marginBottom: '0.5rem',
                  }}
                >
                  {phone}
                </a>
                <span 
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Ma-vr 08:00 - 18:00
                </span>
              </div>

              {/* Email */}
              <div 
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--base-color-brand--mint)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Mail size={28} color="var(--color-charcoal)" />
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.75rem',
                  }}
                >
                  E-mail ons
                </h3>
                <a 
                  href={`mailto:${email}`}
                  style={{
                    display: 'block',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    textDecoration: 'none',
                    marginBottom: '0.5rem',
                  }}
                >
                  {email}
                </a>
                <span 
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Binnen 2 uur reactie
                </span>
              </div>

              {/* Schedule */}
              <div 
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--base-color-brand--sun)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Calendar size={28} color="var(--color-charcoal)" />
                </div>
                <h3 
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Plan een gesprek
                </h3>
                <p 
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  Kies een moment dat u uitkomt
                </p>
                <a 
                  href="/contact"
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.5rem',
                  }}
                >
                  Afspraak maken
                </a>
              </div>

              {/* Upload docs */}
              <div
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--base-color-brand--pink-light)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <FileText size={28} color="var(--color-charcoal)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Documenten sturen
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  Stuur alvast jaarcijfers, bankafschriften of KvK-uittreksel mee. Dat versnelt je voorstel.
                </p>
                <a
                  href={docsMailto}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.5rem',
                  }}
                >
                  Mail documenten
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section 
          style={{
            background: 'var(--background-color--background-white)',
            padding: '5rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 
              style={{
                fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: '3rem',
                textAlign: 'center',
                color: 'var(--color-text)',
              }}
            >
              Bereid u voor op ons gesprek
            </h2>
            
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Document Checklist */}
              <div 
                style={{
                  background: 'var(--background-color--background-alternate)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--base-color-brand--sky)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={24} color="var(--color-charcoal)" />
                  </div>
                  <h3 
                    style={{
                      fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}
                  >
                    Documenten checklist
                  </h3>
                </div>
                <p 
                  style={{
                    color: 'var(--color-text-muted)',
                    marginBottom: '1rem',
                    lineHeight: 1.6,
                  }}
                >
                  Zorg dat u deze documenten bij de hand heeft voor ons gesprek
                </p>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Alle aanvragen
                </p>
                <ul 
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 1.25rem 0',
                  }}
                >
                  <li 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <Check size={18} color="var(--color-primary)" strokeWidth={3} />
                    Bankafschriften afgelopen 12 maanden (PSD2 of PDF)
                  </li>
                </ul>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Vanaf €250.000
                </p>
                <ul 
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <li 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <Check size={18} color="var(--color-primary)" strokeWidth={3} />
                    Kolommenbalans lopend boekjaar
                  </li>
                  <li 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <Check size={18} color="var(--color-primary)" strokeWidth={3} />
                    Jaarcijfers voorgaand boekjaar
                  </li>
                  <li 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 0',
                      color: 'var(--color-text)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <Check size={18} color="var(--color-primary)" strokeWidth={3} />
                    Debiteuren- &amp; crediteurenoverzicht incl. ouderdomsanalyse
                  </li>
                </ul>
              </div>

              {/* FAQ */}
              <div 
                style={{
                  background: 'var(--background-color--background-alternate)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--base-color-brand--mint)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HelpCircle size={24} color="var(--color-charcoal)" />
                  </div>
                  <h3 
                    style={{
                      fontFamily: 'PP Neue Montreal, Neue Montreal, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}
                  >
                    Veelgestelde vragen
                  </h3>
                </div>
                <p 
                  style={{
                    color: 'var(--color-text-muted)',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  Bekijk de antwoorden op de meest gestelde vragen over zakelijke financiering, het aanvraagproces en wat u kunt verwachten.
                </p>
                <a 
                  href="/faq"
                  className="btn btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: 'fit-content',
                  }}
                >
                  Lees FAQ
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Versneld uw aanvraag met een PSD2-koppeling"
          subtitle="Koppel uw zakelijke bankrekening veilig via PSD2 en ontvang sneller een aanbod. Geen handmatig uploaden van bankafschriften."
          ctaLabel="Meer over PSD2"
          ctaHref="/faq"
          background="dark"
        />
      </main>
      <Footer />
    </>
  );
}
