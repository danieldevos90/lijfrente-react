"use client";
import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: number;
  className?: string;
  textColor?: string;
  showText?: boolean;
}

export default function Logo({ size = 40, className = '', textColor, showText = true }: LogoProps) {
  return (
    <Link href="/" className={`geldgeregeld-logo ${className}`} style={{ textDecoration: 'none' }}>
      {showText && (
        <span style={{
          fontSize: size * 0.55,
          fontWeight: 700,
          color: textColor || 'var(--color-text)',
          fontFamily: 'var(--font-logo)',
          letterSpacing: '0.03em'
        }}>
          Geldgeregeld.nl
        </span>
      )}
    </Link>
  );
}

