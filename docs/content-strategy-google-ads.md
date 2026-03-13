# Content & Google Ads Strategie — geldgeregeld.nl

> **Focus:** Zakelijke leningen (niet lijfrente). 8 financieringsvormen × 18 sectoren = 144+ programmatische pagina's.

---

## 1. Content-inventaris

### 1.1 Financieringsvormen (Use Cases / Leningen)

| Slug | Label | Default bedrag | Lead purpose |
|------|-------|----------------|--------------|
| `werkkapitaal` | Werkkapitaal | €50.000 | werkkapitaal |
| `voorraad` | Voorraad financieren | €75.000 | voorraad |
| `machines` | Voertuigen & machines | €120.000 | machines |
| `inventaris` | Inventaris & software | €60.000 | inventaris |
| `uitbreiding` | Uitbreiding & groei | €100.000 | uitbreiding |
| `overname` | Overnamefinanciering | €200.000 | overname |
| `herfinanciering` | Herfinanciering | €100.000 | herfinanciering |
| `factoring` | Factoring | €50.000 | factoring |

### 1.2 Sectoren / Markten

| Slug | Naam | Kernkeywords |
|------|------|--------------|
| `horeca` | Horeca | horeca financiering, restaurant lening, cafe financiering |
| `retail` | Retail | retail financiering, winkel financiering, webshop lening |
| `transport` | Transport & Logistiek | transport financiering, vrachtwagen financiering |
| `bouw` | Bouw & Installatie | bouw financiering, bouwbedrijf financiering |
| `ecommerce` | E-commerce | e-commerce financiering, webshop lening |
| `zorg` | Zorg & Welzijn | zorg financiering, welzijn lening |
| `consultants` | Advies & Consultancy | consultancy financiering, adviesbureau lening |
| `schoonmaak` | Schoonmaak | schoonmaak financiering, schoonmaakbedrijf lening |
| `automotive` | Automotive | automotive financiering, garage lening |
| `productie` | Productie & Industrie | productie financiering, industrie lening |
| `zzp` | ZZP | zzp lening, zzp financiering |
| `starters` | Starters & Startups | starterslening, startup financiering |
| `franchise` | Franchise | franchise lening, franchise financiering |
| `medisch` | Medische Praktijken | medische praktijk lening, arts financiering |
| `tandarts` | Tandartspraktijken | tandartspraktijk lening, tandarts financiering |
| `groothandel` | Groothandel | groothandel financiering |
| `schoonheid` | Schoonheidsindustrie | kapper lening, schoonheidssalon financiering |
| `kasstroom` | Kasstroom & Werkkapitaal | kasstroom lening, werkkapitaal financiering |

### 1.3 URL-structuur

| Type | URL-patroon | Voorbeeld |
|------|-------------|-----------|
| Sector hub | `/sectoren/[sector]` | /sectoren/horeca |
| Sector × use case | `/sectoren/[sector]/[useCase]` | /sectoren/horeca/werkkapitaal |
| Use case hub | `/financiering/[useCase]` | /financiering/werkkapitaal |
| Financiering overzicht | `/financiering` | /financiering |
| Sectoren overzicht | `/sectoren` | /sectoren |

**Totaal:** 18 sectoren × 8 use cases = **144 sector-use-case pagina's** + 8 use-case hubs + sector hubs.

---

## 2. Google Ads Keyword-strategie

### 2.1 Niet targeten

- ❌ **lijfrente** — geen kerncontent; lijfrente zit alleen onder `/sites/[siteId]/lijfrente`
- ❌ Algemene consumentenleningen (BKR, persoonlijke lening)

### 2.2 Wel targeten: zakelijke financiering

**Tier 1 — Hoog intent (product + sector):**
```
[sector] [use case]
horeca werkkapitaal
retail voorraad financiering
zzp lening
bouw financiering
transport lening
startup financiering
factoring horeca
```

**Tier 2 — Use case (product):**
```
werkkapitaal
voorraad financieren
machines financieren
overnamefinanciering
herfinanciering
factoring
```

**Tier 3 — Sector (markt):**
```
horeca financiering
retail lening
zzp financiering
bouwbedrijf lening
transport financiering
webshop lening
```

### 2.3 Aanbevolen keyword-set (Google Ads)

Gebruik de Google Ads Keyword Ideas API met deze seed keywords:

```bash
# Sector × use case combinaties (hoogste intent)
node scripts/google-ads-keyword-ideas.js --keywords "horeca werkkapitaal,retail financiering,zzp lening,bouw financiering,transport lening,webshop lening,factoring,overnamefinanciering" --limit 100

# Per sector
node scripts/google-ads-keyword-ideas.js --keywords "horeca financiering,retail lening,zzp financiering,bouw financiering,transport financiering,ecommerce financiering,zorg financiering,consultancy financiering" --limit 100

# Use cases
node scripts/google-ads-keyword-ideas.js --keywords "werkkapitaal,voorraad financieren,machines financieren,inventaris financieren,uitbreiding financieren,overnamefinanciering,herfinanciering,factoring" --limit 100
```

### 2.4 Campagnestructuur (aanbeveling)

| Campagne | Ad groups | Keywords |
|----------|-----------|----------|
| **Sector × Use Case** | Per sector (18) | [sector] + [use case] combinaties |
| **Use Case** | Per product (8) | werkkapitaal, factoring, overname, etc. |
| **Sector** | Per sector (18) | [sector] financiering/lening |
| **Brand** | geldgeregeld | merktermen |

---

## 3. Content- en SEO-strategie

### 3.1 Sterke punten (behouden)

- Programmatische SEO: 144 sector × use case pagina's
- Duidelijke URL-structuur
- Sector-specifieke keywords in `SECTOR_INFO`
- Use-case-specifieke FAQs en direct answers
- Comparison cards (internal linking)

### 3.2 Aandachtspunten

1. **Sitemap vs Strapi**
   - Sitemap haalt sectoren alleen uit Strapi `sector-pages`
   - `SECTOR_INFO` heeft 18 sectoren; Strapi kan minder hebben
   - **Actie:** Zorg dat alle 18 sectoren in Strapi bestaan, of gebruik `SECTOR_SLUGS` als fallback in sitemap

2. **Sector kasstroom**
   - In `SECTOR_INFO` maar mogelijk niet in Strapi → `/sectoren/kasstroom` kan 404 geven
   - **Actie:** Sector-pagina in Strapi aanmaken of sitemap uitbreiden

3. **Landingspagina’s**
   - Elke Google Ads ad group moet naar de meest relevante URL
   - Sector × use case: `/sectoren/[sector]/[useCase]`
   - Use case only: `/financiering/[useCase]`
   - Sector only: `/sectoren/[sector]`

### 3.3 Content-verbeteringen

| Pagina-type | Verbetering |
|-------------|-------------|
| Sector × use case | Meer sector-specifieke voorbeelden in direct answer |
| Use case hub | Vergelijkingsblokken (werkkapitaal vs factoring) |
| Sector hub | Sterkere CTA naar relevante use cases |
| Homepage | Duidelijke sectoren-grid met links naar top-sectoren |

---

## 4. Implementatiechecklist

### Google Ads

- [ ] Campagnes aanmaken volgens bovenstaande structuur
- [ ] Keywords ophalen via `google-ads-keyword-ideas.js` (zie sectie 2.3)
- [ ] Landingspagina’s koppelen: sector × use case, use case, sector
- [ ] Conversion tracking (lead form, bedankt-pagina)
- [ ] Negatieve keywords: lijfrente, pensioen, particulier, bkr

### Strapi / Content

- [ ] Controleren of alle 18 sectoren in Strapi `sector-pages` bestaan
- [ ] Sector `kasstroom` toevoegen indien ontbreekt
- [ ] Meta titles/descriptions afstemmen op keyword-strategie

### Technisch

- [ ] Sitemap: alle sector × use case URLs opnemen (ook als Strapi minder sectoren heeft)
- [ ] Structured data (FAQ, Service) op sector × use case pagina's

---

## 5. Keyword-export voor Google Ads

Voor bulk-import in Google Ads: run het keyword-ideas script en exporteer naar CSV:

```bash
cd frontend
node scripts/google-ads-keyword-ideas.js \
  --keywords "horeca werkkapitaal,retail financiering,zzp lening,bouw financiering,transport lening,webshop lening,factoring,overnamefinanciering,werkkapitaal,voorraad financieren" \
  --limit 200 \
  --out exports/google-ads-keywords.csv
```

Pas daarna filtering toe op `avgMonthlySearches` en `competition` voor de definitieve keyword-lijst.

---

## 6. Keyword-data (API-test 12 mrt 2025)

| Keyword | Zoekvolume | Competition | Opmerking |
|---------|------------|-------------|-----------|
| factoring | 390/maand | LOW | Sterke kandidaat |
| zakelijk geld lenen | 10/maand | HIGH | Hoge intent |
| zakelijke lening | 10/maand | — | Core term |
| bedrijfslening | 10/maand | — | Core term |
| werkkapitaal | 10/maand | — | Product term |
| zzp lening aanvragen | 10/maand | — | Sector + actie |
| zakelijke lening zonder jaarcijfers | 10/maand | — | Differentiator |
| factoring zzp | 10/maand | — | Sector × product |

**Conclusie:** Veel zakelijke-financiering-termen hebben laag volume in Google's data (10 of 0). "Factoring" is de uitschieter (390). Focus op combinaties sector + product en long-tail (bijv. "zakelijke lening zonder jaarcijfers") voor betere match met jullie USP.
