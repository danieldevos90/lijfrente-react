"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  textColor?: string;
  showText?: boolean;
}

export default function Logo({ size = 40, className = '', textColor, showText = true }: LogoProps) {
  const logomarkSize = size * 0.8; // Slightly smaller than text height
  
  return (
    <Link href="/" className={`geldgeregeld-logo ${className}`} style={{ 
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      lineHeight: 1,
    }}>
      <Image
        src="/logomark.svg"
        alt="Geldgeregeld logo mark"
        width={logomarkSize}
        height={logomarkSize}
        style={{
          flexShrink: 0,
          filter: textColor === 'white' ? 'brightness(0) invert(1)' : 'none',
          display: 'block',
        }}
      />
      {showText && (
        <span style={{
          fontSize: size * 0.55,
          color: textColor || 'var(--color-text)',
          fontFamily: 'Google Sans, sans-serif',
          letterSpacing: '0.03em',
          display: 'inline-flex',
          alignItems: 'baseline',
          lineHeight: 1,
        }}>
          <span style={{ fontWeight: 700 }}>geld</span>
          <span style={{ fontWeight: 400 }}>geregeld.nl</span>
        </span>
      )}
    </Link>
  );
}

