# Manual Content Type Setup for Strapi Cloud

Since Strapi Cloud doesn't automatically register content types from schema files, you need to create them manually in the Strapi Admin UI.

## Step 1: Create Components First

Before creating the content type, create the components it uses:

### Component 1: Use Case (`sectors.use-case`)

1. Go to: **Content-Type Builder** → **Components**
2. Click: **Create new component**
3. Category: Create new category `sectors` (or select existing)
4. Display name: `Use Case`
5. Click: **Continue**

Add these fields:
- **title** (Text, Required)
- **description** (Long text, Required)
- **iconPath** (Text, Optional)
- **color** (Text, Optional, Default: `#fff2b2`)
- **textColor** (Text, Optional, Default: `#1e2021`)

Click **Finish**

### Component 2: Benefit (`sectors.benefit`)

1. Go to: **Content-Type Builder** → **Components**
2. Click: **Create new component**
3. Category: `sectors`
4. Display name: `Sector Benefit`
5. Click: **Continue**

Add these fields:
- **title** (Text, Required)
- **description** (Long text, Required)
- **iconPath** (Text, Optional)
- **color** (Text, Optional, Default: `#fff2b2`)
- **textColor** (Text, Optional, Default: `#1e2021`)

Click **Finish**

## Step 2: Create Content Type

1. Go to: **Content-Type Builder** → **Collection Types**
2. Click: **Create new collection type**
3. Display name: `Sector Page`
4. API ID (singular): `sector-page`
5. API ID (plural): `sector-pages`
6. Click: **Continue**

### Add Required Fields:

1. **siteId**
   - Type: **Text**
   - Required: ✅ Yes
   - Description: Multi-site identifier

2. **sectorSlug**
   - Type: **UID**
   - Required: ✅ Yes
   - Target field: `sectorName`
   - Description: URL-friendly sector identifier

3. **sectorName**
   - Type: **Text**
   - Required: ✅ Yes
   - Description: Display name of the sector

### Add Optional Fields:

4. **metaDescription** (Long text)
5. **metaKeywords** (Text)
6. **heroTitle** (Text)
7. **heroSubtitle** (Long text)
8. **heroImage** (Media, Single, Images only)
9. **easyLendingTitle** (Text)
10. **easyLendingContent** (Rich text)
11. **easyLendingImage** (Media, Single, Images only)
12. **easyLendingImagePosition** (Enumeration)
    - Values: `left`, `right`, `top`
    - Default: `left`
13. **useCasesTitle** (Text)
14. **useCasesSubtitle** (Long text)
15. **useCases** (Component)
    - Component: `sectors.use-case`
    - Repeatable: ✅ Yes
16. **benefitsTitle** (Text)
17. **benefitsSubtitle** (Long text)
18. **benefits** (Component)
    - Component: `sectors.benefit`
    - Repeatable: ✅ Yes
19. **ctaTitle** (Text)
20. **ctaSubtitle** (Long text)
21. **ctaLabel** (Text, Default: `Vraag financiering aan`)
22. **ctaHref** (Text, Default: `/lead`)

### Enable Draft & Publish:

- In the content type settings, enable **Draft & Publish**

Click **Save**

## Step 3: Enable Permissions

1. Go to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Scroll to **Sector-page** section
3. Enable:
   - ✅ **find**
   - ✅ **findOne**
   - ✅ **create**
   - ✅ **update**
4. Click **Save**

## Step 4: Create Content

After permissions are enabled, run:

```bash
python3 scripts/create_sector_page.py
```

This will create the Horeca sector page with complete content.

## Verify

Visit: http://localhost:3003/sectoren/horeca

The page should display all sections with content from Strapi.

