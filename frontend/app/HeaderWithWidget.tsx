import { getNavigationItems } from '@/lib/strapi-cms';
import HeaderWithWidgetClient from './HeaderWithWidgetClient';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default async function HeaderWithWidget() {
  // Fetch navigation from Strapi server-side
  let navItems = [];
  
  try {
    navItems = await getNavigationItems(SITE_ID);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    // Fallback to empty array
  }
  
  return <HeaderWithWidgetClient navItems={navItems} />;
}

