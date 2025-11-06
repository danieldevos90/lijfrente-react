import dynamic from 'next/dynamic';
import Logo from '../components/Logo';

// Section Components
import HeroSection from '../components/sections/HeroSection';
import TrustSection from '../components/sections/TrustSection';
import ContentSection from '../components/sections/ContentSection';
import ServicesSection from '../components/sections/ServicesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';

const StickyCTA = dynamic(() => import('../components/StickyCTA'), { ssr: false });

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Background Image */}
      <HeroSection
        badge="Snel & Transparant"
        title="Zakelijke financiering zonder gedoe"
        subtitle="Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk."
        ctaLabel="Start aanvraag"
        ctaHref="/lead"
        variant="image"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop"
      />

      {/* Trust Badges */}
      <TrustSection
        badges={[
          { icon: "✓", text: "Gecertificeerd en betrouwbaar" },
          { icon: "⚡", text: "Binnen 24 uur inzicht" },
          { icon: "🔒", text: "100% transparant" },
          { icon: "📋", text: "Geen papieren gedoe" }
        ]}
      />

      {/* Content Section */}
      <ContentSection
        title="Zakelijke financiering die écht werkt"
        content="Geen ingewikkelde procedures, geen verrassingen achteraf. Gewoon duidelijke afspraken en snelle service. Wij begrijpen dat ondernemers snel willen handelen en daarom zorgen wij voor een proces dat net zo dynamisch is als jouw bedrijf."
        layout="image-right"
        ctaLabel="Lees meer"
        ctaHref="/over-ons"
        background="gray"
      />

      {/* Services Section */}
      <ServicesSection
        title="Waar begin ik?"
        subtitle="De eerste stap is vaak het moeilijkst. Wij maken het je gemakkelijk."
        services={[
          { 
            icon: "💼", 
            title: "Ik ben werkgever", 
            description: "Financiering voor bedrijfsuitgaven en groei van je team",
            href: "/werkgever"
          },
          { 
            icon: "🏢", 
            title: "Ik heb een bedrijf", 
            description: "Zakelijke leningen en kredietfaciliteiten op maat",
            href: "/zakelijk"
          },
          { 
            icon: "👔", 
            title: "Ik ben ondernemer", 
            description: "Financiering voor zelfstandigen en DGA's",
            href: "/ondernemer"
          },
          { 
            icon: "🎯", 
            title: "Ik wil investeren", 
            description: "Investeren in de toekomst van je bedrijf",
            href: "/investeren"
          }
        ]}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Bekijk wat anderen zeggen"
        testimonials={[
          {
            name: "Petra Jongkind",
            company: "Eco Film B.V.",
            text: "Supersnelle service en heldere communicatie. Binnen een dag wisten we waar we aan toe waren.",
            rating: 5
          },
          {
            name: "Simone Brandt",
            company: "Creative Solutions",
            text: "Eindelijk een financieringspartner die begrijpt wat ondernemers nodig hebben. Aanrader!",
            rating: 5
          }
        ]}
      />

      {/* CTA Section */}
      <CTASection
        title="Klaar om te starten?"
        subtitle="Vraag binnen 2 minuten je zakelijke financiering aan"
        ctaLabel="Start je aanvraag nu"
        ctaHref="/lead"
        background="dark"
      />

      {/* Sticky CTA with Drawer */}
      <StickyCTA label="⚡ Aanvraag starten" useDrawer={true} />
    </div>
  );
}


