# Strapi Content Setup Guide

## ✅ Code Changes Complete

All code changes have been deployed:
- ✅ Schema updated with `quote` and `quoteAuthor` fields
- ✅ Use-case component updated with `image`, `buttonLabel`, `buttonHref`
- ✅ Frontend updated to prioritize Strapi data
- ✅ Deployed to Vercel production

## 📝 Manual Content Creation in Strapi

Since the API script is encountering 405 errors (likely due to Strapi Cloud deployment timing), you can create the content manually:

### Steps:

1. **Go to Strapi Admin**: https://bright-smile-1f47bc9d67.strapiapp.com/admin

2. **Navigate to Content Manager** → **Sector Page**

3. **Create New Entry** with the following data:

#### Basic Info:
- **Site ID**: `geldgeregeld`
- **Sector Slug**: `horeca`
- **Sector Name**: `Horeca`

#### SEO:
- **Meta Description**: `Zakelijke financiering speciaal voor restaurants, cafés en hotels. Snel, flexibel en zonder gedoe. Binnen 24 uur inzicht.`
- **Meta Keywords**: `horeca financiering, restaurant lening, café financiering, hotel financiering, horeca bedrijfslening`

#### Hero Section:
- **Hero Title**: `Zakelijke financiering voor de horeca`
- **Hero Subtitle**: `Financiering op maat voor restaurants, cafés en hotels. Snel geregeld, zonder gedoe.`

#### Quote Section:
- **Quote**: `Financiering die meegroeit met je horecazaak. Of je nu investeert in nieuwe keukenapparatuur, verbouwingen plant, of seizoensgebonden uitgaven moet overbruggen – wij begrijpen de unieke behoeften van de horecasector en bieden flexibele oplossingen die passen bij jouw bedrijf.`
- **Quote Author**: (leave empty)

#### Use Cases Section:
- **Use Cases Title**: `Waarvoor kun je de financiering gebruiken?`
- **Use Cases Subtitle**: `Veelzijdige financieringsoplossingen speciaal voor de horeca`

**Add 4 Use Cases:**

1. **Keukenapparatuur**
   - Description: `Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.`
   - Color: `#fff2b2`
   - Text Color: `#1e2021`
   - Button Label: `Vraag offerte aan`
   - Button Href: `/lead`

2. **Renovatie & Verbouwing**
   - Description: `Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.`
   - Color: `#e4f2ff`
   - Text Color: `#0f1720`
   - Button Label: `Meer informatie`
   - Button Href: `/lead`

3. **Terras & Uitbreiding**
   - Description: `Breid je terras uit of investeer in nieuwe buitenmeubels. Maak optimaal gebruik van het seizoen met flexibele financiering.`
   - Color: `#fff2b2`
   - Text Color: `#1e2021`
   - Button Label: `Vraag offerte aan`
   - Button Href: `/lead`

4. **Werkkapitaal**
   - Description: `Financier je dagelijkse operaties, voorraad of seizoensgebonden pieken in je omzet. Flexibel en snel geregeld.`
   - Color: `#e4f2ff`
   - Text Color: `#0f1720`
   - Button Label: `Meer informatie`
   - Button Href: `/lead`

#### Benefits Section:
- **Benefits Title**: `Waarom kiezen voor onze financiering?`
- **Benefits Subtitle**: `Voordelen speciaal voor horeca-ondernemers`

**Add 4 Benefits:**

1. **Snel geregeld**
   - Description: `Binnen 24 uur inzicht in je financieringsmogelijkheden. Geen weken wachten zoals bij traditionele banken.`
   - Icon Path: `/icons/SVG/interface/zap.svg`
   - Color: `#fff2b2`
   - Text Color: `#1e2021`

2. **Flexibel aflossen**
   - Description: `Pas je aflossingen aan op basis van je seizoensgebonden omzet. Meer aflossen in goede maanden, minder in rustige periodes.`
   - Icon Path: `/icons/SVG/interface/clock.svg`
   - Color: `#e4f2ff`
   - Text Color: `#0f1720`

3. **Geen verborgen kosten**
   - Description: `Transparante voorwaarden en kosten. Geen verrassingen achteraf. Boetevrij vervroegd aflossen mogelijk.`
   - Icon Path: `/icons/SVG/interface/shield.svg`
   - Color: `#fff2b2`
   - Text Color: `#1e2021`

4. **Horeca-specialisten**
   - Description: `We begrijpen de uitdagingen van de horeca. Ons team heeft ervaring met restaurants, cafés en hotels.`
   - Icon Path: `/icons/SVG/interface/heart.svg`
   - Color: `#e4f2ff`
   - Text Color: `#0f1720`

#### CTA Section:
- **CTA Title**: `Klaar om te beginnen?`
- **CTA Subtitle**: `Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.`
- **CTA Label**: `Vraag financiering aan`
- **CTA Href**: `/lead`

4. **Save and Publish** the entry

## ✅ Verification

After creating the content, verify it's working:

1. Visit: `https://geldgeregeld2-ef2ryjv58-danieldevos90s-projects.vercel.app/sectoren/horeca`
2. Check that:
   - Quote section displays the quote text
   - Use cases show with buttons
   - Benefits section displays correctly
   - All content comes from Strapi (not fallback)

## 🔄 Alternative: Use API Script Later

Once Strapi Cloud has fully registered the content type (may take 10-15 minutes after schema deployment), you can run:

```bash
python3 scripts/create_sector_page.py
```

This will automatically create/update the horeca sector page with all the content above.

