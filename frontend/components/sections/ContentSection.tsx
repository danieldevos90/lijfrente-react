"use client";
import React from 'react';
import Section from '../ui/Section';
import ImageTextBlock from '../templates/ImageTextBlock';

interface ContentSectionProps {
  title: string;
  content: string;
  layout?: 'image-left' | 'image-right';
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'default' | 'bordered' | 'shadow';
  background?: 'white' | 'gray' | 'blue' | 'dark';
}

export default function ContentSection({ 
  title, 
  content, 
  layout = 'image-right',
  ctaLabel,
  ctaHref,
  variant = 'default',
  background = 'gray'
}: ContentSectionProps) {
  return (
    <Section background={background} padding="lg">
      <ImageTextBlock
        title={title}
        content={content}
        layout={layout}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        variant={variant}
      />
    </Section>
  );
}
