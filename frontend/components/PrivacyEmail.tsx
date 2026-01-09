"use client";
import React, { useEffect, useState } from 'react';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default function PrivacyEmail({ 
  fallback = 'privacy@geldgeregeld.nl' 
}: { fallback?: string }) {
  const [email, setEmail] = useState(fallback);

  useEffect(() => {
    async function fetchEmail() {
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
        
        // Use privacy email if available, otherwise use main email
        if (footer?.privacyEmail) {
          setEmail(footer.privacyEmail);
        } else if (footer?.email) {
          setEmail(footer.email);
        }
      } catch (error: any) {
        // Silently fail, use fallback
      }
    }
    fetchEmail();
  }, []);

  return <>{email}</>;
}
