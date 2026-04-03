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
 * Fires: GA4 generate_lead, Meta Lead (+ QualifiedLead for warm), Google Ads conversion
 */
export function trackLeadGeneration(
  source: string,
  additionalParams?: Record<string, any>
) {
  const metaEventId =
    typeof additionalParams?.meta_event_id === 'string' ? additionalParams.meta_event_id : undefined;
  const leadQuality = additionalParams?.lead_quality as string | undefined;

  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    lead_source: source,
    lead_quality: leadQuality,
    ...additionalParams,
  });
  trackMetaEvent(
    'Lead',
    {
      content_name: source || META_CONTENT_NAME,
      source,
      lead_quality: leadQuality || 'onbekend',
      ...additionalParams,
      meta_event_id: undefined,
    },
    metaEventId ? { eventID: metaEventId } : undefined
  );

  // Fire QualifiedLead for warm leads so Meta can optimize on this custom event
  if (leadQuality === 'warm') {
    trackMetaEvent(
      'QualifiedLead',
      {
        content_name: source || META_CONTENT_NAME,
        source,
        lead_quality: 'warm',
        ...additionalParams,
        meta_event_id: undefined,
      },
      metaEventId ? { eventID: `${metaEventId}_qualified` } : undefined
    );
  }

  // Google Ads conversion (when NEXT_PUBLIC_GOOGLE_ADS_ID + conversion label are set)
  if (typeof window !== 'undefined' && hasMarketingConsent() && window.gtag) {
    const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
    const gadsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
    if (gadsId && gadsLabel) {
      const value = typeof additionalParams?.amount === 'number' ? additionalParams.amount : undefined;
      window.gtag('event', 'conversion', {
        send_to: `${gadsId}/${gadsLabel}`,
        value,
        currency: 'EUR',
        transaction_id: metaEventId || `lead_${Date.now()}`,
      });
    }
  }
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

/** Where the quick lead form is shown (for funnel reporting). */
export type QuickLeadSurface = 'drawer' | 'exit_intent_modal' | 'inline';

/** How the user dismissed the drawer/modal (for abandon breakdown). */
export type QuickLeadCloseMethod = 'overlay' | 'close_button' | 'escape';

/** Normalized reasons so GA4 explorations can group drop-offs. */
export type QuickLeadValidationReason =
  | 'missing_amount'
  | 'missing_purpose'
  | 'missing_first_name'
  | 'missing_last_name'
  | 'missing_company'
  | 'invalid_email'
  | 'missing_phone'
  | 'invalid_kvk'
  | 'missing_revenue'
  | 'revenue_below_minimum'
  | 'missing_business_activities'
  | 'missing_urgency'
  | 'screening_disqualified'
  | 'submit_http_error'
  | 'submit_api_rejected'
  | 'other';

const QUICK_LEAD_MSG_TO_REASON: Record<string, QuickLeadValidationReason> = {
  'Kies een bedrag.': 'missing_amount',
  'Kies waarvoor je de financiering gebruikt.': 'missing_purpose',
  'Vul je naam in.': 'missing_first_name',
  'Vul je achternaam in.': 'missing_last_name',
  'Vul je bedrijfsnaam in.': 'missing_company',
  'Vul een geldig e-mailadres in.': 'invalid_email',
  'Vul een telefoonnummer in.': 'missing_phone',
  'Vul een geldig KvK-nummer in (8 cijfers).': 'invalid_kvk',
  'Kies je verwachte jaaromzet.': 'missing_revenue',
  'De minimale jaaromzet is € 100.000. Kom je niet in aanmerking voor deze financiering.':
    'revenue_below_minimum',
  'Beschrijf je bedrijfsactiviteiten.': 'missing_business_activities',
  'Kies wanneer je het geld nodig hebt.': 'missing_urgency',
};

function isScreeningMessage(msg: string): boolean {
  return msg.startsWith('screening_disqualified:');
}

/**
 * Map Dutch validation copy to a stable reason code (and optional short detail for "other").
 */
export function quickLeadMessageToValidationReason(message: string): {
  reason: QuickLeadValidationReason;
  detail?: string;
} {
  const trimmed = (message || '').trim();
  if (isScreeningMessage(trimmed)) {
    return { reason: 'screening_disqualified', detail: trimmed.split(':')[1] };
  }
  if (QUICK_LEAD_MSG_TO_REASON[trimmed]) {
    return { reason: QUICK_LEAD_MSG_TO_REASON[trimmed] };
  }
  if (trimmed === 'submit_failed' || /Verzenden mislukt|Too many requests|400|500/i.test(trimmed)) {
    if (/100\.000|jaaromzet|minimaal/i.test(trimmed)) {
      return { reason: 'submit_api_rejected', detail: trimmed.slice(0, 100) };
    }
    return { reason: 'submit_http_error', detail: trimmed.slice(0, 100) };
  }
  return {
    reason: 'other',
    detail: trimmed.slice(0, 100),
  };
}

export type QuickLeadFunnelAction =
  | 'form_mount'
  | 'step_view'
  | 'step_advance'
  | 'step_back'
  | 'step_tab_to_1'
  | 'validation_blocked'
  | 'submit_attempt'
  | 'submit_success'
  | 'submit_failed'
  | 'surface_close_abandon';

/**
 * Unified GA4 + dataLayer event for quick lead drawer/modal/page funnel analysis.
 * Register in GA4 as recommended event or create explorations filtering by event name
 * `quick_lead_funnel` and dimensions: funnel_action, funnel_step, funnel_surface,
 * validation_reason, close_method, funnel_session_id.
 */
export function trackQuickLeadFunnel(params: {
  action: QuickLeadFunnelAction;
  /** Current step after the action (or step user was on for abandon). */
  step: 1 | 2;
  surface: QuickLeadSurface;
  /** One id per form open; correlate all steps in one session. */
  funnel_session_id: string;
  from_step?: 1 | 2;
  validation_reason?: QuickLeadValidationReason;
  /** Human-readable fallback when reason is other */
  validation_detail?: string;
  close_method?: 'overlay' | 'close_button' | 'escape';
  open_trigger?: string;
  purpose?: string;
  sector?: string;
  lead_source?: string;
  contact_variant?: string;
  lead_quality?: string;
}): void {
  if (typeof window === 'undefined') return;

  const payload: Record<string, unknown> = {
    event_category: 'Lead Funnel',
    funnel_action: params.action,
    funnel_step: params.step,
    funnel_surface: params.surface,
    funnel_session_short: params.funnel_session_id,
  };
  if (params.from_step !== undefined) payload.from_step = params.from_step;
  if (params.validation_reason) payload.validation_reason = params.validation_reason;
  if (params.validation_detail) payload.validation_detail = params.validation_detail;
  if (params.close_method) payload.close_method = params.close_method;
  if (params.open_trigger) payload.open_trigger = params.open_trigger;
  if (params.purpose) payload.purpose = params.purpose;
  if (params.sector) payload.sector = params.sector;
  if (params.lead_source) payload.lead_source = params.lead_source;
  if (params.contact_variant) payload.contact_variant = params.contact_variant;
  if (params.lead_quality) payload.lead_quality = params.lead_quality;

  trackEvent('quick_lead_funnel', {
    ...payload,
    funnel_session_id: params.funnel_session_id,
  } as Record<string, unknown>);

  // GTM / Tag Manager (many setups listen on dataLayer)
  if (hasAnalyticsConsent()) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'quick_lead_funnel',
      ...payload,
      funnel_session_id: params.funnel_session_id,
    });
  }
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
