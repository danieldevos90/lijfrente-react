import React from 'react';

export type DirectAnswerItem = {
  label: string;
  value: string;
};

export default function DirectAnswerSection({
  eyebrow = 'Direct antwoord',
  title,
  answer,
  bullets = [],
  backgroundColor = 'var(--color-bg-slate)',
  primaryHref = '/lead',
  secondaryHref = '/hoe-werkt-het',
}: {
  eyebrow?: string;
  title: string;
  answer: string;
  bullets?: DirectAnswerItem[];
  backgroundColor?: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  return (
    <section
      aria-label="Direct antwoord"
      style={{
        background: backgroundColor,
        padding: '5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            // Auto-fit keeps this responsive without CSS media queries.
            gridTemplateColumns: bullets.length > 0 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </p>
            <h2
              style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                margin: '0.75rem 0 1rem',
                color: 'var(--color-text)',
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: 0,
                color: 'var(--color-text)',
                opacity: 0.85,
                lineHeight: 1.8,
                fontSize: '1.125rem',
                maxWidth: '58ch',
              }}
            >
              {answer}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
              <a className="btn btn-primary" href={primaryHref}>
                Start je aanvraag
              </a>
              <a className="btn btn-secondary" href={secondaryHref}>
                Bekijk hoe het werkt
              </a>
            </div>
          </div>

          {bullets.length > 0 && (
            <div
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '1.25rem 1.25rem',
              }}
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.85rem' }}>
                {bullets.map((b, idx) => (
                  <li key={`${b.label}-${idx}`} style={{ display: 'grid', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{b.label}</span>
                    <span style={{ fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: 600 }}>{b.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

