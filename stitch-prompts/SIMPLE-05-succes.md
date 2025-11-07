# Stitch Prompt: Succes Bevestiging (Nederlands)

## Schermoverzicht
Bevestigingsscherm na succesvolle aanvraag. Kan getoond worden in drawer of als modal.

## Ontwerpsysteem
(Zelfde minimale kleuren)

---

## Container

**Als Drawer** (voorkeur):
- Zelfde 440px drawer
- Alle andere content vervangen door succes bericht

**Als Modal** (alternatief):
- Gecentreerd overlay
- Max-breedte: 500px
- Border radius: 14px
- Schaduw: `0 25px 50px rgba(0, 0, 0, 0.25)`

---

## Overlay (achtergrond)
- Background: `rgba(0, 0, 0, 0.4)`
- Backdrop filter: blur(4px)

---

## Succes Header

**Container**
- Padding: 2rem 1.5rem 1rem
- Text-align: center

**Succes Icoon**
- Breedte: 80px
- Hoogte: 80px
- Achtergrond: `#10b981` (Groen cirkel)
- Kleur: Wit
- Border-radius: 50%
- Display: flex, center
- Marge: 0 auto 1.5rem
- Icoon: Vinkje (wit, 40px)

---

## Succes Content

**Container**
- Padding: 0 1.5rem 2rem
- Text-align: center

**Hoofdtitel (H2)**
- Tekst: "Aanvraag ontvangen!"
- Font grootte: 28px
- Gewicht: 700
- Kleur: `#0F172A`
- Marge onder: 1rem

**Beschrijving**
- Tekst: "Bedankt voor uw aanvraag. We nemen binnen 24 uur contact met u op met een passend voorstel."
- Font grootte: 16px
- Kleur: `#64748B`
- Line-height: 1.6
- Marge onder: 2rem

---

## Volgende Stappen

**Container**
- Marge: 2rem 0
- Padding: 0 1.5rem
- Text-align: left

**Sectie Titel**
- Tekst: "Wat gebeurt er nu?"
- Font grootte: 18px
- Gewicht: 600
- Kleur: `#0F172A`
- Text-align: center
- Marge onder: 1.5rem

**Stappen Container**
- Display: flex column
- Gap: 12px

---

### Stap Item (3 totaal)

**Container**
- Display: flex
- Align-items: center
- Gap: 1rem
- Padding: 12px
- Achtergrond: `#f8fafc`
- Border-radius: 8px

**Stap Nummer Cirkel**
- Breedte: 28px
- Hoogte: 28px
- Achtergrond: `#000000`
- Kleur: Wit
- Border-radius: 50%
- Display: flex, center
- Font-grootte: 14px
- Gewicht: 600
- Flex-shrink: 0

**Stap Tekst**
- Font-grootte: 14px
- Kleur: `#0F172A`
- Line-height: 1.4

**Stappen:**
1. "We beoordelen uw aanvraag"
2. "U ontvangt een voorstel per e-mail"
3. "Na akkoord regelen we de financiering"

---

## Contact Sectie (optioneel)

**Container**
- Marge: 2rem 0 1rem
- Padding: 0 1.5rem

**Tekst**
- Tekst: "Vragen? Bel ons op"
- Font grootte: 14px
- Kleur: `#64748B`
- Text-align: center
- Marge onder: 8px

**Telefoonnummer**
- Tekst: "020 - 123 4567"
- Font grootte: 18px
- Gewicht: 600
- Kleur: `#000000`
- Text-align: center
- Display: flex
- Align-items: center
- Justify-content: center
- Gap: 8px
- Icoon: telefoon (16px)

---

## Footer

**Container**
- Padding: 1.5rem
- Border-boven: 1px solid `#E2E8F0`

**Sluit Knop**
- Tekst: "Sluiten"
- Achtergrond: `#000000`
- Kleur: Wit
- Padding: 12px 32px
- Border radius: 8px
- Font grootte: 15px
- Gewicht: 600
- Breedte: 100%
- Text-align: center

**Hover:**
- Achtergrond: `#1a1a1a`
- Transform: translateY(-2px)

---

## Notities voor Stitch
- Alles in Nederlands
- Groene vinkje icoon geeft positief gevoel
- 3 duidelijke stappen wat er nu gebeurt
- Telefoonnummer prominent aanwezig
- Sluiten knop (of redirect naar homepage)
- Minimaal, schoon design
- Gecentreerde layout
- Vriendelijke, professionele toon




