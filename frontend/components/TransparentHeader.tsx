"use client";
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Link from 'next/link';

interface TransparentHeaderProps {
  onCtaClick?: () => void;
  transparent?: boolean; // New prop to control transparency
  textColor?: 'white' | 'black'; // Text color when transparent (white for dark backgrounds, black for light backgrounds)
}

export default function TransparentHeader({ onCtaClick, transparent = false, textColor: initialTextColor = 'white' }: TransparentHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Determine visibility based on scroll direction
      if (currentScrollY < 50) {
        // Always show at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Determine if header should be transparent (only if transparent prop is true AND not scrolled)
  const isTransparent = transparent && !isScrolled;
  // Determine if header should show white/solid background
  const isSolid = !transparent || isScrolled;
  
  // Use dynamic text color when transparent (based on initialTextColor prop), black text when solid
  const textColor = isTransparent ? initialTextColor : 'var(--color-text)';

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: isSolid ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
      borderBottom: isSolid ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid transparent',
      padding: '1rem 0',
      transition: 'all 0.3s ease, transform 0.3s ease',
      boxShadow: isSolid ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none',
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 auto',
      }}>
        <Logo size={36} textColor={textColor} />
        
        <nav className="desktop-nav" style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <Link 
            href="/hoe-werkt-het" 
            style={{
              color: textColor,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
              textShadow: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Hoe werkt het
          </Link>
          <Link 
            href="/over-ons" 
            style={{
              color: textColor,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
              textShadow: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Over ons
          </Link>
          <Link 
            href="/contact" 
            style={{
              color: textColor,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
              textShadow: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Contact
          </Link>
          <button 
            className="btn btn-primary"
            onClick={onCtaClick}
            style={{
              border: 'none',
              backgroundColor: '#000000',
              color: 'white',
              textAlign: 'center',
              borderRadius: '10rem',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '10rem',
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
              e.currentTarget.style.backgroundColor = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
            }}
          >
            Aanvragen
          </button>
        </nav>

        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 102,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '24px',
          }}>
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: textColor,
              transition: 'all 0.3s ease',
              transform: isMobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }} />
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: textColor,
              transition: 'all 0.3s ease',
              opacity: isMobileMenuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block',
              width: '24px',
              height: '2px',
              backgroundColor: textColor,
              transition: 'all 0.3s ease',
              transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <nav className="mobile-menu" style={{
        position: 'fixed',
        top: 0,
        right: isMobileMenuOpen ? 0 : '-100%',
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        padding: '5rem 1rem 2rem',
        gap: '1.5rem',
        transition: 'right 0.3s ease',
      }}>
        {/* Close X Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <Link 
          href="/hoe-werkt-het" 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            color: 'var(--color-text)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '18px',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          Hoe werkt het
        </Link>
        <Link 
          href="/over-ons" 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            color: 'var(--color-text)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '18px',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          Over ons
        </Link>
        <Link 
          href="/contact" 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            color: 'var(--color-text)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '18px',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          Contact
        </Link>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onCtaClick?.();
          }}
          style={{
            border: 'none',
            backgroundColor: '#000000',
            color: 'white',
            textAlign: 'center',
            borderRadius: '10rem',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem 2rem',
            fontFamily: 'Public Sans Variable, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            marginTop: '1rem',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Aanvragen
        </button>
      </nav>

      <style jsx>{`
        .container {
          padding: 0 2rem;
        }
        
        .hamburger-btn {
          padding: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 0 16px !important;
          }
          
          .hamburger-btn {
            padding: 0.25rem !important;
          }
          
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}

