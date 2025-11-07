# Quick Start Guide - Strapi CMS

## 🚀 Getting Started in 5 Minutes

### 1. Start Strapi

```bash
cd cms
npm run develop
```

Access admin: `http://localhost:1337/admin`

### 2. Create Your First Page

1. **Content Manager** → **Pages** → **Create new entry**
2. Fill in:
   - **Title**: "Homepage"
   - **Slug**: `home` (auto-filled)
   - **Site ID**: `geldgeregeld`

3. **Add Sections**:
   - Click **"+ Add component to sections"**
   - Choose **"Hero Section"**
   - Fill in title, subtitle, background image
   - Add CTA buttons

4. **Save** → **Publish**

### 3. View Your Page

Frontend API endpoint:
```
http://localhost:1337/api/pages?filters[slug][$eq]=home&populate[sections][populate]=*
```

---

## 📦 Available Section Components

### Essential Sections

| Component | Use Case | Key Features |
|-----------|----------|--------------|
| **Hero Section** | Landing page header | Title, subtitle, CTAs, background image |
| **CTA Section** | Call-to-action blocks | Title, subtitle, button |
| **Content Section** | Text with image | Two-column layout, multiple variants |
| **Feature Section** | Product features | Image + content, left/right layout |

### Showcase Sections

| Component | Use Case | Key Features |
|-----------|----------|--------------|
| **Benefits Carousel** | Scrolling benefits | Icon cards, custom colors |
| **Why Choose Section** | Unique selling points | Grid layout, benefit cards |
| **Services Section** | Service offerings | Icon grid, service cards |
| **Testimonials Carousel** | Customer reviews | Rotating testimonials, images |

### Interactive Sections

| Component | Use Case | Key Features |
|-----------|----------|--------------|
| **How It Works Bento** | Process explanation | Bento grid, 4-step layout |
| **Process Steps** | Detailed steps | Stacking cards, numbered steps |
| **FAQ Section** | Questions & answers | Accordion, expandable items |
| **Animated Stats** | Statistics showcase | Animated numbers, metrics |

### Utility Sections

| Component | Use Case | Key Features |
|-----------|----------|--------------|
| **Trust Section** | Trust badges | Icons with text, credibility |
| **Two Column Support** | Support content | Two-column layout |
| **Feature Showcase** | Feature grid | Multiple feature cards |

---

## 🎨 Common Patterns

### Homepage Template

```
1. Hero Section (full-screen intro)
2. Trust Section (build credibility)
3. Benefits Carousel (key benefits)
4. Feature Section (main feature)
5. How It Works Bento (process explanation)
6. Testimonials Carousel (social proof)
7. CTA Section (conversion)
```

### Product Page Template

```
1. Hero Section (product intro)
2. Feature Showcase (product features)
3. Benefits Carousel (product benefits)
4. Process Steps (how to use)
5. FAQ Section (common questions)
6. CTA Section (purchase/signup)
```

### About Page Template

```
1. Hero Section (company intro)
2. Content Section (our story)
3. Why Choose Section (our values)
4. Testimonials Carousel (customer success)
5. CTA Section (get in touch)
```

---

## 🎯 Quick Tips

### Icons
- Path format: `/icons/SVG/category/name.svg`
- Example: `/icons/SVG/interface/shield.svg`

### Colors
Standard palette with matching text colors:
- Yellow: `#fff2b2` / `#5e5515`
- Green: `#bbe7be` / `#114e0b`
- Blue: `#aad5fc` / `#0f1720`
- Purple: `#d7d0ff` / `#3b0b5e`

### Images
- Store in: `frontend/public/images/`
- Path format: `/images/filename.jpg`
- Optimize before upload (< 1MB)

### SEO
- Meta Description: 150-160 characters
- Meta Keywords: 5-10 keywords
- Page Title: 50-60 characters

---

## 🔗 API Examples

### Fetch Page by Slug

```javascript
fetch('http://localhost:1337/api/pages?filters[slug][$eq]=home&populate[sections][populate]=*')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Fetch All Testimonials

```javascript
fetch('http://localhost:1337/api/testimonials?filters[siteId][$eq]=geldgeregeld')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Fetch Navigation

```javascript
fetch('http://localhost:1337/api/navigation-items?filters[siteId][$eq]=geldgeregeld&sort=order:asc')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🐛 Common Issues

**Problem**: Component not showing in Dynamic Zone  
**Solution**: Check `page/schema.json` includes component, restart Strapi

**Problem**: API returns empty  
**Solution**: Check siteId filter, ensure content is Published

**Problem**: Images not loading  
**Solution**: Verify path starts with `/`, check file exists in `public/`

---

## 📚 Full Documentation

See `STRAPI_CMS_GUIDE.md` for complete reference.

---

## ✅ Checklist for New Page

- [ ] Create page entry in Strapi
- [ ] Set siteId, slug, title
- [ ] Add meta description and keywords
- [ ] Add sections (Hero, Content, CTA minimum)
- [ ] Add images with alt text
- [ ] Preview via API
- [ ] Publish
- [ ] Test on frontend
- [ ] Check mobile responsive
- [ ] Verify SEO tags

---

**Need Help?** Check the full guide in `STRAPI_CMS_GUIDE.md`

