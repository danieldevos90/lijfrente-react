# Social Media Preview Setup

## ✅ Current Implementation

The site has comprehensive social media preview support configured:

### Open Graph Tags (Facebook, LinkedIn, WhatsApp)
- ✅ Title
- ✅ Description  
- ✅ Image (1200x630px recommended)
- ✅ URL
- ✅ Site Name
- ✅ Locale (nl_NL)
- ✅ Type (website/article/product)

### Twitter Card Tags
- ✅ Card Type: `summary_large_image`
- ✅ Title
- ✅ Description
- ✅ Image

## Current OG Image

Currently using: `/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg`

This is a professional business image suitable for social previews.

## Creating a Custom OG Image

For best results, create a custom OG image (`/public/og-image.jpg`) with:

### Specifications
- **Dimensions**: 1200x630px (1.91:1 aspect ratio)
- **Format**: JPG or PNG
- **File size**: < 1MB (optimized)
- **Content**: Should include:
  - Company logo
  - Tagline or key message
  - Brand colors
  - Professional imagery

### Tools to Create OG Images
- [Canva](https://www.canva.com/) - Free templates for OG images
- [Bannerbear](https://www.bannerbear.com/) - Automated OG image generation
- [Figma](https://www.figma.com/) - Design custom OG images
- [Cloudinary](https://cloudinary.com/) - Dynamic OG image generation

### Example Design
```
┌─────────────────────────────────────┐
│  [Logo]  GeldGeregeld              │
│                                     │
│  Zakelijke Financiering            │
│  Snel en Simpel                    │
│                                     │
│  Binnen 24 uur reactie             │
│                                     │
│  [Professional Business Image]     │
└─────────────────────────────────────┘
```

## Testing Social Previews

### Facebook Debugger
https://developers.facebook.com/tools/debug/

### Twitter Card Validator
https://cards-dev.twitter.com/validator

### LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

### Open Graph Preview
https://www.opengraph.xyz/

## Page-Specific OG Images

You can set custom OG images per page:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Page Title',
    description: 'Page description',
    ogImage: 'https://yoursite.com/custom-og-image.jpg', // Custom image
  });
}
```

## Next Steps

1. ✅ Social preview metadata is configured
2. ⚠️ Create a custom branded OG image (optional but recommended)
3. ✅ Test with social media debuggers
4. ✅ Monitor social sharing performance
