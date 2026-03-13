import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backoffice | GeldGeregeld',
  robots: { index: false, follow: false },
};

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="backoffice-layout">
      {children}
      {/* Hide all site-wide floating widgets inside backoffice */}
      <style>{`
        .backoffice-layout {
          min-height: 100vh;
          background: var(--color-bg, #fafafa);
          font-family: var(--font-base);
          color: var(--color-text, #1e2021);
        }
        /* Suppress cookie banner, sticky CTA, exit-intent modal, drawer widget */
        .cookie-banner,
        .cookie-banner-overlay,
        [class*="StickyCTA"],
        [class*="sticky-cta"],
        [class*="DrawerWidget"],
        [class*="exit-intent"],
        [class*="LeadFormModal"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
