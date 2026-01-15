"use client";
import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings, Check } from 'lucide-react';
import './CookieBanner.css';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';
const COOKIE_CONSENT_EXPIRY_DAYS = 365;

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = getCookie(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
        applyCookiePreferences(parsed);
      } catch (e) {
        // Invalid cookie, show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  };

  const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Always load necessary cookies (they're required for site functionality)
    
    // Load GA4 only if analytics is enabled
    if (prefs.analytics && typeof window !== 'undefined') {
      loadGA4();
    } else {
      // Disable GA4 if user rejected analytics
      if (typeof window !== 'undefined') {
        (window as any).gtag = function() {
          // Disable gtag calls
        };
      }
    }

    // Marketing cookies would be loaded here if needed
    // Currently we don't use marketing cookies, but the structure is ready
  };

  const loadGA4 = () => {
    if (typeof window === 'undefined') return;
    
    const GA4_ID = 'G-1VMPEWNNT0';
    
    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="${GA4_ID}"]`);
    if (existingScript) {
      // Script already loaded, just update consent and send page view
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: preferences.marketing ? 'granted' : 'denied',
        });
        // Send current page view
        (window as any).gtag('config', GA4_ID, {
          page_path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/',
          page_title: typeof document !== 'undefined' ? document.title : '',
        });
      }
      return;
    }

    // Initialize gtag (if not already initialized)
    (window as any).dataLayer = (window as any).dataLayer || [];
    if (!(window as any).gtag) {
      const gtag = (...args: any[]) => {
        (window as any).dataLayer.push(args);
      };
      (window as any).gtag = gtag;
      gtag('js', new Date());
    }

    // Get current page info
    const pagePath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
    const pageTitle = typeof document !== 'undefined' ? document.title : '';

    // Load gtag script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    
    // Configure GA4 with privacy settings and initial page view
    // This will be queued in dataLayer and processed when script loads
    (window as any).gtag('config', GA4_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_path: pagePath,
      page_title: pageTitle,
    });

    // Set consent
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
    });

    // Append script to DOM (this triggers the load)
    document.head.appendChild(script1);

    // Send explicit page_view event after script loads (as backup)
    script1.onload = () => {
      if ((window as any).gtag) {
        // The config call above should already send the page view,
        // but send an explicit event as well to ensure it's tracked
        (window as any).gtag('event', 'page_view', {
          page_path: pagePath,
          page_title: pageTitle,
        });
      }
    };
  };

  const acceptAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const newPrefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    setCookie(COOKIE_CONSENT_KEY, JSON.stringify(prefs), COOKIE_CONSENT_EXPIRY_DAYS);
    applyCookiePreferences(prefs);
    
    // Track consent event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cookie_consent', {
        event_category: 'Privacy',
        analytics_enabled: prefs.analytics,
        marketing_enabled: prefs.marketing,
      });
    }
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="cookie-banner-overlay" onClick={() => setShowBanner(false)} />
      <div className={`cookie-banner ${showSettings ? 'settings-open' : ''}`}>
        {!showSettings ? (
          <>
            <div className="cookie-banner-content">
              <div className="cookie-banner-icon">
                <Cookie size={24} />
              </div>
              <div className="cookie-banner-text">
                <h3>Wij gebruiken cookies</h3>
                <p>
                  Wij gebruiken cookies om onze website te verbeteren en te analyseren hoe u onze website gebruikt. 
                  U kunt zelf kiezen welke cookies u accepteert. 
                  <a href="/cookies" style={{ marginLeft: '0.5rem', textDecoration: 'underline' }}>Meer informatie</a>
                </p>
              </div>
            </div>
            <div className="cookie-banner-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={16} />
                Instellingen
              </button>
              <button 
                className="btn btn-secondary"
                onClick={rejectAll}
              >
                Weigeren
              </button>
              <button 
                className="btn btn-primary"
                onClick={acceptAll}
              >
                Accepteren
              </button>
            </div>
            <button 
              className="cookie-banner-close"
              onClick={() => setShowBanner(false)}
              aria-label="Sluiten"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <div className="cookie-settings">
            <div className="cookie-settings-header">
              <h3>Cookie-instellingen</h3>
              <button 
                className="cookie-banner-close"
                onClick={() => setShowSettings(false)}
                aria-label="Sluiten"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="cookie-settings-content">
              <div className="cookie-setting-item">
                <div className="cookie-setting-info">
                  <h4>Noodzakelijke cookies</h4>
                  <p>Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld.</p>
                </div>
                <div className="cookie-setting-toggle disabled">
                  <Check size={16} />
                </div>
              </div>

              <div className="cookie-setting-item">
                <div className="cookie-setting-info">
                  <h4>Analytische cookies</h4>
                  <p>Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken via Google Analytics.</p>
                </div>
                <label className="cookie-setting-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="cookie-setting-item">
                <div className="cookie-setting-info">
                  <h4>Marketing cookies</h4>
                  <p>Deze cookies worden gebruikt om relevante advertenties te tonen (momenteel niet actief).</p>
                </div>
                <label className="cookie-setting-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    disabled
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="cookie-settings-actions">
              <button 
                className="btn btn-secondary"
                onClick={rejectAll}
              >
                Alles weigeren
              </button>
              <button 
                className="btn btn-primary"
                onClick={saveCustomPreferences}
              >
                Instellingen opslaan
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
