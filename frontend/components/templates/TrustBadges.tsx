"use client";
import React from 'react';

interface TrustBadge {
  icon: string;
  text: string;
}

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
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            minWidth: variant === 'compact' ? 'auto' : '200px'
          }}
        >
          <div style={{ 
            fontSize: '20px',
            color: 'var(--color-brand)'
          }}>
            {badge.icon}
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
