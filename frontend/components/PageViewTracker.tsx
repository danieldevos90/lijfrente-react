"use client";
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * Component that automatically tracks page views on route changes
 * for Next.js App Router
 * 
 * This component tracks page views when:
 * 1. User navigates to a new page (pathname changes)
 * 2. Query parameters change
 * 3. Analytics consent is given
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track on client side
    if (typeof window === 'undefined') return;
    
    // Get the full path including search params
    const searchString = searchParams?.toString() || '';
    const path = pathname + (searchString ? `?${searchString}` : '');
    
    // Get page title
    const title = document?.title || '';
    
    // Track page view with a small delay to ensure GA4 is loaded
    // if consent was just given
    const timeoutId = setTimeout(() => {
      trackPageView(path, title);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return null;
}
