# How to Enable Testimonial Image Updates via API

## Problem
The Strapi REST API is rejecting updates to the `image` field on testimonials with error: **"Invalid key image"**

This means the `image` field is currently read-only or doesn't have write permissions enabled.

## Solution: Enable Image Field Updates in Strapi

### Step 1: Check Content-Type Permissions

1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to: **Settings** → **Users & Permissions Plugin** → **Roles**
3. Click on **Authenticated** (or the role your API token uses)
4. Scroll to find **Testimonial** section
5. Ensure **Update** permission is checked ✅
6. Click **Save**

### Step 2: Check Field-Level Permissions (if available)

Some Strapi versions have field-level permissions:

1. In the same **Roles** → **Authenticated** page
2. Look for **Testimonial** → **Update** section
3. Expand it to see field-level permissions
4. Ensure **image** field has write permission enabled ✅
5. Click **Save**

### Step 3: Verify Content-Type Configuration

1. Go to: **Content-Type Builder**
2. Click on **Testimonial**
3. Click on the **image** field
4. Check if there are any restrictions or read-only settings
5. Ensure the field is configured as **writable**

### Step 4: Run the Update Script

Once permissions are fixed, run:

```bash
python3 scripts/fix_testimonial_image_permissions.py
```

Or use the original script:

```bash
python3 scripts/update_testimonial_images_unsplash.py
```

## Alternative: Manual Assignment

If API updates still don't work, you can manually assign images:

1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to: **Content Manager** → **Collection Types** → **Testimonial**
3. For each testimonial:
   - Click on the testimonial
   - Scroll to **Image** field
   - Click **Select an entry**
   - Choose from recent uploads (114 images available, IDs 73-114+)
   - Click **Save** and **Publish**

## Images Ready for Assignment

✅ **114 profile images** have been uploaded to Strapi
✅ They are available in the media library
✅ They just need to be linked to testimonials

The images are named: `profile_*.jpg` and were uploaded recently.
