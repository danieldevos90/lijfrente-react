# Quick Image Assignment Guide

## Problem
Testimonials are showing old images because images haven't been assigned in Strapi yet.

## Solution: Manually Assign Images in Strapi Admin

### Step 1: Open Strapi Admin
Go to: **https://bright-smile-1f47bc9d67.strapiapp.com/admin**

### Step 2: Navigate to Testimonials
1. Click **Content Manager** in the left sidebar
2. Click **Collection Types**
3. Click **Testimonial**

### Step 3: Assign Images
For each testimonial:

1. **Click on a testimonial** to open it
2. **Scroll to the "Image" field**
3. **Click "Select an entry"** or the media picker button
4. **Browse or search** for images (look for images named `profile_*.jpg`)
5. **Select an image** from the recent uploads
6. **Click "Save"** (top right)
7. **Click "Publish"** if needed

### Quick Access Links

You can also use these direct links (replace `{documentId}` with the testimonial's documentId):

```
https://bright-smile-1f47bc9d67.strapiapp.com/admin/content-manager/collection-types/api::testimonial.testimonial/{documentId}
```

### Images Available
✅ **114 profile images** are uploaded and ready
✅ They're named: `profile_*.jpg`
✅ Uploaded recently (IDs 73-114+)

### After Assigning Images
Once images are assigned:
1. The homepage will automatically fetch them from Strapi
2. Images will appear on the frontend
3. No code changes needed - just refresh the page

## Alternative: Fix API Permissions

If you want to automate this, fix Strapi permissions:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Authenticated**
2. Find **Testimonial** section
3. Enable **Update** permission
4. Check field-level permissions for **image** field
5. Then run: `python3 scripts/fix_testimonial_image_permissions.py`
