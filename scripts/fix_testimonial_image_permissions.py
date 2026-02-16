#!/usr/bin/env python3
"""
Attempt to fix testimonial image field permissions and update images
"""

import os
import requests
import sys
from pathlib import Path

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
    url = f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&pagination[limit]=1000"
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'}, timeout=30)
        if response.status_code == 200:
            return response.json().get('data', [])
    except:
        pass
    return []

def get_recent_images(limit=150):
    url = f"{STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]={limit}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            # Handle both list and dict responses
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return data.get('data', [])
    except Exception as e:
        print(f"Error fetching images: {e}")
    return []

def update_testimonial_with_image(testimonial_id, testimonial_data, image_id, use_numeric_id=False):
    """Try updating testimonial with image - include all fields"""
    url = f"{STRAPI_URL}/api/testimonials/{testimonial_id}"
    
    # Get all testimonial fields
    if 'attributes' in testimonial_data:
        attrs = testimonial_data.get('attributes', {})
    else:
        attrs = testimonial_data
    
    # Build complete update payload with all fields
    update_data = {
        "name": attrs.get('name'),
        "company": attrs.get('company'),
        "text": attrs.get('text'),
        "rating": attrs.get('rating', 5),
        "siteId": attrs.get('siteId'),
        "featured": attrs.get('featured', False),
    }
    
    if attrs.get('sector'):
        update_data["sector"] = attrs.get('sector')
    if attrs.get('role'):
        update_data["role"] = attrs.get('role')
    
    # Try different image formats
    formats_to_try = [
        image_id,  # Just the numeric ID
    ]
    
    # Get image documentId
    img_url = f"{STRAPI_URL}/api/upload/files/{image_id}"
    img_r = requests.get(img_url, headers=HEADERS)
    if img_r.status_code == 200:
        img_data = img_r.json()
        img_doc_id = img_data.get('documentId')
        if img_doc_id:
            formats_to_try.append(img_doc_id)
    
    for img_format in formats_to_try:
        update_data["image"] = img_format
        payload = {"data": update_data}
        r = requests.put(url, headers=HEADERS, json=payload, timeout=10)
        
        if r.status_code in [200, 201]:
            return True
    
    return False

print("=" * 80)
print("🔧 FIXING TESTIMONIAL IMAGE ASSIGNMENTS")
print("=" * 80)

testimonials = get_testimonials()
images = get_recent_images(150)

print(f"\nFound {len(testimonials)} testimonials")
print(f"Found {len(images)} uploaded images\n")

# Filter testimonials without images
testimonials_needing_images = []
for t in testimonials:
    if 'attributes' in t:
        attrs = t.get('attributes', {})
    else:
        attrs = t
    
    has_image = False
    if attrs.get('image'):
        img_data = attrs.get('image')
        if isinstance(img_data, dict):
            if img_data.get('data') or img_data.get('id') or img_data.get('documentId'):
                has_image = True
    
    if not has_image:
        testimonials_needing_images.append(t)

print(f"{len(testimonials_needing_images)} testimonials need images\n")

success_count = 0
failed_count = 0

for i, testimonial in enumerate(testimonials_needing_images[:len(images)], 1):
    if 'attributes' in testimonial:
        attrs = testimonial.get('attributes', {})
    else:
        attrs = testimonial
    
    name = attrs.get('name', 'Unknown')
    doc_id = testimonial.get('documentId')
    numeric_id = testimonial.get('id')
    
    if i <= len(images):
        image = images[i-1]
        image_id = image.get('id')
        
        print(f"{i}. {name}...", end=" ")
        
        # Try with documentId first
        if doc_id and update_testimonial_with_image(doc_id, testimonial, image_id, use_numeric_id=False):
            print("✅ Updated!")
            success_count += 1
        # Try with numeric ID
        elif numeric_id and update_testimonial_with_image(numeric_id, testimonial, image_id, use_numeric_id=True):
            print("✅ Updated!")
            success_count += 1
        else:
            print("❌ Failed (API rejects image field)")
            failed_count += 1

print("\n" + "=" * 80)
print(f"✅ Successfully updated: {success_count}")
print(f"❌ Failed: {failed_count}")
print("=" * 80)

if failed_count > 0:
    print("\n⚠️  Some updates failed. The image field may be read-only.")
    print("   Please check Strapi permissions:")
    print("   1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin")
    print("   2. Settings → Users & Permissions → Roles → Authenticated")
    print("   3. Find 'Testimonial' → Ensure 'Update' is enabled")
    print("   4. Check field-level permissions for 'image' field")
