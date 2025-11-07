"use client";
import React from 'react';
import Image from 'next/image';
import { CheckCircle, Zap, Lock, FileText } from 'lucide-react';

interface TrustBadge {
  icon: string;
  text: string;
}

const trustIconMap: Record<string, React.ComponentType<any>> = {
  '✓': CheckCircle,
  '⚡': Zap,
  '🔒': Lock,
  '📋': FileText,
};

// Check if icon is an SVG path (starts with /icons/ or contains .svg)
const isSvgPath = (icon: string): boolean => {
  return icon.startsWith('/icons/') || icon.includes('.svg') || icon.startsWith('/');
};

interface TrustBadgesProps {
  badges: TrustBadge[];
  variant?: 'default' | 'centered' | 'compact';
}

export default function TrustBadges({ badges, variant = 'default' }: TrustBadgesProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      justifyContent: variant === 'centered' ? 'center' : 'flex-start',
      alignItems: 'stretch',
      padding: 'var(--space-lg) 0'
    }}>
      {badges.map((badge, index) => (
        <div 
          key={index}
          style={{
            background: '#F8FAFC',
            border: '1px solid var(--color-border)',
            borderRadius: '0.625rem',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            minHeight: '200px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ 
            width: '4rem',
            height: '4rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand)',
          }}>
            {isSvgPath(badge.icon) ? (
              <Image
                src={badge.icon}
                alt={badge.text}
                width={64}
                height={64}
                style={{
                  objectFit: 'contain',
                }}
              />
            ) : trustIconMap[badge.icon] ? (
              React.createElement(trustIconMap[badge.icon], { size: 64 })
            ) : (
              <span style={{ fontSize: '64px' }}>{badge.icon}</span>
            )}
          </div>
          <span style={{ 
            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
            fontWeight: 500,
            color: 'var(--color-text)',
            lineHeight: 1.4,
          }}>
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
}
