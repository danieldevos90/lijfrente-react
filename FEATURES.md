# Zakelijk Lening Project — Feature status

## Voltooid (100%)
- Frontend herbrand naar “zakelijk-lening-project” (env: `NEXT_PUBLIC_SITE_NAME`) — 100%
- Lijfrente → Zakelijke financiering transitie (CTA’s, copy, sticky CTA) — 100%
- Two‑step funnel: intake/indicatie → lead (prefill, dataLayer events) — 100%
- A/B‑toggle op intake (`?ab=A|B`) met events — 100%
- Interne links “Verder lezen” (curated) — 100%
- Strapi content‑opschoning en 5 nieuwe corporate/MKB pagina’s — 100%
- Vercel deploys (prod) — 100%
- GTM/Plausible injectie via env — 100%

## Gedeeltelijk (75–90%)
- KvK typeahead (stub + frontend) — 80%
- PSD2 stub + CTA — 80%
- Sitemap‑gestuurde linking (heuristisch + curated) — 80%

## Next steps (worden nu geïmplementeerd) — doel 100%
1) KvK API (productie)
   - Key/endpoint toevoegen in Vercel env
   - Server route hardenen (timeouts, retries)
   - Validatie/telemetrie uitbreiden

2) PSD2 provider koppeling (Tink/Yapily)
   - ClientId/Redirect in env
   - Consent session aanmaken en redirect
   - Success/fail events en fallback upload

3) Sitemap‑gestuurde interne links (volledig)
   - `_analysis/ux/sitemap.md` parsen en mappen op Strapi slugs
   - Huboverzicht op `/sites/[siteId]` met counts

4) Analytics dashboards
   - GTM/GA4 of Plausible custom goals voor funnel
   - A/B‑resultaten per variant

5) Navigatiebeheer
   - Strapi nav sync script (ensure Home/Aanvraag)

6) Content uitbreidingen
   - 5 extra financieringspagina’s: Sectoren, Voorwaarden, Rente, Documenten, Case studies

7) Hardening & UX
   - Errorstates, loading states, accessibility pass

## Stand van zaken (percentage)
- Funnel en CTA’s: 100%
- Content basis (5 pagina’s): 100%
- Interne links: 80%
- KvK/PSD2 stubs: 80%
- Analytics setup: 100% (env nog vullen)
- Branding/site‑naam: 100%

— Laat je gewenste volgorde weten; ik zet de “Next steps” op 100% en deploy gelijk door.


