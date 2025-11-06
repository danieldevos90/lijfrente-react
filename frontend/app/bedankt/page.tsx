import { Check, Phone, Mail, Calendar } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="thank-you-page">
      {/* Hero Section */}
      <section className="thank-you-hero">
        <div className="container">
          <div className="hero-content">
            <div className="success-icon">
              <Check size={64} />
            </div>
            <h1>Bedankt voor uw aanvraag!</h1>
            <p>Uw financieringsaanvraag is succesvol ontvangen. We nemen binnen 24 uur contact met u op.</p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="next-steps">
        <div className="container">
          <h2>Wat gebeurt er nu?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Beoordeling</h3>
                <p>Onze specialisten beoordelen uw aanvraag binnen 4 uur</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Contact</h3>
                <p>We bellen u binnen 24 uur voor een persoonlijk gesprek</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Voorstel</h3>
                <p>U ontvangt een concreet financieringsvoorstel op maat</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Uitbetaling</h3>
                <p>Bij akkoord wordt het geld snel naar u overgemaakt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-info">
        <div className="container">
          <h2>Vragen? Neem direct contact op</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <Phone size={32} />
              <h3>Bel ons</h3>
              <p>085 - 130 5000</p>
              <span>Ma-vr 08:00 - 18:00</span>
            </div>
            <div className="contact-item">
              <Mail size={32} />
              <h3>E-mail ons</h3>
              <p>info@zakelijklening.nl</p>
              <span>Binnen 2 uur reactie</span>
            </div>
            <div className="contact-item">
              <Calendar size={32} />
              <h3>Plan een gesprek</h3>
              <p>Kies een moment dat u uitkomt</p>
              <a href="#" className="btn btn-primary">Afspraak maken</a>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="resources">
        <div className="container">
          <h2>Bereid u voor op ons gesprek</h2>
          <div className="resources-grid">
            <div className="resource-item">
              <h3>Documenten checklist</h3>
              <p>Zorg dat u deze documenten bij de hand heeft voor ons gesprek</p>
              <ul>
                <li>Laatste jaarstukken</li>
                <li>Recente bankafschriften</li>
                <li>KvK uittreksel</li>
                <li>BTW aangiftes (laatste kwartaal)</li>
              </ul>
            </div>
            <div className="resource-item">
              <h3>Veelgestelde vragen</h3>
              <p>Bekijk de antwoorden op de meest gestelde vragen</p>
              <a href="/veelgestelde-vragen" className="btn btn-secondary">Lees FAQ</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Bedankt voor uw aanvraag | GeldGeregeld',
  description: 'Uw financieringsaanvraag is ontvangen. We nemen binnen 24 uur contact met u op.',
};
