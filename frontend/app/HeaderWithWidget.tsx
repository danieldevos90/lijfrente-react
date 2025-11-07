"use client";
import TransparentHeader from '../components/TransparentHeader';
import { useWidget } from '../components/GlobalWidgetProvider';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default function HeaderWithWidget() {
  const { openDrawer } = useWidget();
  
  return (
    <TransparentHeader 
      transparent={true} 
      textColor="white"
      onCtaClick={() => openDrawer('header')}
      siteId={SITE_ID}
    />
  );
}

