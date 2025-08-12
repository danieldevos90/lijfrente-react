import './tokens.css';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Multi-site Frontend',
  description: 'Minimal multi-site frontend with tokens',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <div className="container">
          <header className="site-header">
            <div className="brand">Multi‑Site</div>
            <nav className="nav">
              <a href="/" className="link">Home</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">© {new Date().getFullYear()} Multi‑Site</footer>
        </div>
      </body>
    </html>
  );
}


