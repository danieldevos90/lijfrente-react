import InteractiveLeadForm from "../../../../components/forms/InteractiveLeadForm";
import "../../../../components/forms/InteractiveLeadForm.css";

export default function SiteLeadPage({ params }: { params: { siteId: string } }) {
  return (
    <div className="lead-page">
      {/* Hero Section */}
      <section className="lead-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Uw zakelijke financiering in 6 eenvoudige stappen</h1>
            <p>Binnen 24 uur weet u waar u aan toe bent. Geen gedoe, wel resultaat.</p>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Binnen 24 uur reactie</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>100% veilig en vertrouwelijk</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📞</span>
                <span>Gratis adviesgesprek</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Form */}
      <section className="form-section">
        <div className="container">
          <InteractiveLeadForm />
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <h2>Waarom kiezen meer dan 10.000 ondernemers voor ons?</h2>
          <div className="trust-grid">
            <div className="trust-item">
              <h3>Snelle service</h3>
              <p>Binnen 24 uur weet u of uw aanvraag wordt goedgekeurd</p>
            </div>
            <div className="trust-item">
              <h3>Transparante voorwaarden</h3>
              <p>Geen verrassingen achteraf, alles helder en duidelijk</p>
            </div>
            <div className="trust-item">
              <h3>Persoonlijk contact</h3>
              <p>Een vaste contactpersoon die uw situatie begrijpt</p>
            </div>
            <div className="trust-item">
              <h3>Flexibele oplossingen</h3>
              <p>Financiering op maat, passend bij uw bedrijf</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


