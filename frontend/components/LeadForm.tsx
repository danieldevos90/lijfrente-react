"use client";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

const useOfFundsOptions = [
  { value: "werkkapitaal", label: "Werkkapitaal" },
  { value: "voorraden_en_crediteuren", label: "Voorraden en crediteuren" },
  { value: "meer_personeel", label: "Meer personeel" },
  { value: "voertuigen_en_machines", label: "Voertuigen en machines" },
  { value: "inventaris_en_software", label: "Inventaris en software" },
  { value: "bedrijfspand_financieren", label: "Een bedrijfspand financieren" },
  { value: "herfinanciering", label: "Herfinanciering (geen hypotheek)" },
  { value: "overnamefinanciering", label: "Overnamefinanciering" },
  { value: "factoring", label: "Factoring" },
  { value: "overig", label: "Overig" }
];

const schema = z.object({
  siteId: z.string().min(1, "Vereist"),
  amount_requested_eur: z.string().transform((v) => v.replace(/[^0-9.,]/g, "")).transform((v) => v.replace(",", ".")).pipe(z.string()).refine((v) => v !== "", { message: "Vul bedrag in" }),
  expected_revenue_next_12m_eur: z.string().transform((v) => v.replace(/[^0-9.,]/g, "")).transform((v) => v.replace(",", ".")).pipe(z.string()).refine((v) => v !== "", { message: "Vul omzet in" }),
  kvk_number: z.string().regex(/^(|\d{8})$/, "8 cijfers"),
  company_name: z.string().optional(),
  use_of_funds: z.string().min(1, "Kies doel"),
  email: z.string().email("Ongeldig e‑mailadres").optional(),
}).refine((data) => data.kvk_number || (data.company_name && data.company_name.length > 1), {
  message: "KvK of bedrijfsnaam is vereist",
  path: ["company_name"],
});

function bucketize(value: number, buckets: number[]): string {
  const sorted = [...buckets].sort((a, b) => a - b);
  for (const b of sorted) {
    if (value <= b) return `≤${b}k`;
  }
  return `>${sorted[sorted.length - 1]}k`;
}

function toNumber(input: string): number {
  const clean = input.replace(/[^0-9.]/g, "");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
}

export default function LeadForm({ siteId }: { siteId: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [revenue, setRevenue] = useState("");
  const [kvk, setKvk] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [funds, setFunds] = useState("");
  const [email, setEmail] = useState("");

  // KvK typeahead state
  const [kvkQuery, setKvkQuery] = useState("");
  const [kvkResults, setKvkResults] = useState<Array<{kvk?: string; name?: string}>>([]);
  const [kvkLoading, setKvkLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "form_view", form_id: "finance_lead" });
    }
  }, []);

  const defaultValues = useMemo(() => ({ siteId }), [siteId]);

  // Debounced KvK search
  useEffect(() => {
    const controller = new AbortController();
    const q = kvkQuery.trim();
    if (q.length < 2) { setKvkResults([]); return; }
    async function run() {
      try {
        setKvkLoading(true);
        const res = await fetch(`/api/kvk?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const json = await res.json();
        const items = Array.isArray(json?.items) ? json.items : [];
        setKvkResults(items.map((it: any) => ({ kvk: it.kvkNumber || it.kvk || it.id, name: it.tradeName || it.name || it.title })));
        if (typeof window !== "undefined") {
          (window as any).dataLayer.push({ event: 'kvk_search', query_len: q.length, has_results: items.length > 0 });
        }
      } catch {
        setKvkResults([]);
      } finally {
        setKvkLoading(false);
      }
    }
    const t = setTimeout(run, 250);
    return () => { clearTimeout(t); controller.abort(); };
  }, [kvkQuery]);

  async function onSubmit(form: any) {
    setErrors({});
    setOk(null);
    try {
      const parsed = schema.parse(form);
      const amountK = toNumber(parsed.amount_requested_eur) / 1000;
      const revenueK = toNumber(parsed.expected_revenue_next_12m_eur) / 1000;
      if (typeof window !== "undefined") {
        (window as any).dataLayer.push({
          event: "form_start",
          form_id: "finance_lead",
        });
      }
      setLoading(true);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: parsed.siteId,
          amount_requested_eur: toNumber(parsed.amount_requested_eur),
          expected_revenue_next_12m_eur: toNumber(parsed.expected_revenue_next_12m_eur),
          kvk_number: parsed.kvk_number || undefined,
          company_name: parsed.company_name || undefined,
          use_of_funds: parsed.use_of_funds,
          email: parsed.email || undefined,
        }),
      });
      const okRes = res.ok;
      if (typeof window !== "undefined") {
        (window as any).dataLayer.push({
          event: "form_submit",
          form_id: "finance_lead",
          valid: okRes,
          amount_bucket: bucketize(amountK, [25, 50, 100, 250]),
          revenue_bucket: bucketize(revenueK, [250, 500, 1000, 2500]),
          use_of_funds: form.use_of_funds,
        });
      }
      if (!okRes) throw new Error("Submit failed");
      setOk("Bedankt! We sturen je aanbod spoedig.");
    } catch (e: any) {
      if (e?.issues) {
        const map: Record<string, string> = {};
        for (const issue of e.issues) {
          const key = issue.path?.[0] ?? "form";
          map[key] = issue.message;
        }
        setErrors(map);
      } else {
        setErrors({ form: "Verzenden mislukt, probeer opnieuw." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      await onSubmit({
        siteId,
        amount_requested_eur: amount,
        expected_revenue_next_12m_eur: revenue,
        kvk_number: kvk,
        company_name: companyName,
        use_of_funds: funds,
        email,
      });
    }}>
      <input type="hidden" name="siteId" value={defaultValues.siteId} />

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>Hoeveel financiering heeft jouw klant nodig?</label>
        <input name="amount_requested_eur" placeholder="€" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        {errors.amount_requested_eur && <span className="muted">{errors.amount_requested_eur}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>Hoeveel omzet verwacht jouw klant in 12 maanden?</label>
        <input name="expected_revenue_next_12m_eur" placeholder="€" inputMode="decimal" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        {errors.expected_revenue_next_12m_eur && <span className="muted">{errors.expected_revenue_next_12m_eur}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>KvK‑nummer (8c) of bedrijfsnaam</label>
        <input name="kvk_number" placeholder="12345678" inputMode="numeric" value={kvk} onChange={(e) => setKvk(e.target.value)} />
        <div style={{ height: 6 }} />
        <input name="company_name" placeholder="Bakkerij Jansen" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <div style={{ height: 6 }} />
        <input placeholder="Zoek op bedrijfsnaam of KvK" value={kvkQuery} onChange={(e) => setKvkQuery(e.target.value)} />
        {kvkLoading ? <span className="muted">Zoeken…</span> : null}
        {kvkResults?.length > 0 && (
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px' }}>
            {kvkResults.slice(0, 8).map((it, idx) => (
              <div key={idx} style={{ padding: '6px 4px', cursor: 'pointer' }}
                onClick={() => {
                  setKvk(it.kvk || '');
                  setCompanyName(it.name || '');
                  setKvkResults([]);
                  if (typeof window !== 'undefined') {
                    (window as any).dataLayer.push({ event: 'kvk_select', kvk_number_present: Boolean(it.kvk) });
                  }
                }}>
                {(it.name || '—')} {it.kvk ? `· ${it.kvk}` : ''}
              </div>
            ))}
          </div>
        )}
        {(errors.kvk_number || errors.company_name) && <span className="muted">{errors.kvk_number || errors.company_name}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>Waarvoor gaat jouw klant de financiering gebruiken?</label>
        <select name="use_of_funds" value={funds} onChange={(e) => setFunds(e.target.value)}>
          <option value="" disabled>Maak een keuze</option>
          {useOfFundsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {errors.use_of_funds && <span className="muted">{errors.use_of_funds}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>E‑mail (optioneel)</label>
        <input name="email" placeholder="jij@bedrijf.nl" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <span className="muted">{errors.email}</span>}
      </div>

      <div className="row">
        <button className="btn" type="button" onClick={async () => {
          if (typeof window !== 'undefined') {
            (window as any).dataLayer.push({ event: 'psd2_connect_start' });
          }
          try {
            const res = await fetch('/api/psd2', { method: 'POST' });
            const json = await res.json();
            const url = json?.redirectUrl || '/psd2/callback';
            window.location.href = url;
          } catch {
            if (typeof window !== 'undefined') {
              (window as any).dataLayer.push({ event: 'psd2_connect_fail' });
            }
          }
        }}>Koppel bank (PSD2)</button>
      </div>

      {errors.form && <p className="muted">{errors.form}</p>}
      {ok && <p>{ok}</p>}

      <div className="row">
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Versturen…" : "Bereken aanbod"}</button>
        <a className="btn" href="/">Annuleren</a>
      </div>
      <p className="muted">We vragen alleen wat nodig is om je aanbod te berekenen.</p>
    </form>
  );
}


