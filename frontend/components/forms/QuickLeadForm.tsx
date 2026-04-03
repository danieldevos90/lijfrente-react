"use client";

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Shield, Zap } from "lucide-react";
import {
  trackFormEvent,
  trackLeadGeneration,
  trackEvent,
  createTrackingEventId,
  trackQuickLeadFunnel,
  quickLeadMessageToValidationReason,
  type QuickLeadSurface,
  type QuickLeadCloseMethod,
} from "@/lib/analytics";
import { getABTestVariant, trackABTestConversion } from "@/lib/ab-test";
import { getLeadAttribution } from "@/lib/attribution";

type QuickLeadData = {
  amount: string;
  amountCustom: string;
  purpose: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  kvkNumber: string;
  revenue: string;
  urgency: string;
  additionalInfo: string;
  businessType: string;
  businessAge: string;
  isProfitable: string;
  businessActivities: string;
};

const PURPOSE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "werkkapitaal", label: "Werkkapitaal" },
  { value: "uitbreiding", label: "Uitbreiding / groei" },
  { value: "inventaris", label: "Inventaris / apparatuur" },
  { value: "voorraad", label: "Voorraad" },
  { value: "vastgoed", label: "Vastgoed / verbouwing" },
  { value: "vastgoed_krediet", label: "Zakelijk vastgoed krediet" },
  { value: "overbrugging", label: "Overbrugging / cashflow" },
  { value: "overname", label: "Overname" },
  { value: "tweede_rang", label: "2e rang financiering" },
  { value: "herfinanciering", label: "Herfinanciering" },
  { value: "factoring", label: "Factoring" },
  { value: "overig", label: "Overig" },
];

const AMOUNT_OPTIONS: Array<{ value: string; label: string; popular?: boolean }> = [
  { value: "10000", label: "€ 10.000" },
  { value: "25000", label: "€ 25.000" },
  { value: "50000", label: "€ 50.000", popular: true },
  { value: "100000", label: "€ 100.000" },
  { value: "250000", label: "€ 250.000" },
  { value: "500000", label: "€ 500.000" },
  { value: "1000000", label: "€ 1.000.000" },
  { value: "2500000", label: "€ 2.500.000" },
  { value: "custom", label: "Ander bedrag" },
];

const REVENUE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "0-100k", label: "< €100.000" },
  { value: "100k-250k", label: "€100.000 - €250.000" },
  { value: "250k-500k", label: "€250.000 - €500.000" },
  { value: "500k-1m", label: "€500.000 - €1.000.000" },
  { value: "1m-3m", label: "€1.000.000 - €3.000.000" },
  { value: "3m+", label: "€3.000.000+" },
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
  surface: surfaceProp,
  openTrigger,
}: {
  onSuccess?: () => void;
  isModal?: boolean;
  defaultSource?: string;
  onStepChange?: (step: 1 | 2) => void;
  /** For funnel reporting: drawer widget vs exit-intent modal vs inline page */
  surface?: QuickLeadSurface;
  /** Last open CTA (drawer) or fixed label (exit intent) */
  openTrigger?: string;
}) {
  const surface: QuickLeadSurface = surfaceProp ?? (isModal ? "drawer" : "inline");

  /** Set in useEffect so SSR/hydration never leaves analysis stuck on a sentinel id */
  const [funnelSessionId, setFunnelSessionId] = useState<string | null>(null);
  const funnelCompletedRef = useRef(false);
  const lastStepRef = useRef<1 | 2>(1);
  const closeMethodRef = useRef<QuickLeadCloseMethod | undefined>(undefined);
  const prevStepRef = useRef<1 | 2 | null>(null);
  const formMountOnceRef = useRef(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  // Honeypot field (bots tend to fill hidden inputs).
  const [website, setWebsite] = useState("");

  const [screening, setScreening] = useState({
    noLoss: false,
    noArrears: false,
  });
  const screeningConfirmed = screening.noLoss && screening.noArrears;

  const [data, setData] = useState<QuickLeadData>({
    amount: "",
    amountCustom: "",
    purpose: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    kvkNumber: "",
    revenue: "",
    urgency: "",
    additionalInfo: "",
    businessType: "",
    businessAge: "",
    isProfitable: "",
    businessActivities: "",
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
    trackFormEvent("view", "quick_lead", { variant: isModal ? "modal" : "page", surface });
  }, [isModal, surface]);

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  useEffect(() => {
    lastStepRef.current = step;
  }, [step]);

  useEffect(() => {
    setFunnelSessionId(createTrackingEventId("qlf"));
  }, []);

  // Surface dismissed (drawer / exit-intent): capture method before unmount for abandon event
  useEffect(() => {
    if (surface === "inline") return;
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ method?: QuickLeadCloseMethod }>).detail;
      if (d?.method) closeMethodRef.current = d.method;
    };
    window.addEventListener("quick_lead_surface_close", handler);
    return () => window.removeEventListener("quick_lead_surface_close", handler);
  }, [surface]);

  // One-shot: form opened + step 1 visible (guard: contactVariant/context can update later)
  useEffect(() => {
    if (!funnelSessionId || formMountOnceRef.current) return;
    formMountOnceRef.current = true;
    trackQuickLeadFunnel({
      action: "form_mount",
      step: 1,
      surface,
      funnel_session_id: funnelSessionId,
      open_trigger: openTrigger,
      lead_source: context.source,
      sector: context.sector,
      contact_variant: contactVariant,
    });
    trackQuickLeadFunnel({
      action: "step_view",
      step: 1,
      surface,
      funnel_session_id: funnelSessionId,
    });
    prevStepRef.current = 1;
  }, [funnelSessionId, surface, openTrigger, context.source, context.sector, contactVariant]);

  // Step changes (2 ↔ 1): where users navigate after initial view
  useEffect(() => {
    if (!funnelSessionId) return;
    if (prevStepRef.current === step) return;
    const fromStep = prevStepRef.current;
    if (fromStep !== null) {
      trackQuickLeadFunnel({
        action: "step_view",
        step,
        surface,
        funnel_session_id: funnelSessionId,
        from_step: fromStep,
        lead_source: context.source,
        sector: context.sector,
      });
    }
    prevStepRef.current = step;
  }, [step, surface, funnelSessionId, context.source, context.sector]);

  // Drawer / popup closed without successful submit → abandon (not inline pages)
  useEffect(() => {
    return () => {
      if (surface === "inline") return;
      if (!funnelSessionId) return;
      if (funnelCompletedRef.current) return;
      trackQuickLeadFunnel({
        action: "surface_close_abandon",
        step: lastStepRef.current,
        surface,
        funnel_session_id: funnelSessionId,
        close_method: closeMethodRef.current,
        lead_source: context.source,
        sector: context.sector,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- abandon snapshot at unmount only
  }, [surface, funnelSessionId]);

  const emitValidationBlocked = useCallback(
    (stepNum: 1 | 2, message: string) => {
      if (!funnelSessionId) return;
      const { reason, detail } = quickLeadMessageToValidationReason(message);
      trackQuickLeadFunnel({
        action: "validation_blocked",
        step: stepNum,
        surface,
        funnel_session_id: funnelSessionId,
        validation_reason: reason,
        validation_detail: detail,
        sector: context.sector,
        lead_source: context.source,
        contact_variant: contactVariant,
        purpose: data.purpose || undefined,
      });
      trackFormEvent("error", "quick_lead", {
        step: stepNum,
        reason,
        surface,
        funnel_session_id: funnelSessionId,
      });
    },
    [
      funnelSessionId,
      surface,
      context.sector,
      context.source,
      contactVariant,
      data.purpose,
    ]
  );

  const amountEUR = normalizeAmountEUR(data);

  function setField<K extends keyof QuickLeadData>(key: K, value: QuickLeadData[K]) {
    setSubmitError(null);
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1(): string | null {
    if (!amountEUR) return "Kies een bedrag.";
    if (!data.purpose) return "Kies waarvoor je de financiering gebruikt.";
    if (!data.firstName || data.firstName.trim().length < 2) return "Vul je naam in.";
    if (!data.lastName || data.lastName.trim().length < 2) return "Vul je achternaam in.";
    if (!data.companyName || data.companyName.trim().length < 2) return "Vul je bedrijfsnaam in.";
    if (!data.email || !data.email.includes("@")) return "Vul een geldig e-mailadres in.";
    if (!data.phone || data.phone.trim().length < 6) return "Vul een telefoonnummer in.";
    return null;
  }

  function validateStep2(): string | null {
    if (!screeningConfirmed) {
      const missing: string[] = [];
      if (!screening.noLoss) missing.push("geen verlies");
      if (!screening.noArrears) missing.push("geen achterstanden");
      return `screening_disqualified:${missing.join(",")}`;
    }
    const kvk = (data.kvkNumber || "").replace(/\D/g, "");
    if (kvk.length !== 8) return "Vul een geldig KvK-nummer in (8 cijfers).";
    if (!data.revenue) return "Kies je verwachte jaaromzet.";
    if (data.revenue === "0-100k") return "De minimale jaaromzet is € 100.000. Kom je niet in aanmerking voor deze financiering.";
    if (!data.businessActivities || data.businessActivities.trim().length < 3) return "Beschrijf je bedrijfsactiviteiten.";
    if (!data.urgency) return "Kies wanneer je het geld nodig hebt.";
    return null;
  }

  async function submit(extra: { submitFromStep: 1 | 2 }) {
    setSubmitError(null);
    const err = validateStep1();
    if (err) {
      setSubmitError(err);
      emitValidationBlocked(1, err);
      return;
    }

    if (extra.submitFromStep === 2) {
      const err2 = validateStep2();
      if (err2) {
        setSubmitError(err2);
        emitValidationBlocked(2, err2);
        return;
      }
    }

    setSubmitting(true);
    if (funnelSessionId) {
      trackQuickLeadFunnel({
        action: "submit_attempt",
        step: extra.submitFromStep,
        surface,
        funnel_session_id: funnelSessionId,
        purpose: data.purpose || undefined,
        sector: context.sector,
        lead_source: context.source,
        contact_variant: contactVariant,
      });
    }
    trackFormEvent("start", "quick_lead", { step: extra.submitFromStep, surface, funnel_session_id: funnelSessionId });

    try {
      const attribution = getLeadAttribution();
      const last = attribution?.last;
      const metaEventId = createTrackingEventId("lead");
      const payload = {
        source: context.source || "direct",
        sector: context.sector || undefined,
        partner: context.partner || undefined,
        contact_variant: contactVariant,
        amount: amountEUR,
        purpose: data.purpose,
        firstName: data.firstName.trim() || undefined,
        lastName: data.lastName.trim() || undefined,
        companyName: data.companyName.trim(),
        kvkNumber: data.kvkNumber.trim() || undefined,
        revenue: data.revenue || undefined,
        urgency: data.urgency || undefined,
        email: data.email.trim() || undefined,
        phone: data.phone.trim() || undefined,
        additionalInfo: data.additionalInfo.trim() || undefined,
        businessType: data.businessType || undefined,
        businessAge: data.businessAge || undefined,
        isProfitable: data.isProfitable || undefined,
        bedrijfsactiviteiten: data.businessActivities.trim() || undefined,
        meta_event_id: metaEventId,
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

      const resJson = await res.json().catch(() => ({}));
      const returnedQuality = resJson?.leadQuality || "onbekend";

      funnelCompletedRef.current = true;
      setOk(true);
      if (funnelSessionId) {
        trackQuickLeadFunnel({
          action: "submit_success",
          step: extra.submitFromStep,
          surface,
          funnel_session_id: funnelSessionId,
          purpose: data.purpose,
          sector: context.sector,
          lead_source: context.source,
          contact_variant: contactVariant,
          lead_quality: returnedQuality,
        });
      }
      trackFormEvent("complete", "quick_lead", {
        submit_from_step: extra.submitFromStep,
        sector: context.sector,
        purpose: data.purpose,
        contact_variant: contactVariant,
        lead_quality: returnedQuality,
      });
      trackEvent("form_submit", { event_category: "Form", form_id: "quick_lead", lead_quality: returnedQuality });
      trackLeadGeneration(context.source || "direct", {
        form_id: "quick_lead",
        sector: context.sector,
        purpose: data.purpose,
        partner: context.partner,
        lead_quality: returnedQuality,
        meta_event_id: metaEventId,
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
      const { reason, detail } = quickLeadMessageToValidationReason(msg);
      if (funnelSessionId) {
        trackQuickLeadFunnel({
          action: "submit_failed",
          step: extra.submitFromStep,
          surface,
          funnel_session_id: funnelSessionId,
          validation_reason: reason,
          validation_detail: detail,
          purpose: data.purpose || undefined,
          sector: context.sector,
        });
      }
      trackFormEvent("error", "quick_lead", {
        step: extra.submitFromStep,
        reason: reason,
        surface,
        funnel_session_id: funnelSessionId,
      });
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
    <div className={isModal ? "quick-lead-form quick-lead-form--in-drawer" : "quick-lead-form"}>
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
      <div className="quick-lead-stepper" aria-label="Stappen">
        <button
          type="button"
          className={`quick-lead-stepper__step ${step === 1 ? "is-active" : ""}`}
          onClick={() => {
            if (step === 2) {
              if (funnelSessionId) {
                trackQuickLeadFunnel({
                  action: "step_tab_to_1",
                  step: 1,
                  from_step: 2,
                  surface,
                  funnel_session_id: funnelSessionId,
                });
              }
              setStep(1);
            }
          }}
        >
          <span className="quick-lead-stepper__dot">1</span>
          <span className="quick-lead-stepper__label">Basis</span>
        </button>
        <span className={`quick-lead-stepper__line ${step === 2 ? "is-active" : ""}`} aria-hidden="true" />
        <button
          type="button"
          className={`quick-lead-stepper__step ${step === 2 ? "is-active" : ""}`}
          onClick={() => {
            const err = validateStep1();
            if (err) {
              setSubmitError(err);
              emitValidationBlocked(1, err);
              return;
            }
            if (funnelSessionId) {
              trackQuickLeadFunnel({
                action: "step_advance",
                step: 2,
                from_step: 1,
                surface,
                funnel_session_id: funnelSessionId,
              });
            }
            trackFormEvent("start", "quick_lead", { step: 2, surface, funnel_session_id: funnelSessionId });
            setStep(2);
          }}
        >
          <span className="quick-lead-stepper__dot">2</span>
          <span className="quick-lead-stepper__label">Aanvulling</span>
        </button>
      </div>

      {step === 1 ? (
        <>
          <div style={{ display: "grid", gap: "1.35rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Hoeveel financiering heb je nodig?</label>
              <div className="quick-lead-amount-pills">
                {AMOUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`quick-lead-amount-pill ${opt.value === "custom" ? "quick-lead-amount-pill--wide" : ""} ${data.amount === opt.value ? "btn btn-primary" : "btn btn-secondary"}`}
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
              <label style={{ display: "block", marginBottom: 4 }}>Waarvoor gebruik je de financiering?</label>
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

            <div className="quick-lead-form__row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>Naam</label>
                <input
                  placeholder="Jan"
                  value={data.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  style={{ width: "100%" }}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>Achternaam</label>
                <input
                  placeholder="Jansen"
                  value={data.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  style={{ width: "100%" }}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Bedrijfsnaam</label>
              <input
                placeholder="Bijv. Bakkerij Jansen"
                value={data.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div className="quick-lead-form__row-fit" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              {contactVariant === "phone_first" ? (
                <>
                  <div>
                    <label style={{ display: "block", marginBottom: 4 }}>Telefoon</label>
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
                    <label style={{ display: "block", marginBottom: 4 }}>E-mail</label>
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
                    <label style={{ display: "block", marginBottom: 4 }}>E-mail</label>
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
                    <label style={{ display: "block", marginBottom: 4 }}>Telefoon</label>
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

          {submitError && <p className="quick-lead-error" style={{ marginTop: "0.75rem" }}>{submitError}</p>}

          <div className="quick-lead-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting}
              onClick={() => {
                const err = validateStep1();
                if (err) {
                  setSubmitError(err);
                  emitValidationBlocked(1, err);
                  return;
                }
                if (funnelSessionId) {
                  trackQuickLeadFunnel({
                    action: "step_advance",
                    step: 2,
                    from_step: 1,
                    surface,
                    funnel_session_id: funnelSessionId,
                  });
                }
                trackFormEvent("start", "quick_lead", { step: 2, surface, funnel_session_id: funnelSessionId });
                setStep(2);
              }}
            >
              Volgende
            </button>
          </div>
          {isModal && (
            <div className="quick-lead-usps">
              <span className="quick-lead-usp-pill">
                <Shield size={14} aria-hidden />
                Veilig en vertrouwd
              </span>
              <span className="quick-lead-usp-pill">
                <Zap size={14} aria-hidden />
                Binnen 24 uur reactie
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1.35rem" }}>
            <div className="quick-lead-form__row-fit" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>KvK-nummer</label>
                <input
                  placeholder="12345678"
                  inputMode="numeric"
                  value={data.kvkNumber}
                  onChange={(e) => setField("kvkNumber", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>Verwachte jaaromzet 2026</label>
                <select value={data.revenue} onChange={(e) => setField("revenue", e.target.value)} style={{ width: "100%" }}>
                  <option value="">Kies jaaromzet</option>
                  {REVENUE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Bedrijfsactiviteiten *</label>
              <textarea
                placeholder="Beschrijf kort wat je bedrijf doet..."
                value={data.businessActivities}
                onChange={(e) => setField("businessActivities", e.target.value)}
                rows={2}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>

            <div className="quick-lead-form__row-fit" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>Rechtsvorm</label>
                <select value={data.businessType} onChange={(e) => setField("businessType", e.target.value)} style={{ width: "100%" }}>
                  <option value="">Kies rechtsvorm</option>
                  <option value="eenmanszaak">Eenmanszaak</option>
                  <option value="bv">BV / NV</option>
                  <option value="vof">VOF / Maatschap</option>
                  <option value="stichting">Stichting / Vereniging</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>Hoe lang bestaat het bedrijf?</label>
                <select value={data.businessAge} onChange={(e) => setField("businessAge", e.target.value)} style={{ width: "100%" }}>
                  <option value="">Kies</option>
                  <option value="0_2">0 - 2 jaar</option>
                  <option value="2_5">2 - 5 jaar</option>
                  <option value="5_10">5 - 10 jaar</option>
                  <option value="10_plus">10+ jaar</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Wanneer heb je het geld nodig?</label>
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
              <label style={{ display: "block", marginBottom: 4 }}>Extra info (optioneel)</label>
              <textarea
                placeholder="Bijv. waar je het voor gebruikt, situatie, voorkeuren…"
                value={data.additionalInfo}
                onChange={(e) => setField("additionalInfo", e.target.value)}
                style={{ width: "100%", minHeight: 80 }}
              />
            </div>
          </div>

          {submitError && !submitError.startsWith("screening_disqualified:") && (
            <p className="quick-lead-error" style={{ marginTop: "0.75rem" }}>{submitError}</p>
          )}

          <div className="screening-confirm" role="group" aria-labelledby="screening-confirm-heading">
            <p className="screening-confirm__heading" id="screening-confirm-heading">Ik bevestig dat:</p>
            <label className={`screening-confirm__item ${screening.noLoss ? "is-checked" : ""}`}>
              <input
                type="checkbox"
                checked={screening.noLoss}
                onChange={(e) => {
                  setScreening((s) => ({ ...s, noLoss: e.target.checked }));
                  setSubmitError(null);
                }}
                style={{ width: "auto" }}
              />
              <span>Mijn bedrijf draait geen verlies</span>
            </label>
            <label className={`screening-confirm__item ${screening.noArrears ? "is-checked" : ""}`}>
              <input
                type="checkbox"
                checked={screening.noArrears}
                onChange={(e) => {
                  setScreening((s) => ({ ...s, noArrears: e.target.checked }));
                  setSubmitError(null);
                }}
                style={{ width: "auto" }}
              />
              <span>Geen betaalachterstanden op de bankrekening</span>
            </label>
          </div>

          <div className="quick-lead-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting || !screeningConfirmed}
              onClick={() => submit({ submitFromStep: 2 })}
            >
              {submitting ? "Verzenden…" : "Verstuur"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={submitting}
              onClick={() => {
                if (funnelSessionId) {
                  trackQuickLeadFunnel({
                    action: "step_back",
                    step: 1,
                    from_step: 2,
                    surface,
                    funnel_session_id: funnelSessionId,
                  });
                }
                setStep(1);
              }}
            >
              Terug
            </button>
          </div>
        </>
      )}
    </div>
  );
}

