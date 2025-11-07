"use client";
import React, { useState, createContext, useContext, ReactNode } from 'react';
import DrawerWidget from './DrawerWidget';

interface WidgetContextType {
  openDrawer: (source: string) => void;
  closeDrawer: () => void;
  isOpen: boolean;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function useWidget() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidget must be used within a GlobalWidgetProvider');
  }
  return context;
}

export default function GlobalWidgetProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = (source: string) => {
    setIsDrawerOpen(true);
    
    // Track drawer open event
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 
        event: 'cta_drawer_open',
        source: source
      });
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    
    // Track drawer close event
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 
        event: 'cta_drawer_close'
      });
    }
  };

  return (
    <WidgetContext.Provider value={{ openDrawer, closeDrawer, isOpen: isDrawerOpen }}>
      {children}
      <DrawerWidget isOpen={isDrawerOpen} onClose={closeDrawer} />
    </WidgetContext.Provider>
  );
}



