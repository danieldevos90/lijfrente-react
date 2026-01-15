# Populate New Sectors to Strapi - Instructions

## ✅ What Was Created

A comprehensive Python script (`scripts/populate_new_sectors.py`) that creates content for all 8 new sectors in Strapi:

1. **zzp** - ZZP (Zelfstandigen zonder Personeel)
2. **starters** - Starters & Startups
3. **franchise** - Franchise
4. **medisch** - Medische Praktijken
5. **tandarts** - Tandartspraktijken
6. **groothandel** - Groothandel
7. **schoonheid** - Schoonheidsindustrie
8. **kasstroom** - Kasstroom & Werkkapitaal

## 📋 Content Included for Each Sector

Each sector page includes:
- ✅ SEO metadata (title, description, keywords)
- ✅ Hero section (title, subtitle)
- ✅ Quote section
- ✅ Easy lending section (explaining the process)
- ✅ 4 use cases with descriptions
- ✅ 4 benefits with icons
- ✅ CTA section

## 🚀 How to Run

### Step 1: Get Your Strapi API Token

1. Visit: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Go to: **Settings → API Tokens**
3. Click **Create new API Token**
4. Fill in:
   - **Name**: `Sector Pages API Token`
   - **Token type**: `Full-access` (needed to create/update content)
   - **Token duration**: `Unlimited` (or set expiration)
5. Click **Save**
6. **Copy the token** (you'll only see it once!)

### Step 2: Run the Script

**Option A: Run with token inline**
```bash
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/lijfrente-react
STRAPI_API_TOKEN=your-token-here python3 scripts/populate_new_sectors.py
```

**Option B: Export token first**
```bash
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/lijfrente-react
export STRAPI_API_TOKEN=your-token-here
python3 scripts/populate_new_sectors.py
```

**Option C: Add to .env.local (for future runs)**
```bash
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/lijfrente-react
echo "STRAPI_API_TOKEN=your-token-here" >> .env.local
python3 scripts/populate_new_sectors.py
```

### Step 3: Verify

After running, you should see:
```
✅ Successfully created/updated: 8/8 sectors
🎉 All sectors created successfully!
```

Then verify in Strapi Admin:
- Visit: https://bright-smile-1f47bc9d67.strapiapp.com/admin/content-manager/collection-types/api::sector-page.sector-page
- You should see all 8 new sectors listed

## 📝 What the Script Does

1. **Checks for existing pages**: If a sector page already exists, it updates it. Otherwise, it creates a new one.
2. **Creates comprehensive content**: Each sector gets full content including use cases, benefits, and SEO metadata.
3. **Handles errors gracefully**: Shows clear error messages if something goes wrong.

## 🔍 Troubleshooting

### Error: "STRAPI_API_TOKEN not found"
- Make sure you've set the token as shown in Step 2 above
- Check that there are no extra spaces in the token

### Error: "401 Unauthorized"
- Your token may be expired or invalid
- Create a new token in Strapi Admin
- Make sure the token has **Full-access** permissions (not Read-only)

### Error: "404 Not Found"
- The sector-page content type might not exist in Strapi
- Check that the content type is created in Strapi Admin
- See: `SECTOR_PAGES_STRAPI_GUIDE.md` for setup instructions

### Some sectors fail to create
- Check the error message for details
- The script will continue with other sectors even if one fails
- You can run the script again - it will update existing pages

## 📊 Expected Output

```
================================================================================
🚀 POPULATING NEW SECTORS IN STRAPI
================================================================================

Strapi URL: https://bright-smile-1f47bc9d67.strapiapp.com
Site ID: geldgeregeld
Sectors to create: 8

📄 Processing sector: zzp (ZZP)
--------------------------------------------------------------------------------
  ✅ Created sector page: zzp

📄 Processing sector: starters (Starters & Startups)
--------------------------------------------------------------------------------
  ✅ Created sector page: starters

[... continues for all 8 sectors ...]

================================================================================
📊 SUMMARY
================================================================================

✅ Successfully created/updated: 8/8 sectors

🎉 All sectors created successfully!

🌐 View sectors at: /sectoren/[sector-slug]
📝 Edit in Strapi: https://bright-smile-1f47bc9d67.strapiapp.com/admin/content-manager/collection-types/api::sector-page.sector-page

================================================================================
```

## 🎯 Next Steps

After populating the sectors:

1. **Verify in Strapi**: Check that all sectors are created correctly
2. **Review content**: Edit any content in Strapi Admin if needed
3. **Publish**: Make sure all sector pages are published (not draft)
4. **Test on frontend**: Visit `/sectoren/[sector-slug]` to see the pages
5. **Add images** (optional): Upload hero images and easy lending images in Strapi

## 📄 Files Created

- `scripts/populate_new_sectors.py` - Main script to populate sectors
- `POPULATE_SECTORS_INSTRUCTIONS.md` - This file

## 🔄 Re-running the Script

You can safely run the script multiple times:
- It will **update** existing sector pages
- It will **create** new ones if they don't exist
- No data will be lost

## 💡 Tips

- Keep your API token secure - never commit it to git
- Use environment variables for the token
- The script includes a 1-second delay between requests to avoid rate limiting
- All content is in Dutch and optimized for SEO
