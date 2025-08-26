"use client";
import React from 'react';

interface Service {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

interface ServiceGridProps {
  title?: string;
  subtitle?: string;
  services: Service[];
}

export default function ServiceGrid({ title, subtitle, services }: ServiceGridProps) {
  return (
    <section style={{ padding: 'var(--space-xl) 0' }}>
      {title && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ 
            fontSize: '28px',
            margin: '0 0 var(--space-sm)',
            color: 'var(--color-text)'
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ 
              fontSize: '16px',
              color: 'var(--color-muted)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        {services.map((service, index) => (
          <div 
            key={index}
            style={{
              textAlign: 'center',
              padding: 'var(--space-lg)',
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.2s ease',
              cursor: service.href ? 'pointer' : 'default'
            }}
            onClick={() => service.href && (window.location.href = service.href)}
            onMouseEnter={(e) => {
              if (service.href) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (service.href) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div style={{ 
              fontSize: '48px',
              marginBottom: 'var(--space-md)',
              color: 'var(--color-brand)'
            }}>
              {service.icon}
            </div>
            <h3 style={{ 
              fontSize: '18px',
              margin: '0 0 var(--space-sm)',
              color: 'var(--color-text)'
            }}>
              {service.title}
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              color: 'var(--color-muted)',
              margin: '0'
            }}>
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
