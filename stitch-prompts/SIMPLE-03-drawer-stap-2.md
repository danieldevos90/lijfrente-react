# Stitch Prompt: Widget Drawer - Stap 2 (Financiering)

## Schermoverzicht
Stap 2 van de drawer. Verzamelt gewenst bedrag en bestedingsdoel.

## Drawer Container
(Zelfde als Stap 1 - 440px breed, rechts uitgelijnd)

---

## Drawer Header
- Titel: "Financiering aanvragen"
- Sluit knop (×)

---

## Voortgang Indicator

**Stappen Status** (3 stippen)
- Stip 1: Voltooid (klein, zwart)
- Stip 2: Actief (uitgerekt, zwart)
- Stip 3: Inactief (klein, grijs)

**Teller**: "2/3"

---

## Drawer Body

**Hoofdtitel**
- Tekst: "Financiering"
- Font grootte: 24px
- Gewicht: 600

**Beschrijving**
- Tekst: "Welk bedrag heeft u nodig en waarvoor?"
- Font grootte: 14px
- Kleur: `#64748B`
- Marge onder: 1.5rem

---

### Formulier Velden

---

### Veld 1: Gewenst Bedrag

**Label**
- Tekst: "Gewenst bedrag *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Input**
- Placeholder: "€ 50.000"
- Type: text
- Inputmode: decimal
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px

**Helper Tekst** (onder input)
- Tekst: "Tussen € 10.000 en € 500.000"
- Font grootte: 12px
- Kleur: `#64748B`
- Marge boven: 4px

---

### Veld 2: Bestedingsdoel

**Label**
- Tekst: "Bestedingsdoel *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Select Dropdown**
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px
- Breedte: 100%
- Achtergrond: Wit
- Cursor: pointer

**Opties:**
- "Selecteer een optie" (placeholder, grijs)
- "Werkkapitaal"
- "Voorraad inkopen"
- "Machines en apparatuur"
- "Personeel en groei"
- "Bedrijfspand"
- "Voertuigen"
- "Marketing en ICT"
- "Herfinanciering"
- "Overig"

**Geselecteerde waarde tonen**: "Werkkapitaal"

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

**Hover:**
- Border: `#000000`

**Volgende Knop**
- Tekst: "Volgende"
- Achtergrond: `#000000`
- Kleur: Wit
- Padding: 12px 28px
- Border radius: 8px
- Font grootte: 15px
- Gewicht: 600

**Auto-opslaan Indicator**
- Tekst: "Automatisch opgeslagen"
- Font grootte: 12px
- Kleur: `#64748B`
- Gecentreerd onder knoppen

---

## Notities voor Stitch
- Alles Nederlands
- 2 velden: Gewenst bedrag en Bestedingsdoel
- Dropdown met Nederlandse opties
- Helper tekst bij bedrag veld
- Terug knop nu zichtbaar
- Voortgang indicator toont 2/3

