# Stitch Prompt: Homepage with Sticky CTA

## Screen Overview
Same homepage as initial state, but with a fixed sticky call-to-action button visible at the bottom of the screen.

## Design System
(Same as homepage initial - see 01-homepage-initial.md)

### Colors
- Brand Primary: `#000000`
- Brand Dark: `#1a1a1a`
- Text Primary: `#0F172A`
- Text Muted: `#64748B`
- Background: `#FFFFFF`
- Border: `#E2E8F0`

### Typography
- Font: Inter, system-ui
- H1: 48px, weight 700
- Body: 20px

## Layout Structure

### Hero Section (Same as before)
- Centered content
- H1: "Welkom"
- Subtitle: "Dit is een minimale multi‑site frontend met design tokens en Strapi integratie."
- Primary CTA: "Bekijk demo‑site"

### NEW: Sticky CTA Component

**Position**
- Fixed position at bottom of viewport
- Bottom: 12px
- Left: 12px
- Right: 12px
- Z-index: 50 (appears above all content)

**Container**
- Display: flex
- Justify-content: center
- Align-items: center

**Button Element**
- Text: "Probeer lead formulier"
- Background: `#000000` (Black)
- Text color: `#FFFFFF` (White)
- Padding: 16px 32px
- Border radius: 10px
- Font size: 16px
- Font weight: 600
- Border: none
- Box shadow: `0 6px 18px rgba(0,0,0,0.15)` (more prominent than regular buttons)
- Cursor: pointer

**Button Hover State**
- Background: `#1a1a1a`
- Transform: translateY(-2px)
- Box shadow: `0 8px 24px rgba(0,0,0,0.25)` (even deeper)
- Transition: all 0.2s ease

**Button Active/Click State**
- Transform: translateY(0)
- Box shadow: `0 4px 12px rgba(0,0,0,0.15)`

## Visual Hierarchy
1. Main hero content (centered)
2. Sticky CTA (bottom, fixed, prominent shadow to indicate it's floating)

## Notes for Stitch
- The sticky CTA should appear to "float" above the page content
- Strong shadow helps indicate the button is fixed/sticky
- Button should be centered horizontally at bottom
- Ensure the sticky button doesn't overlap with main content
- The button should look clickable and important
- Consider adding subtle backdrop blur if possible for better readability





