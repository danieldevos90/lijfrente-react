/**
 * Schema Markup Component
 * Renders JSON-LD structured data for SEO
 */

import { generateOrganizationSchema, generateWebSiteSchema, getBaseUrl } from '@/lib/seo';
import { getSiteContactInfo } from '@/lib/get-site-contact-info';

export default async function SchemaMarkup() {
  const baseUrl = getBaseUrl();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';
  const contactInfo = await getSiteContactInfo();

  // Organization schema
  const organizationSchema = generateOrganizationSchema({
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      contactType: 'customer service',
      email: process.env.CONTACT_EMAIL || contactInfo.email,
    },
    sameAs: [
      // Add social media URLs here if available
      // 'https://www.linkedin.com/company/geldgeregeld',
      // 'https://twitter.com/geldgeregeld',
    ],
  });

  // Website schema with search action
  const websiteSchema = generateWebSiteSchema(
    baseUrl,
    `${baseUrl}/search?q={search_term_string}`
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 2),
        }}
      />
    </>
  );
}
