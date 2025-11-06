"use client";
import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`geldgeregeld-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Icon: Thumbs up in circle */}
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <ThumbsUp 
          size={size * 0.5} 
          color="white" 
          strokeWidth={2.5}
          fill="white"
        />
      </div>
      
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

