"use client";

import React, { useState } from 'react';
import TwoColumnSupport from '../../components/TwoColumnSupport';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';

export default function TwoColumnSupportExample() {
  const testimonials = [
    {
      name: 'Sarah van der Berg',
      role: 'Eigenaar Café de Hoek',
      text: 'Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte. Het team dacht mee en bood flexibele oplossingen.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Mark Jansen',
      role: 'Directeur Transport BV',
      text: 'Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als MKB nodig hebben. Binnen 48 uur hadden we de financiering rond.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    {
      name: 'Lisa Vermeulen',
      role: 'Oprichter Webshop Groen',
      text: 'Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden. Geen verrassingen, alleen oplossingen.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  ];

  const [current, setCurrent] = useState(0);

  const handlePrevious = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <>
      <TransparentHeader />
      
      {/* Hero Section */}
      <section style={{
        height: '60vh',
        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            Two Column Support Section
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
          }}>
            Support info + testimonials met carousel functionaliteit
          </p>
        </div>
      </section>

      {/* Two Column Support Component */}
      <TwoColumnSupport
        leftTitle="Betrouwbare ondersteuning"
        leftDescription="Krijg 24/7 ondersteuning van GeldGeregeld. Ons toegewijde klantenserviceteam staat voor u klaar om te helpen, dag en nacht, zodat uw financieel beheer probleemloos en efficiënt verloopt."
        leftButtonLabel="Neem contact op"
        leftButtonUrl="#contact"
        leftBackgroundColor="#bfdbfe"
        testimonialName={testimonials[current].name}
        testimonialRole={testimonials[current].role}
        testimonialText={testimonials[current].text}
        testimonialImage={testimonials[current].image}
        showCarousel={true}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* Example without carousel */}
      <TwoColumnSupport
        leftTitle="Persoonlijke begeleiding"
        leftDescription="Een dedicated adviseur begeleidt u door het hele proces, van aanvraag tot uitbetaling. We zijn er om uw vragen te beantwoorden en u te helpen de juiste keuzes te maken."
        leftButtonLabel="Plan een gesprek"
        leftButtonUrl="#plan"
        leftBackgroundColor="#d7d0ff"
        testimonialName="Johan Peters"
        testimonialRole="CEO Bouwbedrijf Solid"
        testimonialText="De persoonlijke aanpak van GeldGeregeld maakte het verschil. Ze namen de tijd om onze situatie te begrijpen en kwamen met een oplossing op maat."
        showCarousel={false}
      />

      {/* Example with different color */}
      <TwoColumnSupport
        leftTitle="Flexibele voorwaarden"
        leftDescription="Looptijd en voorwaarden volledig op maat van uw bedrijf en situatie. Geen standaard pakketten, maar maatwerk dat past bij uw ambities en mogelijkheden."
        leftButtonLabel="Ontdek de mogelijkheden"
        leftButtonUrl="#mogelijkheden"
        leftBackgroundColor="#bbe7be"
        testimonialName="Emma de Vries"
        testimonialRole="Eigenaar Bloemenwinkel Rosé"
        testimonialText="De flexibiliteit in de terugbetaling heeft mij enorm geholpen. In drukke periodes betaal ik meer, in rustige periodes minder. Perfect voor een seizoensgebonden bedrijf."
        showCarousel={false}
      />

      <Footer />
    </>
  );
}



