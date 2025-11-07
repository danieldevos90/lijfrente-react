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
          background: variant === 'gradient' || variant === 'image' ? '#fff' : undefined,
          color: variant === 'gradient' || variant === 'image' ? 'var(--color-brand)' : undefined,
          border: variant === 'gradient' || variant === 'image' ? '1px solid #fff' : undefined,
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}

