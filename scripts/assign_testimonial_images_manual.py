#!/usr/bin/env python3
"""
Generate a mapping of testimonials to uploaded images for manual assignment
Since the API rejects image field updates, this helps with manual assignment
"""

import os
import requests
import sys
from pathlib import Path
from datetime import datetime, timedelta

def load_env_file(env_path):
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")
    return env_vars

cms_env_path = Path(__file__).parent.parent / 'cms' / '.env'
env_vars = load_env_file(cms_env_path)
frontend_env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
frontend_env_vars = load_env_file(frontend_env_path)
env_vars.update(frontend_env_vars)

for key, value in env_vars.items():
    if key not in os.environ:
        os.environ[key] = value

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Missing STRAPI_TOKEN (or STRAPI_API_TOKEN). Refusing to run without an explicit token.", file=sys.stderr)
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def get_testimonials():
    """Fetch all testimonials"""
    url = f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&populate=*&pagination[limit]=1000"
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'}, timeout=30)
        if response.status_code == 200:
            return response.json().get('data', [])
    except Exception as e:
        print(f"Error fetching testimonials: {e}")
    return []

def get_recent_profile_images(limit=150):
    """Get recently uploaded profile images"""
    url = f"{STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]={limit}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            images = data.get('data', []) if isinstance(data, dict) else data if isinstance(data, list) else []
            # Return all recent images (they're profile images from our script)
            return images
    except Exception as e:
        print(f"Error fetching images: {e}")
    return []

print("=" * 80)
print("📋 TESTIMONIAL TO IMAGE ASSIGNMENT GUIDE")
print("=" * 80)
print(f"\nStrapi URL: {STRAPI_URL}")
print(f"Site ID: {SITE_ID}\n")

testimonials = get_testimonials()
recent_images = get_recent_profile_images(150)

print(f"✅ Found {len(testimonials)} testimonials")
print(f"✅ Found {len(recent_images)} uploaded profile images\n")

# Filter testimonials that need images
testimonials_needing_images = []
for testimonial in testimonials:
    if 'attributes' in testimonial:
        attrs = testimonial.get('attributes', {})
    else:
        attrs = testimonial
    
    has_image = False
    if attrs.get('image'):
        img_data = attrs.get('image')
        if isinstance(img_data, dict):
            if img_data.get('data') or img_data.get('id') or img_data.get('documentId'):
                has_image = True
    
    if not has_image:
        testimonials_needing_images.append(testimonial)

print("=" * 80)
print(f"ASSIGNMENT MAPPING ({len(testimonials_needing_images)} testimonials need images):")
print("=" * 80)

for i, testimonial in enumerate(testimonials_needing_images[:len(recent_images)], 1):
    if 'attributes' in testimonial:
        attrs = testimonial.get('attributes', {})
    else:
        attrs = testimonial
    
    name = attrs.get('name', 'Unknown')
    company = attrs.get('company', '')
    doc_id = testimonial.get('documentId') or testimonial.get('id')
    numeric_id = testimonial.get('id')
    
    if i <= len(recent_images):
        image = recent_images[i-1]
        image_id = image.get('id')
        image_doc_id = image.get('documentId')
        image_url = image.get('url', '')
        image_name = image.get('name', '')
        
        admin_url = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
        
        print(f"\n{i}. {name} ({company})")
        print(f"   └─ Testimonial DocumentID: {doc_id}")
        print(f"   └─ Testimonial Numeric ID: {numeric_id}")
        print(f"   └─ Image ID: {image_id}")
        print(f"   └─ Image DocumentID: {image_doc_id}")
        print(f"   └─ Image Name: {image_name}")
        if image_url:
            print(f"   └─ Image URL: {image_url}")
        print(f"   └─ Admin Link: {admin_url}")

print("\n" + "=" * 80)
print("🔧 HOW TO FIX THE API ISSUE:")
print("=" * 80)
print("""
The REST API is rejecting image field updates with "Invalid key image" error.
This suggests the image field might be read-only or permissions need to be updated.

TO FIX:
1. Go to Strapi Admin: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to Settings → Users & Permissions Plugin → Roles → Authenticated
3. Find "Testimonial" permissions
4. Ensure "Update" permission is enabled
5. Check if there are field-level permissions - ensure "image" field is writable

OR manually assign images using the mapping above.
""")

print("\n" + "=" * 80)
print("📝 MANUAL ASSIGNMENT STEPS:")
print("=" * 80)
print("""
1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to: Content Manager → Collection Types → Testimonial
3. For each testimonial listed above:
   a. Click on the testimonial (use the Admin Link provided)
   b. Scroll to the "Image" field
   c. Click "Select an entry" or the media picker
   d. Search for the Image ID shown above (or browse recent uploads)
   e. Select the image
   f. Click "Save" (top right)
   g. Click "Publish" if needed

The images are already uploaded and ready - you just need to link them!
""")

print("\n" + "=" * 80)
