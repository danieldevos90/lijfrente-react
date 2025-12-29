# Troubleshooting Sector Pages API Issues

## Problem
Getting 405 "Method Not Allowed" when trying to POST to `/api/sector-pages`

## Root Cause
The `sector-page` content type exists, but POST/PUT/DELETE permissions are not enabled for the Public role.

## Solution Options

### Option 1: Enable Permissions via Strapi Admin (Recommended)

1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Find **Sector-page** section
4. Enable these permissions:
   - ✅ `find`
   - ✅ `findOne`
   - ✅ `create`
   - ✅ `update`
5. Click **Save**

### Option 2: Restart Strapi (If Option 1 doesn't work)

The bootstrap code in `cms/src/index.ts` should automatically enable permissions on startup. If permissions aren't working:

1. Restart Strapi CMS
2. Wait for bootstrap to run
3. Try the script again

### Option 3: Use Admin Token (Advanced)

If you have an admin token, you can use it instead of the API token for write operations. However, this is less secure for automated scripts.

## Verification

After enabling permissions, test with:

```bash
python3 -c "
import requests
STRAPI_URL = 'https://bright-smile-1f47bc9d67.strapiapp.com'
STRAPI_TOKEN = 'YOUR_TOKEN'
HEADERS = {'Authorization': f'Bearer {STRAPI_TOKEN}', 'Content-Type': 'application/json'}
test_data = {'data': {'siteId': 'geldgeregeld', 'sectorSlug': 'test', 'sectorName': 'Test'}}
r = requests.post(f'{STRAPI_URL}/api/sector-pages', headers=HEADERS, json=test_data, timeout=30)
print(f'Status: {r.status_code}')
print(r.text[:200] if r.status_code != 200 else 'Success!')
"
```

Status 200 or 201 = Success ✅

## Current Status

- ✅ Content type exists
- ✅ Bootstrap code includes permissions
- ❌ Permissions not enabled in Strapi Cloud
- ✅ API token can create other content (pages)

## Next Steps

1. Enable permissions via Strapi Admin (Option 1)
2. Run the generate script: `python3 scripts/generate_sector_pages_unsplash.py`
3. Verify pages are created
