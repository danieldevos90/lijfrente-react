"use client";
import React from 'react';
import HeroSlide from '../templates/HeroSlide';

interface HeroSectionProps {
  badge?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: string;
  variant?: 'default' | 'gradient' | 'image';
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section className="full-width">
      <HeroSlide {...props} />
    </section>
  );
}
