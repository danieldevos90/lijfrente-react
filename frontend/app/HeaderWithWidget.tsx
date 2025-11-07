"use client";
import TransparentHeader from '../components/TransparentHeader';
import { useWidget } from '../components/GlobalWidgetProvider';

export default function HeaderWithWidget() {
  const { openDrawer } = useWidget();
  
  return (
    <TransparentHeader 
      transparent={true} 
      textColor="white"
      onCtaClick={() => openDrawer('header')}
    />
  );
}

