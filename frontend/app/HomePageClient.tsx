"use client";
import React, { useState, useEffect } from 'react';
import TransparentHeaderClient from '../components/TransparentHeaderClient';
import { StrapiNavigationItem } from '@/types/strapi-cms';
import Footer from '../components/Footer';
import HowItWorksBento from '../components/HowItWorksBento';
import BenefitsCarousel from '../components/BenefitsCarousel';
import TestimonialsGrid from '../components/TestimonialsGrid';
// Removed static testimonials import - using only Strapi data
import FeatureSection from '../components/FeatureSection';
import { useWidget } from '../components/GlobalWidgetProvider';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getHeroSubtitleVariant, getHeroButtonVariant } from '@/lib/hero-ab-tests';
import { getStrapiImageUrl } from '@/lib/strapi-cms';

// Dynamically import SectorsPreviewSection (server component) as a client component wrapper
const SectorsPreviewSection = dynamic(() => import('../components/sections/SectorsPreviewSection'), {
  ssr: true,
});

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

// This is the fallback client component with hardcoded content
export default function HomePageClient() {
  const { openDrawer } = useWidget();
  const [navItems, setNavItems] = useState<StrapiNavigationItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showFirstSentence, setShowFirstSentence] = useState(false);
  const [showSecondSentence, setShowSecondSentence] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [heroSubtitle, setHeroSubtitle] = useState<string>('');
  const [heroButtonText, setHeroButtonText] = useState<string>('Start aanvraag');

  // Initialize hero content A/B tests
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get subtitle variant for content testing
        const subtitleVariant = getHeroSubtitleVariant();
        setHeroSubtitle(subtitleVariant.name);
        
        // Get button text variant for content testing
        const buttonVariant = getHeroButtonVariant();
        setHeroButtonText(buttonVariant.name);
      } catch (error) {
        console.warn('A/B test failed, using defaults:', error);
        // Fallback to defaults
        setHeroSubtitle('Eenvoudig online aanvragen. Geen opstartkosten. Boetevrij aflossen.');
        setHeroButtonText('Start aanvraag');
      }
    }
  }, []);

  // Check if mobile and handle animation
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        // Reset animation states
        setShowFirstSentence(false);
        setShowSecondSentence(false);
        
        // Animate first sentence after a short delay
        setTimeout(() => {
          setShowFirstSentence(true);
        }, 300);
        
        // Animate second sentence after first one appears
        setTimeout(() => {
          setShowSecondSentence(true);
        }, 800);
      } else {
        // On desktop, show both immediately
        setShowFirstSentence(true);
        setShowSecondSentence(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch navigation from Strapi via API route (server-side proxy)
  useEffect(() => {
    async function fetchNav() {
      try {
        const response = await fetch(`/api/strapi/navigation?siteId=${SITE_ID}`);
        // API route returns 200 with empty data on errors, so always try to parse
        const data = await response.json().catch(() => ({ data: [] }));
        // Handle Strapi response format
        const items = data?.data || [];
        setNavItems(items || []);
      } catch (error) {
        // Silently handle errors - navigation is optional
        setNavItems([]);
      }
    }
    fetchNav();
  }, []);

  // Use local hero images for rotation
  useEffect(() => {
    // All available hero images from the hero folder
    const localHeroImages = [
      '/images/hero/a-c-62FMr7OLD3o-unsplash.jpg',
      '/images/hero/brooke-cagle-RIUyV78hnwY-unsplash.jpg',
      '/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg',
      '/images/hero/getty-images-74Kc2Ck7lhY-unsplash.jpg',
      '/images/hero/getty-images-eHFNWsQGJG0-unsplash.jpg',
      '/images/hero/getty-images-eS7zaVvNpEg-unsplash.jpg',
      '/images/hero/getty-images-EUo8S5gfOys-unsplash.jpg',
      '/images/hero/getty-images-NBIYjNRPkzg-unsplash.jpg',
      '/images/hero/getty-images-nMg-6GrzKQ8-unsplash.jpg',
      '/images/hero/getty-images-sZchWleKlPc-unsplash.jpg',
      '/images/hero/getty-images-t7TuquKSttU-unsplash.jpg',
    ];

    // Shuffle images for variety on each page load
    const shuffledImages = [...localHeroImages];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    setHeroImages(shuffledImages);
    
    // Randomize initial image
    const randomIndex = Math.floor(Math.random() * shuffledImages.length);
    setCurrentHeroImageIndex(randomIndex);
    
    // Preload all images for smooth transitions
    shuffledImages.forEach((img: string) => {
      const imageLoader = new Image();
      imageLoader.src = img;
    });
  }, []);

  // Auto-rotate hero images every 8 seconds with smooth fade
  useEffect(() => {
    if (heroImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Get all testimonials from all sectors and randomly select 6
  const [randomTestimonials, setRandomTestimonials] = useState<Array<{
    name: string;
    role: string;
    text: string;
    image: string;
    company?: string;
    rating?: number;
  }>>([]);

  useEffect(() => {
    // Try to fetch testimonials from Strapi first
    const fetchStrapiTestimonials = async () => {
      try {
        const response = await fetch(`/api/strapi/testimonials?siteId=${SITE_ID}`);
        if (response.ok) {
          const data = await response.json();
          const strapiTestimonials = data.testimonials || [];
          
          if (strapiTestimonials.length > 0) {
            // Convert Strapi testimonials to carousel format
            const converted = strapiTestimonials.map((t: any) => {
              const attrs = t.attributes || t;
              // Try to get image URL from Strapi
              let imageUrl = '/images/pexels-ketut-subiyanto-4559683.jpg'; // Default fallback
              
              if (attrs.image) {
                const imgData = attrs.image;
                // Handle various Strapi image response formats
                if (imgData?.data) {
                  // Nested data structure
                  const nestedData = imgData.data;
                  if (Array.isArray(nestedData) && nestedData.length > 0) {
                    imageUrl = getStrapiImageUrl(nestedData[0].attributes?.url || nestedData[0].url);
                  } else if (nestedData?.attributes?.url) {
                    imageUrl = getStrapiImageUrl(nestedData.attributes.url);
                  } else if (nestedData?.url) {
                    imageUrl = getStrapiImageUrl(nestedData.url);
                  }
                } else if (imgData?.attributes?.url) {
                  imageUrl = getStrapiImageUrl(imgData.attributes.url);
                } else if (imgData?.url) {
                  imageUrl = getStrapiImageUrl(imgData.url);
                } else if (typeof imgData === 'string') {
                  imageUrl = imgData;
                }
              }
              
              return {
                name: attrs.name,
                role: attrs.role || attrs.company || '',
                text: attrs.text,
                image: imageUrl,
                company: attrs.company,
                rating: attrs.rating || 5
              };
            });
            
            // Remove duplicates
            const uniqueTestimonials = converted.filter((testimonial: any, index: number, self: any[]) => 
              index === self.findIndex((t: any) => 
                t.name.toLowerCase() === testimonial.name.toLowerCase() &&
                t.text.toLowerCase() === testimonial.text.toLowerCase()
              )
            );
            
            // Shuffle and select
            const shuffled = [...uniqueTestimonials];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            // Show up to 6 testimonials from Strapi (or all if less than 6)
            const selected = shuffled.slice(0, Math.min(6, shuffled.length));
            
            console.log('[HomePage] Using Strapi testimonials:', selected.length);
            setRandomTestimonials(selected);
            return;
          } else {
            console.log('[HomePage] No Strapi testimonials found');
            setRandomTestimonials([]);
            return;
          }
        } else {
          console.log('[HomePage] Strapi API response not OK:', response.status);
          setRandomTestimonials([]);
          return;
        }
      } catch (error) {
        console.error('[HomePage] Strapi fetch failed:', error);
        setRandomTestimonials([]);
        return;
      }
    };
    
    fetchStrapiTestimonials();
  }, []);

  const benefits = [
    { 
      iconPath: '/icons/SVG/interface/zap.svg',
      title: 'Binnen 24 uur', 
      desc: 'Aanvraag binnen 2 minuten. Aanbod binnen 24 uur. Sneller dan traditionele banken.',
      color: 'var(--color-sun)',
      textColor: 'var(--color-warning-dark)'
    },
    { 
      iconPath: '/icons/SVG/interface/shield.svg',
      title: 'Geen verborgen kosten', 
      desc: 'Transparante voorwaarden. Boetevrij vervroegd aflossen. Geen opstartkosten.',
      color: 'var(--color-mint)',
      textColor: 'var(--color-success-dark)'
    },
    { 
      iconPath: '/icons/SVG/interface/clock.svg',
      title: 'Flexibel aflossen', 
      desc: 'Flexibele looptijd van 3 tot 36 maanden. Pas aan op basis van je cashflow.',
      color: 'var(--color-sky)',
      textColor: 'var(--color-text)'
    },
    { 
      iconPath: '/icons/SVG/finance/trend-up.svg',
      title: 'Tot €500.000', 
      desc: 'Van kleine investeringen tot grote groeiplannen. Financiering op maat.',
      color: 'var(--color-pink-light)',
      textColor: 'var(--color-error-dark)'
    },
    { 
      iconPath: '/icons/SVG/interface/user-add.svg',
      title: 'Persoonlijk advies', 
      desc: 'Vaste contactpersoon via telefoon, e-mail of chat. Geen wachtlijnen.',
      color: 'var(--color-bg-error)',
      textColor: 'var(--color-error-dark)'
    },
    { 
      iconPath: '/icons/SVG/interface/trophy.svg',
      title: 'Zonder onderpand', 
      desc: 'Geen zakelijke zekerheden vereist. Ook als de bank je heeft afgewezen.',
      color: 'var(--color-warning)',
      textColor: 'var(--color-warning-dark)'
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
        color: 'var(--color-white)',
        textAlign: 'center',
        padding: '2rem',
        overflow: 'hidden',
      }}>
        {/* Background image layers for smooth rotation */}
        {heroImages.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}>
            {heroImages.map((img, index) => (
              <div
                key={`hero-img-${index}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `linear-gradient(var(--overlay-slate-5), var(--overlay-slate-5)), url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundAttachment: 'fixed',
                  opacity: index === currentHeroImageIndex ? 1 : 0,
                  transition: heroImages.length > 1 ? 'opacity 2s ease-in-out' : 'none',
                  pointerEvents: index === currentHeroImageIndex ? 'auto' : 'none',
                  willChange: 'opacity',
                }}
                aria-hidden={index !== currentHeroImageIndex}
              />
            ))}
          </div>
        )}
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 4rem)',
            fontWeight: 500,
            marginBottom: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            <span 
              style={{
                display: 'block',
                opacity: showFirstSentence ? 1 : 0,
                transform: showFirstSentence ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              }}
            >
              Zakelijke financiering binnen 24 uur.
            </span>
            <span 
              style={{
                display: 'block',
                opacity: showSecondSentence ? 1 : 0,
                transform: showSecondSentence ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              }}
            >
              Geen gedoe met de bank.
            </span>
          </h1>
          
          {/* Subtitle/Description - Default shown, A/B tested for content */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 400,
            marginTop: '1.5rem',
            marginBottom: '2rem',
            lineHeight: 1.5,
            opacity: showSecondSentence ? 1 : 0,
            transform: showSecondSentence ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
            maxWidth: '700px',
            margin: '1.5rem auto 2rem',
            color: 'var(--color-white)',
          }}>
            {heroSubtitle || 'Eenvoudig online aanvragen. Geen opstartkosten. Boetevrij aflossen.'}
          </p>
          
          {/* Button - Always single button, A/B tested for text */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginTop: '1rem',
          }}>
            <button style={{
              border: 'none',
              backgroundColor: 'var(--color-charcoal)',
              color: 'var(--color-white)',
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
              e.currentTarget.style.backgroundColor = 'var(--color-charcoal500)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
            }}>
              {heroButtonText}
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Carousel Section */}
      <BenefitsCarousel benefits={benefits} />

      {/* Sectors Preview Section */}
      <SectorsPreviewSection
        title="Financiering voor elke sector"
        subtitle="Ontdek hoe wij jouw branche specifiek kunnen helpen met zakelijke financiering"
        maxItems={6}
        showViewAll={true}
      />

      {/* Feature Section with Image */}
      <FeatureSection 
        title="Flexibele aflossing op jouw voorwaarden"
        description="Kies zelf wanneer je aflost. Geen vaste maandlasten, maar flexibiliteit die past bij jouw cashflow. Boetevrij vervroegd aflossen mogelijk wanneer het jou uitkomt."
        buttonText="Meer informatie"
        buttonHref="/hoe-werkt-het"
        imagePath="/images/pexels-tima-miroshnichenko-5198239.jpg"
        imagePosition="left"
        backgroundColor="white"
      />

      {/* Testimonials Grid Section */}
      {randomTestimonials.length > 0 && (
        <TestimonialsGrid testimonials={randomTestimonials} />
      )}

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
            color: 'var(--color-white)',
          }}>
            Zakelijke lening aanvragen?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--overlay-white-7)',
            marginBottom: '2rem',
            lineHeight: 1.5,
          }}>
            Binnen 2 minuten aangevraagd. Aanbod binnen 24 uur.
          </p>
          <a 
            href="https://www.geldgeregeld.nl/#aanvragen"
            style={{
              border: 'none',
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-text)',
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
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-alt)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-white)';
            }}>
            Start je aanvraag nu
            <ArrowRight size={20} />
          </a>
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
        
        @media (max-width: 768px) {
          #hero h1 {
            font-size: clamp(1.5rem, 6vw, 2.5rem) !important;
          }
        }
        
        @media (max-width: 480px) {
          #hero {
            padding: 1rem !important;
          }
          
          #hero h1 {
            font-size: clamp(1.25rem, 7vw, 2rem) !important;
          }
        }
      `}</style>
    </>
  );
}

