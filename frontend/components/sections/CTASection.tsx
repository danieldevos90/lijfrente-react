"use client";
import React from 'react';
import Section from '../ui/Section';
import CTASectionButton from './CTASectionButton';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  background?: 'white' | 'gray' | 'blue' | 'dark';
}

export default function CTASection({ 
  title, 
  subtitle, 
  ctaLabel, 
  ctaHref,
  background = 'dark' 
}: CTASectionProps) {
  const textColor = background === 'dark' ? 'text-white' : '';
  
  return (
    <Section background={background} padding="lg">
      <div className={`text-center ${textColor}`}>
        <h2 className={textColor}>{title}</h2>
        {subtitle && (
          <p 
            className={textColor} 
            style={{ fontSize: '20px', marginBottom: '2rem' }}
          >
            {subtitle}
          </p>
        )}
        <CTASectionButton ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </div>
    </Section>
  );
}
