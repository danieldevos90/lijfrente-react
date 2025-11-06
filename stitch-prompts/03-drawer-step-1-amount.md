# Stitch Prompt: Lead Form Drawer - Step 1 (Financing Amount)

## Screen Overview
Right-side slide-out drawer for lead form. Clean, minimal design with the drawer sliding from right edge. Form progress is saved automatically.

## Design System

### Colors (Minimal Palette)
- Brand: `#000000`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Light Gray: `#f8fafc`
- Warning: `#f59e0b`

### Typography (Minimal)
- Font: Inter, system-ui
- H2: 24px, weight 600
- Body: 16px
- Small: 13px

---

## Layout Structure

### Page Background (Left Side - Dimmed)
- Full viewport
- Background: `rgba(0, 0, 0, 0.4)` (lighter than modal overlay)
- Backdrop filter: blur(4px)
- Z-index: 1000
- Click to close drawer

---

## Drawer Container (Right Side)

**Position & Size**
- Position: fixed
- Right: 0
- Top: 0
- Bottom: 0
- Width: 480px (narrower for minimal feel)
- Height: 100vh
- Background: White
- Box-shadow: `-8px 0 40px rgba(0, 0, 0, 0.15)` (shadow on left edge)
- Z-index: 1001
- Animation: slide in from right (0.3s ease-out)

**Slide-in Animation**
- From: translateX(100%) (off-screen right)
- To: translateX(0) (visible)

---

## Drawer Header (Minimal)

**Container**
- Padding: 1.5rem (24px)
- Border-bottom: 1px solid `#E2E8F0`
- Background: White
- Display: flex
- Justify-content: space-between
- Align-items: center

**Title (H2)**
- Text: "Financiering aanvragen"
- Font size: 20px (smaller, minimal)
- Font weight: 600
- Color: `#0F172A`
- Margin: 0

**Close Button (X icon)**
- Position: relative (not absolute)
- Background: none
- Border: none
- Padding: 8px
- Color: `#64748B`
- Cursor: pointer
- Icon size: 20px
- Border-radius: 6px
- Hover: background `#f8fafc`

---

## Progress Indicator (Minimal Dots)

**Container**
- Padding: 1rem 1.5rem
- Background: White
- Border-bottom: 1px solid `#E2E8F0`

**Dot Indicators**
- Display: flex
- Gap: 8px
- Justify-content: center

**Individual Dot** (6 total)
- Width: 8px
- Height: 8px
- Border-radius: 50%
- Background: `#E2E8F0` (inactive)
- Transition: all 0.2s ease

**Active Dot** (Step 1)
- Background: `#000000`
- Width: 24px (elongated pill)
- Border-radius: 4px

**Step Counter** (Right side, optional)
- Text: "1/6"
- Font size: 13px
- Color: `#64748B`
- Margin-left: auto

---

## Drawer Body (Scrollable Content)

**Container**
- Padding: 2rem 1.5rem
- Height: calc(100vh - header - footer - progress)
- Overflow-y: auto
- Overflow-x: hidden

**Heading (H2)**
- Text: "Hoeveel financiering heeft u nodig?"
- Font size: 24px
- Weight: 600
- Color: `#0F172A`
- Margin bottom: 0.75rem

**Description**
- Text: "Selecteer het gewenste bedrag"
- Font size: 14px
- Color: `#64748B`
- Margin bottom: 1.5rem

---

### Amount Grid (Single Column - Minimal)

**Layout**
- Display: flex column
- Gap: 10px
- Margin bottom: 1.5rem

**Amount Option Buttons** (6 total)

Default State:
- Padding: 1rem (16px)
- Border: 1px solid `#E2E8F0` (thinner border)
- Border radius: 8px
- Background: White
- Text align: left
- Font size: 16px
- Font weight: 500
- Color: `#0F172A`
- Cursor: pointer
- Transition: all 0.15s ease
- Display: flex
- Justify-content: space-between
- Align-items: center

Hover State:
- Border color: `#000000`
- Background: `#f8fafc`

Selected State:
- Border color: `#000000`
- Border-width: 2px
- Background: `#f8fafc`
- Font-weight: 600

**Option Layout:**
- Left: Amount text
- Right: Radio indicator (circle, 16px)

Button Labels:
1. "€ 25.000"
2. "€ 50.000" (+ small "Populair" label)
3. "€ 100.000"
4. "€ 250.000"
5. "€ 500.000"
6. "Ander bedrag"

**Popular Badge** (on €50.000)
- Display: inline
- Font-size: 11px
- Color: `#f59e0b`
- Font-weight: 600
- Margin-left: 8px
- Text: "Populair"

**If "Ander bedrag" selected:**
- Show input field below (appears with smooth animation)
- Placeholder: "Voer bedrag in"
- Padding: 12px
- Border: 1px solid `#E2E8F0`
- Border-radius: 8px
- Font-size: 16px
- Width: 100%

---

## Drawer Footer (Fixed Bottom)

**Container**
- Position: sticky (or fixed to drawer bottom)
- Bottom: 0
- Padding: 1.5rem
- Background: White
- Border-top: 1px solid `#E2E8F0`
- Box-shadow: `0 -4px 12px rgba(0, 0, 0, 0.05)` (subtle upward shadow)

**Navigation**
- Display: flex
- Justify-content: flex-end
- Gap: 12px

**Next Button** (Only button on step 1)
- Text: "Volgende"
- Background: `#000000`
- Color: White
- Padding: 12px 24px
- Border-radius: 8px
- Font size: 15px
- Font weight: 600
- Border: none
- Cursor: pointer
- Width: auto
- Hover: background `#1a1a1a`

**Auto-save Indicator** (Below button, centered)
- Text: "Voortgang wordt automatisch opgeslagen"
- Font-size: 12px
- Color: `#64748B`
- Margin-top: 8px
- Display: flex
- Align-items: center
- Gap: 6px
- Icon: Small checkmark or save icon

---

## Minimal Design Notes for Stitch

- Drawer is **480px wide** (not full-width)
- **Single column layout** for all options (no grid)
- **Thinner borders** (1px instead of 2px default)
- **Subtle shadows** (less prominent than modal)
- **Less padding** overall for compact feel
- **Smaller text sizes** (24px instead of 28px for H2)
- **Simple dot navigation** instead of full progress bar
- **White background throughout** - no gradients
- **Minimal hover effects** - just border color change
- Radio indicators on right side of options
- Auto-save message creates confidence without being intrusive
- Close X in header (not absolute positioned)
- Smooth slide-in animation from right edge

