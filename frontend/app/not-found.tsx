import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * 404 Not Found Page (nextjs-app-router-patterns)
 * 
 * Custom 404 page with helpful navigation options.
 */
export const metadata: Metadata = {
  title: 'Pagina niet gevonden | GeldGeregeld',
  description: 'De pagina die u zoekt bestaat niet of is verplaatst.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-primary, #ffffff)',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 700,
          color: 'var(--color-primary, #1a365d)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      
      <h2
        style={{
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          fontWeight: 600,
          color: 'var(--color-text-primary, #1a1a1a)',
          margin: '1rem 0 0.5rem',
        }}
      >
        Pagina niet gevonden
      </h2>
      
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-text-secondary, #666)',
          maxWidth: '500px',
          marginBottom: '2rem',
        }}
      >
        De pagina die u zoekt bestaat niet of is verplaatst. 
        Controleer de URL of ga terug naar de homepage.
      </p>
      
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            backgroundColor: 'var(--color-primary, #1a365d)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'background-color 0.2s, transform 0.2s',
          }}
        >
          Naar homepage
        </Link>
        
        <Link
          href="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--color-primary, #1a365d)',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            border: '2px solid var(--color-primary, #1a365d)',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          Neem contact op
        </Link>
      </div>
      
      {/* Quick links for common pages */}
      <nav
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-secondary, #f8f9fa)',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
        }}
        aria-label="Handige links"
      >
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary, #666)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Handige links
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { href: '/', label: 'Home' },
            { href: '/hoe-werkt-het', label: 'Hoe werkt het' },
            { href: '/over-ons', label: 'Over ons' },
            { href: '/faq', label: 'FAQ' },
            { href: '/sectoren', label: 'Sectoren' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--color-primary, #1a365d)',
                textDecoration: 'none',
                fontSize: '0.9375rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
