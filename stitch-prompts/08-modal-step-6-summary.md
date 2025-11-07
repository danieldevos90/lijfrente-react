# Stitch Prompt: Lead Form Modal - Step 6 (Final Details & Summary)

## Screen Overview
Final step with additional questions and a summary of all previously entered information before submission.

## Design System
(Same as previous modals)

### Colors
- Brand: `#000000`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Light Gray BG: `#f8fafc`
- Success Green: `#10b981`

---

## Modal Structure
(Same container, overlay, and header as previous steps)

---

## Form Progress Header

**Progress Fill**: 100% (6 of 6 steps)

**Step Indicator**: "Stap 6 van 6"

---

## Form Body (Step 6 Content)

**Container Padding**: 3rem 2rem (48px 32px)

**Heading (H2)**
- Text: "Laatste vragen"
- Font size: 28px
- Weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 0.5rem

**Description**
- Text: "Deze informatie helpt ons u nog beter te adviseren"
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

### Field Group 1: Bestaande Financieringen

**Label**
- Text: "Heeft u al bestaande financieringen?"
- Font size: 16px
- Font weight: 600
- Margin bottom: 1rem

**Radio Group**
- Display: flex column
- Gap: 0.5rem

**Radio Options** (3 total)

Default State:
- Display: flex
- Align items: center
- Gap: 0.75rem (12px)
- Padding: 1rem (16px)
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Cursor: pointer

Radio Input:
- Width: 20px
- Height: 20px
- Accent-color: `#000000`

Options:
1. "Nee, geen bestaande financieringen" - SELECTED
2. "Ja, maar beperkt"
3. "Ja, meerdere financieringen"

Selected Option:
- Radio checked
- Label font-weight: 600
- Label color: `#000000`

---

### Field Group 2: Aanvullende Informatie

**Label**
- Text: "Aanvullende informatie (optioneel)"
- Font size: 16px
- Font weight: 600
- Margin bottom: 0.5rem

**Textarea**
- Placeholder: "Vertel ons meer over uw situatie..."
- Rows: 4
- Value: "" (empty, optional field)
- Padding: 1rem
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Font size: 16px
- Width: 100%
- Resize: vertical
- Font-family: Inter (same as inputs)

Focus State:
- Border color: `#000000`
- Outline: none

---

### Summary Section

**Container**
- Margin top: 2rem
- Padding: 1.5rem (24px)
- Background: `#f8fafc` (light gray)
- Border radius: 10px

**Section Heading (H3)**
- Text: "Samenvatting van uw aanvraag"
- Font size: 18px
- Weight: 600
- Margin bottom: 1rem
- Color: `#0F172A`

**Summary Grid**
- Display: grid
- Grid-template-columns: repeat(2, 1fr)
- Gap: 1rem (16px)

**Summary Items** (4 total)

Container:
- Padding: 0.75rem (12px)
- Background: White
- Border radius: 6px
- Font size: 14px

Content Format:
- Strong label (bold)
- Value

Items:
1. **Bedrag:** €50.000
2. **Bedrijf:** Bakkerij Jansen
3. **Doel:** Werkkapitaal
4. **Urgentie:** Binnenkort (1-4 weken)

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
- Font weight: 600
- Display: flex, gap 8px

**Submit Button** (Right) - DIFFERENT STYLE
- Text: "Aanvraag versturen" with checkmark icon (✓)
- Background: `#10b981` (Green, not black)
- Color: White
- Padding: 1.25rem 2.5rem (larger than regular)
- Border radius: 10px
- Font size: 18px (larger)
- Font weight: 600
- Display: flex, align-items center, gap 8px
- Border: none
- Cursor: pointer

Hover State:
- Background: `#059669` (darker green)
- Transform: translateY(-2px)

**Trust Indicators**
- "🔒 100% veilig"
- "⚡ Binnen 24 uur reactie"
- "📞 Gratis adviesgesprek"

---

## Notes for Stitch
- Progress bar at 100% (full width, white)
- Summary section has light gray background to stand out
- Summary grid is 2x2 showing key info from previous steps
- Submit button is GREEN (success color) instead of black
- Submit button is larger/more prominent than regular Next buttons
- Textarea is taller (4 rows) and resizable
- First radio option selected ("Nee, geen bestaande financieringen")
- Summary creates confidence before submission





