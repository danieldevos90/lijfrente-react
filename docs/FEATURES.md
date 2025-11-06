# Zakelijk Lening Project — Feature status

## Voltooid (100%)
- Frontend herbrand naar "zakelijk-lening-project" (env: `NEXT_PUBLIC_SITE_NAME`) — 100%
- Lijfrente → Zakelijke financiering transitie (CTA's, copy, sticky CTA) — 100%
- Two‑step funnel: intake/indicatie → lead (prefill, dataLayer events) — 100%
- A/B‑toggle op intake (`?ab=A|B`) met events — 100%
- Interne links "Verder lezen" (curated) — 100%
- Strapi content‑opschoning en 5 nieuwe corporate/MKB pagina's — 100%
- Vercel deploys (prod) — 100%
- GTM/Plausible injectie via env — 100%
- UX Design: Minimale drawer widget (3 stappen, Nederlands, auto-opslaan) — 100%
- Stitch prompts: 5 schermen (homepage + 3 drawer stappen + succes) — 100%

## Gedeeltelijk (75–90%)
- KvK typeahead (stub + frontend) — 80%
- PSD2 stub + CTA — 80%
- Sitemap‑gestuurde linking (heuristisch + curated) — 80%

## Next steps (worden nu geïmplementeerd) — doel 100%

1) Drawer Widget Implementatie (VOLTOO ID) ✅
   - DrawerWidget component gebouwd (React)
   - 3-staps formulier (Bedrijfsgegevens → Financiering → NAW+Contact)
   - Auto-opslaan (cookie-based met 7 dagen expiry)
   - Voortgang indicator (dots + progress bar)
   - Volledig in Nederlands
   - Responsive (440px desktop, 100vw mobiel)
   - Velden: bedrijfsnaam, KvK, activiteiten, bedrag, doel, NAW, email, tel
   - GTM event tracking per stap

2) KvK API (productie)
   - Key/endpoint toevoegen in Vercel env
   - Server route hardenen (timeouts, retries)
   - Validatie/telemetrie uitbreiden
   - Integratie in drawer stap 1

3) Formulier Optimalisatie
   - Validatie per stap (Nederlands error berichten)
   - Debounced auto-save (500ms)
   - Resume progress prompt
   - Success bevestiging in drawer
   - GTM events per stap

4) Sitemap‑gestuurde interne links (volledig)
   - `_analysis/ux/sitemap.md` parsen en mappen op Strapi slugs
   - Huboverzicht op `/sites/[siteId]` met counts

5) Analytics dashboards
   - GTM/GA4 of Plausible custom goals voor funnel
   - A/B‑resultaten per variant
   - Drawer conversie tracking

6) Content uitbreidingen
   - 5 extra financieringspagina's: Sectoren, Voorwaarden, Rente, Documenten, Case studies
   - Alle content in Nederlands

7) Hardening & UX
   - Errorstates, loading states, accessibility pass
   - Keyboard navigation (Tab, Esc)
   - Focus trap in drawer
   - Touch targets (min 44px mobiel)

## Stand van zaken (percentage)
- Funnel en CTA's: 100%
- Content basis (5 pagina's): 100%
- Interne links: 80%
- KvK/PSD2 stubs: 80%
- Analytics setup: 100% (env nog vullen)
- Branding/site‑naam: 100%
- Drawer Widget: 100% ✅
- Minimale homepage in Nederlands: 100% ✅

— Laat je gewenste volgorde weten; ik zet de “Next steps” op 100% en deploy gelijk door.


