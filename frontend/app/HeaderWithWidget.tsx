import { getNavigationItems } from '@/lib/strapi-cms';
import HeaderWithWidgetClient from './HeaderWithWidgetClient';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default async function HeaderWithWidget() {
  // Fetch navigation from Strapi server-side only (no fallback)
  const navItems = await getNavigationItems(SITE_ID);
  
  return <HeaderWithWidgetClient navItems={navItems} />;
}

