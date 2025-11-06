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
            border: '1px solid var(--color-charcoal)',
            backgroundColor: 'var(--color-charcoal)',
            color: 'white',
            textAlign: 'center',
            borderRadius: '.25rem',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '10.5rem',
            maxHeight: '2.75rem',
            padding: '1rem 1.5rem',
            fontFamily: 'Public Sans Variable, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1,
            transition: 'border-color .28s, background-color .28s',
            display: 'flex',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 32, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
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


