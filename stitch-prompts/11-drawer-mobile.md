# Stitch Prompt: Lead Form Drawer - Mobile View (Full Width)

## Screen Overview
Mobile version of the drawer - takes full screen width on mobile devices (< 768px).

## Design System
(Same minimal palette)

---

## Mobile Drawer Container

**Position & Size**
- Position: fixed
- Right: 0
- Top: 0
- Bottom: 0
- Width: 100vw (full width on mobile)
- Height: 100vh
- Background: White
- Box-shadow: none
- Z-index: 1001

**No Overlay on Mobile**
- Drawer takes full screen
- No dimmed background behind it

---

## Drawer Header (Mobile)

**Container**
- Padding: 1rem (16px)
- Border-bottom: 1px solid `#E2E8F0`
- Background: White
- Display: flex
- Justify-content: space-between
- Align-items: center
- Position: sticky
- Top: 0
- Z-index: 10

**Title**
- Text: "Financiering aanvragen"
- Font size: 18px
- Font weight: 600

**Close Button**
- Icon: X (20px)
- Padding: 8px
- Background: transparent
- Tap-friendly size: 44x44px

---

## Progress Indicator (Mobile)

**Container**
- Padding: 12px 1rem
- Background: White
- Border-bottom: 1px solid `#E2E8F0`
- Sticky positioning

**Dot Indicators**
- Gap: 6px (smaller)
- Dot size: 6px
- Active dot: 20px wide (pill)

**Step Counter**
- Font-size: 12px
- "1/6"

---

## Drawer Body (Mobile)

**Padding**: 1.5rem 1rem
- Reduced horizontal padding
- More vertical scroll space

**Heading**
- Font-size: 22px (smaller on mobile)

**Description**
- Font-size: 14px

**Amount Options**
- Same single-column layout
- Padding: 14px (tap-friendly)
- Min-height: 48px (accessibility)
- Gap: 8px between options

**Font-sizes**
- Option text: 15px
- Buttons: 15px

---

## Drawer Footer (Mobile)

**Container**
- Position: fixed
- Bottom: 0
- Left: 0
- Right: 0
- Padding: 1rem
- Background: White
- Border-top: 1px solid `#E2E8F0`
- Safe-area-inset-bottom: included

**Buttons**
- Full width stack (if both back and next)
- Gap: 8px
- Padding: 14px (tap-friendly)
- Font-size: 15px

**Layout on Step 1** (Only Next)
- Next button: full width

**Layout on Steps 2-6** (Back + Next)
- Display: grid
- Grid: 1fr 2fr (Back smaller, Next larger)
- Gap: 8px

**Auto-save Indicator**
- Font-size: 11px
- Margin-top: 8px
- Centered

---

## Mobile-Specific Notes

- **Full-width drawer** (no side dimming)
- **Reduced padding** for more content space
- **Sticky header** and progress stay visible
- **Fixed footer** with safe-area handling
- **Tap targets minimum 44x44px**
- **Larger spacing** between interactive elements
- **Simplified layout** - everything single column
- **No hover states** (touch interface)
- **Focus on thumb-friendly navigation**

---

## Responsive Breakpoint
- Desktop: 480px drawer width
- Mobile (< 768px): 100vw drawer width
- Transition between the two should be smooth

