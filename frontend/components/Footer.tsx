"use client";
import React from 'react';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{
      background: '#0f1720',
      color: 'white',
      padding: '3rem 0 2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    }}>
      <div style={{
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        {/* Top Section - LinkedIn Link */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <Linkedin size={16} />
              <span>Volg ons op LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: '2rem 0',
        }} />

        {/* Main Content Grid */}
        <div className="footer-main-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '4rem',
          marginBottom: '2rem',
        }}>
          {/* Left Column - Address */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: 'rgba(255, 255, 255, 0.9)',
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
              GeldGeregeld B.V.<br />
              Herengracht 282<br />
              1016 BX Amsterdam<br />
              Nederland
            </address>
            
            <button style={{
              border: 'none',
              backgroundColor: 'white',
              color: '#0f1720',
              textAlign: 'center',
              borderRadius: '10rem',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '12rem',
              padding: '0.75rem 2rem',
              fontFamily: 'Public Sans Variable, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: '1rem',
              transition: 'all .28s',
              display: 'flex',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              Neem contact op
            </button>
          </div>

          {/* Right Column - Legal Text */}
          <div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              lineHeight: '1.7',
              marginBottom: '1rem',
            }}>
              GeldGeregeld B.V. is een Nederlandse financiële dienstverlener die ondernemers helpt bij het verkrijgen van passende zakelijke financiering. Wij werken samen met een netwerk van gerenommeerde kredietverstrekkers en bemiddelen tussen ondernemers en financiers.
            </p>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              lineHeight: '1.7',
              marginBottom: '1rem',
            }}>
              Het verstrekken van financiering gebeurt door onze partnercrediteurs onder de voorwaarden die door hen worden gesteld. GeldGeregeld verstrekt zelf geen krediet. Wij helpen bij het vinden van de meest geschikte financiering voor uw onderneming.
            </p>

            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              lineHeight: '1.7',
            }}>
              Let op: lenen kost geld. Raadpleeg uw adviseur en vraag indien nodig advies over de voorwaarden en risico's. Alle financieringsvormen en voorwaarden zijn afhankelijk van goedkeuring door de crediteur. Restricties zijn van toepassing; zie de voorwaarden van de betreffende crediteur voor details.
            </p>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            margin: 0,
          }}>
            ©2025 GeldGeregeld B.V. Alle rechten voorbehouden.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link 
              href="/privacy" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Privacy
            </Link>
            <Link 
              href="/cookies" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Cookies
            </Link>
            <Link 
              href="/algemene-voorwaarden" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Algemene Voorwaarden
            </Link>
            <Link 
              href="/disclaimer" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Disclaimer
            </Link>
            <Link 
              href="/contact" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Contact
            </Link>
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

