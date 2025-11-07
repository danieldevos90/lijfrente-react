"use client";
import { useWidget } from '../GlobalWidgetProvider';

interface HeroCTAButtonProps {
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'default' | 'gradient' | 'image';
}

export default function HeroCTAButton({ ctaLabel, ctaHref, variant = 'default' }: HeroCTAButtonProps) {
  const { openDrawer } = useWidget();
  
  if (!ctaLabel) return null;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openDrawer('hero_primary');
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <a
        className="btn btn-primary"
        href={ctaHref || '#'}
        onClick={handleClick}
        style={{
          background: variant === 'gradient' || variant === 'image' ? '#fff' : 'var(--color-brand)',
          color: variant === 'gradient' || variant === 'image' ? 'var(--color-brand)' : '#fff',
          border: variant === 'gradient' || variant === 'image' ? '1px solid #fff' : '1px solid var(--color-brand)',
          borderRadius: '10rem'
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}

