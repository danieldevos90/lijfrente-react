"use client";
import { useWidget } from '../GlobalWidgetProvider';

interface CTASectionButtonProps {
  ctaLabel: string;
  ctaHref: string;
}

export default function CTASectionButton({ ctaLabel, ctaHref }: CTASectionButtonProps) {
  const { openDrawer } = useWidget();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openDrawer('cta_section');
  };
  
  return (
    <a 
      className="btn btn-primary" 
      href={ctaHref || '#'}
      onClick={handleClick}
    >
      {ctaLabel}
    </a>
  );
}

