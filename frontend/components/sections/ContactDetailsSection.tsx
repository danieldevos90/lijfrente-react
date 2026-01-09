"use client";
import React, { useEffect, useState } from 'react';
import ContactForm from '../ContactForm';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

interface ContactDetailsSectionProps {
  title?: string;
  content?: string;
}

export default function ContactDetailsSection({ 
  title = "Contactgegevens",
  content = "Bereik ons via telefoon of e-mail. We zijn bereikbaar van maandag tot vrijdag tussen 09:00 en 18:00."
}: ContactDetailsSectionProps) {
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`/api/strapi/footer?siteId=${SITE_ID}`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          return;
        }
        const json = await response.json();
        const siteData = json?.data?.[0] || null;
        setFooterData(siteData);
      } catch (error: any) {
        // Silently fail
      }
    }
    fetchFooter();
  }, []);

  const footer = footerData?.attributes || footerData || {
    companyName: 'GeldGeregeld',
    address: 'Roggestraat 7',
    postalCode: '7311 CA',
    city: 'Apeldoorn',
    country: 'Nederland',
  };

  return (
    <section id="contact-details" style={{
      background: 'var(--color-bg)',
      padding: '8rem 2rem',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
          }}>
            {content}
          </p>
        </div>


        {/* Form */}
        <div style={{
          marginTop: '3rem',
        }}>
          <ContactForm />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          #contact-details {
            padding: 4rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}

