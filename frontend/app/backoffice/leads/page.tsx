'use client';

import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LeadDetailPanel } from './LeadDetailPanel';

type Lead = {
  id: number;
  documentId: string;
  siteId: string;
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
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  nieuw: 'Nieuw',
  in_behandeling: 'In behandeling',
  meer_info_nodig: 'Meer info nodig',
  contact_opnemen: 'Contact opnemen',
  afgekeurd: 'Afgekeurd',
  afgehandeld: 'Afgehandeld',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  nieuw: { bg: '#dbeafe', color: '#1e40af' },
  in_behandeling: { bg: '#fef3c7', color: '#92400e' },
  meer_info_nodig: { bg: '#fce7f3', color: '#9d174d' },
  contact_opnemen: { bg: '#e0e7ff', color: '#3730a3' },
  afgekeurd: { bg: '#fef2f2', color: '#991b1b' },
  afgehandeld: { bg: '#d3ffdd', color: '#065f46' },
};

const QUALITY_COLORS: Record<string, { bg: string; color: string }> = {
  warm: { bg: '#d3ffdd', color: '#065f46' },
  koud: { bg: '#e0e7ff', color: '#3730a3' },
};

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

function formatCurrency(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const SOURCE_LABELS: Record<string, string> = {
  lead_page: 'Leadpagina',
  sector_page: 'Sectorpagina',
  drawer: 'Drawer',
  interactive_form: 'Interactief formulier',
  quick_form: 'Snel formulier',
  tool_werkkapitaal_calculator: 'Werkkapitaal tool',
};

function formatChannel(lead: Lead): string {
  const parts: string[] = [];
  if (lead.utm_source) parts.push(lead.utm_source);
  if (lead.utm_campaign) parts.push(lead.utm_campaign);
  if (parts.length) return parts.join(' / ');
  if (lead.partner) return `Partner: ${lead.partner}`;
  if (lead.source) return SOURCE_LABELS[lead.source] || lead.source;
  return '—';
}

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, background: bg, color, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'createdAt:desc', label: 'Datum (nieuwste eerst)' },
  { value: 'createdAt:asc', label: 'Datum (oudste eerst)' },
  { value: 'amount_requested_eur:desc', label: 'Bedrag (hoog → laag)' },
  { value: 'amount_requested_eur:asc', label: 'Bedrag (laag → hoog)' },
  { value: 'company_name:asc', label: 'Bedrijf (A–Z)' },
  { value: 'company_name:desc', label: 'Bedrijf (Z–A)' },
  { value: 'status:asc', label: 'Status (A–Z)' },
  { value: 'status:desc', label: 'Status (Z–A)' },
];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState('createdAt:desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [siteIdFilter, setSiteIdFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useLayoutEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, qualityFilter, sourceFilter, siteIdFilter, sort, pageSize]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      params.set('sort', sort);
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      if (statusFilter) params.set('status', statusFilter);
      if (qualityFilter) params.set('lead_quality', qualityFilter);
      if (sourceFilter) params.set('source', sourceFilter);
      if (siteIdFilter.trim()) params.set('siteId', siteIdFilter.trim());

      const res = await fetch(`/api/backoffice/leads?${params.toString()}`);
      if (res.status === 401) {
        router.push('/backoffice');
        return null;
      }
      const data = await res.json();
      const list = data.data || [];
      setLeads(list);
      const p = data.meta?.pagination;
      if (p && typeof p.page === 'number') {
        setPagination({
          page: p.page,
          pageSize: p.pageSize,
          pageCount: p.pageCount,
          total: p.total,
        });
      } else {
        setPagination(null);
      }
      return { listLength: list.length, fetchedPage: page };
    } catch {
      console.error('Failed to fetch leads');
      return null;
    } finally {
      setLoading(false);
    }
  }, [router, page, pageSize, sort, debouncedSearch, statusFilter, qualityFilter, sourceFilter, siteIdFilter]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (documentId: string) => {
    if (!confirm('Weet je zeker dat je deze lead wilt verwijderen?')) return;
    const res = await fetch(`/api/backoffice/leads/${documentId}`, { method: 'DELETE' });
    if (res.ok) {
      if (selectedLead?.documentId === documentId) setSelectedLead(null);
      const result = await fetchLeads();
      if (result && result.listLength === 0 && result.fetchedPage > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
    }
  };

  const handleUpdate = async (documentId: string, data: Partial<Lead>) => {
    const res = await fetch(`/api/backoffice/leads/${documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchLeads();
      const updated = leads.find((l) => l.documentId === documentId);
      if (updated) setSelectedLead({ ...updated, ...data });
    }
    return res.ok;
  };

  const handleSendEmail = async (documentId: string, status: string, customMessage?: string) => {
    const res = await fetch(`/api/backoffice/leads/${documentId}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, customMessage }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchLeads();
    }
    return { ok: res.ok, data };
  };

  const totalLeads = pagination?.total ?? 0;
  const pageCount = pagination?.pageCount ?? 1;
  const rangeFrom =
    pagination && totalLeads > 0
      ? (pagination.page - 1) * pagination.pageSize + 1
      : 0;
  const rangeTo =
    pagination && totalLeads > 0
      ? Math.min(pagination.page * pagination.pageSize, totalLeads)
      : 0;

  return (
    <div className="bo-page">
      {/* Header */}
      <header className="bo-header">
        <div className="bo-header-left">
          <img src="/logomark.svg" alt="" width={32} height={32} />
          <span className="bo-header-brand"><strong>geld</strong>geregeld</span>
          <span className="bo-header-sep">/</span>
          <span className="bo-header-title">Leads</span>
        </div>
        <div className="bo-header-right">
          <span className="bo-header-count">
            {loading ? '…' : `${totalLeads.toLocaleString('nl-NL')} leads`}
          </span>
          <button className="bo-btn-ghost" onClick={() => { document.cookie = 'bo-auth=; path=/; max-age=0'; router.push('/backoffice'); }}>
            Uitloggen
          </button>
        </div>
      </header>

      {/* Filters & search */}
      <div className="bo-toolbar bo-toolbar-stack">
        <div className="bo-toolbar-row">
          <input
            type="search"
            className="bo-search"
            placeholder="Zoek op bedrijf, email, KvK, naam..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <label className="bo-field">
            <span className="bo-field-label">Sorteren</span>
            <select
              className="bo-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sorteer leads"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="bo-field">
            <span className="bo-field-label">Per pagina</span>
            <select
              className="bo-select"
              value={String(pageSize)}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Aantal per pagina"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        <div className="bo-toolbar-row">
          <label className="bo-field">
            <span className="bo-field-label">Status</span>
            <select
              className="bo-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter op status"
            >
              <option value="">Alle statussen</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="bo-field">
            <span className="bo-field-label">Kwaliteit</span>
            <select
              className="bo-select"
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              aria-label="Filter op kwaliteit"
            >
              <option value="">Alle</option>
              <option value="warm">Warm</option>
              <option value="koud">Koud</option>
              <option value="onbekend">Onbekend</option>
            </select>
          </label>
          <label className="bo-field">
            <span className="bo-field-label">Bron</span>
            <select
              className="bo-select"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              aria-label="Filter op bron"
            >
              <option value="">Alle bronnen</option>
              {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="bo-field bo-field-grow">
            <span className="bo-field-label">Site-ID</span>
            <input
              type="text"
              className="bo-input-sm"
              placeholder="Optioneel"
              value={siteIdFilter}
              onChange={(e) => setSiteIdFilter(e.target.value)}
              aria-label="Filter op site-ID"
            />
          </label>
          <button type="button" className="bo-btn-secondary" onClick={() => void fetchLeads()}>
            Vernieuwen
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bo-table-wrap">
        {loading ? (
          <div className="bo-loading">Laden...</div>
        ) : leads.length === 0 ? (
          <div className="bo-empty">Geen leads gevonden</div>
        ) : (
          <table className="bo-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Bedrijf</th>
                <th>E-mail</th>
                <th>Bedrag</th>
                <th>Doel</th>
                <th>Kanaal</th>
                <th>Kwaliteit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const status = lead.status || 'nieuw';
                const quality = lead.lead_quality || 'onbekend';
                const sc = STATUS_COLORS[status] || STATUS_COLORS.nieuw;
                const qc = QUALITY_COLORS[quality];
                return (
                  <tr
                    key={lead.documentId}
                    className={`bo-row ${selectedLead?.documentId === lead.documentId ? 'bo-row-selected' : ''}`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="bo-cell-date">{formatDate(lead.createdAt)}</td>
                    <td>
                      <div className="bo-cell-company">{lead.company_name || '—'}</div>
                      {lead.firstName && <div className="bo-cell-sub">{lead.firstName} {lead.lastName}</div>}
                    </td>
                    <td className="bo-cell-email">{lead.email || '—'}</td>
                    <td className="bo-cell-amount">{formatCurrency(lead.amount_requested_eur)}</td>
                    <td>{USE_OF_FUNDS_LABELS[lead.use_of_funds] || lead.use_of_funds}</td>
                    <td className="bo-cell-channel" title={formatChannel(lead)}>{formatChannel(lead)}</td>
                    <td>{qc ? <Badge label={quality} bg={qc.bg} color={qc.color} /> : quality}</td>
                    <td><Badge label={STATUS_LABELS[status] || status} bg={sc.bg} color={sc.color} /></td>
                    <td>
                      <button
                        className="bo-btn-icon"
                        title="Verwijder"
                        onClick={(e) => { e.stopPropagation(); handleDelete(lead.documentId); }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && pagination && totalLeads > 0 && (
        <nav className="bo-pagination" aria-label="Paginatie">
          <p className="bo-pagination-meta">
            {rangeFrom}–{rangeTo} van {totalLeads.toLocaleString('nl-NL')} · pagina {pagination.page} van{' '}
            {pageCount}
          </p>
          <div className="bo-pagination-actions">
            <button
              type="button"
              className="bo-btn-secondary"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Vorige
            </button>
            <button
              type="button"
              className="bo-btn-secondary"
              disabled={pagination.page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Volgende
            </button>
          </div>
        </nav>
      )}

      {/* Detail Panel */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdate}
          onSendEmail={handleSendEmail}
          onDelete={handleDelete}
        />
      )}

      <style>{`
        .bo-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem 2rem;
        }

        /* Header */
        .bo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border-gray, #e5e7eb);
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .bo-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .bo-header-brand {
          font-size: 1.125rem;
          color: var(--color-charcoal, #1e2021);
          letter-spacing: 0.02em;
        }
        .bo-header-brand strong { font-weight: 700; }
        .bo-header-sep { color: var(--color-charcoal200, #b5b8bc); margin: 0 0.25rem; }
        .bo-header-title { font-weight: 600; }
        .bo-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .bo-header-count {
          font-size: 0.875rem;
          color: var(--color-text-muted, #6c737a);
        }

        /* Toolbar */
        .bo-toolbar {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .bo-toolbar-stack {
          flex-direction: column;
          align-items: stretch;
        }
        .bo-toolbar-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: flex-end;
        }
        .bo-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        .bo-field-grow {
          flex: 1;
          min-width: 140px;
        }
        .bo-field-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #6c737a);
        }
        .bo-select, .bo-input-sm {
          padding: 0.5rem 0.75rem;
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          font-size: 0.875rem;
          font-family: inherit;
          background: #fff;
          color: var(--color-text, #1e2021);
          min-height: 38px;
        }
        .bo-select {
          min-width: 200px;
          cursor: pointer;
        }
        .bo-input-sm {
          width: 100%;
        }
        .bo-select:focus, .bo-input-sm:focus {
          outline: none;
          border-color: var(--color-brand, #00c800);
          box-shadow: 0 0 0 3px rgba(0, 200, 0, 0.1);
        }
        .bo-search {
          flex: 1;
          min-width: 200px;
          padding: 0.5rem 0.875rem;
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          background: #fff;
          color: var(--color-text, #1e2021);
        }
        .bo-search:focus {
          border-color: var(--color-brand, #00c800);
          box-shadow: 0 0 0 3px rgba(0, 200, 0, 0.1);
        }

        /* Buttons */
        .bo-btn-primary {
          padding: 0.5rem 1.25rem;
          background: var(--color-charcoal, #1e2021);
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 150ms ease;
        }
        .bo-btn-primary:hover:not(:disabled) { background: var(--color-charcoal-hover, #2a2c2d); }
        .bo-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .bo-btn-secondary {
          padding: 0.5rem 1.25rem;
          background: #fff;
          color: var(--color-charcoal, #1e2021);
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms ease;
        }
        .bo-btn-secondary:hover { border-color: var(--color-charcoal200, #b5b8bc); background: var(--color-bg, #fafafa); }
        .bo-btn-ghost {
          padding: 0.5rem 1rem;
          background: transparent;
          color: var(--color-text-muted, #6c737a);
          border: none;
          border-radius: 100px;
          font-size: 0.875rem;
          cursor: pointer;
          font-family: inherit;
        }
        .bo-btn-ghost:hover { color: var(--color-text, #1e2021); }
        .bo-btn-icon {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--color-text-muted, #6c737a);
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 150ms ease;
        }
        .bo-btn-icon:hover { background: var(--color-bg-red-light, #fef2f2); color: var(--color-error, #ff0000); }

        /* Table */
        .bo-table-wrap {
          background: #fff;
          border-radius: var(--radius-lg, 12px);
          border: 1px solid var(--color-border-gray, #e5e7eb);
          overflow-x: auto;
        }
        .bo-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .bo-table thead th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted, #6c737a);
          border-bottom: 1px solid var(--color-border-gray, #e5e7eb);
          white-space: nowrap;
        }
        .bo-table tbody td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--color-border-gray, #e5e7eb);
          vertical-align: middle;
        }
        .bo-row { cursor: pointer; transition: background 100ms ease; }
        .bo-row:hover { background: var(--color-bg-gray-very-light, #f9fafb); }
        .bo-row-selected { background: rgba(0, 200, 0, 0.04); }
        .bo-row-selected:hover { background: rgba(0, 200, 0, 0.06); }
        .bo-cell-date { white-space: nowrap; color: var(--color-text-muted, #6c737a); font-size: 0.8125rem; }
        .bo-cell-company { font-weight: 600; color: var(--color-charcoal, #1e2021); }
        .bo-cell-sub { font-size: 0.8125rem; color: var(--color-text-muted, #6c737a); }
        .bo-cell-email { color: var(--color-charcoal400, #6c737a); }
        .bo-cell-amount { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .bo-cell-channel { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.8125rem; color: var(--color-text-muted, #6c737a); }

        /* States */
        .bo-loading, .bo-empty {
          padding: 3rem;
          text-align: center;
          color: var(--color-text-muted, #6c737a);
        }

        .bo-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          padding: 0.75rem 0;
        }
        .bo-pagination-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-text-muted, #6c737a);
        }
        .bo-pagination-actions {
          display: flex;
          gap: 0.5rem;
        }
        .bo-pagination .bo-btn-secondary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .bo-table { font-size: 0.8125rem; }
          .bo-table thead th, .bo-table tbody td { padding: 0.5rem 0.75rem; }
        }
      `}</style>
    </div>
  );
}
