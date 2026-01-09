# Complete SEO Implementation Guide

This guide covers all SEO optimizations implemented for the website.

## ✅ Implemented Features

### 1. Schema Markup (JSON-LD)

#### Organization Schema
- Added to root layout (`app/layout.tsx`)
- Includes company name, URL, logo, contact information
- Helps Google understand your business

#### WebSite Schema
- Includes search action for Google search box
- Added to root layout

#### Service Schema
- Added to all sector pages (`/sectoren/[sector]`)
- Describes financial services per sector
- Includes provider information and area served

#### FinancialProduct Schema
- Added to homepage
- Describes the financial product offering
- Includes amount range, provider, and terms

#### BreadcrumbList Schema
- Added to sector pages and sector listing page
- Helps Google understand site structure
- Improves search result appearance

### 2. Sitemap

**Location:** `/sitemap.xml` (automatically generated)

**Includes:**
- All static pages (home, about, contact, FAQ, etc.)
- All dynamic pages from Strapi CMS
- All sector pages (`/sectoren/[sector]`)
- Proper priority and change frequency
- Last modified dates

**Features:**
- Automatically updates when new pages are added
- Includes fallback for predefined sectors
- Properly handles Strapi API errors gracefully

### 3. Robots.txt

**Location:** `/robots.txt` (automatically generated)

**Configuration:**
- Allows all search engines
- Disallows API routes, password pages, admin areas
- Points to sitemap location
- Optimized for Googlebot

### 4. Enhanced Metadata

**All pages include:**
- Title tags (with site name suffix)
- Meta descriptions (optimized length)
- Keywords (where applicable)
- Canonical URLs
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Proper robots directives

**Sector Pages:**
- Sector-specific titles and descriptions
- Keywords from Strapi or fallback
- Unique canonical URLs
- Optimized for sector-specific searches

### 5. Technical SEO

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Alt text for images (check components)
- ✅ Mobile-responsive design
- ✅ Fast page load times
- ✅ HTTPS (via Vercel)
- ✅ Proper language tag (`lang="nl"`)

## 📋 SEO Checklist

### On-Page SEO

- [x] Unique title tags (50-60 characters)
- [x] Meta descriptions (150-160 characters)
- [x] H1 tags on every page
- [x] Proper heading hierarchy
- [x] Internal linking structure
- [x] Canonical URLs
- [x] Schema markup
- [x] Sitemap.xml
- [x] Robots.txt

### Technical SEO

- [x] Mobile-friendly (responsive design)
- [x] Fast loading times
- [x] HTTPS enabled
- [x] Proper redirects (if needed)
- [x] Clean URLs
- [x] XML sitemap
- [x] Robots.txt

### Content SEO

- [x] Keyword-rich content
- [x] Sector-specific landing pages
- [x] Unique content per page
- [x] Regular content updates (via Strapi)

## 🔧 Google Search Console Setup

### Option 1: Manual Submission

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (website URL)
3. Verify ownership (HTML tag, DNS, or file upload)
4. Go to **Sitemaps** section
5. Submit: `https://yourdomain.com/sitemap.xml`

### Option 2: API Submission (Automated)

#### Using Node.js Script

```bash
# Install dependencies
npm install googleapis

# Set credentials
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Run script
node scripts/submit-sitemap.js
```

#### Using CLI Script

```bash
# Get access token from OAuth Playground
# https://developers.google.com/oauthplayground/
# Select "Search Console API v1" scope

export GOOGLE_SEARCH_CONSOLE_TOKEN=your_token_here
./scripts/submit-sitemap-cli.sh
```

### Option 3: Vercel Integration

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/submit-sitemap",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

## 📊 Monitoring & Analytics

### Google Search Console

Monitor:
- Search performance
- Index coverage
- Mobile usability
- Core Web Vitals
- Sitemap status

### Google Analytics

Track:
- Organic traffic
- Keyword performance
- Page views
- Bounce rate
- Conversion goals

## 🎯 Sector Page SEO Strategy

Each sector page (`/sectoren/[sector]`) is optimized for:

1. **Target Keywords:**
   - Primary: `[sector] financiering`
   - Secondary: `[sector] lening`, `zakelijke financiering [sector]`

2. **Content:**
   - Sector-specific hero title
   - Unique meta description
   - Sector-specific use cases
   - Sector-specific benefits
   - Relevant keywords in content

3. **Schema Markup:**
   - Service schema with sector-specific details
   - Breadcrumb schema for navigation

4. **Internal Linking:**
   - Links from homepage
   - Links from sector listing page
   - Related sectors section

## 🚀 Best Practices

### Title Tags
- Keep under 60 characters
- Include primary keyword
- Include brand name
- Unique per page

### Meta Descriptions
- Keep under 160 characters
- Include call-to-action
- Include primary keyword
- Compelling and descriptive

### Keywords
- Focus on 1-2 primary keywords per page
- Use long-tail keywords for sector pages
- Natural keyword placement
- Avoid keyword stuffing

### Content
- Write for users first, search engines second
- Use natural language
- Include keywords naturally
- Regular updates

### Links
- Internal linking between related pages
- Use descriptive anchor text
- Link to important pages from homepage
- Breadcrumb navigation

## 📝 Next Steps

1. **Submit Sitemap:**
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools

2. **Monitor Performance:**
   - Set up Google Search Console
   - Monitor indexing status
   - Track keyword rankings

3. **Content Optimization:**
   - Review and optimize existing content
   - Add more sector-specific content
   - Create blog/content section

4. **Link Building:**
   - Build quality backlinks
   - Partner with industry sites
   - Guest posting

5. **Technical Improvements:**
   - Monitor Core Web Vitals
   - Optimize images
   - Improve page speed
   - Fix any crawl errors

## 🔍 Testing Tools

- **Google Search Console:** Monitor search performance
- **Google Rich Results Test:** Test schema markup
- **PageSpeed Insights:** Test page speed
- **Mobile-Friendly Test:** Test mobile usability
- **Schema.org Validator:** Validate structured data

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Console Help](https://support.google.com/webmasters)
