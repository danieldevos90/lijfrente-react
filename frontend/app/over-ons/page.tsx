"use client";
import React from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import SubpageHero from '../../components/SubpageHero';
import Footer from '../../components/Footer';

// Example: This data would come from Strapi in a real implementation
// async function getPageData() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/over-ons`, {
//     next: { revalidate: 60 }
//   });
//   return res.json();
// }

export default function OverOnsPage() {
  // In a real implementation, you would fetch this from Strapi:
  // const pageData = await getPageData();
  
  // Example Strapi data structure:
  const pageData = {
    hero: {
      title: "We believe in shaping a better financial future for everyone",
      subtitle: "Empowering businesses and employees with seamless financial solutions.",
      ctaText: "Request a Demo",
      ctaHref: "#contact",
      backgroundColor: "#f5f5f5"
    }
  };

  const handleCtaClick = () => {
    // Handle CTA click - could open a modal, navigate, etc.
    console.log('CTA clicked');
  };

  return (
    <>
      <TransparentHeader />
      
      <SubpageHero
        title={pageData.hero.title}
        subtitle={pageData.hero.subtitle}
        ctaText={pageData.hero.ctaText}
        ctaHref={pageData.hero.ctaHref}
        backgroundColor={pageData.hero.backgroundColor}
        onCtaClick={handleCtaClick}
      />

      {/* Page content would go here */}
      <section style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: '3rem',
            fontWeight: 400,
            lineHeight: 1.08,
            marginBottom: '2rem',
            color: 'var(--color-text)',
          }}>
            Over GeldGeregeld
          </h2>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.7,
            opacity: 0.85,
          }}>
            Content from Strapi would be rendered here...
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

