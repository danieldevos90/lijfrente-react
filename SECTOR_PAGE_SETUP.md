# Sector Page Setup Guide

## Status

✅ **Components Created:**
- `frontend/components/sections/EasyLendingSection.tsx`
- `frontend/components/sections/UseCasesSection.tsx`
- `frontend/components/sections/CTASection.tsx`
- Updated `frontend/app/sectoren/[sector]/page.tsx` with data normalization

✅ **Schemas Deployed:**
- `cms/src/api/sector-page/content-types/sector-page/schema.json`
- `cms/src/components/sectors/use-case.json`
- `cms/src/components/sectors/benefit.json`

✅ **Permission Scripts:**
- `scripts/enable_sector_permissions.py` - Enables permissions programmatically
- Permissions have been added to Public role

⚠️ **Current Issue:**
The `sector-page` content type may not be fully registered in Strapi Cloud yet, preventing POST requests.

## Manual Setup (if needed)

If the content type doesn't appear automatically:

1. **Go to Strapi Admin:** https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. **Content-Type Builder** → **Create new collection type**
3. **Name:** `sector-page`
4. **Add fields** according to `cms/src/api/sector-page/content-types/sector-page/schema.json`
5. **Save** and **Restart** Strapi

## Enable Permissions

Run the permission script:
```bash
python3 scripts/enable_sector_permissions.py
```

Or manually in Strapi Admin:
1. **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Under **Sector-page**, enable:
   - `find`
   - `findOne`
   - `create`
   - `update`
3. **Save**

## Create Content

Once permissions are enabled:
```bash
python3 scripts/create_sector_page.py
```

This will create the Horeca sector page with complete content.

## Verify

Visit: http://localhost:3003/sectoren/horeca

The page should display:
- Hero section
- Easy Lending section
- Use Cases section
- Benefits section
- CTA section
- Related sectors

