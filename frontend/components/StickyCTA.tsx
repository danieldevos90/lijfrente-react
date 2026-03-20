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
          href: (href || '/lead')
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
      <button
        className="btn btn-primary"
        onClick={handleClick}
        style={{
          display: 'flex',
        }}
      >
        {label || 'Vraag financiering aan'}
      </button>

      {useDrawer && (
        <DrawerWidget
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          openTrigger="sticky_cta"
        />
      )}
    </>
  );
}


