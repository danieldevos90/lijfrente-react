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

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "form_view", form_id: "finance_lead" });
    }
  }, []);

  const defaultValues = useMemo(() => ({
    siteId,
    amount_requested_eur: "",
    expected_revenue_next_12m_eur: "",
    kvk_number: "",
    company_name: "",
    use_of_funds: "",
    email: "",
  }), [siteId]);

  async function onSubmit(form: any) {
    setErrors({});
    setOk(null);
    try {
      const parsed = schema.parse(form);
      const amount = toNumber(parsed.amount_requested_eur) / 1000;
      const revenue = toNumber(parsed.expected_revenue_next_12m_eur) / 1000;
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
          amount_bucket: bucketize(amount, [25, 50, 100, 250]),
          revenue_bucket: bucketize(revenue, [250, 500, 1000, 2500]),
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
    <form action={async (formData) => {
      const payload = Object.fromEntries(formData.entries());
      await onSubmit(payload);
    }}>
      <input type="hidden" name="siteId" value={defaultValues.siteId} />

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>Hoeveel financiering heeft jouw klant nodig?</label>
        <input name="amount_requested_eur" placeholder="€" inputMode="decimal" />
        {errors.amount_requested_eur && <span className="muted">{errors.amount_requested_eur}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>Hoeveel omzet verwacht jouw klant in 12 maanden?</label>
        <input name="expected_revenue_next_12m_eur" placeholder="€" inputMode="decimal" />
        {errors.expected_revenue_next_12m_eur && <span className="muted">{errors.expected_revenue_next_12m_eur}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>KvK‑nummer (8c) of bedrijfsnaam</label>
        <input name="kvk_number" placeholder="12345678" inputMode="numeric" />
        <div style={{ height: 6 }} />
        <input name="company_name" placeholder="Bakkerij Jansen" />
        {(errors.kvk_number || errors.company_name) && <span className="muted">{errors.kvk_number || errors.company_name}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>Waarvoor gaat jouw klant de financiering gebruiken?</label>
        <select name="use_of_funds" defaultValue="">
          <option value="" disabled>Maak een keuze</option>
          {useOfFundsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {errors.use_of_funds && <span className="muted">{errors.use_of_funds}</span>}
      </div>

      <div className="row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <label>E‑mail (optioneel)</label>
        <input name="email" placeholder="jij@bedrijf.nl" inputMode="email" />
        {errors.email && <span className="muted">{errors.email}</span>}
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


