"use client";

import React, { useEffect, useMemo, useState } from "react";
import { trackFormEvent, trackLeadGeneration, trackEvent } from "@/lib/analytics";
import { getABTestVariant, trackABTestConversion } from "@/lib/ab-test";
import { getLeadAttribution } from "@/lib/attribution";

type QuickLeadData = {
  amount: string;
  amountCustom: string;
  purpose: string;
  email: string;
  phone: string;
  companyName: string;
  kvkNumber: string;
  revenue: string;
  urgency: string;
  additionalInfo: string;
};

const PURPOSE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "werkkapitaal", label: "Werkkapitaal" },
  { value: "uitbreiding", label: "Uitbreiding / groei" },
  { value: "inventaris", label: "Inventaris / apparatuur" },
  { value: "voorraad", label: "Voorraad" },
  { value: "vastgoed", label: "Vastgoed / verbouwing" },
  { value: "overbrugging", label: "Overbrugging / cashflow" },
  { value: "overname", label: "Overname" },
  { value: "herfinanciering", label: "Herfinanciering" },
  { value: "factoring", label: "Factoring" },
  { value: "overig", label: "Overig" },
];

const AMOUNT_OPTIONS: Array<{ value: string; label: string; popular?: boolean }> = [
  { value: "25000", label: "€ 25.000" },
  { value: "50000", label: "€ 50.000", popular: true },
  { value: "100000", label: "€ 100.000" },
  { value: "250000", label: "€ 250.000" },
  { value: "500000", label: "€ 500.000" },
  { value: "custom", label: "Ander bedrag" },
];

const REVENUE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "0-50k", label: "0 - 50k" },
  { value: "50k-100k", label: "50k - 100k" },
  { value: "100k-250k", label: "100k - 250k" },
  { value: "250k-500k", label: "250k - 500k" },
  { value: "500k-1m", label: "500k - 1m" },
  { value: "1m+", label: "1m+" },
];

const URGENCY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "direct", label: "Binnen 1 week" },
  { value: "kort", label: "Binnen 1-4 weken" },
  { value: "maand", label: "Binnen 1 maand" },
  { value: "kwartaal", label: "Dit kwartaal" },
];

function storageKey(path: string) {
  return `quick_lead_form_v1:${path}`;
}

function normalizeAmountEUR(data: QuickLeadData): string {
  if (data.amount === "custom") return data.amountCustom.trim();
  return data.amount.trim();
}

function base64UrlDecode(input: string): string {
  // Node supports base64url in modern versions, but this keeps it browser-safe.
  const norm = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 === 0 ? "" : "=".repeat(4 - (norm.length % 4));
  const str = norm + pad;
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

type DraftPayload = {
  v: 1;
  step: 1 | 2;
  // Intentionally exclude email/phone from URL.
  data: Omit<QuickLeadData, "email" | "phone">;
  context?: { sector?: string; source?: string; partner?: string };
  ts: number;
};

function parseDraft(input: string): DraftPayload | null {
  const raw = base64UrlDecode(input);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj || obj.v !== 1) return null;
    if (obj.step !== 1 && obj.step !== 2) return null;
    if (!obj.data || typeof obj.data !== "object") return null;
    return obj as DraftPayload;
  } catch {
    return null;
  }
}

export default function QuickLeadForm({
  onSuccess,
  isModal = false,
  defaultSource,
  onStepChange,
}: {
  onSuccess?: () => void;
  isModal?: boolean;
  defaultSource?: string;
  onStepChange?: (step: 1 | 2) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  // Honeypot field (bots tend to fill hidden inputs).
  const [website, setWebsite] = useState("");

  const [data, setData] = useState<QuickLeadData>({
    amount: "",
    amountCustom: "",
    purpose: "",
    email: "",
    phone: "",
    companyName: "",
    kvkNumber: "",
    revenue: "",
    urgency: "",
    additionalInfo: "",
  });

  const [context, setContext] = useState<{ sector?: string; source?: string; partner?: string }>({});

  const persistKey = useMemo(() => storageKey(isModal ? "modal" : "lead"), [isModal]);

  const [contactVariant, setContactVariant] = useState<"email_first" | "phone_first">("email_first");

  useEffect(() => {
    // Phone-first vs email-first A/B (for lead conversion lift).
    // - Default = email_first (safe for confirmation email + CRM)
    // - Mobile users: split test; desktop keeps email_first.
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia ? window.matchMedia("(max-width: 640px)").matches : false;
    if (!isMobile) {
      setContactVariant("email_first");
      return;
    }

    const test = {
      testId: "lead_contact_mobile_v1",
      testName: "Lead contact field order (mobile)",
      variants: [
        { id: "email_first", name: "Email first", weight: 1 },
        { id: "phone_first", name: "Phone first", weight: 1 },
      ],
    };
    const v = getABTestVariant(test);
    setContactVariant(v.id === "phone_first" ? "phone_first" : "email_first");
  }, []);

  useEffect(() => {
    // Prefill from query params when available (sector pages handoff).
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);

    const draftQ = url.searchParams.get("draft");
    const amountQ = url.searchParams.get("amount");
    const purposeQ = url.searchParams.get("purpose");
    const sectorQ = url.searchParams.get("sector");
    const sourceQ = url.searchParams.get("source");
    const partnerQ = url.searchParams.get("partner") || url.searchParams.get("affiliate") || url.searchParams.get("ref");

    // Draft restore via emailed resume link (URL-safe, no email/phone embedded).
    if (draftQ) {
      const parsed = parseDraft(draftQ);
      if (parsed) {
        setStep(parsed.step);
        setContext({
          sector: parsed.context?.sector || sectorQ || undefined,
          source: "resume_link",
          partner: parsed.context?.partner || partnerQ || undefined,
        });
        setData((prev) => ({
          ...prev,
          ...(parsed.data || {}),
        }));
      }
    }

    setContext({
      sector: sectorQ || undefined,
      source: sourceQ || defaultSource || (sectorQ ? "sector_page" : "direct"),
      partner: partnerQ || undefined,
    });

    setData((prev) => ({
      ...prev,
      amount: amountQ && amountQ !== "custom" ? amountQ : prev.amount,
      purpose: purposeQ ? purposeQ : prev.purpose,
    }));
  }, [defaultSource]);

  useEffect(() => {
    // Restore draft from storage.
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(persistKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      setData((prev) => ({ ...prev, ...(parsed.data || {}) }));
      setStep(parsed.step === 2 ? 2 : 1);
    } catch {
      // ignore
    }
  }, [persistKey]);

  useEffect(() => {
    // Persist draft for drop-off recovery.
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(persistKey, JSON.stringify({ step, data }));
    } catch {
      // ignore
    }
  }, [persistKey, step, data]);

  useEffect(() => {
    trackFormEvent("view", "quick_lead", { variant: isModal ? "modal" : "page" });
  }, [isModal]);

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  const amountEUR = normalizeAmountEUR(data);

  function setField<K extends keyof QuickLeadData>(key: K, value: QuickLeadData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1(): string | null {
    if (!amountEUR) return "Kies een bedrag.";
    if (!data.purpose) return "Kies waarvoor je de financiering gebruikt.";
    if (!data.companyName || data.companyName.trim().length < 2) return "Vul je bedrijfsnaam in.";
    if (contactVariant === "phone_first") {
      if (!data.phone || data.phone.trim().length < 6) return "Vul een telefoonnummer in.";
      // Email optional in this variant.
    } else {
      if (!data.email || !data.email.includes("@")) return "Vul een geldig e-mailadres in.";
    }
    // Always require at least one contact method (fallback safety).
    if (!data.email && !data.phone) return "Vul e-mail of telefoon in.";
    return null;
  }

  function validateStep2(): string | null {
    if (!data.revenue) return "Kies je omzetrange.";
    if (!data.urgency) return "Kies wanneer je het geld nodig hebt.";
    return null;
  }

  async function submit(extra: { submitFromStep: 1 | 2 }) {
    setSubmitError(null);
    const err = validateStep1();
    if (err) {
      setSubmitError(err);
      trackFormEvent("error", "quick_lead", { step: 1, reason: err });
      return;
    }

    if (extra.submitFromStep === 2) {
      const err2 = validateStep2();
      if (err2) {
        setSubmitError(err2);
        trackFormEvent("error", "quick_lead", { step: 2, reason: err2 });
        return;
      }
    }

    setSubmitting(true);
    trackFormEvent("start", "quick_lead", { step: extra.submitFromStep });

    try {
      const attribution = getLeadAttribution();
      const last = attribution?.last;
      const payload = {
        source: context.source || "direct",
        sector: context.sector || undefined,
        partner: context.partner || undefined,
        contact_variant: contactVariant,
        amount: amountEUR,
        purpose: data.purpose,
        companyName: data.companyName.trim(),
        kvkNumber: data.kvkNumber.trim() || undefined,
        revenue: data.revenue || undefined,
        urgency: data.urgency || undefined,
        email: data.email.trim() || undefined,
        phone: data.phone.trim() || undefined,
        additionalInfo: data.additionalInfo.trim() || undefined,
        attribution: attribution || undefined,
        website: website || undefined,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Submit failed");
      }

      setOk(true);
      trackFormEvent("complete", "quick_lead", {
        submit_from_step: extra.submitFromStep,
        sector: context.sector,
        purpose: data.purpose,
        contact_variant: contactVariant,
      });
      trackEvent("form_submit", { event_category: "Form", form_id: "quick_lead" });
      trackLeadGeneration(context.source || "direct", {
        form_id: "quick_lead",
        sector: context.sector,
        purpose: data.purpose,
        partner: context.partner,
        utm_source: last?.utm_source,
        utm_campaign: last?.utm_campaign,
        gclid: last?.gclid ? "1" : undefined,
      });

      // A/B conversion (mobile contact variant).
      trackABTestConversion(
        "lead_contact_mobile_v1",
        "Lead contact field order (mobile)",
        contactVariant,
        "lead_submit",
        { submit_from_step: extra.submitFromStep }
      );

      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(persistKey);
        }
      } catch {}

      if (isModal && onSuccess) {
        onSuccess();
      } else if (typeof window !== "undefined") {
        window.location.href = "/bedankt";
      }
    } catch (e: any) {
      const msg = e?.message && typeof e.message === "string" ? e.message : "Verzenden mislukt, probeer opnieuw.";
      setSubmitError(msg);
      trackFormEvent("error", "quick_lead", { step: extra.submitFromStep, reason: "submit_failed" });
    } finally {
      setSubmitting(false);
    }
  }

  if (ok) {
    return (
      <div style={{ padding: isModal ? 0 : "1rem 0" }}>
        <h2 style={{ marginTop: 0 }}>Bedankt! We nemen snel contact op.</h2>
        <p className="muted">Binnen 24 uur hoor je van ons. Wil je sneller schakelen? Bel ons gerust.</p>
        <div className="row" style={{ gap: "0.75rem" }}>
          <a className="btn btn-secondary" href="tel:+31850480881">
            Bel direct
          </a>
          <a className="btn btn-primary" href="/sectoren">
            Bekijk sectoren
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Honeypot - keep in DOM but off-screen */}
      <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>
      {!isModal && (
        <div style={{ marginBottom: "1.25rem" }}>
          <p className="muted" style={{ margin: 0 }}>
            Binnen 2 minuten aangevraagd • Aanbod binnen 24 uur • Geen gedoe met de bank
          </p>
        </div>
      )}

      <div className="quick-lead-stepper" aria-label="Stappen">
        <button
          type="button"
          className={`quick-lead-stepper__step ${step === 1 ? "is-active" : ""}`}
          onClick={() => setStep(1)}
        >
          <span className="quick-lead-stepper__dot" aria-hidden="true">
            1
          </span>
          <span className="quick-lead-stepper__label">Basis</span>
        </button>
        <div className={`quick-lead-stepper__line ${step === 2 ? "is-active" : ""}`} aria-hidden="true" />
        <button
          type="button"
          className={`quick-lead-stepper__step ${step === 2 ? "is-active" : ""}`}
          onClick={() => {
            const err = validateStep1();
            if (err) {
              setSubmitError(err);
              return;
            }
            trackFormEvent("start", "quick_lead", { step: 2 });
            setStep(2);
          }}
        >
          <span className="quick-lead-stepper__dot" aria-hidden="true">
            2
          </span>
          <span className="quick-lead-stepper__label">Aanvulling</span>
        </button>
      </div>

      {step === 1 ? (
        <>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Hoeveel financiering heb je nodig?</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
                {AMOUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={data.amount === opt.value ? "btn btn-primary" : "btn btn-secondary"}
                    onClick={() => setField("amount", opt.value)}
                    style={opt.popular ? { borderColor: "var(--color-brand)" } : undefined}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {data.amount === "custom" && (
                <div style={{ marginTop: "0.75rem" }}>
                  <input
                    placeholder="Vul bedrag in (EUR)"
                    inputMode="decimal"
                    value={data.amountCustom}
                    onChange={(e) => setField("amountCustom", e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Waarvoor gebruik je de financiering?</label>
              <select value={data.purpose} onChange={(e) => setField("purpose", e.target.value)} style={{ width: "100%" }}>
                <option value="" disabled>
                  Maak een keuze
                </option>
                {PURPOSE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Bedrijfsnaam</label>
              <input
                placeholder="Bijv. Bakkerij Jansen"
                value={data.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              {contactVariant === "phone_first" ? (
                <>
                  <div>
                    <label style={{ display: "block", marginBottom: 6 }}>Telefoon</label>
                    <input
                      placeholder="06…"
                      inputMode="tel"
                      value={data.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <span className="muted">Voorkeur: telefonisch contact</span>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6 }}>E-mail (optioneel)</label>
                    <input
                      placeholder="jij@bedrijf.nl"
                      inputMode="email"
                      value={data.email}
                      onChange={(e) => setField("email", e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: "block", marginBottom: 6 }}>E-mail</label>
                    <input
                      placeholder="jij@bedrijf.nl"
                      inputMode="email"
                      value={data.email}
                      onChange={(e) => setField("email", e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <span className="muted">We sturen alleen updates over je aanvraag</span>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6 }}>Telefoon (optioneel)</label>
                    <input
                      placeholder="06…"
                      inputMode="tel"
                      value={data.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {submitError && <p className="muted" style={{ marginTop: "0.75rem" }}>{submitError}</p>}

          <div className="quick-lead-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting}
              onClick={() => {
                const err = validateStep1();
                if (err) {
                  setSubmitError(err);
                  return;
                }
                trackFormEvent("start", "quick_lead", { step: 2 });
                setStep(2);
              }}
            >
              Volgende
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>KvK (optioneel)</label>
                <input
                  placeholder="12345678"
                  inputMode="numeric"
                  value={data.kvkNumber}
                  onChange={(e) => setField("kvkNumber", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Omzet</label>
                <select value={data.revenue} onChange={(e) => setField("revenue", e.target.value)} style={{ width: "100%" }}>
                  <option value="">Kies omzetrange</option>
                  {REVENUE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Wanneer heb je het geld nodig?</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
                {URGENCY_OPTIONS.map((o) => (
                  <label
                    key={o.value}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 0 }}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={o.value}
                      checked={data.urgency === o.value}
                      onChange={(e) => setField("urgency", e.target.value)}
                      style={{ width: "auto" }}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Extra info (optioneel)</label>
              <textarea
                placeholder="Bijv. waar je het voor gebruikt, situatie, voorkeuren…"
                value={data.additionalInfo}
                onChange={(e) => setField("additionalInfo", e.target.value)}
                style={{ width: "100%", minHeight: 110 }}
              />
            </div>
          </div>

          {submitError && <p className="muted" style={{ marginTop: "0.75rem" }}>{submitError}</p>}

          <div className="quick-lead-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting}
              onClick={() => submit({ submitFromStep: 2 })}
            >
              {submitting ? "Verzenden…" : "Verstuur"}
            </button>
            <button type="button" className="btn btn-secondary" disabled={submitting} onClick={() => setStep(1)}>
              Terug
            </button>
          </div>
        </>
      )}
    </div>
  );
}

