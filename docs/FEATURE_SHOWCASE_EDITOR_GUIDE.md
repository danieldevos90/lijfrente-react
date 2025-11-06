# Feature Showcase - Strapi Content Editor Guide

## Quick Start

This guide helps content editors create beautiful feature cards in Strapi.

### Step 1: Navigate to Content Manager
1. Log into Strapi admin panel
2. Click "Content Manager" in the left sidebar
3. Select your page or content type
4. Add a new "Feature Showcase" component

### Step 2: Configure the Section

#### Section Settings:
- **Title** (Optional): e.g., "See How It Works"
- **Description** (Optional): Brief explanation of the features
- **Layout**: Choose how cards are displayed
  - `grid-2`: Two columns (recommended for 2-4 cards)
  - `grid-3`: Three columns (good for 3-6 cards)
  - `grid-4`: Four columns (good for 4+ cards)
  - `slider`: Horizontal scrolling (mobile-friendly)
- **Background Color**: Hex color code (default: #ffffff)

### Step 3: Add Feature Cards

Click "+ Add Feature Card" and fill in:

#### Required Fields:
1. **Background Image**: Upload the main image
   - Recommended size: 800x600px or similar aspect ratio
   - File formats: JPG, PNG, WebP
   - Max file size: 5MB

2. **Badge Text**: Short text to display in the badge
   - Examples: "+$210.10", "New", "✓ Complete"
   - Keep it short (1-15 characters)

#### Optional Fields:

**Icon Options** (choose one):
- **Icon Image**: Upload a small image/avatar (40x40px recommended)
- **Icon Emoji**: Type an emoji (💰, ✓, 📱, etc.)

**Badge Styling**:
- **Badge Color**: Hex color code for badge background
  - Light Purple: `#e9d5ff`
  - Light Blue: `#bfdbfe`
  - Light Green: `#d1fae5`
  - Light Pink: `#fbcfe8`
  
- **Badge Position**: Where the badge appears
  - `top-left`: Upper left corner
  - `top-center`: Top middle
  - `top-right`: Upper right corner
  - `center`: Middle of image
  - `bottom-left`: Lower left corner
  - `bottom-center`: Bottom middle
  - `bottom-right`: Lower right corner

**Bottom Overlay** (optional):
- **Overlay Text**: Text at the bottom of the card
  - Example: "Wage disbursement complete"
- **Overlay Color**: Background color for the overlay
  - Success Green: `#d1fae5`
  - Info Blue: `#dbeafe`
- **Overlay Icon**: Emoji to show before text (✓, ⚡, etc.)

## Example Configurations

### Example 1: Payment Notification
```
Background Image: [Upload image of people]
Icon Image: [Upload small avatar]
Badge Text: "+$210.10"
Badge Color: #e9d5ff
Badge Position: top-left
```

### Example 2: Success Message
```
Background Image: [Upload image of person at computer]
Icon Emoji: ✓
Badge Text: [leave empty]
Badge Position: bottom-center
Overlay Text: "Wage disbursement complete"
Overlay Color: #d1fae5
Overlay Icon: ✓
```

### Example 3: Feature Highlight
```
Background Image: [Upload feature screenshot]
Icon Emoji: 🚀
Badge Text: "Fast & Secure"
Badge Color: #bfdbfe
Badge Position: top-right
```

## Tips for Great Results

### Image Selection:
✓ Use high-quality, clear images
✓ Ensure the main subject is visible
✓ Avoid images with too much text
✓ Consider where the badge will be placed

### Badge Placement:
✓ Don't cover important parts of the image
✓ Use contrasting positions for variety
✓ Test on mobile to check readability
✓ Center positions work well for portraits

### Color Choices:
✓ Use colors that complement the image
✓ Lighter colors work best for badges
✓ Ensure text is readable (dark text on light background)
✓ Stay consistent with your brand colors

### Text Content:
✓ Keep badge text very short
✓ Use clear, action-oriented language
✓ Consider using emojis for visual interest
✓ Test with different screen sizes

## Common Use Cases

### Financial Features:
- Payment confirmations: "+$500.00" with 💰 emoji
- Account balance: "Balance: $1,234" with 💵 emoji
- Transaction status: "✓ Complete" with green overlay

### App Screenshots:
- New features: "New!" badge with ⭐ emoji
- Feature highlights: Feature name in badge
- Status updates: Success messages with checkmark

### Product Benefits:
- Speed: "2x Faster" with ⚡ emoji
- Security: "Bank-Level Security" with 🔒 emoji
- Support: "24/7 Support" with 💬 emoji

## Troubleshooting

### Issue: Badge text is cut off
**Solution**: Reduce text length or choose a different position

### Issue: Image looks pixelated
**Solution**: Upload a higher resolution image (min 800px width)

### Issue: Badge is hard to read
**Solution**: Choose a lighter badge color or different position

### Issue: Layout looks wrong on mobile
**Solution**: Try the 'slider' layout or reduce number of cards

## Color Reference

### Popular Badge Colors:
- Purple/Lavender: `#e9d5ff` - Great for payments/money
- Sky Blue: `#bfdbfe` - Good for information
- Mint Green: `#d1fae5` - Perfect for success
- Rose Pink: `#fbcfe8` - Nice for highlights
- Amber Yellow: `#fef3c7` - Good for warnings/attention

### Popular Overlay Colors:
- Success: `#d1fae5` (green)
- Info: `#dbeafe` (blue)
- Warning: `#fef3c7` (yellow)
- Neutral: `#f3f4f6` (gray)

## Keyboard Shortcuts in Strapi

- `Ctrl/Cmd + S`: Save draft
- `Ctrl/Cmd + Shift + S`: Save and publish
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo

## Need Help?

If you encounter issues:
1. Check this guide for common solutions
2. Preview the page before publishing
3. Contact your developer team
4. Refer to the technical documentation: `FEATURE_SHOWCASE_README.md`

---

**Pro Tip**: Save as draft frequently and use the preview feature to see how your changes look before publishing!

