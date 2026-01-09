"use client";
import React, { useEffect, useState } from 'react';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default function KvkNumber({ 
  fallback = '64859525' 
}: { fallback?: string }) {
  const [kvk, setKvk] = useState(fallback);

  useEffect(() => {
    async function fetchKvk() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`/api/strapi/footer?siteId=${SITE_ID}`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          return;
        }
        const json = await response.json();
        const siteData = json?.data?.[0] || null;
        const footer = siteData?.attributes || siteData;
        
        if (footer?.kvkNumber) {
          setKvk(footer.kvkNumber);
        }
      } catch (error: any) {
        // Silently fail, use fallback
      }
    }
    fetchKvk();
  }, []);

  return <>{kvk}</>;
}
