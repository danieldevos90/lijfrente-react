import React from 'react';

interface InfoSectionProps {
  title?: string;
  subtitle?: string;
  content: string;
  variant?: 'default' | 'centered' | 'highlight';
  maxWidth?: string;
}

export default function InfoSection({
  title,
  subtitle,
  content,
  variant = 'default',
  maxWidth = '100%'
}: InfoSectionProps) {
  const containerStyle = {
    maxWidth,
    margin: variant === 'centered' ? '0 auto' : '0',
    textAlign: variant === 'centered' ? 'center' as const : 'left' as const,
    padding: variant === 'highlight' ? 'var(--space-lg)' : '0',
    background: variant === 'highlight' ? '#F8FAFC' : 'transparent',
    borderRadius: variant === 'highlight' ? 'var(--radius-md)' : '0',
    border: variant === 'highlight' ? '1px solid var(--color-border)' : 'none'
  };

  return (
    <div style={containerStyle}>
      {title && (
        <h2 style={{ 
          fontFamily: '"PP Neue Montreal", sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.75rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          marginBottom: '1rem',
          color: 'var(--color-text)' 
        }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--color-muted)', 
          margin: '0 0 var(--space-md)' 
        }}>
          {subtitle}
        </p>
      )}
      <div style={{ 
        whiteSpace: 'pre-wrap', 
        lineHeight: 1.6, 
        color: 'var(--color-text)' 
      }}>
        {content}
      </div>
    </div>
  );
}
