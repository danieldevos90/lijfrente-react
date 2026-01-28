'use client';

/**
 * Skip to Content Link - Accessibility improvement
 * Based on fixing-accessibility skill: keyboard access (critical)
 * 
 * Allows keyboard users to skip navigation and go directly to main content.
 * Only visible when focused (Tab key).
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1rem 2rem',
        backgroundColor: 'var(--color-primary, #1a365d)',
        color: 'white',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '14px',
        borderRadius: '0 0 8px 8px',
        zIndex: 9999,
        transition: 'top 0.2s ease-in-out',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100px';
      }}
    >
      Ga naar hoofdinhoud
    </a>
  );
}
