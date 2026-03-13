# Google Ads optimalisatie & lead tracking — geldgeregeld.nl

> Roadmap voor optimalisatie, conversietracking en lead-ophaling.

---

## 1. Huidige setup (wat je al hebt)

| Component | Status | Details |
|-----------|--------|---------|
| **GA4** | ✅ | G-1VMPEWNNT0, `generate_lead` event bij form submit |
| **Meta Pixel + CAPI** | ✅ | Lead event naar Meta, server-side via `/api/leads` |
| **Attribution** | ✅ | gclid, utm_*, fbclid, msclkid in `lib/attribution.ts` |
| **Lead forms** | ✅ | QuickLeadForm, InteractiveLeadForm → Strapi + Resend |
| **Bedankt-pagina** | ✅ | `/bedankt` na succesvolle submit (noindex) |
| **GTM** | ⚠️ | Optioneel via `NEXT_PUBLIC_GTM_ID` |
| **Google Ads conversie** | ❌ | Nog niet gekoppeld |

---

## 2. Google Ads conversietracking (prioriteit 1)

### Optie A: GA4-import (snelst)

1. Ga naar [ads.google.com](https://ads.google.com) → Tools → Conversions
2. Klik **New conversion action** → **Import** → **Google Analytics 4**
3. Koppel GA4 property G-1VMPEWNNT0
4. Selecteer **generate_lead** als conversie
5. Naam: "Lead - Financieringsaanvraag"
6. Waarde: Geen (of later: dynamisch op basis van bedrag)

**Voordeel:** Geen code-aanpassing. **Nadeel:** Tot 24–48 uur vertraging.

### Optie B: gtag-conversietag (directer)

1. In Google Ads: Tools → Conversions → New → Website
2. Kies "Add a conversion action manually"
3. Categorie: Lead
4. Kopieer de **Conversion ID** en **Conversion label**
5. Voeg toe aan `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
   NEXT_PUBLE_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXX
   ```
6. In `lib/analytics.ts` bij `trackLeadGeneration`:
   ```ts
   if (window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
     window.gtag('event', 'conversion', {
       send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL}`,
       value: amountEUR || undefined,
       currency: 'EUR',
     });
   }
   ```

---

## 3. Landingspagina’s met gclid

Google Ads voegt automatisch `?gclid=...` toe aan je final URL. Jullie attribution vangt dit al op. Zorg dat:

- **Final URL** in ads = `https://www.geldgeregeld.nl` of sector-specifiek
- **Tracking template** leeg (standaard)
- **Final URL suffix** (optioneel): `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}`

Sector-specifieke landingspagina’s (beter voor Quality Score):

| Campagne | Aanbevolen final URL |
|----------|----------------------|
| Werkkapitaal & Factoring | `https://www.geldgeregeld.nl/financiering/werkkapitaal` |
| Horeca & ZZP | `https://www.geldgeregeld.nl/sectoren/horeca` of `/sectoren/zzp` |

---

## 4. Lead-flow & conversie

```
Google Ads click (gclid) → Landing page → Form → Submit → /bedankt
                                    ↓
                    trackLeadGeneration() → GA4 + Meta + (Google Ads)
                                    ↓
                    /api/leads → Strapi + Resend e-mail
```

**Checklist:**

- [ ] gclid wordt bewaard in attribution (✅ al zo)
- [ ] Lead payload bevat `attribution` met gclid (✅ al zo)
- [ ] Google Ads conversie wordt getriggerd (❌ nog doen)
- [ ] Bedankt-pagina: eventueel extra conversion-fire voor edge cases

---

## 5. Optimalisatie na 2–4 weken data

| Actie | Wanneer |
|-------|---------|
| **Negatieve keywords** | Na 1–2 weken: lijfrente, pensioen, particulier, bkr, gratis |
| **Keyword match types** | Van BROAD naar PHRASE/EXACT voor termen met conversies |
| **Bidding** | Van Target Spend naar Maximize conversions of Target CPA |
| **Landingspagina’s** | Per ad group de meest relevante sector/use-case URL |
| **Ad copy A/B-test** | Nieuwe headlines/descriptions testen |
| **Budget** | Verhogen voor campagnes met lage CPA en goede ROAS |

---

## 6. Rapportage & dashboards

### GA4

- **Conversies:** generate_lead
- **Custom dimensions:** utm_source, utm_medium, utm_campaign, gclid (via attribution)
- **Funnel:** Landing page → Form start → Form complete → Bedankt

### Google Ads

- **Conversies:** Lead (na koppeling)
- **Kolommen:** Conv. rate, Cost/conv., Conv. value
- **Segmenten:** Per campagne, ad group, keyword

### Strapi / CRM

- Leads met `source`, `attribution`, `gclid`
- Koppel later aan deal/opportunity voor full-funnel ROI

---

## 7. Implementatie-checklist

### Fase 1: Conversietracking (deze week)

1. [x] Google Ads conversie aanmaken (via `npm run googleads:setup-conversion`)
2. [x] gtag-conversie in `trackLeadGeneration` + env vars
3. [x] Negatieve keywords (via `npm run googleads:add-negative-keywords`)
4. [ ] Ads final URLs controleren (sector-specifiek waar mogelijk)

### Fase 2: Optimalisatie (na 2–4 weken)

4. [ ] Negatieve keywords toevoegen
5. [ ] Keyword match types aanscherpen
6. [ ] Bidding-strategie evalueren

### Fase 3: Uitbreiding

7. [ ] Remarketing-audience (bezoekers zonder conversie)
8. [ ] Conversion value (op basis van aangevraagd bedrag)
9. [ ] Google Ads–Strapi sync voor offline conversies (optioneel)

---

## 8. Env-variabelen (voor gtag-conversie)

Voeg toe aan `frontend/.env.local`:

```env
# Google Ads conversietracking (na aanmaken conversion action in ads.google.com)
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXX
```

De code in `lib/analytics.ts` en `layout.tsx` is al voorbereid — zodra deze vars gezet zijn, worden leads automatisch als conversie naar Google Ads gestuurd.

---

## 9. Referenties

- [Google Ads conversion tracking](https://support.google.com/google-ads/answer/1722022)
- [GA4 → Google Ads import](https://support.google.com/google-ads/answer/12260921)
- [Attribution in codebase](../../frontend/lib/attribution.ts)
- [trackLeadGeneration](../../frontend/lib/analytics.ts)
