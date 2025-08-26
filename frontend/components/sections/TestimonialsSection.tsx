"use client";
import React from 'react';
import Section from '../ui/Section';
import TestimonialSection from '../templates/TestimonialSection';

interface TestimonialsSectionProps {
  title?: string;
  testimonials: Array<{
    name: string;
    company: string;
    text: string;
    rating?: number;
  }>;
}

export default function TestimonialsSection({ title, testimonials }: TestimonialsSectionProps) {
  return (
    <Section background="blue" padding="xl">
      <TestimonialSection title={title} testimonials={testimonials} />
    </Section>
  );
}
