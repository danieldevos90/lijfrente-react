"use client";
import React from 'react';
import TrustBadges from '../templates/TrustBadges';

interface TrustSectionProps {
  badges: Array<{
    icon: string;
    text: string;
    description?: string;
    color?: string;
    textColor?: string;
  }>;
  variant?: 'default' | 'centered' | 'compact';
}

export default function TrustSection({ badges, variant = 'centered' }: TrustSectionProps) {
  return (
    <section style={{
      background: 'white',
      padding: '8rem 2rem',
    }}>
      <div className="container">
        <TrustBadges badges={badges} variant={variant} />
      </div>
    </section>
  );
}
