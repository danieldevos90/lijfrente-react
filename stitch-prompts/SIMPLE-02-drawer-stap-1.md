# Stitch Prompt: Widget Drawer - Stap 1 (Bedrijfsgegevens)

## Schermoverzicht
Eenvoudige drawer die van rechts inschuift. Eerste stap verzamelt bedrijfsinformatie.

## Ontwerpsysteem

### Kleuren (Minimaal)
- Merkkleur: `#000000`
- Tekst: `#0F172A`
- Grijs: `#64748B`
- Achtergrond: `#FFFFFF`
- Rand: `#E2E8F0`
- Lichtgrijs: `#f8fafc`

---

## Drawer Container

**Positie & Grootte**
- Position: fixed
- Rechts: 0
- Boven: 0
- Onder: 0
- Breedte: 440px (smal, minimaal)
- Hoogte: 100vh
- Achtergrond: Wit
- Schaduw: `-8px 0 40px rgba(0, 0, 0, 0.15)`
- Animatie: inschuiven van rechts (0.3s)

---

## Drawer Header

**Container**
- Padding: 1.5rem (24px)
- Border-onder: 1px solid `#E2E8F0`
- Display: flex
- Justify-content: space-between

**Titel**
- Tekst: "Financiering aanvragen"
- Font grootte: 20px
- Gewicht: 600
- Kleur: `#0F172A`

**Sluit Knop (×)**
- Icoon: X (20px)
- Achtergrond: transparant
- Padding: 8px
- Kleur: `#64748B`
- Border radius: 6px
- Hover: achtergrond `#f8fafc`

---

## Voortgang Indicator (Minimaal)

**Container**
- Padding: 1rem 1.5rem
- Border-onder: 1px solid `#E2E8F0`

**Stappen Dots** (3 stippen totaal)
- Display: flex
- Gap: 8px
- Justify-content: center

**Stip**
- Breedte: 8px
- Hoogte: 8px
- Border radius: 50%
- Achtergrond: `#E2E8F0` (inactief)

**Actieve Stip** (Stap 1)
- Achtergrond: `#000000`
- Breedte: 24px (uitgerekt)
- Border radius: 4px

**Teller**
- Tekst: "1/3"
- Font grootte: 13px
- Kleur: `#64748B`
- Margin-left: auto

---

## Drawer Body (Scrollbaar)

**Padding**: 2rem 1.5rem

**Hoofdtitel**
- Tekst: "Bedrijfsgegevens"
- Font grootte: 24px
- Gewicht: 600
- Marge onder: 0.75rem

**Beschrijving**
- Tekst: "Vul uw bedrijfsinformatie in"
- Font grootte: 14px
- Kleur: `#64748B`
- Marge onder: 1.5rem

---

### Formulier Velden

**Velden Container**
- Display: flex column
- Gap: 1.25rem

---

### Veld 1: Bedrijfsnaam

**Label**
- Tekst: "Bedrijfsnaam *"
- Font grootte: 14px
- Gewicht: 600
- Kleur: `#0F172A`
- Marge onder: 6px

**Input**
- Placeholder: "Bijv. Bakkerij Jansen B.V."
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px
- Breedte: 100%

**Focus State:**
- Border kleur: `#000000`
- Outline: none

---

### Veld 2: KvK-nummer

**Label**
- Tekst: "KvK-nummer *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Input**
- Placeholder: "12345678"
- Type: text
- Inputmode: numeric
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px

---

### Veld 3: Bedrijfsactiviteiten

**Label**
- Tekst: "Bedrijfsactiviteiten *"
- Font grootte: 14px
- Gewicht: 600
- Marge onder: 6px

**Textarea**
- Placeholder: "Beschrijf kort uw bedrijfsactiviteiten..."
- Rows: 3
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border radius: 8px
- Font grootte: 15px
- Resize: vertical
- Font-family: Inter

---

## Drawer Footer

**Container**
- Padding: 1.5rem
- Border-boven: 1px solid `#E2E8F0`
- Achtergrond: Wit
- Schaduw: `0 -4px 12px rgba(0, 0, 0, 0.05)`

**Knop Container**
- Display: flex
- Justify-content: flex-end

**Volgende Knop**
- Tekst: "Volgende"
- Achtergrond: `#000000`
- Kleur: Wit
- Padding: 12px 28px
- Border radius: 8px
- Font grootte: 15px
- Gewicht: 600
- Border: none
- Cursor: pointer

**Hover:**
- Achtergrond: `#1a1a1a`

**Auto-opslaan Indicator**
- Tekst: "Automatisch opgeslagen"
- Font grootte: 12px
- Kleur: `#64748B`
- Marge boven: 8px
- Text-align: right
- Display: flex
- Align-items: center
- Justify-content: flex-end
- Gap: 6px
- Icoon: klein vinkje

---

## Notities voor Stitch
- Alles in Nederlands
- Geen Engelse woorden
- 3 velden in stap 1: Bedrijfsnaam, KvK-nummer, Bedrijfsactiviteiten
- Single column layout
- Minimaal design
- Dunne borders (1px)
- Auto-opslaan bericht geeft vertrouwen
- Drawer 440px breed (compacter dan eerder)

