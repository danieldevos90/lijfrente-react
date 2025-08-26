"use client";
import React from 'react';

interface Feature {
  icon?: string;
  title: string;
  description: string;
  badge?: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
}

export default function FeatureGrid({
  features,
  title,
  subtitle,
  columns = 3
}: FeatureGridProps) {
  const minWidth = {
    2: '300px',
    3: '250px',
    4: '200px'
  };

  return (
    <section style={{ margin: 'var(--space-xl) 0' }}>
      {title && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
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
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth[columns]}, 1fr))`,
        gap: 'var(--space-lg)'
      }}>
        {features.map((feature, index) => (
          <div 
            key={index}
            style={{
              padding: 'var(--space-lg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: '#fff',
              textAlign: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {feature.badge && (
              <div className="badge" style={{ marginBottom: 'var(--space-sm)' }}>
                {feature.badge}
              </div>
            )}
            {feature.icon && (
              <div style={{ 
                fontSize: '40px', 
                marginBottom: 'var(--space-md)',
                color: 'var(--color-brand)'
              }}>
                {feature.icon}
              </div>
            )}
            <h3 style={{ 
              fontSize: '18px', 
              margin: '0 0 var(--space-sm)', 
              color: 'var(--color-text)' 
            }}>
              {feature.title}
            </h3>
            <p style={{ 
              lineHeight: 1.6, 
              color: 'var(--color-muted)',
              margin: '0'
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
