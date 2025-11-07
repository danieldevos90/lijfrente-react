# Stitch Prompt: Lead Form Modal - Step 4 (Business Details)

## Screen Overview
Step 4 collecting business information with text inputs and dropdown select for company details.

## Design System
(Same as previous modals)

### Colors
- Brand: `#000000`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Light Gray BG: `#f8fafc`
- Error Red: `#ef4444`

---

## Modal Structure
(Same container, overlay, and header as previous steps)

---

## Form Progress Header

**Progress Fill**: 66.67% (4 of 6 steps)

**Step Indicator**: "Stap 4 van 6"

---

## Form Body (Step 4 Content)

**Container Padding**: 3rem 2rem (48px 32px)

**Heading (H2)**
- Text: "Vertel ons over uw bedrijf"
- Font size: 28px
- Weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 0.5rem

**Description**
- Text: "Deze gegevens helpen ons uw aanvraag sneller te verwerken"
- Font size: 16px
- Color: `#64748B`
- Text-align: center
- Margin bottom: 2rem

---

### Form Fields Container

**Layout**
- Display: flex column
- Gap: 1.5rem (24px)

---

### Field Group 1: Bedrijfsnaam

**Label**
- Text: "Bedrijfsnaam *"
- Font size: 16px
- Font weight: 600
- Color: `#0F172A`
- Margin bottom: 0.5rem
- Display: block

**Input Field**
- Type: text
- Placeholder: "Uw bedrijfsnaam"
- Value: "Bakkerij Jansen" (show as filled)
- Padding: 1rem (16px)
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Width: 100%
- Transition: border-color 0.2s ease

Focus State:
- Border color: `#000000`
- Outline: none

---

### Field Group 2: KvK nummer

**Label**
- Text: "KvK nummer *"
- Font size: 16px
- Font weight: 600
- Color: `#0F172A`
- Margin bottom: 0.5rem

**Input Field**
- Type: text
- Placeholder: "12345678"
- Value: "12345678" (show as filled)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Width: 100%

Focus State:
- Border color: `#000000`
- Outline: none

---

### Field Group 3: Jaaromzet

**Label**
- Text: "Jaaromzet (ongeveer)"
- Font size: 16px
- Font weight: 600
- Color: `#0F172A`
- Margin bottom: 0.5rem

**Select Dropdown**
- Selected value: "€ 100.000 - € 250.000" (show as selected)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Width: 100%
- Background: White
- Cursor: pointer

Dropdown Options (visible in select):
- "Selecteer omzet" (default, grayed out)
- "€ 0 - € 50.000"
- "€ 50.000 - € 100.000"
- "€ 100.000 - € 250.000" ← SELECTED
- "€ 250.000 - € 500.000"
- "€ 500.000 - € 1.000.000"
- "€ 1.000.000+"

Focus State:
- Border color: `#000000`
- Outline: none

---

## Form Footer

**Navigation Buttons**
- Display: flex
- Justify-content: space-between

**Back Button** (Left)
- Text: "← Vorige"
- Background: White
- Color: `#0F172A`
- Border: 2px solid `#E2E8F0`
- Padding: 1rem 2rem
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Display: flex, align-items center, gap 8px

**Next Button** (Right)
- Text: "Volgende →"
- Background: `#000000`
- Color: White
- Padding: 1rem 2rem
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Display: flex, align-items center, gap 8px

**Trust Indicators** (same as previous steps)
- "🔒 100% veilig"
- "⚡ Binnen 24 uur reactie"
- "📞 Gratis adviesgesprek"

---

## Notes for Stitch
- Show all three fields as filled with example data
- Input fields have clean, minimal design
- Select dropdown shows the currently selected value
- All fields are full-width
- Consistent spacing (1.5rem gap) between field groups
- * asterisk indicates required fields
- Focus states should be clearly visible with brand color border





