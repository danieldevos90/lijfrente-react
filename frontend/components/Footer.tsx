"use client";
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-bg-secondary)',
      color: 'white',
      padding: '4rem 0 2rem',
    }}>
      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Logo & About */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <Logo size={36} showText={true} />
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              lineHeight: '1.6',
            }}>
              Zakelijke financiering snel geregeld. Binnen 24 uur duidelijkheid over uw aanvraag.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              Navigatie
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {['Over ons', 'Diensten', 'Veelgestelde vragen', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              Contact
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="rgba(255, 255, 255, 0.7)" />
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  info@geldgeregeld.nl
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="rgba(255, 255, 255, 0.7)" />
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  085 - 130 5000
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.7)" />
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  Amsterdam, Nederland
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '13px',
            margin: 0,
          }}>
            © 2025 GeldGeregeld. Alle rechten voorbehouden.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link 
              href="/privacy" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '13px',
              }}
            >
              Privacy
            </Link>
            <Link 
              href="/algemene-voorwaarden" 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '13px',
              }}
            >
              Algemene voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

