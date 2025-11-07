import React from 'react';

interface ImageTextBlockProps {
  title?: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  layout?: 'image-left' | 'image-right' | 'image-top';
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'default' | 'bordered' | 'shadow';
}

export default function ImageTextBlock({
  title,
  content,
  imageUrl,
  imageAlt = '',
  layout = 'image-left',
  ctaLabel,
  ctaHref,
  variant = 'default'
}: ImageTextBlockProps) {
  const containerStyle = {
    display: layout === 'image-top' ? 'block' : (!imageUrl && (layout === 'image-left' || layout === 'image-right')) ? 'block' : 'grid',
    gridTemplateColumns: layout === 'image-left' ? '1fr 1.5fr' : layout === 'image-right' ? '1.5fr 1fr' : '1fr',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: variant === 'bordered' || variant === 'shadow' ? 'var(--space-lg)' : '0',
    border: variant === 'bordered' ? '1px solid var(--color-border)' : 'none',
    borderRadius: variant === 'bordered' || variant === 'shadow' ? 'var(--radius-md)' : '0',
    boxShadow: variant === 'shadow' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
    background: variant === 'bordered' || variant === 'shadow' ? '#fff' : 'transparent'
  };

  const imageStyle = {
    width: '100%',
    height: layout === 'image-top' ? '200px' : '300px',
    objectFit: 'cover' as const,
    borderRadius: 'var(--radius-sm)',
    marginBottom: layout === 'image-top' ? 'var(--space-md)' : '0'
  };

  const textContent = (
    <div style={{ 
      maxWidth: !imageUrl ? '800px' : '100%',
      margin: !imageUrl ? '0 auto' : '0',
      textAlign: !imageUrl ? 'center' as const : 'left' as const
    }}>
      {title && (
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
          margin: '0 0 var(--space-md)', 
          color: 'var(--color-text)',
          fontWeight: 600
        }}>
          {title}
        </h2>
      )}
      <div style={{ 
        whiteSpace: 'pre-wrap', 
        lineHeight: 1.7, 
        color: 'var(--color-text)',
        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
        marginBottom: ctaLabel ? 'var(--space-md)' : '0'
      }}>
        {content}
      </div>
      {ctaLabel && ctaHref && (
        <div className="row" style={{ marginTop: 'var(--space-md)' }}>
          <a className="btn btn-primary" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
      )}
    </div>
  );

  const imageElement = imageUrl ? (
    <img 
      src={imageUrl} 
      alt={imageAlt}
      style={imageStyle}
    />
  ) : (
    <div style={{
      ...imageStyle,
      background: 'var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-muted)',
      fontSize: '14px'
    }}>
      Afbeelding
    </div>
  );

  return (
    <div style={containerStyle}>
      {layout === 'image-left' && imageUrl && imageElement}
      {textContent}
      {layout === 'image-right' && imageUrl && imageElement}
      {layout === 'image-top' && imageUrl && imageElement}
    </div>
  );
}
