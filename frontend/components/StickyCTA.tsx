"use client";
import React, { useState } from "react";
import DrawerWidget from "./DrawerWidget";

interface StickyCTAProps {
  href?: string;
  label?: string;
  useDrawer?: boolean;
}

export default function StickyCTA({ href, label, useDrawer = true }: StickyCTAProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (useDrawer) {
      e.preventDefault();
      setIsDrawerOpen(true);
      
      // Track drawer open event
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ 
          event: 'cta_sticky_drawer_open',
          source: 'sticky_cta'
        });
      }
    } else {
      // Track regular click event
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ 
          event: 'cta_sticky_click', 
          href: href || '#'
        });
      }
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    
    // Track drawer close event
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 
        event: 'cta_sticky_drawer_close',
        source: 'sticky_cta'
      });
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}>
        <button
          className="btn btn-primary"
          onClick={handleClick}
          style={{
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '14px 32px',
          }}
        >
          {label || 'Vraag financiering aan'}
        </button>
      </div>

      {useDrawer && (
        <DrawerWidget 
          isOpen={isDrawerOpen} 
          onClose={handleDrawerClose}
        />
      )}
    </>
  );
}


