import './tokens.css';
import './globals.css';
import type { ReactNode } from 'react';
import GlobalWidgetProvider from '../components/GlobalWidgetProvider';

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'GeldGeregeld';
export const metadata = {
  title: SITE_NAME + ' - Zakelijke Financiering',
  description: 'Snel en simpel zakelijke financiering regelen – binnen 24 uur reactie en transparante voorwaarden',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleApiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io';
  return (
    <html lang="nl">
      <head>
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
        <GlobalWidgetProvider>
          {children}
        </GlobalWidgetProvider>
      </body>
    </html>
  );
}


