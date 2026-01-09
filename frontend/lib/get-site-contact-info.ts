/**
 * Get site contact information from Strapi
 * Can be used in both server and API routes
 */

import { getFooterContent } from './strapi-cms';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export interface SiteContactInfo {
  email: string;
  phone: string;
  kvkNumber: string;
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

const DEFAULT_CONTACT_INFO: SiteContactInfo = {
  email: 'info@geldgeregeld.nl',
  phone: '085-0480881',
  kvkNumber: '64859525',
  companyName: 'GeldGeregeld',
  address: 'Roggestraat 7',
  postalCode: '7311 CA',
  city: 'Apeldoorn',
  country: 'Nederland',
};

export async function getSiteContactInfo(): Promise<SiteContactInfo> {
  try {
    const siteData = await getFooterContent(SITE_ID);
    if (!siteData) {
      return DEFAULT_CONTACT_INFO;
    }

    const site = siteData.attributes || siteData;
    return {
      email: site.email || DEFAULT_CONTACT_INFO.email,
      phone: site.phone || DEFAULT_CONTACT_INFO.phone,
      kvkNumber: site.kvkNumber || DEFAULT_CONTACT_INFO.kvkNumber,
      companyName: site.companyName || DEFAULT_CONTACT_INFO.companyName,
      address: site.address || DEFAULT_CONTACT_INFO.address,
      postalCode: site.postalCode || DEFAULT_CONTACT_INFO.postalCode,
      city: site.city || DEFAULT_CONTACT_INFO.city,
      country: site.country || DEFAULT_CONTACT_INFO.country,
    };
  } catch (error) {
    console.error('Error fetching site contact info:', error);
    return DEFAULT_CONTACT_INFO;
  }
}
