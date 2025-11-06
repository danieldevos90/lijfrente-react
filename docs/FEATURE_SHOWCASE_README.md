# Feature Showcase Component

A dynamic Strapi component for displaying feature cards with images, icon badges, and text overlays.

## Overview

The Feature Showcase component allows you to create visually appealing feature cards similar to app store screenshots or product showcases. Each card displays:

- A background image
- An icon badge with text (positioned anywhere on the card)
- Optional bottom overlay text
- Customizable colors

## Strapi Components Created

### 1. Feature Card (`shared.feature-card`)
Individual card component with the following fields:

#### Fields:
- **backgroundImage** (Media, Required): Main background image for the card
- **iconImage** (Media, Optional): Small icon/avatar image to display in the circle badge
- **iconEmoji** (String, Optional): Alternative to icon image - use an emoji or icon character
- **badgeText** (String, Required): Text to display next to the icon (e.g., "+$210.10")
- **badgeColor** (String): Background color for the badge (hex code, default: #e9d5ff)
- **badgePosition** (Enum): Position of the badge overlay on the image
  - Options: top-left, top-center, top-right, center, bottom-left, bottom-center, bottom-right
  - Default: top-left
- **overlayText** (Text, Optional): Optional overlay text at the bottom
- **overlayColor** (String): Background color for the overlay text (hex code, default: #d1fae5)
- **overlayIcon** (String, Optional): Icon or emoji to show before overlay text (e.g., "✓")

### 2. Feature Showcase Section (`sections.feature-showcase`)
Section component for displaying multiple feature cards:

#### Fields:
- **title** (String, Optional): Section title
- **description** (Text, Optional): Section description
- **featureCards** (Component, Repeatable): Array of Feature Card components
- **layout** (Enum): Layout style for displaying cards
  - Options: grid-2, grid-3, grid-4, slider
  - Default: grid-2
- **backgroundColor** (String): Background color for the section (hex code, default: #ffffff)

## Frontend Components

### FeatureCard Component
Location: `frontend/components/FeatureCard.tsx`

Renders an individual feature card with:
- Responsive image handling
- Dynamic badge positioning
- Icon circle (image or emoji)
- Bottom overlay text
- Customizable colors

### FeatureShowcase Section
Location: `frontend/components/sections/FeatureShowcase.tsx`

Renders a section containing multiple feature cards with:
- Optional section header (title + description)
- Multiple layout options (2, 3, 4 column grid, or slider)
- Responsive design

## Usage in Strapi

1. Go to Content-Type Builder
2. Add a dynamic zone or component field to your Page content type
3. Select "Feature Showcase" from the sections category
4. Configure the section:
   - Add a title (e.g., "See How It Works")
   - Add a description
   - Add feature cards
   - Choose a layout

### Example Configuration:

**Card 1 (Payment Notification):**
- Background Image: Upload image of people/transaction scene
- Icon Image: Upload small avatar/profile image
- Badge Text: "+$210.10"
- Badge Color: #e9d5ff (light purple)
- Badge Position: top-left
- Overlay Text: (empty)

**Card 2 (Wage Disbursement):**
- Background Image: Upload image of person at computer
- Icon Emoji: ✓
- Badge Text: (empty)
- Overlay Text: "Wage disbursement complete"
- Overlay Color: #d1fae5 (light green)
- Overlay Icon: ✓
- Badge Position: bottom-center

## Color Suggestions

### Badge Colors:
- Light Purple: `#e9d5ff`
- Light Blue: `#bfdbfe`
- Light Pink: `#fbcfe8`
- Light Yellow: `#fef3c7`
- Light Green: `#d1fae5`

### Overlay Colors:
- Success Green: `#d1fae5`
- Info Blue: `#dbeafe`
- Warning Yellow: `#fef3c7`
- Neutral Gray: `#f3f4f6`

## Styling Notes

- Cards have a minimum height of 400px
- Images use object-cover to maintain aspect ratio
- Badges have backdrop blur for better visibility
- All corners are rounded for a modern look
- Shadows are applied for depth
- Fully responsive and mobile-friendly

## Integration Steps

1. **Update Strapi Schema** (if not auto-detected):
   ```bash
   cd cms
   npm run build
   npm run develop
   ```

2. **Add to Page Rendering**:
   The component will need to be registered in your page rendering logic where other section components are handled.

3. **Create Content**:
   - Upload images (recommended: 800x600px or similar aspect ratio)
   - Add badge text and customize colors
   - Position badges for best visual effect

## Best Practices

1. **Image Selection**:
   - Use high-quality, relevant images
   - Ensure images have clear focal points
   - Consider badge placement when selecting images

2. **Badge Positioning**:
   - Avoid covering important parts of the image
   - Use contrasting positions for visual variety
   - Test on mobile to ensure readability

3. **Color Choice**:
   - Use colors that complement the image
   - Ensure sufficient contrast for readability
   - Maintain brand consistency

4. **Text Content**:
   - Keep badge text short and impactful
   - Use overlay text for additional context
   - Consider using emojis for visual interest

## Future Enhancements

Possible additions:
- Animation options (fade-in, slide-up, etc.)
- Link/CTA functionality for each card
- Video background support
- Gradient overlay options
- More badge styles (outlined, solid, etc.)

