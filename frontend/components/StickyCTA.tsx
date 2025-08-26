"use client";
import React, { useState } from "react";
import LeadFormModal from "./modals/LeadFormModal";

interface StickyCTAProps {
  href?: string;
  label?: string;
  useModal?: boolean;
}

export default function StickyCTA({ href, label, useModal = true }: StickyCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (useModal) {
      e.preventDefault();
      setIsModalOpen(true);
      
      // Track modal open event
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ 
          event: 'cta_sticky_modal_open',
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    
    // Track modal close event
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 
        event: 'cta_sticky_modal_close',
        source: 'sticky_cta'
      });
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        right: 12,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          className="btn btn-primary"
          onClick={handleClick}
          style={{
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {label || 'Vraag financiering aan'}
        </button>
      </div>

      {useModal && (
        <LeadFormModal 
          isOpen={isModalOpen} 
          onClose={handleModalClose}
        />
      )}
    </>
  );
}


