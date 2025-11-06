"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';
import AnimatedStatsCards from '../../components/AnimatedStatsCards';
import ProcessSteps from '../../components/ProcessSteps';
import WhyChooseSection from '../../components/WhyChooseSection';
import CTASection from '../../components/CTASection';
import { useWidget } from '../../components/GlobalWidgetProvider';

export default function HoeWerktHetPage() {
  const { openDrawer } = useWidget();
  
  const handleCtaClick = () => {
    openDrawer('hoe_werkt_het_page');
  };

  const steps = [
    {
      number: '01',
      title: 'Aanvraag indienen',
      description: 'Vul in 2 minuten het online formulier in met uw bedrijfsgegevens en financieringswens.',
      details: [
        'Geen uitgebreide documentatie nodig',
        'Volledig online en veilig',
        'Geen verplichtingen',
      ],
      imagePath: '/images/pexels-ketut-subiyanto-4473496.jpg',
    },
    {
      number: '02',
      title: 'Beoordeling',
      description: 'Wij analyseren uw aanvraag en selecteren de meest geschikte financieringspartners.',
      details: [
        'Automatische matching met partners',
        'Beoordeling binnen 1 werkdag',
        'Persoonlijk contactmoment',
      ],
      imagePath: '/images/pexels-tima-miroshnichenko-6693637.jpg',
    },
    {
      number: '03',
      title: 'Aanbod ontvangen',
      description: 'Ontvang binnen 24 uur meerdere aanbiedingen van verschillende financiers.',
      details: [
        'Duidelijk overzicht van voorwaarden',
        'Vergelijk rente en looptijden',
        'Geen verrassingen',
      ],
      imagePath: '/images/pexels-amina-filkins-5414025.jpg',
    },
    {
      number: '04',
      title: 'Financiering regelen',
      description: 'Kies het beste aanbod en wij regelen de rest. Het geld staat snel op uw rekening.',
      details: [
        'Hulp bij het maken van de juiste keuze',
        'Snelle afhandeling',
        'Uitbetaling binnen enkele dagen',
      ],
      imagePath: '/images/pexels-ketut-subiyanto-4559683.jpg',
    },
  ];

  const benefits = [
    {
      title: 'Snel proces',
      description: 'Van aanvraag tot uitbetaling in enkele dagen. Geen lange wachttijden of eindeloze procedures.',
      iconPath: '/icons/SVG/interface/zap.svg',
      color: '#fff2b2',
      textColor: '#5e5515'
    },
    {
      title: 'Persoonlijke begeleiding',
      description: 'Een vaste contactpersoon gedurende het hele proces. Altijd bereikbaar voor uw vragen.',
      iconPath: '/icons/SVG/interface/user-add.svg',
      color: '#f8e4e4',
      textColor: '#3b0b0b'
    },
    {
      title: 'Transparant',
      description: 'Duidelijke voorwaarden en kosten. Geen verborgen kosten of verrassingen achteraf.',
      iconPath: '/icons/SVG/interface/shield.svg',
      color: '#bbe7be',
      textColor: '#114e0b'
    },
  ];

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      <main style={{
        minHeight: '100vh',
        background: '#ffffff',
      }}>
        <SubpageHero
          title="Hoe werkt het?"
          subtitle="Van aanvraag tot uitbetaling in 4 eenvoudige stappen. Wij maken zakelijke financiering toegankelijk, transparant en snel."
          iconPath="/icons/SVG/interface/bulb.svg"
          backgroundColor="#f9f9f8"
        />

        <AnimatedStatsCards />

        <ProcessSteps steps={steps} />

        <WhyChooseSection benefits={benefits} />

        <CTASection
          title="Klaar om te starten?"
          description="Dien binnen 2 minuten uw aanvraag in en ontvang binnen 24 uur een aanbod op maat"
          buttonText="Start uw aanvraag"
          onButtonClick={handleCtaClick}
        />
      </main>

      <Footer />
    </>
  );
}
