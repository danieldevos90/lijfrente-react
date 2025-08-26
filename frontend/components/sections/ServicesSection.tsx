"use client";
import React from 'react';
import Section from '../ui/Section';
import ServiceGrid from '../templates/ServiceGrid';

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  services: Array<{
    icon: string;
    title: string;
    description: string;
    href?: string;
  }>;
}

export default function ServicesSection({ title, subtitle, services }: ServicesSectionProps) {
  return (
    <Section background="white" padding="xl">
      <ServiceGrid
        title={title}
        subtitle={subtitle}
        services={services}
      />
    </Section>
  );
}
