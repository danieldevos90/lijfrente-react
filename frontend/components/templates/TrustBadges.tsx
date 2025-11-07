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
      display: 'flex',
      flexWrap: 'wrap',
      gap: variant === 'compact' ? 'var(--space-md)' : 'var(--space-lg)',
      justifyContent: variant === 'centered' ? 'center' : 'flex-start',
      alignItems: 'center',
      padding: 'var(--space-lg) 0'
    }}>
      {badges.map((badge, index) => (
        <div 
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: variant === 'compact' ? 'var(--space-sm)' : 'var(--space-md)',
            background: '#F8FAFC',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            minWidth: variant === 'compact' ? 'auto' : '200px'
          }}
        >
          <div style={{ 
            color: 'var(--color-brand)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {isSvgPath(badge.icon) ? (
              <Image
                src={badge.icon}
                alt={badge.text}
                width={20}
                height={20}
                style={{
                  objectFit: 'contain',
                }}
              />
            ) : trustIconMap[badge.icon] ? (
              React.createElement(trustIconMap[badge.icon], { size: 20 })
            ) : (
              <span style={{ fontSize: '20px' }}>{badge.icon}</span>
            )}
          </div>
          <span style={{ 
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-text)'
          }}>
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
}
