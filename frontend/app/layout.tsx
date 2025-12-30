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
                // Suppress unhandled promise rejections for 401 errors
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason;
                  if (reason && (
                    reason.message && reason.message.includes('401') ||
                    reason.status === 401 ||
                    reason.response && reason.response.status === 401 ||
                    String(reason).includes('401') ||
                    String(reason).includes('Unauthorized')
                  )) {
                    event.preventDefault();
                    return false;
                  }
                });
                
                // Suppress console errors for 401s
                const originalError = console.error;
                console.error = function() {
                  const message = Array.from(arguments).join(' ');
                  if (message.includes('401') || message.includes('Unauthorized')) {
                    return;
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
