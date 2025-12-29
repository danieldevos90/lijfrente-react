# Strapi Update Guide

## Updating Strapi via CLI/API

Since this project uses **Strapi Cloud**, you cannot directly run CLI commands on the cloud instance. However, you can update Strapi in several ways:

## Method 1: Bootstrap Code (Automatic)

The bootstrap code in `cms/src/index.ts` automatically enables permissions when Strapi starts. This includes sector-page permissions.

**To trigger a rebuild:**
1. Make sure `cms/src/index.ts` is committed and pushed
2. Strapi Cloud will automatically rebuild on git push
3. The bootstrap function will run and enable permissions

**Check if bootstrap code is up to date:**
```bash
git log --oneline -5 -- cms/src/index.ts
```

## Method 2: API Script (Manual)

Use the Python script to update permissions via API:

```bash
python3 scripts/update_strapi_permissions.py
```

**Note:** This may not work if Strapi Cloud has restrictions on permission updates via API.

## Method 3: Strapi Admin UI (Recommended for Strapi Cloud)

1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
3. Find **Sector-page** section
4. Enable:
   - ✅ `find`
   - ✅ `findOne`
   - ✅ `create`
   - ✅ `update`
5. Click **Save**

## Method 4: Local Development

If running Strapi locally:

```bash
cd cms
npm run develop
# or
npm run build
npm run start
```

The bootstrap code will run automatically on startup.

## Current Status

- ✅ Bootstrap code includes sector-page permissions (lines 67-70 in `cms/src/index.ts`)
- ✅ API script created (`scripts/update_strapi_permissions.py`)
- ⚠️ Permissions may need manual enablement in Strapi Cloud admin UI

## Verification

After updating, test with:

```bash
python3 scripts/generate_sector_pages_unsplash.py
```

Or manually test:

```bash
python3 -c "
import requests
STRAPI_URL = 'https://bright-smile-1f47bc9d67.strapiapp.com'
STRAPI_TOKEN = 'YOUR_TOKEN'
HEADERS = {'Authorization': f'Bearer {STRAPI_TOKEN}', 'Content-Type': 'application/json'}
test_data = {'data': {'siteId': 'geldgeregeld', 'sectorSlug': 'test', 'sectorName': 'Test'}}
r = requests.post(f'{STRAPI_URL}/api/sector-pages', headers=HEADERS, json=test_data, timeout=30)
print(f'Status: {r.status_code}')
print('✅ Success!' if r.status_code in [200, 201] else f'Response: {r.text[:200]}')
"
```

Status 200 or 201 = Permissions are working ✅
