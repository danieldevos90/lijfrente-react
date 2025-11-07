import { getNavigationItems } from '@/lib/strapi-cms';
import { StrapiNavigationItem } from '@/types/strapi-cms';
import TransparentHeaderClient from './TransparentHeaderClient';

interface TransparentHeaderProps {
  onCtaClick?: () => void;
  transparent?: boolean;
  textColor?: 'white' | 'black';
  siteId?: string;
  navItems?: StrapiNavigationItem[]; // Optional: if provided, skip server fetch
}

export default async function TransparentHeader({ 
  onCtaClick, 
  transparent = false, 
  textColor: initialTextColor = 'white',
  siteId = 'geldgeregeld',
  navItems: providedNavItems
}: TransparentHeaderProps) {
  // If navItems are provided, use them (for client component usage)
  // Otherwise, fetch from Strapi server-side
  let navItems: StrapiNavigationItem[] = providedNavItems || [];
  
  if (!providedNavItems) {
    try {
      navItems = await getNavigationItems(siteId);
    } catch (error) {
      console.error('Error fetching navigation:', error);
      // Fallback to empty array
    }
  }

  return (
    <TransparentHeaderClient
      navItems={navItems}
      onCtaClick={onCtaClick}
      transparent={transparent}
      textColor={initialTextColor}
    />
  );
}
