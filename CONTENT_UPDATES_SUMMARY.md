# Content Updates Summary

This document summarizes the content changes made to the site.

## Changes Made

### 1. Address Update ✅
- **Changed from:** Herengracht 282, 1016 BX Amsterdam
- **Changed to:** Roggestraat 7, 7311 ca apeldoorn
- **Files updated:**
  - `scripts/populate_strapi_content.py` - Updated default address in site footer
  - `frontend/app/algemene-voorwaarden/page.tsx` - Updated hardcoded address

### 2. "Over Ons" Page Title ✅
- **Changed from:** "Over Ons - Zakelijke Financieringen"
- **Changed to:** "Specialist in zakelijke financieringen"
- **Files updated:**
  - `scripts/update_about_page.py` - Updated page title and meta description

### 3. Copy Changed from "I" to "We" Form ✅
- **Changes:**
  - "Erik de Vos richt zich" → "Wij richten ons"
  - "Hij helpt" → "Wij helpen"
  - "Erik verdiept zich" → "Wij verdiepen ons"
  - "denkt mee" → "denken mee"
  - "begeleidt" → "begeleiden"
  - "Erik vertaalt" → "Wij vertalen"
  - "Erik kijkt" → "Wij kijken"
  - "de ondernemer" → "ondernemers" (where appropriate)
- **Files updated:**
  - `scripts/update_about_page.py` - Updated content section and benefits descriptions

### 4. Years Updated ✅
- **Changed from:** "Meer dan tien jaar" / "Meer dan 10 jaar"
- **Changed to:** "25 jaar"
- **Files updated:**
  - `scripts/update_about_page.py` - Updated benefit description

### 5. "Waarom kiezen voor..." Title ✅
- **Changed from:** "Waarom kiezen voor Erik de Vos en Jan Dijkerman?"
- **Changed to:** "Waarom kiezen voor geldgeregeld.nl"
- **Files updated:**
  - `scripts/update_about_page.py` - Updated why-choose section title

### 6. Team Member Roles ✅
- **Changed from:** 
  - Erik de Vos: "Oprichter & CEO"
  - Jan Dijkerman: "Mede-oprichter & CFO"
- **Changed to:** 
  - Both: "mede-oprichter/consultant"
- **Files updated:**
  - `scripts/create_team_members.py` - Updated team member roles

## How to Apply Changes

### Option 1: Run Update Script (Recommended)
```bash
# Set your Strapi API token
export STRAPI_TOKEN='your-token-here'
# Or
export STRAPI_API_TOKEN='your-token-here'

# Run the update script
python3 scripts/update_site_content.py
```

### Option 2: Run Individual Scripts
```bash
# Update About Us page
python3 scripts/update_about_page.py

# Update team members
python3 scripts/create_team_members.py

# Update site address (via populate script)
python3 scripts/populate_strapi_content.py
```

### Option 3: Manual Update in Strapi Admin
1. Go to https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to **Content Manager**
3. Update:
   - **Site** → Update address fields
   - **Page** → Find "over-ons" page and update content
   - **Team Members** → Update roles for Erik de Vos and Jan Dijkerman

## Notes

- The hardcoded address in `frontend/app/algemene-voorwaarden/page.tsx` has been updated directly
- All other changes require a valid Strapi API token to apply via API
- The scripts are ready to run - they just need a valid token in the environment

## Verification

After applying changes, verify:
1. Footer shows new address: Roggestraat 7, 7311 ca apeldoorn
2. "Over Ons" page title is "Specialist in zakelijke financieringen"
3. Content uses "we" form instead of "I" form
4. Benefits mention "25 jaar" instead of "10 jaar"
5. Why choose section title is "Waarom kiezen voor geldgeregeld.nl"
6. Team members show "mede-oprichter/consultant" as role
