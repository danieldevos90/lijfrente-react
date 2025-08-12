### UX-plan (NL)

- **Doel**: Content- en productflows die zoekintentie direct bedienen en conversie naar lead aanvragen maximaliseren.
- **Primaire secties (hubs)**: Btw, Calculators, Factoring, Liquiditeit, Other, Rente, Werkkapitaal

### Doelgroepen en taken
- **MKB-ondernemer**: wil snel antwoord (btw, rente), tools (calculators), en een financieringsoplossing.
- **Financieel verantwoordelijke**: zoekt beleidsinfo, voorwaarden, en vergelijkingen.
- **Oriënterende bezoeker**: wil basisuitleg en vervolgstappen.

### Navigatie & IA
- **Hoofdnavigatie**: BTW, Rente, Calculators, Werkkapitaal, Factoring, Liquiditeit, Blog.
- **Secundaire navigatie**: Over ons, Contact, Tarieven, Veelgestelde vragen.
- **Zoekfunctie**: prominente globale zoekbalk (autocomplete op topics/tools).

### Pagina-templates
- **Hub-pagina**: hero + categorie-navigatie, highlights, CTA naar product.
- **Artikel/Guides**: titel, introductie, inhoudsopgave, H2-secties, FAQ, gerelateerde links, duidelijke volgende stap (CTA).
- **Calculator**: invoervelden, resultatenkaart, toelichting, CTA naar product/advies.
- **Productpagina (zakelijke lening / kredietlijn)**: bewijs (reviews/keurmerken), USP’s, tarieven, voorwaarden, stappenplan, FAQ, krachtige CTA.

### Componenten
- Header, Breadcrumbs, TOC, On-page nav, Related content, Sticky CTA, Footer.
- Kaartenrijen voor hubs en topics; callouts voor belangrijke definities en wettelijke waarschuwingen.

### SEO & Interne linking
- Interne linking hub → subtopics; artikels onderling via ‘gerelateerd’ op basis van hub.
- Structured data: `Article`, `FAQPage`, `BreadcrumbList`, `Product`.
- URL’s: `/hub/slug`; duidelijke H1/H2, snippet-optimale meta’s.

### Toegankelijkheid & Performance
- WCAG 2.1 AA, toetsenbordnavigatie, voldoende contrast, focus states.
- Core Web Vitals: lazy-load media, CSS-only voor iconen waar mogelijk, server-side rendering.

### Design system & techniek
- Next.js + Tailwind CSS (PostCSS met `@tailwindcss/postcss`), component-gebaseerd design system.
- UI tokens voor spacing, kleuren, typografie; semantische varianten voor CTA’s.

### Content governance
- Definition of Done: bijgewerkte datum, interne links, FAQ, CTA, check op SERP intent.
- Redactionele workflow met SEO check en juridische review voor btw/rente.

### KPI’s
- CTR vanuit organisch, scroll depth, CTA clicks, leads, converterende hubs.

