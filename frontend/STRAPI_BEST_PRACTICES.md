# Strapi Integration Best Practices

## 🔒 Security Best Practices

### 1. API Token Management

✅ **DO:**
- Store tokens in environment variables only (never in code)
- Use different tokens for different environments (dev/staging/prod)
- Use **Read-only** tokens when possible (more secure)
- Rotate tokens regularly (every 90 days recommended)
- Set token expiration dates when creating them
- Use separate tokens for different services/apps

❌ **DON'T:**
- Commit tokens to git (even in comments)
- Hardcode tokens in source code
- Share tokens via email/chat
- Use the same token for all environments
- Use Full-access tokens when Read-only is sufficient

### 2. Environment Variables

✅ **DO:**
- Use `.env.local` for local development (gitignored)
- Set all required variables in Vercel for each environment
- Use descriptive variable names (`STRAPI_API_TOKEN` not `TOKEN`)
- Document required variables in `ENV_STATUS.md`
- Verify variables are set before deployment

❌ **DON'T:**
- Commit `.env.local` to git
- Use `.env` files (use `.env.local` instead)
- Share environment files
- Use production tokens in development

### 3. Client vs Server-Side API Calls

✅ **DO:**
- Use **API routes** (`/api/*`) for client-side Strapi calls
- Keep tokens server-side only (never expose to browser)
- Use `process.env.STRAPI_API_TOKEN` (server-side only)
- Use `NEXT_PUBLIC_*` prefix only for public, non-sensitive values

❌ **DON'T:**
- Call Strapi directly from client components
- Use `NEXT_PUBLIC_STRAPI_API_TOKEN` (exposes token to browser)
- Fetch Strapi from `useEffect` without API route proxy
- Expose API tokens in client-side code

## 🏗️ Architecture Best Practices

### 1. API Route Pattern

**✅ Recommended Pattern:**

```typescript
// frontend/app/api/strapi/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // Server-side only!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  
  // Validate input
  if (!siteId) {
    return NextResponse.json({ error: 'siteId required' }, { status: 400 });
  }
  
  // Build Strapi URL
  const url = `${STRAPI_URL}/api/resource?filters[siteId][$eq]=${siteId}`;
  
  // Add auth header
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }
  
  try {
    const response = await fetch(url, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      console.error('Strapi API error:', response.status);
      return NextResponse.json(
        { error: `Strapi API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### 2. Client Component Pattern

**✅ Recommended Pattern:**

```typescript
// frontend/app/SomeClientComponent.tsx
"use client";
import { useState, useEffect } from 'react';

export default function SomeClientComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Use API route, not direct Strapi call
        const response = await fetch('/api/strapi/resource?siteId=xxx');
        
        if (!response.ok) {
          throw new Error(`Failed: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      }
    }
    
    fetchData();
  }, []);
  
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### 3. Server Component Pattern

**✅ Recommended Pattern:**

```typescript
// frontend/app/SomeServerComponent.tsx
import { getPageBySlug } from '@/lib/strapi-cms';

export default async function SomeServerComponent() {
  // ✅ Direct call is OK in server components
  const page = await getPageBySlug('home', 'geldgeregeld');
  
  if (!page) {
    return <div>Page not found</div>;
  }
  
  return <div>{/* Render page */}</div>;
}
```

## 📝 Code Organization Best Practices

### 1. File Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── strapi/          # ✅ API routes for client-side calls
│   │       ├── navigation/
│   │       ├── pages/
│   │       └── sector-pages/
│   └── [pages].tsx          # Server components
├── lib/
│   └── strapi-cms.ts        # ✅ Server-side Strapi utilities
├── components/
│   └── [ClientComponents].tsx  # Client components using API routes
└── .env.local               # ✅ Local environment variables (gitignored)
```

### 2. Error Handling

**✅ Recommended Pattern:**

```typescript
// Always handle errors gracefully
try {
  const data = await fetchStrapi('/endpoint');
  if (!data) {
    // Handle null/empty response
    return fallbackData;
  }
  return data;
} catch (error) {
  console.error('Strapi fetch error:', error);
  // Return fallback or null, don't crash the app
  return null;
}
```

### 3. Type Safety

**✅ Recommended Pattern:**

```typescript
// Use TypeScript types from Strapi
import { StrapiPage, StrapiNavigationItem } from '@/types/strapi-cms';

// Type your API responses
interface ApiResponse {
  data: StrapiPage[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
```

## 🔄 Deployment Best Practices

### 1. Environment Variable Checklist

Before deploying, verify:

```bash
# Check all required variables are set
vercel env ls | grep -E "(STRAPI|NEXT_PUBLIC_STRAPI)"

# Should show:
# STRAPI_API_TOKEN           (all environments)
# NEXT_PUBLIC_STRAPI_URL     (all environments)
```

### 2. Pre-Deployment Testing

```bash
# Test locally first
cd frontend
npm run dev

# Test API routes
curl http://localhost:3000/api/strapi/navigation?siteId=test

# Test with production-like environment
vercel env pull .env.local
npm run build
```

### 3. Deployment Process

1. ✅ Verify environment variables in Vercel
2. ✅ Test locally with production env vars
3. ✅ Deploy to Preview first
4. ✅ Test Preview deployment
5. ✅ Deploy to Production
6. ✅ Monitor logs for errors

## 🛡️ Security Checklist

### Pre-Commit Checklist

- [ ] No API tokens in code
- [ ] No `.env.local` committed
- [ ] No hardcoded credentials
- [ ] All sensitive values use `process.env.*`
- [ ] Client-side code uses API routes, not direct Strapi calls

### Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Tokens are valid and not expired
- [ ] Using Read-only tokens when possible
- [ ] Error handling doesn't expose sensitive info
- [ ] API routes validate input
- [ ] Rate limiting considered (if needed)

## 📊 Monitoring Best Practices

### 1. Error Logging

```typescript
// Log errors with context, but not sensitive data
console.error('Strapi API error:', {
  status: response.status,
  endpoint: endpoint,
  // ❌ Don't log: token, full request body, user data
});
```

### 2. Health Checks

```typescript
// Create health check endpoint
// app/api/health/route.ts
export async function GET() {
  const strapiHealthy = await checkStrapiHealth();
  return NextResponse.json({
    status: strapiHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
  });
}
```

## 🚀 Performance Best Practices

### 1. Caching Strategy

```typescript
// Server components - use revalidation
const page = await getPageBySlug('home', siteId, {
  next: { revalidate: 3600 } // Cache for 1 hour
});

// API routes - use appropriate cache headers
export async function GET() {
  const data = await fetchStrapi('/endpoint');
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

### 2. Request Optimization

```typescript
// ✅ Only fetch what you need
const endpoint = `/pages?filters[slug][$eq]=${slug}&fields=title,slug`;

// ✅ Use pagination for large datasets
const endpoint = `/pages?pagination[pageSize]=10&pagination[page]=1`;

// ✅ Populate only needed relations
const endpoint = `/pages?populate[sections][populate]=title,content`;
```

## 📚 Documentation Best Practices

### 1. Document Environment Variables

Keep `ENV_STATUS.md` updated with:
- Required variables
- Optional variables
- How to set them
- What they're used for

### 2. Document API Routes

```typescript
/**
 * GET /api/strapi/navigation
 * 
 * Fetches navigation items from Strapi for a given site.
 * 
 * @param siteId - Site identifier (required)
 * @returns Navigation items array
 * 
 * @example
 * GET /api/strapi/navigation?siteId=geldgeregeld
 */
```

## ✅ Summary: Quick Reference

| Practice | ✅ Good | ❌ Bad |
|----------|---------|--------|
| Token Storage | Environment variables | Hardcoded in code |
| Client Calls | API routes (`/api/*`) | Direct Strapi calls |
| Error Handling | Graceful fallbacks | Throwing errors |
| Token Type | Read-only when possible | Always Full-access |
| Environment | Separate per env | Same for all |
| Documentation | Keep updated | Outdated docs |
| Testing | Test before deploy | Deploy untested |

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
