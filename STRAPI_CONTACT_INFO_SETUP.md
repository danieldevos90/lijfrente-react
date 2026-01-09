# Strapi Contact Information Setup Guide

## Overview
All contact information (email, phone, KVK) has been migrated to Strapi CMS. Components now fetch this data dynamically from Strapi instead of using hardcoded values.

## Changes Made

### 1. Schema Updates
- ✅ Added `email`, `phone`, and `kvkNumber` fields to `cms/src/api/site/content-types/site/schema.json`

### 2. Components Updated
- ✅ `ContactInfo.tsx` - Fetches email, phone, KVK from Strapi
- ✅ `Footer.tsx` - Uses Strapi data for contact info
- ✅ `ContactDetailsSection.tsx` - Fetches address from Strapi
- ✅ `PrivacyEmail.tsx` - New component for dynamic privacy email
- ✅ `KvkNumber.tsx` - New component for dynamic KVK display
- ✅ `SchemaMarkup.tsx` - Fetches email from Strapi for SEO

### 3. API Routes Updated
- ✅ `app/api/contact/route.ts` - Fetches email from Strapi
- ✅ `app/api/leads/route.ts` - Fetches email from Strapi

### 4. Pages Updated
- ✅ `app/privacy/page.tsx` - Uses `<PrivacyEmail />` component
- ✅ `app/algemene-voorwaarden/page.tsx` - Uses `<KvkNumber />` component

## Setup Steps

### Step 1: Rebuild/Deploy CMS
The schema changes need to be deployed to Strapi before the fields will be available:

```bash
cd cms
npm run build
# Then deploy to Strapi Cloud or your hosting
```

### Step 2: Update Strapi Content
After the CMS is rebuilt, run the update script:

```bash
export STRAPI_TOKEN='your-valid-token-here'
python3 scripts/update_site_contact_info.py
```

Or manually update via Strapi Admin:
1. Go to Strapi Admin Panel
2. Navigate to Content Manager > Site
3. Find the "geldgeregeld" site entry
4. Add/update:
   - `email`: `info@geldgeregeld.nl`
   - `phone`: `020-1234567`
   - `kvkNumber`: `64859525`
5. Save and publish

### Step 3: Verify
After updating Strapi:
1. Check that components display the correct contact info
2. Verify API routes use Strapi email
3. Test contact form submissions

## Fallback Behavior
All components have fallback values that will be used if Strapi is unavailable:
- Email: `info@geldgeregeld.nl`
- Phone: `020-1234567`
- KVK: `64859525`

## Token Issues
If you get 401 errors when running the script:
1. Verify your token is valid and not expired
2. Check token permissions in Strapi Admin
3. Generate a new API token if needed:
   - Go to Strapi Admin > Settings > API Tokens
   - Create new token with "Full access" or appropriate permissions
   - Use this token in the script

## Files Modified
- `cms/src/api/site/content-types/site/schema.json` - Schema definition
- `frontend/lib/get-site-contact-info.ts` - Helper function (NEW)
- `frontend/components/PrivacyEmail.tsx` - Privacy email component (NEW)
- `frontend/components/KvkNumber.tsx` - KVK component (NEW)
- `scripts/update_site_contact_info.py` - Update script (NEW)
- Various components and API routes updated to use Strapi data
