import dynamic from 'next/dynamic';
import Logo from '../components/Logo';

const StickyCTA = dynamic(() => import('../components/StickyCTA'), { ssr: false });

export default function HomePage() {
  return (
    <div className="homepage-minimal">
      <section className="hero-minimal">
        <div className="container">
          <div className="hero-content-minimal">
            <Logo size={64} showText={true} />
            <h1>Zakelijke Financiering Snel Geregeld</h1>
            <p className="hero-lead">Krijg binnen 24 uur duidelijkheid over uw zakelijke lening. Simpel, snel en transparant.</p>
            
            <div className="hero-features-list">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Binnen 24 uur reactie</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Transparante voorwaarden</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Geen verborgen kosten</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>Voor elke ondernemer</h3>
              <p>Van ZZP'er tot MKB, wij helpen u verder met passende financiering</p>
            </div>
            <div className="info-card">
              <h3>Snel en eenvoudig</h3>
              <p>Vul het formulier in en ontvang binnen 24 uur een vrijblijvende offerte</p>
            </div>
            <div className="info-card">
              <h3>Persoonlijk advies</h3>
              <p>Onze specialisten denken graag met u mee over de beste oplossing</p>
            </div>
          </div>
        </div>
      </section>
      
      <StickyCTA label="⚡ Aanvraag starten" useDrawer={true} />
    </div>
  );
}


