import React from 'react';

interface Column {
  title?: string;
  content: string;
  icon?: string;
  badge?: string;
}

interface ColumnLayoutProps {
  columns: Column[];
  variant?: '2-column' | '3-column' | '4-column';
  gap?: string;
}

export default function ColumnLayout({
  columns,
  variant = '3-column',
  gap = 'var(--space-lg)'
}: ColumnLayoutProps) {
  const gridCols = {
    '2-column': 'repeat(auto-fit, minmax(300px, 1fr))',
    '3-column': 'repeat(auto-fit, minmax(250px, 1fr))',
    '4-column': 'repeat(auto-fit, minmax(200px, 1fr))'
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: gridCols[variant],
      gap,
      margin: 'var(--space-lg) 0'
    }}>
      {columns.map((col, index) => (
        <div 
          key={index}
          className="card"
          style={{
            padding: 'var(--space-lg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-white)',
            textAlign: 'center'
          }}
        >
          {col.badge && (
            <div className="badge" style={{ marginBottom: 'var(--space-sm)' }}>
              {col.badge}
            </div>
          )}
          {col.icon && (
            <div style={{ 
              fontSize: '32px', 
              marginBottom: 'var(--space-sm)',
              color: 'var(--color-brand)'
            }}>
              {col.icon}
            </div>
          )}
          {col.title && (
            <h3 style={{ 
              fontSize: '18px', 
              margin: '0 0 var(--space-sm)', 
              color: 'var(--color-text)' 
            }}>
              {col.title}
            </h3>
          )}
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: 1.6, 
            color: 'var(--color-muted)' 
          }}>
            {col.content}
          </div>
        </div>
      ))}
    </div>
  );
}
