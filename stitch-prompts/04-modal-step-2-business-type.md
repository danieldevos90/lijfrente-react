# Stitch Prompt: Lead Form Modal - Step 2 (Business Type)

## Screen Overview
Step 2 of the lead form asking about business type and size with icon-based selection and radio buttons.

## Design System
(Same as previous modals)

### Colors
- Brand: `#000000`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Light Gray BG: `#f8fafc`

---

## Modal Structure
(Same container, overlay, and header as Step 1 - see 03-modal-step-1-amount.md)

---

## Form Progress Header

**Progress Fill**: 33.33% (2 of 6 steps)

**Step Indicator**: "Stap 2 van 6"

---

## Form Body (Step 2 Content)

**Container Padding**: 3rem 2rem (48px 32px)

**Heading (H2)**
- Text: "Wat voor type bedrijf heeft u?"
- Font size: 28px
- Weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 0.5rem

**Description**
- Text: "Dit helpt ons de beste financieringsoptie voor u te vinden"
- Font size: 16px
- Color: `#64748B`
- Text-align: center
- Margin bottom: 2rem

---

### Business Type Grid

**Layout**
- Display: grid
- Grid: 2x2 (4 options)
- Gap: 1rem (16px)
- Margin bottom: 2rem

**Business Type Option Buttons** (4 total)

Default State:
- Display: flex column
- Align items: center
- Gap: 1rem (16px)
- Padding: 2rem 1rem (32px 16px)
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Background: White
- Cursor: pointer
- Transition: all 0.2s ease

Hover State:
- Border color: `#000000`
- Transform: translateY(-2px)

Selected State:
- Border color: `#000000`
- Background: `#000000`
- Color: White

**Option 1: Eenmanszaak**
- Icon: User icon (32px)
- Label: "Eenmanszaak"

**Option 2: BV / NV**
- Icon: Building icon (32px)
- Label: "BV / NV"
- State: SELECTED (show in selected state)

**Option 3: VOF / Maatschap**
- Icon: User icon (32px)
- Label: "VOF / Maatschap"

**Option 4: Stichting / Vereniging**
- Icon: Building icon (32px)
- Label: "Stichting / Vereniging"

---

### Business Size Section

**Section Heading (H3)**
- Text: "Bedrijfsgrootte"
- Font size: 18px
- Weight: 600
- Margin bottom: 1rem
- Color: `#0F172A`

**Radio Options Container**
- Display: flex column
- Gap: 0.5rem (8px)

**Radio Option** (4 options)

Default State:
- Display: flex
- Align items: center
- Gap: 0.75rem (12px)
- Padding: 1rem (16px)
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Cursor: pointer
- Transition: all 0.2s ease

Hover State:
- Border color: `#000000`

**Radio Input**
- Width: 20px
- Height: 20px
- Accent-color: `#000000`

**Radio Labels:**
1. "Starter (0-2 jaar)"
2. "Klein bedrijf (2-10 werknemers)" - SELECTED
3. "Middelbedrijf (10-50 werknemers)"
4. "Groot bedrijf (50+ werknemers)"

Selected Option:
- Radio checked
- Label font-weight: 600
- Label color: `#000000`

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
- Hover: border-color `#000000`, color `#000000`

**Next Button** (Right)
- Text: "Volgende →"
- Background: `#000000`
- Color: White
- Padding: 1rem 2rem
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Display: flex, align-items center, gap 8px
- Hover: background `#1a1a1a`, translateY(-2px)

**Trust Indicators** (same as Step 1)
- "🔒 100% veilig"
- "⚡ Binnen 24 uur reactie"
- "📞 Gratis adviesgesprek"

## Notes for Stitch
- Show "BV / NV" and "Klein bedrijf (2-10 werknemers)" in selected states
- Icons should be simple line icons (lucide-react style)
- Radio buttons have custom accent color matching brand
- Both Back and Next buttons should be visible
- Ensure proper spacing between business type grid and size section


