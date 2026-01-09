"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';
import ContactInfo from '../../components/ContactInfo';
import KvkNumber from '../../components/KvkNumber';

export default function TermsPage() {
  const handleCtaClick = () => {
    window.location.href = '/lead';
  };

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <SubpageHero
        title="Algemene Voorwaarden"
        subtitle="Laatst bijgewerkt: 6 november 2025"
        backgroundColor="var(--color-bg)"
        iconPath="/icons/SVG/interface/doc.svg"
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
              1. Definities
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              In deze algemene voorwaarden worden de volgende termen met een hoofdletter gebruikt:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>GeldGeregeld:</strong> GeldGeregeld, gevestigd te Amsterdam, KVK-nummer <KvkNumber />, de aanbieder van bemiddelingsdiensten</li>
              <li><strong>Klant:</strong> De natuurlijke persoon of rechtspersoon die gebruik maakt of wil maken van de diensten van GeldGeregeld</li>
              <li><strong>Diensten:</strong> Alle diensten die door GeldGeregeld worden aangeboden, inclusief maar niet beperkt tot bemiddeling bij zakelijke financiering</li>
              <li><strong>Financier:</strong> De derde partij die de daadwerkelijke financiering verstrekt</li>
              <li><strong>Website:</strong> www.geldgeregeld.nl en alle onderliggende pagina's</li>
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
              2. Toepasselijkheid
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              2.1 Deze algemene voorwaarden zijn van toepassing op alle diensten die door GeldGeregeld worden aangeboden, tenzij uitdrukkelijk schriftelijk anders is overeengekomen.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              2.2 Door gebruik te maken van onze diensten of door het indienen van een aanvraag, verklaart de Klant zich akkoord met deze algemene voorwaarden.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              2.3 De toepasselijkheid van eventuele inkoop- of andere voorwaarden van de Klant wordt uitdrukkelijk van de hand gewezen.
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
              3. Dienstverlening
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              3.1 GeldGeregeld bemiddelt tussen Klanten en Financiers met als doel passende zakelijke financiering te vinden.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              3.2 GeldGeregeld verstrekt zelf geen krediet of financiering. De daadwerkelijke financiering wordt verstrekt door onafhankelijke Financiers.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              3.3 GeldGeregeld spant zich in om passende financieringsopties te vinden, maar kan geen garanties geven over:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Het vinden van een Financier die bereid is financiering te verstrekken</li>
              <li>De voorwaarden waaronder financiering wordt aangeboden</li>
              <li>De termijn waarbinnen een aanbod wordt gedaan</li>
              <li>De hoogte van de rente of andere kosten van de Financier</li>
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
              4. Aanvraagproces
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              4.1 De Klant dient een aanvraag in via de Website of via andere door GeldGeregeld aangeboden kanalen.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              4.2 De Klant is verplicht alle gevraagde informatie volledig en naar waarheid te verstrekken. GeldGeregeld mag ervan uitgaan dat alle verstrekte informatie juist en volledig is.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              4.3 Bij onjuiste of onvolledige informatie behoudt GeldGeregeld zich het recht voor om de aanvraag te weigeren of de overeenkomst te ontbinden.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              4.4 Na ontvangst van de aanvraag zal GeldGeregeld deze beoordelen en, indien geschikt, voorleggen aan één of meerdere Financiers.
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
              5. Verplichtingen van de Klant
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              5.1 De Klant verplicht zich om:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Alle door GeldGeregeld gevraagde informatie en documenten tijdig en volledig te verstrekken</li>
              <li>Wijzigingen in de verstrekte informatie onmiddellijk te melden</li>
              <li>Mee te werken aan het verkrijgen van aanvullende informatie indien nodig</li>
              <li>De diensten niet te gebruiken voor onwettige doeleinden</li>
              <li>Geen misleidende of valse informatie te verstrekken</li>
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
              6. Kosten en betaling
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              6.1 De diensten van GeldGeregeld zijn voor de Klant kosteloos, tenzij uitdrukkelijk anders overeengekomen.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              6.2 GeldGeregeld ontvangt een vergoeding van de Financier indien een financiering tot stand komt. Deze vergoeding is niet ten laste van de Klant.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              6.3 Indien aanvullende diensten worden aangeboden waarvoor kosten in rekening worden gebracht, zal dit vooraf duidelijk worden gecommuniceerd en alleen na expliciete toestemming van de Klant worden uitgevoerd.
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
              7. Aansprakelijkheid
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              7.1 GeldGeregeld is niet aansprakelijk voor schade die voortvloeit uit:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Het niet tot stand komen van een financiering</li>
              <li>De voorwaarden die door een Financier worden gesteld</li>
              <li>Het handelen of nalaten van een Financier</li>
              <li>Onjuiste of onvolledige informatie verstrekt door de Klant</li>
              <li>Technische storingen of onderbrekingen van de Website</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              7.2 Indien GeldGeregeld aansprakelijk is voor schade, is deze aansprakelijkheid beperkt tot het bedrag dat in het betreffende geval door de aansprakelijkheidsverzekering wordt uitbetaald, dan wel tot het bedrag van de door GeldGeregeld ontvangen vergoeding voor de betreffende dienstverlening, met een maximum van €5.000.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              7.3 GeldGeregeld is uitsluitend aansprakelijk voor directe schade. Iedere aansprakelijkheid voor indirecte schade, gevolgschade, gederfde winst, gemiste besparingen en schade door bedrijfsstagnatie is uitgesloten.
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
              8. Intellectueel eigendom
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              8.1 Alle intellectuele eigendomsrechten met betrekking tot de Website en de diensten berusten bij GeldGeregeld of haar licentiegevers.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              8.2 Het is niet toegestaan om zonder voorafgaande schriftelijke toestemming van GeldGeregeld:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Inhoud van de Website te kopiëren, te verveelvoudigen of openbaar te maken</li>
              <li>Het logo, handelsnaam of andere merken van GeldGeregeld te gebruiken</li>
              <li>Delen van de Website te extraheren of hergebruiken</li>
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
              9. Privacy en gegevensbescherming
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              9.1 GeldGeregeld verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              9.2 Voor meer informatie over hoe wij omgaan met uw persoonsgegevens, verwijzen wij naar ons <a href="/privacy" style={{ color: 'var(--color-charcoal)', textDecoration: 'underline' }}>Privacybeleid</a>.
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
              10. Wijziging van voorwaarden
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              10.1 GeldGeregeld behoudt zich het recht voor deze algemene voorwaarden te wijzigen.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              10.2 Wijzigingen worden minimaal 30 dagen voor inwerkingtreding op de Website gepubliceerd en per e-mail gecommuniceerd aan bestaande Klanten.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              10.3 Indien de Klant niet akkoord gaat met de wijzigingen, kan deze de overeenkomst opzeggen.
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
              11. Beëindiging
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              11.1 Beide partijen kunnen de overeenkomst te allen tijde beëindigen door schriftelijke kennisgeving.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              11.2 GeldGeregeld kan de overeenkomst met onmiddellijke ingang beëindigen indien:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>De Klant onjuiste of misleidende informatie heeft verstrekt</li>
              <li>De Klant in strijd handelt met deze algemene voorwaarden</li>
              <li>De Klant de diensten gebruikt voor onwettige doeleinden</li>
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
              12. Geschillen en toepasselijk recht
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              12.1 Op deze algemene voorwaarden en alle daaruit voortvloeiende overeenkomsten is Nederlands recht van toepassing.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              12.2 Alle geschillen voortvloeiend uit of verband houdend met deze algemene voorwaarden worden voorgelegd aan de bevoegde rechter in Amsterdam, tenzij de wet dwingend anders voorschrijft.
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
              13. Contact
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen:
            </p>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}>
              <ContactInfo showEmail={true} showPhone={true} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

