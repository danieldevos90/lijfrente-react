# Stitch Prompt: Lead Form Modal - Step 3 (Purpose & Urgency)

## Screen Overview
Step 3 asking about the purpose of financing and urgency/timeline with descriptive cards and radio options.

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
(Same container, overlay, and header as previous steps)

---

## Form Progress Header

**Progress Fill**: 50% (3 of 6 steps)

**Step Indicator**: "Stap 3 van 6"

---

## Form Body (Step 3 Content)

**Container Padding**: 3rem 2rem (48px 32px)

**Heading (H2)**
- Text: "Waarvoor gaat u de financiering gebruiken?"
- Font size: 28px
- Weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 0.5rem

**Description**
- Text: "Selecteer het hoofddoel van uw financiering"
- Font size: 16px
- Color: `#64748B`
- Text-align: center
- Margin bottom: 2rem

---

### Purpose Grid

**Layout**
- Display: grid
- Grid: 2 columns (repeat(2, 1fr))
- Gap: 1rem (16px)
- Margin bottom: 2rem

**Purpose Option Cards** (6 total)

Default State:
- Padding: 1.5rem (24px)
- Border: 2px solid `#E2E8F0`
- Border radius: 10px
- Background: White
- Text-align: left
- Cursor: pointer
- Transition: all 0.2s ease

Hover State:
- Border color: `#000000`
- Transform: translateY(-2px)

Selected State:
- Border color: `#000000`
- Background: `#000000`
- Color: White

**Purpose Label**
- Font size: 16px
- Font weight: 600
- Margin bottom: 0.5rem

**Purpose Description**
- Font size: 14px
- Opacity: 0.8

**Options:**

1. **Werkkapitaal** - SELECTED
   - Description: "Voor dagelijkse bedrijfsvoering"

2. **Uitbreiding**
   - Description: "Groei en nieuwe investeringen"

3. **Inventaris**
   - Description: "Machines en apparatuur"

4. **Vastgoed**
   - Description: "Pand aankoop of verbouwing"

5. **Voorraad**
   - Description: "Inkoop van goederen"

6. **Overbrugging**
   - Description: "Tijdelijke cashflow"

---

### Urgency Section

**Margin Top**: 2rem

**Section Heading (H3)**
- Text: "Wanneer heeft u het geld nodig?"
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
1. "Direct (binnen 1 week)"
2. "Binnenkort (1-4 weken)" - SELECTED
3. "Binnen een maand"
4. "Dit kwartaal"

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
- Font weight: 600
- Display: flex, gap 8px

**Next Button** (Right)
- Text: "Volgende →"
- Background: `#000000`
- Color: White
- Padding: 1rem 2rem
- Border radius: 10px
- Font weight: 600
- Display: flex, gap 8px

**Trust Indicators** (same as previous steps)
- "🔒 100% veilig"
- "⚡ Binnen 24 uur reactie"
- "📞 Gratis adviesgesprek"

## Notes for Stitch
- Show "Werkkapitaal" card and "Binnenkort (1-4 weken)" radio in selected states
- Purpose grid has 2 columns, 3 rows
- Each purpose card has two-line text (label + description)
- Selected card has white text on black background
- Maintain clear visual hierarchy between purpose section and urgency section




