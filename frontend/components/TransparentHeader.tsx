"use client";
import React from 'react';
import Logo from './Logo';
import Link from 'next/link';

export default function TransparentHeader() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(108, 115, 122, 0.1)',
      padding: '1rem 0',
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
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
            }}
          >
            Over ons
          </Link>
          <Link 
            href="/contact" 
            style={{
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px',
            }}
          >
            Contact
          </Link>
          <button 
            className="btn btn-primary"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              padding: '0.625rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Aanvragen
          </button>
        </nav>
      </div>
    </header>
  );
}

