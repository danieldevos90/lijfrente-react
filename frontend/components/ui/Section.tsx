"use client";
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'blue' | 'dark';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const backgroundClasses = {
  white: 'section-white',
  gray: 'section-gray', 
  blue: 'section-blue',
  dark: 'section-dark'
};

const paddingClasses = {
  sm: 'py-12',
  md: 'py-16', 
  lg: 'py-20',
  xl: 'py-24'
};

export default function Section({ 
  children, 
  className = '', 
  background = 'white',
  padding = 'lg',
  fullWidth = true 
}: SectionProps) {
  const sectionClasses = [
    fullWidth ? 'full-width' : '',
    backgroundClasses[background],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses}>
      <div className="container">
        {children}
      </div>
    </section>
  );
}
