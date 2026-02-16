import React from 'react';

export type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQSection({
  title = 'Veelgestelde vragen',
  subtitle,
  faqs,
  backgroundColor = 'var(--color-bg)',
}: {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  backgroundColor?: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section
      aria-label="Veelgestelde vragen"
      style={{
        background: backgroundColor,
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2
            style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              margin: 0,
              color: 'var(--color-text)',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                margin: '1rem auto 0',
                maxWidth: '70ch',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                fontSize: '1.125rem',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gap: '1rem',
          }}
        >
          {faqs.map((faq, idx) => (
            <details
              key={`${faq.question}-${idx}`}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                background: 'var(--color-white)',
                padding: '1.25rem 1.25rem',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  listStyle: 'none',
                  fontFamily: 'PP Neue Montreal, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  outline: 'none',
                }}
              >
                {faq.question}
              </summary>
              <div
                style={{
                  marginTop: '0.85rem',
                  color: 'var(--color-text)',
                  opacity: 0.85,
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                }}
              >
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <a className="btn btn-secondary" href="/contact">
            Stel een vraag
          </a>
        </div>
      </div>
    </section>
  );
}

