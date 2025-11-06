# Stitch Prompts - Minimal Drawer Lead Form

## Overview
These prompts create a **minimal, drawer-based lead form** that slides from right to left with automatic progress saving. Replaces the centered modal approach.

---

## Key Design Changes

### From Modal → To Drawer

**Before (Modal):**
- Centered overlay
- 600px max-width
- Strong shadows and gradients
- Full overlay click to close

**After (Drawer):**
- Right-aligned slide-out panel
- 480px fixed width (desktop)
- Minimal shadows, no gradients
- Single column layout
- Lighter overlay (40% vs 80% opacity)
- Auto-save indicator

---

## New Prompts for Drawer Design

### Drawer-Specific Screens
- **03-drawer-step-1-amount.md** - Drawer version of amount selection (replaces modal)
- **10-drawer-step-2-business-type.md** - Drawer version of business type
- **11-drawer-mobile.md** - Full-width mobile drawer specifications

### Still Relevant
- **01-homepage-initial.md** - Homepage (unchanged)
- **02-homepage-with-sticky-cta.md** - Sticky CTA triggers drawer instead of modal
- **09-success-modal.md** - Success confirmation (can be modal or drawer)

---

## Drawer Design System

### Minimal Design Principles

1. **Single Column Layout**
   - No grids (except mobile buttons)
   - All options stack vertically
   - Easier to scan, cleaner feel

2. **Reduced Visual Weight**
   - 1px borders (instead of 2px)
   - Smaller shadows
   - More whitespace
   - No gradients (all solid colors)

3. **Compact Sizing**
   - Desktop: 480px wide (vs 600px modal)
   - Mobile: 100vw (full screen)
   - Smaller text sizes overall
   - Reduced padding

4. **Simplified Navigation**
   - Dot indicators (6 dots, active is elongated)
   - Step counter (e.g., "2/6")
   - No progress bar fill

5. **Auto-Save Feedback**
   - "Voortgang wordt automatisch opgeslagen"
   - Small text under footer buttons
   - Builds trust without being intrusive

---

## Layout Specifications

### Desktop Drawer (≥ 768px)
```
┌─────────────────┐
│ [×] Title       │ ← Header (24px padding)
├─────────────────┤
│ ● ● ○ ○ ○ ○ 1/6│ ← Progress dots
├─────────────────┤
│                 │
│   Content       │ ← Scrollable body (24px padding)
│   (Single col)  │
│                 │
├─────────────────┤
│ [Back] [Next]   │ ← Footer (24px padding)
│ Auto-saved ✓    │
└─────────────────┘
     480px wide
```

### Mobile Drawer (< 768px)
```
┌──────────────────────┐
│ [×] Title            │ ← Header (16px padding)
├──────────────────────┤
│ ● ● ○ ○ ○ ○      1/6│ ← Progress dots
├──────────────────────┤
│                      │
│   Content            │ ← Scrollable (16px H padding)
│   (Full width)       │
│                      │
├──────────────────────┤
│ [Back] [  Next   ]   │ ← Footer (16px padding)
│    Auto-saved ✓      │ ← Fixed at bottom
└──────────────────────┘
       100vw wide
```

---

## File Structure

### Homepage
1. **01-homepage-initial.md**
2. **02-homepage-with-sticky-cta.md**

### Drawer Lead Form (Desktop)
3. **03-drawer-step-1-amount.md** ⭐ NEW
4. **10-drawer-step-2-business-type.md** ⭐ NEW
5. Create similar for steps 3-6 (using same drawer structure)

### Mobile Specific
11. **11-drawer-mobile.md** ⭐ NEW (shows mobile adaptations)

### Success State
9. **09-success-modal.md** (can be adapted to drawer if needed)

---

## Implementation Features

### Automatic Progress Saving

**What Gets Saved:**
- All form field values
- Current step number
- Timestamp

**Where It's Saved:**
- Primary: localStorage
- Backup: Cookie (7 day expiry)
- Fallback if one fails

**When It Saves:**
- On every field change (debounced 500ms)
- On step navigation
- On drawer close

**Resume Experience:**
```
User returns after closing drawer
  ↓
[Resume Prompt Appears]
"Wilt u doorgaan waar u gebleven was?"
  ↓
[ Doorgaan vanaf stap 3 ]  [ Opnieuw beginnen ]
```

### Auto-Save Indicator States

1. **Saving...** (during debounce)
2. **Opgeslagen ✓** (success, 2 seconds)
3. **Automatisch opgeslagen** (default state)

---

## Drawer vs Modal Comparison

| Feature | Modal (Old) | Drawer (New) |
|---------|-------------|--------------|
| Width | 600px | 480px |
| Position | Center | Right edge |
| Layout | Grid (2 col) | Single column |
| Animation | Scale + fade | Slide from right |
| Mobile | Same centered | Full screen |
| Overlay | 80% black | 40% black |
| Progress | Bar fill | Dots |
| Borders | 2px | 1px |
| Shadows | Strong | Subtle |
| Gradients | Yes | No |
| Auto-save | No | Yes |

---

## Usage Instructions

### For Stitch:

1. **Start with homepage** (prompts 1-2)
2. **Create drawer Step 1** (prompt 3) - this shows the drawer structure
3. **Create drawer Step 2** (prompt 10) - shows with Back button
4. **Use Step 2 as template** for steps 3-6 (adjust content only)
5. **Create mobile version** (prompt 11) - shows responsive changes
6. **Create success state** (prompt 9)

### Key Points:
- All drawer screens share same container (480px, right-aligned)
- Progress dots update per step (1-6)
- Single column layout throughout
- Minimal visual styling (clean, simple)
- Auto-save message always visible in footer

---

## Color Palette (Minimal)

```css
--brand: #000000;
--text: #0F172A;
--muted: #64748B;
--bg: #FFFFFF;
--border: #E2E8F0;
--light: #f8fafc;
--warning: #f59e0b;
```

Only 7 colors total. No gradients, no extra accent colors.

---

## Typography Scale (Simplified)

```css
--text-xl: 24px;   /* Headings */
--text-lg: 20px;   /* Drawer title */
--text-base: 16px; /* Body, options */
--text-sm: 14px;   /* Descriptions */
--text-xs: 12px;   /* Auto-save, step counter */
```

---

## Next Steps

1. ✅ Create drawer Stitch prompts (Steps 1-2)
2. ⏳ Create remaining step prompts (3-6) using same structure
3. ⏳ Implement drawer component in React
4. ⏳ Add localStorage/cookie persistence
5. ⏳ Test on desktop and mobile
6. ⏳ Add accessibility features
7. ⏳ Performance optimization

---

**The drawer approach is more modern, less intrusive, and better for mobile users while maintaining progress automatically.**

