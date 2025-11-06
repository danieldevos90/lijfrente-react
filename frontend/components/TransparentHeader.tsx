"use client";
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Link from 'next/link';

export default function TransparentHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
      borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid transparent',
      padding: '1rem 0',
      transition: 'all 0.3s ease',
      boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        <Logo size={36} showText={true} />
        
        <nav style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <Link 
            href="/over-ons" 
            style={{
              color: isScrolled ? 'var(--color-text)' : 'white',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
              textShadow: isScrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            Over ons
          </Link>
          <Link 
            href="/contact" 
            style={{
              color: isScrolled ? 'var(--color-text)' : 'white',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
              textShadow: isScrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            Contact
          </Link>
          <button 
            className="btn btn-primary"
            style={{
              border: '1px solid var(--color-charcoal)',
              backgroundColor: 'var(--color-charcoal)',
              color: 'white',
              textAlign: 'center',
              borderRadius: '.25rem',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '10.5rem',
              maxHeight: '2.75rem',
              padding: '1rem 1.5rem',
              fontFamily: 'Public Sans Variable, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              lineHeight: 1,
              transition: 'border-color .28s, background-color .28s',
              display: 'flex',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 32, 0.85)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
            }}
          >
            Aanvragen
          </button>
        </nav>
      </div>
    </header>
  );
}

