import './tokens.css';
import './globals.css';
import type { ReactNode } from 'react';
import GlobalWidgetProvider from '../components/GlobalWidgetProvider';
import PasswordProtection from '../components/PasswordProtection';
import { ErrorHandler } from './error-handler';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';
export const metadata = {
  title: SITE_NAME + ' - Zakelijke Financiering',
  description: 'Snel en simpel zakelijke financiering regelen – binnen 24 uur reactie en transparante voorwaarden',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#457fff' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleApiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io';
  return (
    <html lang="nl">
      <head>
        {/* Suppress unhandled promise rejections and 401 errors immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDev = ${process.env.NODE_ENV === 'development'};
                
                // Intercept fetch to log and suppress 401 errors
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                  const url = args[0];
                  const isStrapiCall = typeof url === 'string' && (
                    url.includes('strapiapp.com') ||
                    url.includes('/api/sites') ||
                    url.includes('/api/strapi')
                  );
                  
                  if (isDev && isStrapiCall) {
                    console.log('[CLIENT FETCH]', url);
                  }
                  
                  return originalFetch.apply(this, args)
                    .then(response => {
                      if (isDev && isStrapiCall) {
                        console.log('[CLIENT FETCH RESPONSE]', {
                          url,
                          status: response.status,
                          statusText: response.statusText,
                          ok: response.ok
                        });
                      }
                      
                      // Suppress 401 errors by returning a fake successful response
                      if (response.status === 401 && isStrapiCall) {
                        if (isDev) {
                          console.warn('[CLIENT FETCH] Suppressing 401 error for:', url);
                        }
                        // Return a response that looks successful but has no data
                        return new Response(JSON.stringify({ data: null }), {
                          status: 200,
                          statusText: 'OK',
                          headers: { 'Content-Type': 'application/json' }
                        });
                      }
                      return response;
                    })
                    .catch(error => {
                      // Suppress network errors and "Load failed" errors
                      if (isDev && isStrapiCall) {
                        // Only log if it's not a network error
                        if (!error.message?.includes('Load failed') && 
                            !error.message?.includes('Failed to fetch') &&
                            !error.message?.includes('network')) {
                          console.warn('[CLIENT FETCH ERROR]', { url, error: error.message });
                        }
                      }
                      // Always return a fake successful response to prevent errors
                      return new Response(JSON.stringify({ data: null }), {
                        status: 200,
                        statusText: 'OK',
                        headers: { 'Content-Type': 'application/json' }
                      });
                    });
                };
                
                // Suppress ALL unhandled promise rejections (not just 401s)
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason;
                  // Suppress 401, network errors, and "No response received" errors
                  if (reason && (
                    (reason.message && (
                      reason.message.includes('401') ||
                      reason.message.includes('Unauthorized') ||
                      reason.message.includes('No response received') ||
                      reason.message.includes('Failed to fetch') ||
                      reason.message.includes('Load failed') ||
                      reason.message.includes('network') ||
                      reason.message.includes('Could not connect')
                    )) ||
                    (reason.name && (
                      reason.name === 'TypeError' ||
                      reason.name === 'NetworkError'
                    )) ||
                    reason.status === 401 ||
                    reason.status === 403 ||
                    (reason.response && reason.response.status === 401) ||
                    String(reason).includes('401') ||
                    String(reason).includes('Unauthorized') ||
                    String(reason).includes('sites') ||
                    String(reason).includes('Load failed') ||
                    String(reason).includes('No response received') ||
                    String(reason).includes('Could not connect')
                  )) {
                    if (isDev) {
                      console.warn('[UNHANDLED REJECTION] Suppressed:', reason);
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                });
                
                // Suppress console errors for 401s and network errors
                const originalError = console.error;
                console.error = function() {
                  const message = Array.from(arguments).join(' ');
                  if (message.includes('401') || 
                      message.includes('Unauthorized') ||
                      message.includes('No response received') ||
                      message.includes('Failed to load resource') ||
                      message.includes('Load failed') ||
                      message.includes('Could not connect') ||
                      message.includes('sites') ||
                      message.includes('footer')) {
                    if (isDev) {
                      console.warn('[CONSOLE ERROR] Suppressed:', message);
                    }
                    return; // Suppress these errors
                  }
                  originalError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
        {gtmId ? (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`,
              }}
            />
            <script async src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}></script>
          </>
        ) : null}
        {plausibleDomain ? (
          <script defer data-domain={plausibleDomain} src={`${plausibleApiHost}/js/script.js`}></script>
        ) : null}
      </head>
      <body>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        <ErrorHandler />
        <PasswordProtection>
        <GlobalWidgetProvider>
          {children}
        </GlobalWidgetProvider>
        </PasswordProtection>
      </body>
    </html>
  );
}
