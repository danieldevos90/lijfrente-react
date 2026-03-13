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
      <style>{`
        .backoffice-layout {
          min-height: 100vh;
          background: var(--color-bg, #fafafa);
          font-family: var(--font-base);
          color: var(--color-text, #1e2021);
        }
      `}</style>
    </div>
  );
}
