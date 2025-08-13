"use client";
import React from "react";

export default function StickyCTA({ href, label }: { href: string; label?: string }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 12,
      left: 12,
      right: 12,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <a
        className="btn btn-primary"
        href={href}
        onClick={() => {
          if (typeof window !== 'undefined') {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({ event: 'cta_sticky_click', href });
          }
        }}
        style={{
          boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
        }}
      >
        {label || 'Vraag financiering aan'}
      </a>
    </div>
  );
}


