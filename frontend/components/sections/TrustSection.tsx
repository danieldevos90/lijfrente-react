"use client";
import React from 'react';
import Section from '../ui/Section';
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
    <Section background="white" padding="md">
      <TrustBadges badges={badges} variant={variant} />
    </Section>
  );
}
