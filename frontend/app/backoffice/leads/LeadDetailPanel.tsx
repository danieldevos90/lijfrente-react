'use client';

import { useState } from 'react';

type Lead = {
  id: number;
  documentId: string;
  company_name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  kvk_number?: string;
  amount_requested_eur: number;
  expected_revenue_next_12m_eur: number;
  use_of_funds: string;
  business_type?: string;
  business_age_years?: string;
  is_profitable?: boolean;
  urgency?: string;
  lead_quality?: string;
  status?: string;
  notes?: string;
  source?: string;
  partner?: string;
  sector?: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: 'nieuw', label: 'Nieuw', icon: '●' },
  { value: 'in_behandeling', label: 'In behandeling', icon: '◐' },
  { value: 'meer_info_nodig', label: 'Meer info nodig', icon: '?' },
  { value: 'contact_opnemen', label: 'Contact opnemen', icon: '☏' },
  { value: 'afgekeurd', label: 'Afgekeurd', icon: '✕' },
  { value: 'afgehandeld', label: 'Afgehandeld', icon: '✓' },
] as const;

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  nieuw: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  in_behandeling: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  meer_info_nodig: { bg: '#fce7f3', color: '#9d174d', border: '#f9a8d4' },
  contact_opnemen: { bg: '#e0e7ff', color: '#3730a3', border: '#a5b4fc' },
  afgekeurd: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  afgehandeld: { bg: '#d3ffdd', color: '#065f46', border: '#86efac' },
};

const EMAIL_ACTIONS = [
  { status: 'in_behandeling', label: 'Aanvraag in behandeling', desc: 'Laat weten dat je bezig bent' },
  { status: 'meer_info_nodig', label: 'Meer info nodig', desc: 'Vraag om aanvullende documenten' },
  { status: 'contact_opnemen', label: 'We bellen je', desc: 'Geef aan dat je gaat bellen' },
  { status: 'afgekeurd', label: 'Afgekeurd', desc: 'Laat weten dat het niet doorgaat' },
  { status: 'afgehandeld', label: 'Case afgehandeld', desc: 'Sluit de aanvraag af' },
];

const USE_OF_FUNDS_LABELS: Record<string, string> = {
  werkkapitaal: 'Werkkapitaal',
  voorraden_en_crediteuren: 'Voorraden & crediteuren',
  meer_personeel: 'Meer personeel',
  voertuigen_en_machines: 'Voertuigen & machines',
  inventaris_en_software: 'Inventaris & software',
  bedrijfspand_financieren: 'Bedrijfspand',
  herfinanciering: 'Herfinanciering',
  overnamefinanciering: 'Overname',
  factoring: 'Factoring',
  tweede_rang: 'Tweede rang',
  vastgoed_krediet: 'Vastgoed krediet',
  overig: 'Overig',
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  eenmanszaak: 'Eenmanszaak',
  bv: 'BV',
  vof: 'VOF',
  maatschap: 'Maatschap',
  stichting: 'Stichting',
};

const AGE_LABELS: Record<string, string> = {
  '0_2': '0-2 jaar',
  '2_5': '2-5 jaar',
  '5_10': '5-10 jaar',
  '10_plus': '10+ jaar',
  'y0_2': '0-2 jaar',
  'y2_5': '2-5 jaar',
  'y5_10': '5-10 jaar',
  'y10_plus': '10+ jaar',
};

const URGENCY_LABELS: Record<string, string> = {
  direct: 'Direct',
  kort: 'Binnen een week',
  maand: 'Binnen een maand',
  kwartaal: 'Binnen een kwartaal',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type Props = {
  lead: Lead;
  onClose: () => void;
  onUpdate: (documentId: string, data: Partial<Lead>) => Promise<boolean>;
  onSendEmail: (documentId: string, status: string, customMessage?: string) => Promise<{ ok: boolean; data: any }>;
  onDelete: (documentId: string) => void;
};

export function LeadDetailPanel({ lead, onClose, onUpdate, onSendEmail, onDelete }: Props) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [notesSaving, setNotesSaving] = useState(false);

  const currentStatus = lead.status || 'nieuw';
  const sc = STATUS_COLORS[currentStatus] || STATUS_COLORS.nieuw;

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSendEmail(status: string) {
    if (!lead.email) {
      showToast('Geen e-mailadres beschikbaar', 'error');
      return;
    }
    if (!confirm(`E-mail "${EMAIL_ACTIONS.find((a) => a.status === status)?.label}" sturen naar ${lead.email}?`)) return;
    setSending(status);
    const result = await onSendEmail(lead.documentId, status, customMessage || undefined);
    setSending(null);
    if (result.ok) {
      showToast(`E-mail verstuurd naar ${lead.email}`, 'success');
      setCustomMessage('');
    } else {
      showToast(result.data?.error || 'Versturen mislukt', 'error');
    }
  }

  async function handleSaveNotes() {
    setNotesSaving(true);
    const ok = await onUpdate(lead.documentId, { notes } as any);
    setNotesSaving(false);
    showToast(ok ? 'Notities opgeslagen' : 'Opslaan mislukt (veld bestaat mogelijk nog niet in Strapi)', ok ? 'success' : 'error');
  }

  return (
    <>
      {/* Backdrop */}
      <div className="bo-panel-backdrop" onClick={onClose} />

      {/* Panel */}
      <aside className="bo-panel">
        {/* Panel header */}
        <div className="bo-panel-header">
          <div>
            <h2 className="bo-panel-title">{lead.company_name || 'Lead'}</h2>
            <p className="bo-panel-subtitle">{formatDate(lead.createdAt)}</p>
          </div>
          <button className="bo-btn-icon-lg" onClick={onClose} aria-label="Sluiten">✕</button>
        </div>

        {/* Status badge */}
        <div className="bo-panel-status" style={{ background: sc.bg, borderColor: sc.border }}>
          <span style={{ color: sc.color, fontWeight: 600 }}>
            {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.icon}{' '}
            {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label || currentStatus}
          </span>
        </div>

        {/* Lead details */}
        <div className="bo-panel-section">
          <h3 className="bo-panel-section-title">Contactgegevens</h3>
          <div className="bo-detail-grid">
            {lead.firstName && <DetailRow label="Naam" value={`${lead.firstName} ${lead.lastName || ''}`} />}
            <DetailRow label="E-mail" value={lead.email} link={lead.email ? `mailto:${lead.email}` : undefined} />
            {lead.phone && <DetailRow label="Telefoon" value={lead.phone} link={`tel:${lead.phone}`} />}
            {lead.kvk_number && <DetailRow label="KvK" value={lead.kvk_number} />}
          </div>
        </div>

        <div className="bo-panel-section">
          <h3 className="bo-panel-section-title">Financiering</h3>
          <div className="bo-detail-grid">
            <DetailRow label="Gevraagd bedrag" value={formatCurrency(lead.amount_requested_eur)} highlight />
            <DetailRow label="Omzet (12 mnd)" value={formatCurrency(lead.expected_revenue_next_12m_eur)} />
            <DetailRow label="Doel" value={USE_OF_FUNDS_LABELS[lead.use_of_funds] || lead.use_of_funds} />
            {lead.urgency && <DetailRow label="Urgentie" value={URGENCY_LABELS[lead.urgency] || lead.urgency} />}
          </div>
        </div>

        <div className="bo-panel-section">
          <h3 className="bo-panel-section-title">Bedrijfsgegevens</h3>
          <div className="bo-detail-grid">
            {lead.business_type && <DetailRow label="Rechtsvorm" value={BUSINESS_TYPE_LABELS[lead.business_type] || lead.business_type} />}
            {lead.business_age_years && <DetailRow label="Leeftijd" value={AGE_LABELS[lead.business_age_years] || lead.business_age_years} />}
            {lead.is_profitable !== undefined && <DetailRow label="Winstgevend" value={lead.is_profitable ? 'Ja' : 'Nee'} />}
            {lead.lead_quality && <DetailRow label="Lead kwaliteit" value={lead.lead_quality} />}
            {lead.source && <DetailRow label="Bron" value={lead.source} />}
            {lead.partner && <DetailRow label="Partner" value={lead.partner} />}
          </div>
        </div>

        {/* Notes */}
        <div className="bo-panel-section">
          <h3 className="bo-panel-section-title">Notities</h3>
          <textarea
            className="bo-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne notities over deze lead..."
            rows={3}
          />
          <button className="bo-btn-secondary bo-btn-sm" onClick={handleSaveNotes} disabled={notesSaving}>
            {notesSaving ? 'Opslaan...' : 'Notities opslaan'}
          </button>
        </div>

        {/* Email actions */}
        <div className="bo-panel-section">
          <h3 className="bo-panel-section-title">Nabehandeling e-mails</h3>
          <p className="bo-panel-hint">Verstuur een statusupdate naar {lead.email || '(geen e-mail)'}.</p>

          <textarea
            className="bo-textarea"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Optioneel: voeg een persoonlijk bericht toe..."
            rows={2}
          />

          <div className="bo-email-actions">
            {EMAIL_ACTIONS.map((action) => {
              const asc = STATUS_COLORS[action.status] || STATUS_COLORS.nieuw;
              return (
                <button
                  key={action.status}
                  className="bo-email-action-btn"
                  style={{ borderColor: asc.border, background: sending === action.status ? asc.bg : undefined }}
                  onClick={() => handleSendEmail(action.status)}
                  disabled={!lead.email || sending !== null}
                >
                  <span className="bo-email-action-label" style={{ color: asc.color }}>{action.label}</span>
                  <span className="bo-email-action-desc">{sending === action.status ? 'Versturen...' : action.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bo-panel-section bo-danger-zone">
          <button className="bo-btn-danger" onClick={() => onDelete(lead.documentId)}>
            Lead verwijderen
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`bo-toast ${toast.type === 'success' ? 'bo-toast-success' : 'bo-toast-error'}`}>
            {toast.msg}
          </div>
        )}
      </aside>

      <style>{`
        .bo-panel-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
          animation: fadeIn 200ms ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .bo-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 520px;
          max-width: 100vw;
          background: #fff;
          z-index: 1000;
          overflow-y: auto;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.1);
          animation: slideIn 250ms ease;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .bo-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .bo-panel-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          color: var(--color-charcoal, #1e2021);
        }
        .bo-panel-subtitle {
          margin: 0.25rem 0 0;
          font-size: 0.8125rem;
          color: var(--color-text-muted, #6c737a);
        }
        .bo-btn-icon-lg {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          background: #fff;
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--color-text-muted, #6c737a);
          flex-shrink: 0;
        }
        .bo-btn-icon-lg:hover { background: var(--color-bg, #fafafa); }

        .bo-panel-status {
          display: inline-flex;
          padding: 0.375rem 1rem;
          border-radius: 100px;
          border: 1.5px solid;
          font-size: 0.875rem;
          align-self: flex-start;
          margin-bottom: 0.75rem;
        }

        .bo-panel-section {
          padding: 1rem 0;
          border-top: 1px solid var(--color-border-gray, #e5e7eb);
        }
        .bo-panel-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted, #6c737a);
          margin: 0 0 0.75rem;
        }
        .bo-panel-hint {
          font-size: 0.8125rem;
          color: var(--color-text-muted, #6c737a);
          margin: 0 0 0.75rem;
        }

        .bo-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
        }
        .bo-detail-row { display: flex; flex-direction: column; gap: 0.125rem; }
        .bo-detail-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-muted, #6c737a);
        }
        .bo-detail-value {
          font-size: 0.875rem;
          color: var(--color-text, #1e2021);
        }
        .bo-detail-value.highlight {
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-charcoal, #1e2021);
        }
        .bo-detail-value a {
          color: var(--color-brand, #00c800);
          text-decoration: none;
        }
        .bo-detail-value a:hover { text-decoration: underline; }

        .bo-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          font-size: 0.875rem;
          font-family: inherit;
          resize: vertical;
          outline: none;
          color: var(--color-text, #1e2021);
          margin-bottom: 0.5rem;
          box-sizing: border-box;
        }
        .bo-textarea:focus {
          border-color: var(--color-brand, #00c800);
          box-shadow: 0 0 0 3px rgba(0, 200, 0, 0.1);
        }

        .bo-btn-sm {
          padding: 0.375rem 1rem;
          font-size: 0.8125rem;
        }
        .bo-btn-secondary {
          padding: 0.5rem 1.25rem;
          background: #fff;
          color: var(--color-charcoal, #1e2021);
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: 100px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms ease;
        }
        .bo-btn-secondary:hover:not(:disabled) { border-color: var(--color-charcoal200, #b5b8bc); }
        .bo-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

        .bo-email-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        .bo-email-action-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: #fff;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: all 150ms ease;
        }
        .bo-email-action-btn:hover:not(:disabled) { box-shadow: var(--shadow-sm); transform: translateY(-1px); }
        .bo-email-action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .bo-email-action-label { font-weight: 600; font-size: 0.875rem; }
        .bo-email-action-desc { font-size: 0.75rem; color: var(--color-text-muted, #6c737a); margin-top: 0.125rem; }

        .bo-danger-zone { border-top: 1px solid var(--color-error-border, #fecaca); }
        .bo-btn-danger {
          padding: 0.5rem 1.25rem;
          background: #fff;
          color: var(--color-error, #ff0000);
          border: 1.5px solid var(--color-error-border, #fecaca);
          border-radius: 100px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms ease;
        }
        .bo-btn-danger:hover { background: var(--color-bg-red-light, #fef2f2); }

        .bo-toast {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md, 8px);
          font-size: 0.875rem;
          font-weight: 500;
          z-index: 1100;
          box-shadow: var(--shadow-lg);
          animation: fadeIn 200ms ease;
        }
        .bo-toast-success { background: #065f46; color: #fff; }
        .bo-toast-error { background: #991b1b; color: #fff; }
      `}</style>
    </>
  );
}

function DetailRow({ label, value, link, highlight }: { label: string; value?: string | null; link?: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div className="bo-detail-row">
      <span className="bo-detail-label">{label}</span>
      <span className={`bo-detail-value ${highlight ? 'highlight' : ''}`}>
        {link ? <a href={link}>{value}</a> : value}
      </span>
    </div>
  );
}
