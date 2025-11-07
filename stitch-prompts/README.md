# Stitch Prompts - Lead Form Flow

This folder contains individual Stitch prompts for each screen/state in the lead form user flow.

## File Organization

### Homepage Screens
- **01-homepage-initial.md** - Basic landing page without sticky CTA
- **02-homepage-with-sticky-cta.md** - Homepage with visible sticky bottom CTA button

### Lead Form Modal Screens (Multi-Step Form)
- **03-modal-step-1-amount.md** - Step 1: Financing amount selection
- **04-modal-step-2-business-type.md** - Step 2: Business type and size
- **05-modal-step-3-purpose.md** - Step 3: Purpose and urgency
- **06-modal-step-4-business-details.md** - Step 4: Company details (name, KvK, revenue)
- **07-modal-step-5-contact-info.md** - Step 5: Personal contact information
- **08-modal-step-6-summary.md** - Step 6: Final questions and summary

### Confirmation Screen
- **09-success-modal.md** - Success modal after form submission

## Design System Reference

All screens share the same design system:

### Colors
- **Brand Primary**: `#000000` (Black)
- **Brand Dark**: `#1a1a1a`
- **Text Primary**: `#0F172A`
- **Text Muted**: `#64748B`
- **Background**: `#FFFFFF`
- **Border**: `#E2E8F0`
- **Success Green**: `#10b981`
- **Warning Orange**: `#f59e0b`
- **Error Red**: `#ef4444`

### Typography
- **Font Family**: Inter, system-ui, -apple-system
- **H1**: 48px, weight 700
- **H2**: 28-36px, weight 600
- **H3**: 18-24px, weight 600
- **Body**: 16-18px, weight 400
- **Small**: 13-14px

### Spacing
- **xs**: 6px
- **sm**: 10px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

### Border Radius
- **sm**: 6px
- **md**: 10px
- **lg**: 14px

## User Flow

```
1. Homepage (initial)
   ↓
2. Homepage (with sticky CTA visible)
   ↓ (click sticky CTA)
3. Modal Step 1 (Amount) ─→ 4. Step 2 (Business Type) ─→ 5. Step 3 (Purpose)
   ↓                              ↓                              ↓
   6. Step 4 (Business Details) ← ─                              ←
   ↓
7. Step 5 (Contact Info)
   ↓
8. Step 6 (Summary)
   ↓ (submit)
9. Success Modal
```

## Usage Instructions

1. Open each markdown file in order
2. Copy the entire prompt into Stitch
3. Generate the design for that specific screen
4. Repeat for all screens to create the complete flow

## Notes

- Each prompt is self-contained with all necessary design specifications
- Example data is included in later steps to show filled states
- All modals share the same container, overlay, and basic structure
- Progress indicators update across Steps 1-6 (16.67%, 33.33%, 50%, 66.67%, 83.33%, 100%)
- Selected/active states are indicated in each prompt for realistic previews





