"use client";
import TransparentHeaderClient from '../components/TransparentHeaderClient';
import { useWidget } from '../components/GlobalWidgetProvider';
import { StrapiNavigationItem } from '@/types/strapi-cms';

interface HeaderWithWidgetClientProps {
  navItems: StrapiNavigationItem[];
}

export default function HeaderWithWidgetClient({ navItems }: HeaderWithWidgetClientProps) {
  const { openDrawer } = useWidget();
  
  return (
    <TransparentHeaderClient
      navItems={navItems}
      transparent={true}
      textColor="white"
      onCtaClick={() => openDrawer('header')}
    />
  );
}

