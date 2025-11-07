# Favicon Setup Guide

This project uses comprehensive favicon support for all browsers and devices.

## Required Files

The following favicon files should be placed in `/frontend/public/`:

### Basic Favicons
- `favicon.ico` - Traditional favicon (16x16, 32x32, 48x48 multi-size ICO file)
- `favicon.svg` - Modern SVG favicon (already created)
- `favicon-16x16.png` - 16x16 PNG favicon
- `favicon-32x32.png` - 32x32 PNG favicon

### Apple Touch Icons
- `apple-touch-icon.png` - 180x180 PNG for iOS devices

### PWA Icons
- `favicon-192x192.png` - 192x192 PNG for Android/PWA
- `favicon-512x512.png` - 512x512 PNG for Android/PWA

### Safari
- `safari-pinned-tab.svg` - SVG mask icon for Safari pinned tabs (already created)

## Generating Favicon Files

### Option 1: Online Tools
1. Use [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/)
2. Upload your logo/icon (512x512px recommended)
3. Download the generated files
4. Place all files in `/frontend/public/`

### Option 2: Using ImageMagick (Command Line)
```bash
# Convert SVG to PNG sizes
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 favicon-192x192.png
convert favicon.svg -resize 512x512 favicon-512x512.png

# Create ICO file (requires ImageMagick)
convert favicon-16x16.png favicon-32x32.png favicon.ico
```

### Option 3: Using Node.js Script
```javascript
const sharp = require('sharp');

async function generateFavicons() {
  const sizes = [16, 32, 180, 192, 512];
  for (const size of sizes) {
    await sharp('favicon.svg')
      .resize(size, size)
      .toFile(`favicon-${size}x${size}.png`);
  }
}
```

## Current Status

✅ Created:
- `favicon.svg` - SVG favicon
- `safari-pinned-tab.svg` - Safari mask icon
- `site.webmanifest` - Web app manifest

⏳ To Generate:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `favicon-192x192.png`
- `favicon-512x512.png`

## Metadata Configuration

The favicon metadata is configured in `/frontend/app/layout.tsx` and includes:
- Standard favicons (ICO, SVG, PNG)
- Apple touch icons for iOS
- Safari pinned tab icon
- Web app manifest for PWA support

All browsers will automatically use the appropriate favicon format.

