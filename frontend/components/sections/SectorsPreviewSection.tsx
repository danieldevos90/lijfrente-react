import { getAllSectorPages } from '@/lib/strapi-cms';
import SectorsPreview from './SectorsPreview';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

interface SectorsPreviewSectionProps {
  title?: string;
  subtitle?: string;
  maxItems?: number;
  backgroundColor?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default async function SectorsPreviewSection({
  title,
  subtitle,
  maxItems = 6,
  backgroundColor,
  showViewAll = true,
  viewAllHref = '/sectoren'
}: SectorsPreviewSectionProps) {
  // Fetch all sector pages from Strapi
  let sectorPages = [];
  try {
    sectorPages = await getAllSectorPages(SITE_ID, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
  } catch (error) {
    // Silently fail - component will show empty state
  }

  // Transform Strapi data to component format
  const sectors = sectorPages.map((page: any) => {
    const pageData = page.attributes || page;
    return {
      slug: pageData.sectorSlug || '',
      name: pageData.sectorName || pageData.sectorSlug || '',
      description: pageData.metaDescription || pageData.heroSubtitle || '',
      iconPath: undefined, // Will use fallback from component
      heroImage: pageData.heroImage,
    };
  }).filter((sector: any) => sector.slug); // Filter out invalid sectors

  // If no sectors from Strapi, return null (component handles empty state)
  if (sectors.length === 0) {
    return null;
  }

  return (
    <SectorsPreview
      sectors={sectors}
      title={title}
      subtitle={subtitle}
      maxItems={maxItems}
      backgroundColor={backgroundColor}
      showViewAll={showViewAll}
      viewAllHref={viewAllHref}
    />
  );
}
