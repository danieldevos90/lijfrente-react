"use client";

/**
 * Verplichte disclosure voor Google Ads Personal Loans policy en AFM-transparantie.
 * Toont: voorbeeld kosten, max APR, looptijd. In footer op elke pagina.
 */
export default function FinanceDisclosure() {
  return (
    <div
      role="complementary"
      aria-label="Financieringsinformatie"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        fontSize: '12px',
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.85)',
      }}
    >
      <strong style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px' }}>
        Financieringsinformatie
      </strong>
      <p style={{ margin: '0.5rem 0 0', fontSize: '12px' }}>
        Voorbeeld: bij €50.000 over 36 maanden, rente 8%: geschatte maandlasten ca. €1.565.
        Totale kosten afhankelijk van rente en looptijd. <strong>Max. APR 12%</strong>.
        Looptijd: <strong>12 maanden tot 60 maanden</strong>. GeldGeregeld bemiddelt kosteloos;
        de crediteur bepaalt kosten en voorwaarden.
      </p>
    </div>
  );
}
