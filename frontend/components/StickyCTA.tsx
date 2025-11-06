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
      <button
        className="btn btn-primary"
        onClick={handleClick}
        style={{
          border: 'none',
          backgroundColor: '#000000',
          color: 'white',
          textAlign: 'center',
          borderRadius: '10rem',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '14rem',
          padding: '1.5rem 3rem',
          fontFamily: 'Public Sans Variable, sans-serif',
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: '1rem',
          transition: 'all .28s',
          display: 'flex',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#333333';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
        }}
      >
        {label || 'Vraag financiering aan'}
      </button>

      {useDrawer && (
        <DrawerWidget 
          isOpen={isDrawerOpen} 
          onClose={handleDrawerClose}
        />
      )}
    </>
  );
}


