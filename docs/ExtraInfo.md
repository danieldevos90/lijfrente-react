Direct geregeld
Binnen 24 uur inzicht
Supersnelle aanvraag
Geen papieren gedoe
Snel, simpel en online
Zonder gedoe of wachttijd
In enkele klikken aangevraagd
Financiering zonder papierwerk
✅ Over betrouwbaarheid & zekerheid:
100% transparant
Heldere voorwaarden, geen verrassingen
Gecertificeerd en betrouwbaar
Zakelijk financieren zoals het hoort
Zekerheid zonder zorgen
✅ Over flexibiliteit:
Op maat voor jouw onderneming
Altijd boetevrij aflossen
Jij bepaalt de looptijd
Financiering die met je meebeweegt
✅ Combinaties in pakkende zinnen:
“Zakelijke financiering zonder gedoe — snel geregeld, helder en flexibel.”
“Geen stapels papierwerk. Gewoon doen wat werkt.”
“Van aanvraag tot uitbetaling in 24 uur.”
“Focus op je bedrijf. Wij regelen de financiering.”
“Slim financieren, zonder rompslomp.”

## Scraping & content discovery
- Tools: Firecrawl (URL discovery) → Trafilatura (volledige contentextractie)
- Bronnen: floryn.com, qeld.nl, capitalbox.nl, swishfund.nl, new10.com
- Opslag:
  - `_scraped_sites/*.urls.txt` en `*.urls.clean.txt`
  - `_scraped_sites/trafilatura/<domein>/*.md`
- Let op: URL‑lijsten schoonmaken (geen lege regels, alleen http/https) vóór Trafilatura.

## SEO en SERP‑analyse
- Focusclusters: zakelijke financiering, corporate financing, small business financing, werkkapitaal, veelgestelde vragen
- Metrics: Google Trends (5y volume‑index) + SERP‑competitie (Bright Data) → `serp/keyword_metrics_trends_serp_5y.csv`
- Content queue: prioriteiten in `serp/content_queue.csv` (per hub en pagina)
- Titel/meta sjablonen (met jouw messaging):
  - Title: “Zakelijke financiering zonder gedoe — snel geregeld | [Merk]”
  - Meta: “Binnen 24 uur inzicht. Helder, flexibel en zonder papierwerk.”

## Copy‑inzet (hero/CTA/snippets)
- Hero H1: “Zakelijke financiering zonder gedoe — snel geregeld, helder en flexibel.”
- Sub: “Van aanvraag tot uitbetaling in 24 uur.”
- USP’s (korte bullets):
  - Direct geregeld • Binnen 24 uur inzicht • Supersnelle aanvraag
  - Geen papieren gedoe • Snel, simpel en online
  - In enkele klikken aangevraagd • Financiering zonder papierwerk
- Trust: 100% transparant • Heldere voorwaarden • Gecertificeerd en betrouwbaar
- Flex: Op maat • Boetevrij aflossen • Jij bepaalt looptijd • Beweegt mee
- Snippet‑varianten: “Geen stapels papierwerk. Gewoon doen wat werkt.”

## Tracking & meting
- dataLayer events: `hero_cta_click`, `lead_step_view`, `kvk_search`, `psd2_start`, `lead_submit_success|error`
- A/B: variant via `?ab=A|B` + eventlabels in CTA’s en funnelstappen

## Interne linking (SEO + conversie)
- Hub‑navigatie en “Verder lezen” sturen verkeer naar: ‘zakelijke‑financiering’, ‘corporate‑financing’, ‘small‑business‑financing’, ‘werkkapitaal’, ‘veelgestelde‑vragen’
- Gebruik anchor‑teksten gebaseerd op bovenstaande USP’s/benefits
