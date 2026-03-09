/**
 * GA4 Analytics Event Tracking
 * Provides utilities for tracking events throughout the application
 * Only tracks if user has consented to analytics cookies
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

type CookieConsentPreferences = {
  necessary?: boolean;
  analytics?: boolean;
  marketing?: boolean;
};

const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';
const META_CONTENT_NAME = 'GeldGeregeld';

export function createTrackingEventId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${randomPart}`;
}

function getCookieConsentPreferences(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  const consentCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));

  if (!consentCookie) return null;

  try {
    return JSON.parse(decodeURIComponent(consentCookie.split('=')[1]));
  } catch {
    return null;
  }
}

/**
 * Check if analytics consent has been given
 */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsentPreferences()?.analytics === true;
}

/**
 * Check if marketing consent has been given
 */
export function hasMarketingConsent(): boolean {
  return getCookieConsentPreferences()?.marketing === true;
}

function hasMetaPixelLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  options?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (!hasMarketingConsent()) return;
  if (!hasMetaPixelLoaded()) return;
  window.fbq?.('track', eventName, params || {}, options || {});
}

/**
 * Track a GA4 event
 */
export function trackEvent(
  eventName: string,
  eventParams?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }
) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (!window.gtag) return;

  window.gtag('event', eventName, eventParams);
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;
  if (hasAnalyticsConsent() && window.gtag) {
    window.gtag('config', 'G-1VMPEWNNT0', {
      page_path: path,
      page_title: title,
    });
  }
  trackMetaEvent('PageView', {
    page_path: path,
    content_name: title || META_CONTENT_NAME,
  });
}

/**
 * Track form interactions
 */
export function trackFormEvent(
  action: 'view' | 'start' | 'submit' | 'error' | 'complete',
  formId: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('form_' + action, {
    event_category: 'Form',
    form_id: formId,
    ...additionalParams,
  });
}

/**
 * Track button clicks
 */
export function trackButtonClick(
  buttonLabel: string,
  location?: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('button_click', {
    event_category: 'Engagement',
    event_label: buttonLabel,
    button_location: location,
    ...additionalParams,
  });
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(
  ctaLabel: string,
  ctaLocation: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('cta_click', {
    event_category: 'Conversion',
    event_label: ctaLabel,
    cta_location: ctaLocation,
    ...additionalParams,
  });
}

/**
 * Track lead generation events
 */
export function trackLeadGeneration(
  source: string,
  additionalParams?: Record<string, any>
) {
  const metaEventId =
    typeof additionalParams?.meta_event_id === 'string' ? additionalParams.meta_event_id : undefined;

  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    lead_source: source,
    ...additionalParams,
  });
  trackMetaEvent(
    'Lead',
    {
      content_name: source || META_CONTENT_NAME,
      source,
      ...additionalParams,
      meta_event_id: undefined,
    },
    metaEventId ? { eventID: metaEventId } : undefined
  );
}

/**
 * Track drawer/widget interactions
 */
export function trackDrawerEvent(
  action: 'open' | 'close' | 'step_complete' | 'step_back',
  step?: number,
  additionalParams?: Record<string, any>
) {
  trackEvent('drawer_' + action, {
    event_category: 'Widget',
    drawer_step: step,
    ...additionalParams,
  });
}

/**
 * Track search events
 */
export function trackSearch(
  searchTerm: string,
  resultsCount?: number,
  additionalParams?: Record<string, any>
) {
  trackEvent('search', {
    event_category: 'Search',
    search_term: searchTerm,
    results_count: resultsCount,
    ...additionalParams,
  });
}

/**
 * Track video interactions
 */
export function trackVideoEvent(
  action: 'play' | 'pause' | 'complete',
  videoTitle: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('video_' + action, {
    event_category: 'Video',
    video_title: videoTitle,
    ...additionalParams,
  });
}

/**
 * Track file downloads
 */
export function trackDownload(
  fileName: string,
  fileType: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('file_download', {
    event_category: 'Download',
    file_name: fileName,
    file_type: fileType,
    ...additionalParams,
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(
  url: string,
  linkText?: string,
  additionalParams?: Record<string, any>
) {
  trackEvent('external_link_click', {
    event_category: 'Outbound',
    link_url: url,
    link_text: linkText,
    ...additionalParams,
  });
}

/**
 * Track email/phone contact interactions
 */
export function trackContactClick(
  channel: 'phone' | 'email',
  destination: string,
  additionalParams?: Record<string, unknown>
) {
  trackEvent('contact_click', {
    event_category: 'Conversion',
    contact_channel: channel,
    contact_destination: destination,
    ...additionalParams,
  });

  trackMetaEvent('Contact', {
    content_name: channel,
    status: 'clicked',
    destination,
    ...additionalParams,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number) {
  trackEvent('scroll', {
    event_category: 'Engagement',
    scroll_depth: depth,
  });
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number) {
  trackEvent('time_on_page', {
    event_category: 'Engagement',
    time_on_page: seconds,
  });
}
