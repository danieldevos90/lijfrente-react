# Stitch Prompt: Widget Drawer - Stap 3 (Contactgegevens)

## Schermoverzicht
Laatste stap van de drawer. Verzamelt NAW-gegevens, e-mail en telefoonnummer.

## Drawer Container
(Zelfde als vorige stappen - 440px breed)

---

## Drawer Header
- Titel: "Financiering aanvragen"
- Sluit knop (×)

---

## Voortgang Indicator

**Stappen Status** (3 stippen)
- Stip 1: Voltooid (klein, zwart)
- Stip 2: Voltooid (klein, zwart)
- Stip 3: Actief (uitgerekt, zwart)

**Teller**: "3/3"

---

## Drawer Body

**Hoofdtitel**
- Tekst: "Contactgegevens"
- Font grootte: 24px
- Gewicht: 600

**Beschrijving**
- Tekst: "Hoe kunnen we u bereiken?"
- Font grootte: 14px
- Kleur: `#64748B`
- Marge onder: 1.5rem

---

### Formulier Velden

**Velden Container**
- Display: flex column
- Gap: 1.25rem

---

### NAW Gegevens

**Label Sectie**
- Tekst: "NAW-gegevens"
- Font grootte: 16px
- Gewicht: 600
- Kleur: `#0F172A`
- Marge onder: 1rem

---

### Veld 1: Naam

**Label**
- Tekst: "Volledige naam *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Input**
- Placeholder: "Voor- en achternaam"
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px
- Breedte: 100%

---

### Veld 2: Adres

**Label**
- Tekst: "Adres *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Input**
- Placeholder: "Straatnaam + huisnummer"
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px

---

### Veld 3: Postcode + Woonplaats (2 kolommen)

**Container**
- Display: grid
- Grid-template-columns: 1fr 2fr
- Gap: 12px

**Postcode**

Label:
- Tekst: "Postcode *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

Input:
- Placeholder: "1234 AB"
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px

**Woonplaats**

Label:
- Tekst: "Woonplaats *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

Input:
- Placeholder: "Amsterdam"
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px

---

### Scheiding Lijn (optioneel)
- Border-top: 1px solid `#E2E8F0`
- Marge: 1.5rem 0

---

### Veld 4: E-mailadres

**Label**
- Tekst: "E-mailadres *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Input**
- Type: email
- Placeholder: "naam@bedrijf.nl"
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px
- Breedte: 100%

---

### Veld 5: Telefoonnummer

**Label**
- Tekst: "Telefoonnummer *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Input**
- Type: tel
- Placeholder: "06 - 12 34 56 78"
- Inputmode: tel
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px
- Breedte: 100%

---

## Drawer Footer

**Knop Container**
- Display: flex
- Justify-content: space-between
- Gap: 12px

**Terug Knop**
- Tekst: "Terug"
- Achtergrond: Wit
- Kleur: `#0F172A`
- Border: 1px solid `#E2E8F0`
- Padding: 12px 20px
- Border radius: 8px
- Font grootte: 15px
- Gewicht: 500

**Versturen Knop** (Groen - laatste stap!)
- Tekst: "Aanvraag versturen"
- Achtergrond: `#10b981` (Groen, niet zwart)
- Kleur: Wit
- Padding: 12px 28px
- Border radius: 8px
- Font grootte: 15px
- Gewicht: 600
- Border: none

**Hover:**
- Achtergrond: `#059669` (donkerder groen)

**Auto-opslaan Indicator**
- Tekst: "Automatisch opgeslagen"
- Font grootte: 12px
- Kleur: `#64748B`
- Gecentreerd

**Privacy Melding** (onder auto-opslaan)
- Tekst: "Uw gegevens worden veilig verwerkt"
- Font grootte: 11px
- Kleur: `#64748B`
- Gecentreerd
- Icoon: slot 🔒

---

## Notities voor Stitch
- Laatste stap (3/3)
- NAW = Naam, Adres, Woonplaats (Nederlands begrip)
- Postcode en Woonplaats naast elkaar (2 kolommen)
- Versturen knop is GROEN (niet zwart) - geeft aan dat het de laatste stap is
- Privacy melding geeft vertrouwen
- Alle velden required (*)
- E-mail en telefoon onderaan
- Focus states met zwarte border




