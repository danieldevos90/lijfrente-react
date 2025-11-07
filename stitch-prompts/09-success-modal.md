# Stitch Prompt: Success Modal

## Screen Overview
Success confirmation modal that appears after successful form submission with celebratory design and next steps information.

## Design System

### Colors
- Success Green: `#10b981`
- Success Dark: `#059669`
- Brand: `#000000`
- Text: `#0F172A`
- Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Light Gray BG: `#f8fafc`

---

## Modal Overlay

**Background**
- Full viewport (100vw x 100vh)
- Background: `rgba(0, 0, 0, 0.8)`
- Backdrop filter: blur(6px)
- Display: flex, center content
- Z-index: 1000

---

## Modal Container

**Layout**
- Max-width: 500px
- Width: 100%
- Background: White
- Border radius: 14px
- Box shadow: `0 25px 50px rgba(0, 0, 0, 0.25)`
- Position: relative
- Padding: 0
- Overflow: hidden

---

## Close Button (Top Right)

**Position**
- Position: absolute
- Top: 1rem (16px)
- Right: 1rem (16px)
- Z-index: 10

**Styling**
- Background: `rgba(255, 255, 255, 0.9)`
- Border: 1px solid `#E2E8F0`
- Border radius: 6px
- Padding: 8px
- Width: 40px
- Height: 40px
- Cursor: pointer
- Icon: X (close, 24px)
- Color: `#64748B`

Hover State:
- Background: White
- Color: `#0F172A`

---

## Success Content

**Container Padding**: 3rem 2rem 2rem (48px 32px 32px)

---

### Success Icon

**Container**
- Width: 80px
- Height: 80px
- Background: `#10b981` (green circle)
- Color: White
- Border-radius: 50% (perfect circle)
- Display: flex, center content
- Margin: 0 auto 1.5rem
- Icon: Checkmark (white, 40px)

---

### Heading (H2)

- Text: "Bedankt voor uw aanvraag!"
- Font size: 28px
- Font weight: 700
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 1rem

---

### Main Message (Paragraph)

- Text: "We hebben uw aanvraag ontvangen en zullen deze zo snel mogelijk verwerken. U ontvangt binnen 24 uur een gepersonaliseerd financieringsvoorstel per e-mail."
- Font size: 16px
- Color: `#64748B`
- Line-height: 1.6
- Text-align: center
- Margin bottom: 2rem
- Max-width: 100%

---

## Next Steps Section

**Container**
- Margin: 2rem 0
- Text-align: left

**Section Heading (H3)**
- Text: "Wat gebeurt er nu?"
- Font size: 18px
- Font weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 1rem

**Steps Container**
- Display: flex column
- Gap: 0.75rem (12px)

---

### Step Item (3 total)

**Container**
- Display: flex
- Align-items: center
- Gap: 1rem (16px)
- Padding: 0.75rem (12px)
- Background: `#f8fafc` (light gray)
- Border-radius: 6px

**Step Number Circle**
- Width: 24px
- Height: 24px
- Background: `#000000` (brand black)
- Color: White
- Border-radius: 50%
- Display: flex, center content
- Font-size: 12px
- Font-weight: 600
- Flex-shrink: 0

**Step Text**
- Font-size: 14px
- Color: `#0F172A`
- Line-height: 1.4

**Steps Content:**

1. "We beoordelen uw aanvraag"
2. "U ontvangt een voorstel per e-mail"
3. "Na akkoord regelen we de financiering"

---

## Contact Section

**Container**
- Margin: 2rem 0

**Section Heading (H3)**
- Text: "Heeft u vragen?"
- Font size: 16px
- Font weight: 600
- Color: `#0F172A`
- Text-align: center
- Margin bottom: 1rem

**Contact Options**
- Display: flex
- Gap: 1rem
- Justify-content: center
- Flex-wrap: wrap

---

### Contact Option Buttons (2 buttons)

**Default State**
- Display: flex, align-items center
- Gap: 0.5rem (8px)
- Padding: 0.75rem 1rem (12px 16px)
- Background: `#f8fafc`
- Border: 1px solid `#E2E8F0`
- Border-radius: 6px
- Font-size: 14px
- Font-weight: 500
- Color: `#0F172A`
- Cursor: pointer
- Text-decoration: none

Hover State:
- Background: `#000000`
- Color: White
- Border-color: `#000000`

**Option 1: Phone**
- Icon: Phone icon (16px)
- Text: "020 123 4567"

**Option 2: Email**
- Icon: Mail icon (16px)
- Text: "info@financiering.nl"

---

## Primary Action Button

**Container**
- Margin top: 1.5rem (24px)
- Text-align: center

**Button**
- Text: "Sluiten"
- Background: `#000000`
- Color: White
- Padding: 1rem 2rem (16px 32px)
- Border-radius: 10px
- Font-size: 16px
- Font-weight: 600
- Border: none
- Cursor: pointer
- Display: inline-block

Hover State:
- Background: `#1a1a1a`
- Transform: translateY(-2px)
- Box-shadow: `0 4px 12px rgba(0,0,0,0.2)`
- Transition: all 0.2s ease

---

## Notes for Stitch
- Modal appears centered on dark overlay backdrop
- Success icon (green circle with white checkmark) is the focal point
- Close button in top-right corner is subtle but accessible
- Three numbered steps create clear expectation
- Contact options change to brand color on hover
- Overall feeling should be positive, celebratory, and reassuring
- White space and padding create breathing room
- All elements centered except step items which are left-aligned within their section




