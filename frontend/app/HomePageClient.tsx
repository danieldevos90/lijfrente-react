"use client";
import React, { useState, useEffect } from 'react';
import TransparentHeaderClient from '../components/TransparentHeaderClient';
import { StrapiNavigationItem } from '@/types/strapi-cms';
import Footer from '../components/Footer';
import HowItWorksBento from '../components/HowItWorksBento';
import BenefitsCarousel from '../components/BenefitsCarousel';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import FeatureSection from '../components/FeatureSection';
import { useWidget } from '../components/GlobalWidgetProvider';
import { ArrowRight } from 'lucide-react';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// This is the fallback client component with hardcoded content
export default function HomePageClient() {
  const { openDrawer } = useWidget();
  const [navItems, setNavItems] = useState<StrapiNavigationItem[]>([]);

  // Fetch navigation from Strapi via API route (server-side proxy)
  useEffect(() => {
    async function fetchNav() {
      try {
        const response = await fetch(`/api/strapi/navigation?siteId=${SITE_ID}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch navigation: ${response.status}`);
        }
        const data = await response.json();
        // Handle Strapi response format
        const items = data?.data || [];
        setNavItems(items || []);
      } catch (error) {
        console.error('Error fetching navigation:', error);
        // Fallback to empty array on error
        setNavItems([]);
      }
    }
    fetchNav();
  }, []);
  
  const testimonials = [
    {
      name: 'Sarah van der Berg',
      role: 'Eigenaar Café de Hoek',
      text: 'Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte.',
      image: '/images/pexels-ketut-subiyanto-4559683.jpg',
    },
    {
      name: 'Mark Jansen',
      role: 'Directeur Transport BV',
      text: 'Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als MKB nodig hebben.',
      image: '/images/pexels-yankrukov-4458386.jpg',
    },
    {
      name: 'Lisa Vermeulen',
      role: 'Oprichter Webshop Groen',
      text: 'Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden.',
      image: '/images/pexels-amina-filkins-5414025.jpg',
    },
  ];

  const benefits = [
    { 
      iconPath: '/icons/SVG/interface/zap.svg',
      title: 'Binnen 24 uur', 
      desc: 'Aanvraag binnen 2 minuten. Aanbod binnen 24 uur. Sneller dan traditionele banken.',
      color: '#fff2b2',
      textColor: '#5e5515'
    },
    { 
      iconPath: '/icons/SVG/interface/shield.svg',
      title: 'Geen verborgen kosten', 
      desc: 'Transparante voorwaarden. Boetevrij vervroegd aflossen. Geen opstartkosten.',
      color: '#bbe7be',
      textColor: '#114e0b'
    },
    { 
      iconPath: '/icons/SVG/interface/clock.svg',
      title: 'Flexibel aflossen', 
      desc: 'Flexibele looptijd van 3 tot 36 maanden. Pas aan op basis van je cashflow.',
      color: '#aad5fc',
      textColor: '#0f1720'
    },
    { 
      iconPath: '/icons/SVG/finance/trend-up.svg',
      title: 'Tot €500.000', 
      desc: 'Van kleine investeringen tot grote groeiplannen. Financiering op maat.',
      color: '#d7d0ff',
      textColor: '#3b0b0b'
    },
    { 
      iconPath: '/icons/SVG/interface/user-add.svg',
      title: 'Persoonlijk advies', 
      desc: 'Vaste contactpersoon via telefoon, e-mail of chat. Geen wachtlijnen.',
      color: '#f8e4e4',
      textColor: '#3b0b0b'
    },
    { 
      iconPath: '/icons/SVG/interface/trophy.svg',
      title: 'Zonder onderpand', 
      desc: 'Geen zakelijke zekerheden vereist. Ook als de bank je heeft afgewezen.',
      color: '#fcf8d8',
      textColor: '#5e5515'
    },
  ];

  return (
    <>
      <TransparentHeaderClient 
        navItems={navItems}
        onCtaClick={() => openDrawer('header')} 
        transparent={true} 
        textColor="white" 
      />
      
      {/* Hero Section */}
      <section id="hero" style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(15, 23, 32, 0.5), rgba(15, 23, 32, 0.5)), url('/images/pexels-ketut-subiyanto-4473496.jpg') center/cover`,
        backgroundAttachment: 'fixed',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 500,
            marginBottom: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            Zakelijke financiering binnen 24 uur.<br />
            Geen gedoe met de bank.
          </h1>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginTop: '3rem',
          }}>
            <button style={{
              border: 'none',
              backgroundColor: '#000000',
              color: 'white',
              textAlign: 'center',
              borderRadius: '10rem',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '14rem',
              padding: '1.5rem 3rem',
              fontFamily: 'Public Sans Variable, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: '1rem',
              transition: 'all .28s',
              display: 'flex',
              cursor: 'pointer',
            }}
            onClick={() => openDrawer('hero_primary')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
            }}>
              Start aanvraag
            </button>
            
            <button style={{
              border: 'none',
              backgroundColor: 'white',
              color: '#0f1720',
              textAlign: 'center',
              borderRadius: '10rem',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '14rem',
              padding: '1.5rem 3rem',
              fontFamily: 'Public Sans Variable, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: '1rem',
              transition: 'all .28s',
              display: 'flex',
              cursor: 'pointer',
            }}
            onClick={() => openDrawer('hero_secondary')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              Bereken je lening
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Carousel Section */}
      <BenefitsCarousel benefits={benefits} />

      {/* Feature Section with Image */}
      <FeatureSection 
        title="Flexibele aflossing op jouw voorwaarden"
        description="Kies zelf wanneer je aflost. Geen vaste maandlasten, maar flexibiliteit die past bij jouw cashflow. Boetevrij vervroegd aflossen mogelijk wanneer het jou uitkomt."
        buttonText="Meer informatie"
        onButtonClick={() => openDrawer('feature_section')}
        imagePath="/images/pexels-tima-miroshnichenko-5198239.jpg"
        imagePosition="left"
        backgroundColor="white"
      />

      {/* Testimonials Carousel Section */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* How It Works Section - Bento Grid */}
      <HowItWorksBento />

      {/* CTA Section */}
      <section id="cta" style={{
        background: 'var(--color-charcoal)',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 500,
            marginBottom: '1rem',
            color: 'white',
          }}>
            Zakelijke lening aanvragen?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2rem',
            lineHeight: 1.5,
          }}>
            Binnen 2 minuten aangevraagd. Aanbod binnen 24 uur.
          </p>
          <button style={{
            border: 'none',
            backgroundColor: 'white',
            color: '#0f1720',
            textAlign: 'center',
            borderRadius: '10rem',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '14rem',
            padding: '1.5rem 3rem',
            fontFamily: 'Public Sans Variable, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '1rem',
            transition: 'all .28s',
            display: 'inline-flex',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={() => openDrawer('cta_bottom')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}>
            Start je aanvraag nu
            <ArrowRight size={20} />
          </button>
    </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 480px) {
          #hero {
            padding: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}

