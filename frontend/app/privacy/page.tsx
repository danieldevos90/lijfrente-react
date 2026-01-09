"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';
import ContactInfo from '../../components/ContactInfo';
import PrivacyEmail from '../../components/PrivacyEmail';

export default function PrivacyPage() {
  const handleCtaClick = () => {
    window.location.href = '/lead';
  };

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <SubpageHero
        title="Privacybeleid"
        subtitle="Laatst bijgewerkt: 6 november 2025"
        backgroundColor="var(--color-bg)"
        iconPath="/icons/SVG/interface/shield.svg"
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
              1. Inleiding
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld (hierna: "GeldGeregeld", "wij" of "ons") hecht veel waarde aan de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij uit welke persoonsgegevens wij verzamelen, waarom wij deze verzamelen, hoe wij deze gebruiken en met wie wij deze delen.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Dit privacybeleid is van toepassing op alle diensten die worden aangeboden via www.geldgeregeld.nl en alle andere websites, applicaties en diensten die door GeldGeregeld worden aangeboden.
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
              2. Wie is verantwoordelijk voor uw gegevens?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld is de verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens:
            </p>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <ContactInfo showKvk={true} showEmail={true} showPhone={true} email="privacy@geldgeregeld.nl" />
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, margin: '1rem 0 0 0' }}>
                Website: www.geldgeregeld.nl
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
              3. Welke gegevens verzamelen wij?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij verzamelen verschillende soorten persoonsgegevens, afhankelijk van hoe u onze diensten gebruikt:
            </p>

            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
              color: 'var(--color-text)',
            }}>
              3.1 Gegevens die u ons verstrekt
            </h3>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Contactgegevens: naam, e-mailadres, telefoonnummer, adres</li>
              <li>Bedrijfsgegevens: bedrijfsnaam, KVK-nummer, BTW-nummer, omzet, sector</li>
              <li>Financiële informatie: gewenst financieringsbedrag, looptijd, gebruiksdoel</li>
              <li>Communicatie: berichten die u ons stuurt via formulieren, e-mail of telefoon</li>
            </ul>

            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
              color: 'var(--color-text)',
            }}>
              3.2 Gegevens die wij automatisch verzamelen
            </h3>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Gebruiksgegevens: pagina's die u bezoekt, klikgedrag, tijd op de website, scrollgedrag</li>
              <li>Technische gegevens: IP-adres (geanonimiseerd), browsertype, apparaattype, besturingssysteem, schermresolutie</li>
              <li>Verkeersgegevens: verwijzende websites, zoektermen, campagne-informatie</li>
              <li>Cookies en vergelijkbare technologieën: analytische cookies, functionele cookies (zie ons <a href="/cookies" style={{ color: 'var(--color-charcoal)', textDecoration: 'underline' }}>Cookiebeleid</a>)</li>
              <li>Google Analytics: wij gebruiken Google Analytics 4 (GA4) voor website-analyse. Uw IP-adres wordt geanonimiseerd voordat verzending naar Google.</li>
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
              4. Waarvoor gebruiken wij uw gegevens?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij gebruiken uw persoonsgegevens voor de volgende doeleinden:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Dienstverlening:</strong> Het bemiddelen bij het vinden van passende financiering</li>
              <li><strong>Communicatie:</strong> Contact opnemen over uw aanvraag en vragen beantwoorden</li>
              <li><strong>Verbetering diensten:</strong> Analyseren van website-gebruik om onze diensten te verbeteren</li>
              <li><strong>Marketing:</strong> Met uw toestemming informeren over nieuwe diensten en aanbiedingen</li>
              <li><strong>Wettelijke verplichtingen:</strong> Voldoen aan wettelijke verplichtingen zoals identificatie- en administratieplicht</li>
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
              5. Juridische grondslag
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij verwerken uw persoonsgegevens op basis van:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Overeenkomst:</strong> Voor het uitvoeren van onze diensten</li>
              <li><strong>Gerechtvaardigd belang:</strong> Voor analyse en verbetering van onze diensten</li>
              <li><strong>Toestemming:</strong> Voor marketing en nieuwsbrieven (altijd vrijwillig en intrekbaar)</li>
              <li><strong>Wettelijke verplichting:</strong> Voor compliance met wet- en regelgeving</li>
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
              6. Met wie delen wij uw gegevens?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij kunnen uw gegevens delen met:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Financieringspartners:</strong> Alleen met uw toestemming, om uw aanvraag te beoordelen</li>
              <li><strong>Dienstverleners:</strong> IT-dienstverleners, hosting providers, e-mailservice providers (Resend), marketing- en analysebureaus (onder strikte contractuele afspraken)</li>
              <li><strong>Google Analytics:</strong> Wij gebruiken Google Analytics 4 voor website-analyse. Google verwerkt gegevens volgens hun privacybeleid. U kunt zich afmelden via cookie-instellingen.</li>
              <li><strong>Overheidsinstanties:</strong> Wanneer wij hiertoe wettelijk verplicht zijn</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij verkopen nooit uw persoonsgegevens aan derden.
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
              7. Hoe lang bewaren wij uw gegevens?
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Actieve klanten:</strong> Gedurende de gehele relatie</li>
              <li><strong>Afgewezen aanvragen:</strong> Maximaal 2 jaar na afwijzing</li>
              <li><strong>Marketing:</strong> Tot u zich afmeldt of na 3 jaar inactiviteit</li>
              <li><strong>Wettelijke bewaartermijnen:</strong> 7 jaar voor administratieve gegevens</li>
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
              8. Uw rechten
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              U heeft de volgende rechten met betrekking tot uw persoonsgegevens:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Inzage:</strong> U kunt opvragen welke gegevens wij van u hebben</li>
              <li><strong>Rectificatie:</strong> U kunt onjuiste gegevens laten corrigeren</li>
              <li><strong>Verwijdering:</strong> U kunt verzoeken om verwijdering van uw gegevens</li>
              <li><strong>Beperking:</strong> U kunt verzoeken om beperking van de verwerking</li>
              <li><strong>Bezwaar:</strong> U kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang</li>
              <li><strong>Dataportabiliteit:</strong> U kunt uw gegevens in een gestructureerd formaat ontvangen</li>
              <li><strong>Intrekken toestemming:</strong> U kunt eerder gegeven toestemming te allen tijde intrekken</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              U kunt uw rechten uitoefenen door contact met ons op te nemen via <PrivacyEmail />. Wij reageren binnen 1 maand op uw verzoek.
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
              9. Beveiliging
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik, ongeautoriseerde toegang, openbaarmaking, wijziging of vernietiging. Dit omvat onder andere:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>SSL-encryptie voor alle gegevensoverdracht</li>
              <li>Regelmatige beveiligingsaudits en updates</li>
              <li>Toegangscontrole en authenticatie</li>
              <li>Bewustwordingstraining voor medewerkers</li>
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
              10. Wijzigingen in dit privacybeleid
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Wij behouden ons het recht voor om wijzigingen aan te brengen in dit privacybeleid. De meest recente versie is altijd beschikbaar op onze website. Belangrijke wijzigingen zullen wij u via e-mail of via een duidelijke melding op de website communiceren.
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
              11. Klachten
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Indien u niet tevreden bent met de manier waarop wij met uw persoonsgegevens omgaan, kunt u contact met ons opnemen via <PrivacyEmail />. U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens (AP):
            </p>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, margin: 0 }}>
                <strong>Autoriteit Persoonsgegevens</strong><br />
                Postbus 93374<br />
                2509 AJ Den Haag<br />
                Telefoon: 088 - 1805 250<br />
                Website: autoriteitpersoonsgegevens.nl
              </p>
            </div>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              12. Contact
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Heeft u vragen over dit privacybeleid of over de verwerking van uw persoonsgegevens? Neem dan contact met ons op:
            </p>
            <div style={{
              background: '#f9f9f8',
              padding: '1.5rem',
              borderRadius: '8px',
            }}>
              <ContactInfo showKvk={true} showEmail={true} showPhone={true} email="privacy@geldgeregeld.nl" />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

