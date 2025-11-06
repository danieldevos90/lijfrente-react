"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';

export default function CookiesPage() {
  const handleCtaClick = () => {
    window.location.href = '/lead';
  };

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <SubpageHero
        title="Cookiebeleid"
        subtitle="Laatst bijgewerkt: 6 november 2025"
        backgroundColor="var(--color-bg)"
        iconPath="/icons/SVG/interface/cookie.svg"
      />
      
      <main style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 2rem 6rem',
        }}>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Wat zijn cookies?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden geplaatst wanneer u een website bezoekt. Cookies worden veel gebruikt om websites te laten werken of om ze efficiënter te laten werken, en om informatie te verstrekken aan de eigenaren van de website.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld B.V. (hierna: "GeldGeregeld") maakt gebruik van cookies en vergelijkbare technologieën op www.geldgeregeld.nl. In dit cookiebeleid leggen wij uit welke cookies wij gebruiken en waarvoor.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Waarom gebruiken wij cookies?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij gebruiken cookies voor verschillende doeleinden:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Om onze website goed te laten functioneren</li>
              <li>Om uw ervaring op onze website te verbeteren</li>
              <li>Om te analyseren hoe onze website wordt gebruikt</li>
              <li>Om relevante informatie en advertenties te kunnen tonen</li>
              <li>Om fraude te voorkomen en de website veilig te houden</li>
            </ul>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Welke soorten cookies gebruiken wij?
            </h2>

            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
              color: 'var(--color-text)',
            }}>
              1. Strikt noodzakelijke cookies
            </h3>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze cookies zijn essentieel voor het functioneren van de website. Zonder deze cookies kan de website niet goed werken. Deze cookies slaan geen persoonlijk identificeerbare informatie op.
            </p>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Voorbeelden:</strong> Sessiecookies, cookievoorkeuren, beveiligingscookies
              </p>
            </div>

            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
              color: 'var(--color-text)',
            }}>
              2. Functionele cookies
            </h3>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze cookies stellen de website in staat om uitgebreide functionaliteit en personalisatie te bieden. Ze kunnen worden ingesteld door ons of door externe partijen waarvan wij hun diensten hebben toegevoegd aan onze pagina's.
            </p>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Voorbeelden:</strong> Taalvoorkeuren, formuliergegevens, live chat
              </p>
            </div>

            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
              color: 'var(--color-text)',
            }}>
              3. Analytische cookies
            </h3>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze cookies helpen ons te begrijpen hoe bezoekers met onze website omgaan door informatie te verzamelen en te rapporteren. Alle informatie die deze cookies verzamelen is geaggregeerd en daarom anoniem.
            </p>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Voorbeelden:</strong> Google Analytics, heatmaps, paginaweergaven, bezoekduur
              </p>
            </div>

            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
              color: 'var(--color-text)',
            }}>
              4. Marketing cookies
            </h3>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze cookies worden gebruikt om bezoekers te volgen bij het bezoeken van verschillende websites. Het doel is advertenties weer te geven die relevant en aantrekkelijk zijn voor de individuele gebruiker.
            </p>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--color-text-muted)' }}>
                <strong>Voorbeelden:</strong> Google Ads, Facebook Pixel, LinkedIn Insight Tag, remarketing
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Specifieke cookies die wij gebruiken
            </h2>
            
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr style={{ background: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Cookie</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Doel</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Bewaartermijn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>_ga</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>Google Analytics - gebruikersanalyse</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>2 jaar</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>_gid</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>Google Analytics - sessie-identificatie</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>24 uur</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>cookieconsent</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>Opslaan van cookievoorkeuren</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9375rem' }}>1 jaar</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontSize: '0.9375rem' }}>PHPSESSID</td>
                    <td style={{ padding: '1rem', fontSize: '0.9375rem' }}>Sessiebeveiliging</td>
                    <td style={{ padding: '1rem', fontSize: '0.9375rem' }}>Sessie</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Cookies van derden
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Naast onze eigen cookies kunnen wij ook cookies van derden gebruiken. Wij werken samen met de volgende externe partijen:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Google Analytics:</strong> Voor websitestatistieken en gebruikersgedrag</li>
              <li><strong>Google Ads:</strong> Voor advertenties en conversietracking</li>
              <li><strong>LinkedIn:</strong> Voor zakelijke advertenties en analytics</li>
              <li><strong>Facebook:</strong> Voor social media integratie en advertenties</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze externe partijen kunnen cookies plaatsen die buiten onze controle vallen. Wij raden u aan de privacyverklaringen van deze partijen te raadplegen voor meer informatie over hoe zij met uw gegevens omgaan.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Uw toestemming en keuzes
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Bij uw eerste bezoek aan onze website vragen wij u toestemming voor het plaatsen van cookies, met uitzondering van strikt noodzakelijke cookies. U kunt uw toestemming te allen tijde intrekken door:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>De cookie-instellingen op onze website aan te passen</li>
              <li>Cookies in uw browser te verwijderen</li>
              <li>Uw browserinstellingen aan te passen om cookies te weigeren</li>
            </ul>
            <div style={{
              background: '#fcf8d8',
              border: '1px solid #5e5515',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, margin: 0, color: '#5e5515' }}>
                <strong>Let op:</strong> Als u cookies uitschakelt, is het mogelijk dat bepaalde delen van de website niet goed werken.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Cookies verwijderen
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              U kunt cookies die al op uw apparaat zijn geplaatst te allen tijde verwijderen via uw browserinstellingen:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies en andere sitegegevens</li>
              <li><strong>Firefox:</strong> Opties → Privacy en beveiliging → Cookies en sitegegevens</li>
              <li><strong>Safari:</strong> Voorkeuren → Privacy → Websitegegevens beheren</li>
              <li><strong>Edge:</strong> Instellingen → Privacy, zoeken en diensten → Browsegegevens wissen</li>
            </ul>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Meer informatie over cookies
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Voor meer informatie over cookies en uw privacy kunt u de volgende websites bezoeken:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><a href="https://www.consumentenbond.nl/internet-privacy/cookies" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-charcoal)', textDecoration: 'underline' }}>Consumentenbond over cookies</a></li>
              <li><a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-charcoal)', textDecoration: 'underline' }}>Autoriteit Persoonsgegevens</a></li>
              <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-charcoal)', textDecoration: 'underline' }}>All About Cookies</a></li>
            </ul>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Wijzigingen in dit cookiebeleid
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij kunnen dit cookiebeleid van tijd tot tijd aanpassen. De meest recente versie is altijd beschikbaar op deze pagina. Belangrijke wijzigingen zullen wij op de website communiceren.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Vragen?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Heeft u vragen over ons gebruik van cookies? Neem dan contact met ons op:
            </p>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, margin: 0 }}>
                <strong>GeldGeregeld B.V.</strong><br />
                E-mail: privacy@geldgeregeld.nl<br />
                Telefoon: 020-1234567<br />
                Post: Herengracht 282, 1016 BX Amsterdam
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

