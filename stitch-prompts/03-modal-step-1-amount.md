# Stitch Prompt: Lead Form Modal - Step 1 (Financing Amount)

## Screen Overview
Modal overlay with multi-step lead form. First step asks users to select financing amount with visual button options.

## Design System

### Colors
- Brand: `#000000`
- Brand Dark: `#1a1a1a`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Border Active: `#000000`
- Warning Orange: `#f59e0b`
- Light Gray BG: `#f8fafc`

### Typography
- Font: Inter
- H2: 28px, weight 600
- Body: 16px
- Small: 13px

## Layout Structure

### Modal Overlay (Background)
- Full viewport width/height
- Background: `rgba(0, 0, 0, 0.8)`
- Backdrop filter: blur(6px)
- Display: flex, center content
- Z-index: 1000

### Modal Container
- Max-width: 600px
- Width: 100%
- Background: White
- Border radius: 14px
- Box shadow: `0 25px 50px rgba(0, 0, 0, 0.25)`
- Max-height: 90vh
- Overflow: hidden

---

## Modal Header

**Background & Layout**
- Background: `#f8fafc` (light gray)
- Padding: 1.5rem 2rem (24px 32px)
- Border-bottom: 1px solid `#E2E8F0`
- Display: flex
- Justify-content: space-between
- Align-items: center

**Title (H2)**
- Text: "Zakelijke financiering aanvragen"
- Font size: 24px
- Font weight: 700
- Color: `#0F172A`
- Margin: 0

**Close Button (Right side)**
- Icon: X (close icon, 24px)
- Background: transparent
- Padding: 8px
- Border: none
- Color: `#64748B`
- Cursor: pointer
- Border radius: 6px
- Hover background: `#E2E8F0`

---

## Form Progress Header

**Background**
- Gradient: `linear-gradient(135deg, #000000, #1a1a1a)`
- Padding: 1.5rem 2rem
- Color: White

**Progress Bar**
- Width: 100%
- Height: 8px
- Background: `rgba(255, 255, 255, 0.2)`
- Border radius: 4px
- Margin bottom: 1rem

**Progress Fill**
- Width: 16.67% (1 of 6 steps)
- Height: 8px
- Background: White
- Border radius: 4px

**Step Indicator**
- Display: flex, centered, gap 8px
- "Stap 1" - 28px, weight 700, white
- "van 6" - 20px, weight 400, 90% opacity

---

## Form Body (Step 1 Content)

**Container Padding**: 3rem 2rem (48px 32px)

**Heading (H2)**
- Text: "Hoeveel financiering heeft u nodig?"
- Font size: 28px
- Weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 0.5rem

**Description**
- Text: "Selecteer het bedrag dat het beste bij uw situatie past"
- Font size: 16px
- Color: `#64748B`
- Text-align: center
- Margin bottom: 2rem

**Amount Grid**
- Display: grid
- Grid: 3 columns on desktop (repeat(3, 1fr))
- Gap: 12px
- Margin bottom: 2rem

**Amount Option Buttons** (6 total)

Default State:
- Padding: 1.25rem 0.75rem (20px 12px)
- Border: 2px solid `#e5e7eb`
- Border radius: 10px
- Background: White
- Text align: center
- Font size: 16px
- Font weight: 600
- Color: `#374151`
- Cursor: pointer
- Transition: all 0.2s ease

Hover State:
- Border color: `#000000`
- Transform: translateY(-2px)
- Box shadow: `0 4px 12px rgba(0,0,0,0.1)`

Selected State:
- Border color: `#000000`
- Background: `#000000`
- Color: White

Button Labels:
1. "€ 25.000"
2. "€ 50.000" (has "Populair" badge)
3. "€ 100.000"
4. "€ 250.000"
5. "€ 500.000"
6. "Ander bedrag"

**Popular Badge** (on €50.000 option)
- Position: absolute top -8px, right -8px
- Background: `#f59e0b` (orange)
- Color: White
- Padding: 4px 8px
- Border radius: 6px
- Font size: 12px
- Font weight: 600
- Text: "Populair"

---

## Form Footer

**Container**
- Padding: 2rem
- Background: `#f8fafc`
- Border-top: 1px solid `#E2E8F0`

**Navigation Buttons**
- Display: flex
- Justify-content: flex-end (only Next button, no Back on step 1)

**Next Button**
- Text: "Volgende" with right arrow icon (→)
- Background: `#000000`
- Color: White
- Padding: 1rem 2rem (16px 32px)
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Border: none
- Display: flex, align-items center, gap 8px
- Cursor: pointer
- Hover: background `#1a1a1a`, translateY(-2px)

**Trust Indicators** (below buttons)
- Display: flex, centered, gap 1.5rem
- Margin top: 1rem
- Font size: 13px
- Color: `#64748B`

Items:
- "🔒 100% veilig"
- "⚡ Binnen 24 uur reactie"
- "📞 Gratis adviesgesprek"

## Notes for Stitch
- Modal should appear centered on dark overlay
- Grid should be responsive (3 columns, but can adjust)
- "Populair" badge should overlap the €50.000 button
- Show one button in selected state (e.g., €50.000)
- Ensure proper visual hierarchy: header → progress → content → footer
- Box shadows create depth and focus attention on modal




