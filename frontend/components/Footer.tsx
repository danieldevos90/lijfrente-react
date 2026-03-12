"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useWidget } from './GlobalWidgetProvider';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default function Footer() {
  const { openDrawer } = useWidget();
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    async function fetchFooter() {
      try {
        // Use API route instead of direct Strapi call (prevents client-side 401 errors)
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`/api/strapi/footer?siteId=${SITE_ID}`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          return; // Silently fail
        }
        const json = await response.json();
        // Extract site data from response (same structure as getFooterContent)
        const siteData = json?.data?.[0] || null;
        setFooterData(siteData);
      } catch (error: any) {
        // Silently fail - suppress all errors including network errors and timeouts
        // The error handler in layout.tsx will catch and suppress these
      }
    }
    fetchFooter();
  }, []);

  // Fallback data if Strapi is not available
  const footer = footerData?.attributes || footerData || {
    companyName: 'GeldGeregeld',
    address: 'Roggestraat 7',
    postalCode: '7311 CA',
    city: 'Apeldoorn',
    country: 'Nederland',
    email: 'info@geldgeregeld.nl',
    phone: '085-0480881',
    kvkNumber: '64859525',
    linkedinUrl: 'https://linkedin.com',
    linkedinText: 'Volg ons op LinkedIn',
    description1: 'GeldGeregeld is een Nederlandse financiële dienstverlener die ondernemers helpt bij het verkrijgen van passende zakelijke financiering. Wij werken samen met een netwerk van gerenommeerde kredietverstrekkers en bemiddelen tussen ondernemers en financiers.',
    description2: 'Het verstrekken van financiering gebeurt door onze partnercrediteurs onder de voorwaarden die door hen worden gesteld. GeldGeregeld verstrekt zelf geen krediet. Wij helpen bij het vinden van de meest geschikte financiering voor uw onderneming.',
    description3: 'Let op: lenen kost geld. Raadpleeg uw adviseur en vraag indien nodig advies over de voorwaarden en risico\'s. Alle financieringsvormen en voorwaarden zijn afhankelijk van goedkeuring door de crediteur. Restricties zijn van toepassing; zie de voorwaarden van de betreffende crediteur voor details.',
    copyright: '©2025 GeldGeregeld Alle rechten voorbehouden.',
    footerLinks: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Algemene Voorwaarden', href: '/algemene-voorwaarden' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Contact', href: '/contact' },
    ]
  };

  return (
    <footer style={{
      background: 'var(--color-bg-secondary)',
      color: 'var(--color-white)',
      padding: '3rem 0 2rem',
      borderTop: '1px solid var(--overlay-white-05)',
    }}>
      <div style={{
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        {/* LinkedIn section hidden */}

        {/* Main Content Grid */}
        <div className="footer-main-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '4rem',
          marginBottom: '2rem',
        }}>
          {/* Left Column - Address */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <Logo size={36} textColor="white" />
            </div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: 'var(--overlay-white-9)',
            }}>
              Adres
            </h4>
            <address style={{
              fontStyle: 'normal',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
            }}>
              {footer.companyName || 'GeldGeregeld'}<br />
              {footer.address || 'Roggestraat 7'}<br />
              {footer.postalCode || '7311 CA'} {footer.city || 'Apeldoorn'}<br />
              {footer.country || 'Nederland'}
            </address>
            
            <Link className="btn btn-secondary" href="/contact">
              Neem contact op
            </Link>
          </div>

          {/* Right Column - Legal Text */}
          <div>
            {footer.description1 && (
              <p style={{
                color: 'var(--overlay-white-6)',
                fontSize: '12px',
                lineHeight: '1.7',
                marginBottom: '1rem',
              }}>
                {footer.description1}
              </p>
            )}
            
            {footer.description2 && (
              <p style={{
                color: 'var(--overlay-white-6)',
                fontSize: '12px',
                lineHeight: '1.7',
                marginBottom: '1rem',
              }}>
                {footer.description2}
              </p>
            )}

            {footer.description3 && (
              <p style={{
                color: 'var(--overlay-white-6)',
                fontSize: '12px',
                lineHeight: '1.7',
              }}>
                {footer.description3}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div style={{
          borderTop: '1px solid var(--overlay-white-1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            color: 'var(--overlay-white-5)',
            fontSize: '12px',
            margin: 0,
          }}>
            {footer.copyright || '©2025 GeldGeregeld Alle rechten voorbehouden.'}
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {(footer.footerLinks || [
              { label: 'Privacy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' },
              { label: 'Algemene Voorwaarden', href: '/algemene-voorwaarden' },
              { label: 'Disclaimer', href: '/disclaimer' },
              { label: 'Contact', href: '/contact' },
            ]).map((link: any, index: number) => (
              <Link 
                key={index}
                href={link.href} 
                style={{
                  color: 'var(--overlay-white-5)',
                  textDecoration: 'none',
                  fontSize: '12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
