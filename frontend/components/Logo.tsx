"use client";
import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`geldgeregeld-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Icon: Lightning bolt in circle */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        
        {/* Circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
        
        {/* Lightning bolt - simplified and clean */}
        <path 
          d="M22 10L14 21H20L18 30L26 19H20L22 10Z" 
          fill="white"
          stroke="white"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
      
      {showText && (
        <span style={{
          fontSize: size * 0.55,
          fontWeight: 700,
          color: 'var(--color-text)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.01em'
        }}>
          GeldGeregeld
        </span>
      )}
    </div>
  );
}

