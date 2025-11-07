# Stitch Prompt: Lead Form Drawer - Step 2 (Business Type)

## Screen Overview
Step 2 in right-side drawer. Minimal, clean design with single-column selection.

## Design System
(Same minimal palette as drawer step 1)

---

## Drawer Container
(Same as Step 1 - 480px wide, right-aligned, white background)

---

## Drawer Header
- Title: "Financiering aanvragen"
- Close X button

---

## Progress Indicator (Minimal Dots)

**Dot Status** (6 dots)
- Dots 1-2: Active (dot 2 is elongated pill)
- Dots 3-6: Inactive

**Step Counter**: "2/6"

---

## Drawer Body (Scrollable)

**Padding**: 2rem 1.5rem

**Heading**
- Text: "Type bedrijf"
- Font size: 24px
- Weight: 600
- Margin bottom: 0.75rem

**Description**
- Text: "Selecteer uw bedrijfstype"
- Font size: 14px
- Color: `#64748B`
- Margin bottom: 1.5rem

---

### Business Type List (Single Column)

**Layout**
- Display: flex column
- Gap: 10px
- Margin bottom: 2rem

**Business Type Options** (4 total)

Default State:
- Padding: 1rem
- Border: 1px solid `#E2E8F0`
- Border-radius: 8px
- Background: White
- Cursor: pointer
- Display: flex
- Align-items: center
- Gap: 12px
- Transition: all 0.15s ease

Hover:
- Border-color: `#000000`
- Background: `#f8fafc`

Selected State (BV/NV):
- Border-color: `#000000`
- Border-width: 2px
- Background: `#f8fafc`
- Font-weight: 600

**Option Layout:**
- Icon (24px, left)
- Label (center-left)
- Radio circle (16px, right)

Options:
1. User icon + "Eenmanszaak"
2. Building icon + "BV / NV" - SELECTED
3. User icon + "VOF / Maatschap"
4. Building icon + "Stichting"

---

### Business Size Section

**Section Label**
- Text: "Bedrijfsgrootte"
- Font size: 16px
- Weight: 600
- Margin: 0 0 12px
- Color: `#0F172A`

**Size Options List** (4 options)

Default State:
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border-radius: 8px
- Background: White
- Display: flex
- Align-items: center
- Gap: 12px
- Cursor: pointer

Selected State:
- Border-color: `#000000`
- Border-width: 2px
- Background: `#f8fafc`
- Font-weight: 600

**Radio Circle**
- Width: 16px
- Height: 16px
- Border: 2px solid `#E2E8F0`
- Border-radius: 50%
- Selected: filled with black dot (8px)

Options:
1. "Starter (0-2 jaar)"
2. "Klein (2-10 werknemers)" - SELECTED
3. "Middelbedrijf (10-50)"
4. "Groot (50+)"

---

## Drawer Footer

**Navigation**
- Display: flex
- Justify-content: space-between
- Gap: 12px

**Back Button**
- Text: "Terug"
- Background: White
- Color: `#0F172A`
- Border: 1px solid `#E2E8F0`
- Padding: 12px 20px
- Border-radius: 8px
- Font-size: 15px
- Font-weight: 500
- Hover: border `#000000`

**Next Button**
- Text: "Volgende"
- Background: `#000000`
- Color: White
- Padding: 12px 24px
- Border-radius: 8px
- Font-size: 15px
- Font-weight: 600

**Auto-save Indicator**
- "Automatisch opgeslagen"
- Font-size: 12px
- Color: `#64748B`

---

## Minimal Design Notes
- All options in single column (no grid)
- Icons are 24px, simple line style
- Consistent 10-12px gaps between items
- Selected state uses border + background color
- No gradients, shadows minimal
- Compact padding throughout




