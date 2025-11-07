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
  const backgroundClass = background === 'gray' ? 'section-gray' : background === 'blue' ? 'section-blue' : background === 'dark' ? 'section-dark' : 'section-white';
  
  return (
    <section className={`full-width ${backgroundClass}`} style={{ padding: '8rem 2rem' }}>
      <div className="container">
        <ImageTextBlock
          title={title}
          content={content}
          layout={layout}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          variant={variant}
        />
      </div>
    </section>
  );
}
