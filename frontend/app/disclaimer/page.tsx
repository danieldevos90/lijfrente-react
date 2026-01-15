"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';
import ContactInfo from '../../components/ContactInfo';

export default function DisclaimerPage() {
  const handleCtaClick = () => {
    window.location.href = '/lead';
  };

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <SubpageHero
        title="Disclaimer"
        subtitle="Laatst bijgewerkt: 6 november 2025"
        backgroundColor="var(--color-bg)"
        iconPath="/icons/SVG/interface/caution.svg"
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
              Algemene informatie
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld (hierna: "GeldGeregeld") streeft ernaar om via deze website accurate, volledige en actuele informatie te verstrekken. Desondanks kunnen er onjuistheden of onvolledigheden in de informatie voorkomen. GeldGeregeld aanvaardt geen aansprakelijkheid voor schade die voortvloeit uit het gebruik van de informatie op deze website.
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
              Geen financieel advies
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              De informatie op deze website is uitsluitend bedoeld voor algemene informatiedoeleinden en vormt geen financieel advies. GeldGeregeld is geen financieel adviseur en geeft geen advies over financiële producten. Voor professioneel financieel advies dient u een gecertificeerde adviseur te raadplegen.
            </p>
            <div style={{
              background: 'var(--color-warning)',
              border: '1px solid var(--color-warning-dark)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1rem',
            }}>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, margin: 0, color: 'var(--color-warning-dark)' }}>
                <strong>⚠️ Let op:</strong> Lenen kost geld. Een krediet of financiering dient u alleen aan te gaan als u zeker weet dat u aan uw betalingsverplichtingen kunt voldoen. Raadpleeg altijd uw eigen adviseur voordat u een financiële beslissing neemt.
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
              Bemiddelingsrol
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld treedt uitsluitend op als bemiddelaar tussen ondernemers en financiers. GeldGeregeld:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Verstrekt zelf geen krediet of financiering</li>
              <li>Neemt geen kredietbeslis singen</li>
              <li>Staat niet in voor de kwaliteit of betrouwbaarheid van financiers</li>
              <li>Is niet verantwoordelijk voor de voorwaarden die door financiers worden gesteld</li>
              <li>Garandeert niet dat een financiering tot stand komt</li>
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
              Geen garanties
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld geeft geen garanties met betrekking tot:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li><strong>Goedkeuring:</strong> Het wordt goedgekeurd van een financieringsaanvraag</li>
              <li><strong>Voorwaarden:</strong> De specifieke voorwaarden, rente of kosten van een financiering</li>
              <li><strong>Doorlooptijd:</strong> De tijd die nodig is om een aanbod te ontvangen</li>
              <li><strong>Financieringsbedrag:</strong> Het bedrag dat daadwerkelijk wordt toegekend</li>
              <li><strong>Beschikbaarheid:</strong> De continue beschikbaarheid van onze diensten of de website</li>
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
              Voorbeelden en illustraties
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Alle voorbeelden, berekeningen en illustraties op deze website zijn indicatief en dienen uitsluitend ter illustratie. Deze voorbeelden zijn gebaseerd op aannames en kunnen afwijken van de werkelijke situatie. Aan voorbeelden kunnen geen rechten worden ontleend.
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
              Externe links
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze website kan links bevatten naar externe websites van derden. GeldGeregeld heeft geen controle over de inhoud of werking van deze externe websites en aanvaardt geen verantwoordelijkheid voor:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>De inhoud van externe websites</li>
              <li>Het privacybeleid van externe websites</li>
              <li>De beschikbaarheid van externe websites</li>
              <li>Schade voortvloeiend uit het gebruik van externe websites</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Het gebruik van externe links is geheel op eigen risico.
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
              Technische aspecten
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld spant zich in om de website te allen tijde beschikbaar te houden, maar kan niet garanderen dat de website altijd:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Ononderbroken beschikbaar is</li>
              <li>Vrij is van fouten, bugs of virussen</li>
              <li>Veilig is tegen ongeautoriseerde toegang of cyberaanvallen</li>
              <li>Compatibel is met alle browsers en apparaten</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld is niet aansprakelijk voor schade die voortvloeit uit technische storingen, onderbrekingen of beveiligingsincidenten.
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
              Intellectueel eigendom
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Alle content op deze website, inclusief maar niet beperkt tot teksten, afbeeldingen, logo's, iconen en software, is eigendom van GeldGeregeld of haar licentiegevers en wordt beschermd door auteursrecht en andere intellectuele eigendomsrechten.
            </p>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Het is niet toegestaan om zonder voorafgaande schriftelijke toestemming content van deze website te kopiëren, te verveelvoudigen, te verspreiden of openbaar te maken.
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
              Beperking van aansprakelijkheid
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld is niet aansprakelijk voor enige directe of indirecte schade, inclusief maar niet beperkt tot:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Financiële verliezen</li>
              <li>Gederfde winst of inkomsten</li>
              <li>Verlies van gegevens</li>
              <li>Reputatieschade</li>
              <li>Gevolgschade van welke aard dan ook</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Deze beperking van aansprakelijkheid geldt voor zover wettelijk toegestaan.
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
              Wijzigingen
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              GeldGeregeld behoudt zich het recht voor om:
            </p>
            <ul style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            }}>
              <li>Deze disclaimer te allen tijde te wijzigen</li>
              <li>Informatie op de website te wijzigen of te verwijderen</li>
              <li>Diensten te wijzigen of te beëindigen</li>
              <li>De website tijdelijk of permanent buiten gebruik te stellen</li>
            </ul>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Door gebruik te blijven maken van deze website na wijzigingen, gaat u akkoord met de gewijzigde disclaimer.
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
              Toepasselijk recht
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Op deze disclaimer is Nederlands recht van toepassing. Geschillen voortvloeiend uit of verband houdend met deze disclaimer worden voorgelegd aan de bevoegde rechter in Amsterdam.
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
              Contact
            </h2>
            <p style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}>
              Heeft u vragen over deze disclaimer? Neem dan contact met ons op:
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

