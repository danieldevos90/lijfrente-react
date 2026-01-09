"use client";
import React, { useEffect, useState } from 'react';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

interface ContactInfoProps {
  showEmail?: boolean;
  showPhone?: boolean;
  showKvk?: boolean;
  email?: string;
  phone?: string;
  kvkNumber?: string;
}

export default function ContactInfo({
  showEmail = false,
  showPhone = false,
  showKvk = false,
  email = 'info@geldgeregeld.nl',
  phone = '085-0480881',
  kvkNumber = '64859525',
}: ContactInfoProps) {
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    async function fetchFooter() {
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
        setFooterData(siteData);
      } catch (error: any) {
        // Silently fail
      }
    }
    fetchFooter();
  }, []);

  const footer = footerData?.attributes || footerData || {
    companyName: 'GeldGeregeld',
    address: 'Roggestraat 7',
    postalCode: '7311 CA',
    city: 'Apeldoorn',
    country: 'Nederland',
    email: 'info@geldgeregeld.nl',
    phone: '085-0480881',
    kvkNumber: '64859525',
  };

  // Use Strapi data if available, otherwise fall back to props or defaults
  const displayEmail = footer.email || email;
  const displayPhone = footer.phone || phone;
  const displayKvk = footer.kvkNumber || kvkNumber;

  return (
    <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, margin: 0 }}>
      <strong>{footer.companyName || 'GeldGeregeld'}</strong><br />
      {footer.address || 'Roggestraat 7'}<br />
      {footer.postalCode || '7311 CA'} {footer.city || 'Apeldoorn'}<br />
      {footer.country || 'Nederland'}
      {showKvk && (
        <>
          <br />
          KVK-nummer: {displayKvk}
        </>
      )}
      {showEmail && (
        <>
          <br />
          E-mail: {displayEmail}
        </>
      )}
      {showPhone && (
        <>
          <br />
          Telefoon: {displayPhone}
        </>
      )}
    </p>
  );
}
