"use client";

import React, { useMemo, useState } from "react";
import { trackEvent, trackFormEvent, trackLeadGeneration } from "@/lib/analytics";
import { getLeadAttribution } from "@/lib/attribution";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function roundToNearest(amount: number, step: number) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount / step) * step;
}

function eur(n: number) {
  try {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `EUR ${Math.round(n)}`;
  }
}

type CalcInputs = {
  monthlyCostsEUR: string;
  dsoDays: string; // days sales outstanding
  dpoDays: string; // days payables outstanding
  bufferPct: string;
};

export default function WerkkapitaalCalculator() {
  const [inputs, setInputs] = useState<CalcInputs>({
    monthlyCostsEUR: "",
    dsoDays: "30",
    dpoDays: "14",
    bufferPct: "15",
  });
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Honeypot
  const [website, setWebsite] = useState("");

  const monthlyCosts = useMemo(() => {
    const v = Number(String(inputs.monthlyCostsEUR).replace(/[^0-9.,]/g, "").replace(",", "."));
    return Number.isFinite(v) ? v : 0;
  }, [inputs.monthlyCostsEUR]);

  const dso = useMemo(() => clamp(Number(inputs.dsoDays) || 0, 0, 180), [inputs.dsoDays]);
  const dpo = useMemo(() => clamp(Number(inputs.dpoDays) || 0, 0, 180), [inputs.dpoDays]);
  const bufferPct = useMemo(() => clamp(Number(inputs.bufferPct) || 0, 0, 50), [inputs.bufferPct]);

  const result = useMemo(() => {
    const dailyCosts = monthlyCosts > 0 ? monthlyCosts / 30 : 0;
    const gapDays = Math.max(0, dso - dpo);
    const workingCapitalGap = dailyCosts * gapDays;
    const buffer = workingCapitalGap * (bufferPct / 100);
    const recommended = workingCapitalGap + buffer;
    const suggestedAmount = roundToNearest(recommended, 5000);
    return {
      dailyCosts,
      gapDays,
      workingCapitalGap,
      buffer,
      recommended,
      suggestedAmount,
    };
  }, [monthlyCosts, dso, dpo, bufferPct]);

  const leadHref = useMemo(() => {
    const amount = result.suggestedAmount > 0 ? result.suggestedAmount : 50000;
    const sp = new URLSearchParams();
    sp.set("drawer", "lead");
    sp.set("source", "tool_werkkapitaal_calculator");
    sp.set("purpose", "werkkapitaal");
    sp.set("amount", String(amount));
    return "/?" + sp.toString();
  }, [result.suggestedAmount]);

  function setField<K extends keyof CalcInputs>(key: K, value: CalcInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function sendToEmail() {
    setError(null);
    if (!monthlyCosts || monthlyCosts < 1) {
      setError("Vul je gemiddelde maandelijkse kosten in.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    setSubmitting(true);
    trackFormEvent("start", "werkkapitaal_calculator", { action: "email_result" });

    try {
      const attribution = getLeadAttribution();
      const res = await fetch("/api/tools/werkkapitaal-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "tool_werkkapitaal_calculator",
          email: email.trim(),
          companyName: companyName.trim() || undefined,
          monthlyCostsEUR: monthlyCosts,
          dsoDays: dso,
          dpoDays: dpo,
          bufferPct,
          result,
          attribution: attribution || undefined,
          website: website || undefined,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Verzenden mislukt");
      }

      setOk(true);
      trackFormEvent("complete", "werkkapitaal_calculator");
      trackEvent("lead_magnet_submit", { event_category: "Lead Magnet", lead_source: "werkkapitaal_calculator" });
      trackLeadGeneration("werkkapitaal_calculator", { value: result.suggestedAmount });
    } catch (e: any) {
      setError(e?.message || "Verzenden mislukt, probeer opnieuw.");
      trackFormEvent("error", "werkkapitaal_calculator", { reason: "submit_failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Honeypot - keep in DOM but off-screen */}
      <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>Bereken je werkkapitaalbehoefte</h2>
          <p style={{ marginTop: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            Snelle indicatie op basis van je kosten en betaaltermijnen. Je ziet direct een schatting, en kunt de uitkomst mailen.
          </p>

          <div style={{ display: "grid", gap: "1rem", marginTop: "1.25rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Gemiddelde maandelijkse kosten (EUR)</label>
              <input
                inputMode="decimal"
                placeholder="Bijv. 25000"
                value={inputs.monthlyCostsEUR}
                onChange={(e) => setField("monthlyCostsEUR", e.target.value)}
                style={{ width: "100%" }}
              />
              <span className="muted">Denk aan inkoop, personeel, huur, marketing, etc.</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Klant betaalt na (dagen)</label>
                <input
                  inputMode="numeric"
                  value={String(dso)}
                  onChange={(e) => setField("dsoDays", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Jij betaalt na (dagen)</label>
                <input
                  inputMode="numeric"
                  value={String(dpo)}
                  onChange={(e) => setField("dpoDays", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Buffer (%)</label>
              <input
                inputMode="numeric"
                value={String(bufferPct)}
                onChange={(e) => setField("bufferPct", e.target.value)}
                style={{ width: "100%" }}
              />
              <span className="muted">Voor onverwachte kosten/vertragingen.</span>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>Indicatie</h2>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Cashflow-gap</span>
              <strong>{result.gapDays} dagen</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Benodigde overbrugging</span>
              <strong>{eur(result.workingCapitalGap)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Buffer</span>
              <strong>{eur(result.buffer)}</strong>
            </div>
            <div style={{ height: 1, background: "var(--color-border)", margin: "0.5rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Aanbevolen</span>
              <strong style={{ fontSize: "1.25rem" }}>{eur(result.recommended)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Sugg. aanvraagbedrag</span>
              <strong>{eur(result.suggestedAmount || 0)}</strong>
            </div>
          </div>

          <div style={{ marginTop: "1.25rem", padding: "1rem", background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-border)" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.125rem" }}>Mail jezelf de uitkomst</h3>
            <p style={{ marginTop: "0.5rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
              Handig om later terug te lezen. Je krijgt ook een snelle route naar je aanvraag (optioneel).
            </p>

            {ok ? (
              <div>
                <p style={{ margin: "0.75rem 0 0" }}>
                  <strong>Gelukt.</strong> Check je inbox.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  <a className="btn btn-primary" href={leadHref}>
                    Start aanvraag (prefill)
                  </a>
                  <a className="btn btn-secondary" href="/sectoren">
                    Bekijk sectoren
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <input
                    placeholder="E-mail (voor resultaat)"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <input
                    placeholder="Bedrijfsnaam (optioneel)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                {error ? <p className="muted" style={{ marginTop: "0.75rem" }}>{error}</p> : null}

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  <button className="btn btn-primary" onClick={sendToEmail} disabled={submitting}>
                    {submitting ? "Verzenden…" : "Mail resultaat"}
                  </button>
                  <a className="btn btn-secondary" href={leadHref} onClick={() => trackEvent("lead_magnet_cta", { event_category: "Lead Magnet", action: "open_drawer" })}>
                    Start aanvraag
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

