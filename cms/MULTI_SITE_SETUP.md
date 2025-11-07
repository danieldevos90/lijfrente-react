
# Multi-Site Strapi Configuration

## Overview

This Strapi instance is configured for multi-site/multi-domain support. Each site has its own content filtered by `siteId`.

## Current Sites

1. **GeldGeregeld** (`siteId: geldgeregeld`)
   - Domain: geldgeregeld.nl
   - Primary site for business loans

## Adding a New Site

### 1. Create Site Entry

```javascript
{
  "data": {
    "siteId": "newsite",
    "name": "New Site Name",
    "domain": "newsite.com"
  }
}
```

### 2. Create Content for New Site

All content types support `siteId`:
- Pages
- Navigation Items
- Testimonials
- Token Sets

Example:
```javascript
{
  "data": {
    "siteId": "newsite",
    "slug": "home",
    "title": "Homepage for New Site",
    ...
  }
}
```

### 3. Frontend Integration

```typescript
// Fetch content for specific site
const page = await getPageBySlug('home', 'newsite');
const nav = await getNavigationItems('newsite');
```

## API Filtering

All API calls should filter by siteId:

```
GET /api/pages?filters[siteId][$eq]=geldgeregeld
GET /api/testimonials?filters[siteId][$eq]=geldgeregeld
GET /api/navigation-items?filters[siteId][$eq]=geldgeregeld
```

## Benefits

- ✅ **Single CMS** for multiple brands/domains
- ✅ **Shared infrastructure** reduces costs
- ✅ **Centralized management** for efficiency
- ✅ **Independent content** per site
- ✅ **Flexible scaling** add sites easily

## Security

Each site's content is isolated by siteId. API tokens can be scoped per site if needed.
