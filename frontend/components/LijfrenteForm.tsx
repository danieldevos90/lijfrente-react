"use client";
import { useEffect, useMemo, useState } from "react";

type Frequency = "maandelijks" | "kwartaal" | "jaarlijks";

export default function LijfrenteForm({ siteId }: { siteId: string }) {
  const [age, setAge] = useState(55);
  const [gender, setGender] = useState<"M" | "F" | "X">("M");
  const [amount, setAmount] = useState(50000);
  const [startDate, setStartDate] = useState<string>("");
  const [freq, setFreq] = useState<Frequency>("maandelijks");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [indicatie, setIndicatie] = useState<string>("");
  const [variant, setVariant] = useState<"A" | "B">("A");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      const url = new URL(window.location.href);
      const v = (url.searchParams.get('ab') || '').toUpperCase();
      if (v === 'A' || v === 'B') setVariant(v as any);
      (window as any).dataLayer.push({ event: "lr_form_view", form_id: "lijfrente_intake", ab: v || 'A' });
    }
  }, []);

  const isValid = useMemo(() => {
    return age > 17 && amount > 0 && Boolean(startDate) && consent;
  }, [age, amount, startDate, consent]);

  function calcIndicatie() {
    // Zeer grove, niet-bindende indicatie (educatief): lineaire deling over 20 jaar met 2% opslag
    // Dit is bewust conservatief en uitsluitend om de conversie te ondersteunen met een richtbedrag.
    const jaren = 20; // vereenvoudigd
    const factor = 1.02; // opslag
    const perJaar = (amount / jaren) / factor;
    const perMaand = perJaar / 12;
    let value = perMaand;
    if (freq === "kwartaal") value = perJaar / 4;
    if (freq === "jaarlijks") value = perJaar;
    const euro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(value)));
    return euro;
  }

  async function onCalculate() {
    const errs: Record<string, string> = {};
    if (age < 18) errs.age = "Minimale leeftijd is 18";
    if (!amount || amount <= 0) errs.amount = "Vul koopsom in";
    if (!startDate) errs.startDate = "Kies ingangsdatum";
    if (!consent) errs.consent = "Vereist";
    setErrors(errs);

    if (typeof window !== "undefined") {
      (window as any).dataLayer.push({ event: "lr_calc", valid: Object.keys(errs).length === 0, freq, age_bucket: age < 45 ? "<45" : age < 60 ? "45-59" : "60+" });
      if (Object.keys(errs).length > 0) {
        for (const [field] of Object.entries(errs)) {
          (window as any).dataLayer.push({ event: 'form_field_error', field, error_code: 'invalid' });
        }
      }
    }

    if (Object.keys(errs).length === 0) {
      setIndicatie(calcIndicatie());
    } else {
      setIndicatie("");
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12, padding: 12, background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 10 }}>
        <h1 style={{ marginTop: 0 }}>Persoonlijke lijfrente‑indicatie</h1>
        <p className="muted">{variant === 'A' ? 'Binnen 1 minuut een richtbedrag. Niet‑bindend. Je ontvangt daarna vrijblijvend een aanbod.' : 'Ontvang direct een persoonlijke indicatie. Geen verplichtingen en snel een aanbod.'}</p>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <span className="muted">Vertrouwd door ondernemers</span>
          <span aria-hidden>•</span>
          <span className="muted">Privacy‑vriendelijk</span>
          <span aria-hidden>•</span>
          <span className="muted">Binnen 24u reactie</span>
        </div>
      </div>

      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <label>Leeftijd</label>
        <input name="age" inputMode="numeric" value={age} onChange={(e) => setAge(Number(e.target.value || 0))} />
        {errors.age && <span className="muted">{errors.age}</span>}
      </div>

      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <label>Geslacht</label>
        <div className="row" style={{ gap: 8 }}>
          {(["M","F","X"] as const).map(g => (
            <button key={g} type="button" className={`btn ${gender === g ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setGender(g)}>{g}</button>
          ))}
        </div>
      </div>

      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <label>Koopsom/inleg (€)</label>
        <input name="amount" placeholder="€" inputMode="decimal" value={amount} onChange={(e) => setAmount(Number((e.target.value || '').replace(/[^0-9]/g, '')))} />
        {errors.amount && <span className="muted">{errors.amount}</span>}
      </div>

      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <label>Ingangsdatum</label>
        <input name="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        {errors.startDate && <span className="muted">{errors.startDate}</span>}
      </div>

      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <label>Uitkeringsfrequentie</label>
        <select name="frequency" value={freq} onChange={(e) => setFreq(e.target.value as Frequency)}>
          <option value="maandelijks">Maandelijks</option>
          <option value="kwartaal">Per kwartaal</option>
          <option value="jaarlijks">Jaarlijks</option>
        </select>
      </div>

      <div className="row" style={{ alignItems: 'center', gap: 8 }}>
        <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <label htmlFor="consent">Ik geef toestemming voor verwerking van mijn gegevens t.b.v. een indicatie en vrijblijvend aanbod.</label>
        {errors.consent && <span className="muted">{errors.consent}</span>}
      </div>

      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <label>E‑mail (optioneel)</label>
        <input name="email" placeholder="jij@voorbeeld.nl" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" type="button" onClick={onCalculate} disabled={!isValid}>{variant === 'A' ? 'Bereken indicatie' : 'Bekijk jouw indicatie'}</button>
        <a className="btn btn-secondary" href={`/sites/${siteId}`}>Annuleren</a>
      </div>

      {indicatie && (
        <div style={{ marginTop: 16, padding: 12, background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Jouw indicatie</h3>
          <p className="muted">Richtbedrag {freq}: <strong>{indicatie}</strong> (niet‑bindend)</p>
          <p className="muted">Op basis van eenvoudige aannames. Voor een definitief, persoonlijk aanbod hebben we nog een paar bedrijfsgegevens nodig.</p>
          <div className="row" style={{ marginTop: 12 }}>
            <a
              className="btn btn-primary"
              href={`/sites/${siteId}/lead?amount=${encodeURIComponent(String(amount))}&ab=${variant}`}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  (window as any).dataLayer.push({ event: 'lr_continue', freq, has_email: Boolean(email), ab: variant });
                }
              }}
            >
              {variant === 'A' ? 'Ga verder en ontvang aanbod' : 'Ga verder'}
            </a>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>We vragen daarna alleen wat nodig is om je aanbod te berekenen. Geen verplichtingen.</p>
        </div>
      )}
    </div>
  );
}


