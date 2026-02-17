"use client";
import { useWidget } from '../GlobalWidgetProvider';

interface CTASectionButtonProps {
  ctaLabel: string;
  ctaHref?: string;
}

function sanitizeHref(href: string | undefined, fallback: string) {
  const trimmed = (href || '').trim();
  return trimmed && trimmed !== '#' ? trimmed : fallback;
}

export default function CTASectionButton({ ctaLabel, ctaHref }: CTASectionButtonProps) {
  const { openDrawer } = useWidget();
  const resolvedHref = sanitizeHref(ctaHref, '/lead');
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openDrawer('cta_section');
  };
  
  return (
    <a 
      className="btn btn-primary" 
      href={resolvedHref}
      onClick={handleClick}
    >
      {ctaLabel}
    </a>
  );
}

