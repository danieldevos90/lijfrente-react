# Navigation Items Public Permissions Setup

## What Was Changed

1. ✅ **Removed fallback navigation** - Navigation now only uses Strapi data
2. ✅ **Updated `getNavigationItems()`** - Now fetches without authentication (public endpoint)
3. ✅ **Deployed to Vercel** - Code changes are live

## Required: Enable Public Permissions in Strapi

Navigation items need to be made public in Strapi Admin. Follow these steps:

### Option 1: Via Strapi Admin Panel (Recommended)

1. **Go to Strapi Admin:**
   - Visit: https://bright-smile-1f47bc9d67.strapiapp.com/admin
   - Login with your admin credentials

2. **Navigate to Permissions:**
   - Go to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**

3. **Enable Navigation-Item Permissions:**
   - Find **Navigation-item** section
   - Check the boxes for:
     - ✅ **find** (allows listing navigation items)
     - ✅ **findOne** (allows getting a single navigation item)
   - **Save**

4. **Verify:**
   - Test the public endpoint:
     ```
     https://bright-smile-1f47bc9d67.strapiapp.com/api/navigation-items?filters[siteId][$eq]=geldgeregeld&sort=order:asc
     ```
   - Should return JSON with navigation items (no authentication needed)

### Option 2: Via Bootstrap Code (Automatic)

The bootstrap code in `cms/src/index.ts` already includes navigation-item permissions. If you restart/redeploy the Strapi CMS, it should automatically enable these permissions.

**To trigger bootstrap:**
- Restart your Strapi instance, or
- Redeploy the CMS if using Strapi Cloud

### Option 3: Via API Script

Run the script (requires valid admin token):
```bash
export STRAPI_API_TOKEN='your-admin-token-here'
python3 scripts/enable_navigation_permissions.py
```

## Verify It's Working

After enabling permissions, test:

1. **Public endpoint test:**
   ```bash
   curl "https://bright-smile-1f47bc9d67.strapiapp.com/api/navigation-items?filters[siteId][$eq]=geldgeregeld&sort=order:asc"
   ```
   Should return JSON data without authentication.

2. **Check your website:**
   - Visit: https://geldgeregeld.nl
   - Navigation menu should appear in the header
   - If navigation items exist in Strapi, they will show

## Current Status

- ✅ Code updated to use public endpoint
- ✅ Fallback navigation removed
- ⚠️ **Permissions need to be enabled in Strapi Admin** (see steps above)

## Troubleshooting

**If navigation doesn't show:**

1. Check if navigation items exist in Strapi:
   - Go to: Content Manager → Navigation-item
   - Verify items exist with `siteId: geldgeregeld`

2. Check permissions:
   - Settings → Users & Permissions Plugin → Roles → Public
   - Ensure `find` and `findOne` are enabled for Navigation-item

3. Test public endpoint:
   - Should return data without authentication
   - If 401/403 error, permissions are not enabled

4. Check browser console:
   - Look for errors fetching navigation
   - Network tab should show successful request to `/api/navigation-items`
