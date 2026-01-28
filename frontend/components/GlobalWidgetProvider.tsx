"use client";
import React, { useState, createContext, useContext, ReactNode } from 'react';
import dynamic from 'next/dynamic';

/**
 * Lazy load DrawerWidget for better initial page load performance
 * (vercel-react-best-practices: bundle-dynamic-imports)
 * 
 * The drawer is only loaded when the user clicks to open it,
 * reducing the initial JavaScript bundle size.
 */
const DrawerWidget = dynamic(() => import('./DrawerWidget'), {
  loading: () => (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      aria-label="Formulier wordt geladen"
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTopColor: 'var(--color-primary, #1a365d)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  ),
  ssr: false, // Client-side only component
});

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
  // Track if drawer has been opened at least once (for preloading)
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const openDrawer = (source: string) => {
    setIsDrawerOpen(true);
    setHasBeenOpened(true);
    
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
      {/* Only render DrawerWidget if it has been opened at least once or is currently open */}
      {(isDrawerOpen || hasBeenOpened) && (
        <DrawerWidget isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}
    </WidgetContext.Provider>
  );
}




