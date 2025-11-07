"use client";
import { usePathname } from 'next/navigation';
import TransparentHeaderClient from '../components/TransparentHeaderClient';
import { useWidget } from '../components/GlobalWidgetProvider';
import { StrapiNavigationItem } from '@/types/strapi-cms';

interface HeaderWithWidgetClientProps {
  navItems: StrapiNavigationItem[];
}

export default function HeaderWithWidgetClient({ navItems }: HeaderWithWidgetClientProps) {
  const { openDrawer } = useWidget();
  const pathname = usePathname();
  
  // Determine text color based on page type
  // Subpages (not home) with light backgrounds should have black text
  const isSubpage = pathname !== '/' && pathname !== '/home';
  const textColor = isSubpage ? 'black' : 'white';
  
  return (
    <TransparentHeaderClient
      navItems={navItems}
      transparent={true}
      textColor={textColor}
      onCtaClick={() => openDrawer('header')}
    />
  );
}

