#!/usr/bin/env python3
"""
List testimonials and their corresponding uploaded images
This helps manually assign images in Strapi admin panel
"""

import os
import sys
import requests
from pathlib import Path

# Load environment variables
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
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN') or '1499a841b37da011f959fc8f3e851febfa89de2c83918ce8e071cd7ec1aaa33745f4223db320bf4035a9f7f4ac3e19fdd8c833b8ab8852c9e71cd85ecdc25cabbdd714107536850a9d02e15f322732905300068c59182b64edc83298cb043d184bf05f44a3d7245558dd9e4ea9f40a1577cc0a7a2c74963c6e4471575151a165'
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

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
    except:
        pass
    return []

def get_recent_images(limit=50):
    """Get recently uploaded images"""
    url = f"{STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]={limit}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            # Handle both array and object responses
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return data.get('data', [])
    except Exception as e:
        print(f"Error fetching images: {e}")
    return []

print("=" * 80)
print("📋 TESTIMONIAL TO IMAGE MAPPING")
print("=" * 80)
print(f"\nStrapi URL: {STRAPI_URL}")
print(f"Site ID: {SITE_ID}\n")

testimonials = get_testimonials()
recent_images = get_recent_images(100)

print(f"Found {len(testimonials)} testimonials")
print(f"Found {len(recent_images)} recent images\n")

print("=" * 80)
print("TESTIMONIALS NEEDING IMAGES:")
print("=" * 80)

for i, testimonial in enumerate(testimonials, 1):
    if 'attributes' in testimonial:
        attrs = testimonial.get('attributes', {})
    else:
        attrs = testimonial
    
    name = attrs.get('name', 'Unknown')
    company = attrs.get('company', '')
    doc_id = testimonial.get('documentId') or testimonial.get('id')
    
    # Check if has image
    has_image = False
    if attrs.get('image'):
        img_data = attrs.get('image')
        if isinstance(img_data, dict):
            if img_data.get('data') or img_data.get('id') or img_data.get('documentId'):
                has_image = True
    
    if not has_image and i <= len(recent_images):
        image = recent_images[i-1]
        image_id = image.get('id')
        image_doc_id = image.get('documentId')
        image_url = image.get('url', '')
        
        print(f"\n{i}. {name} ({company})")
        print(f"   Testimonial ID: {doc_id}")
        print(f"   Image ID: {image_id}")
        print(f"   Image DocumentID: {image_doc_id}")
        print(f"   Image URL: {image_url}")
        print(f"   Admin Link: {STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}")

print("\n" + "=" * 80)
print("MANUAL ASSIGNMENT INSTRUCTIONS:")
print("=" * 80)
print("""
1. Go to Strapi Admin: https://bright-smile-1f47bc9d67.strapiapp.com/admin
2. Navigate to Content Manager > Testimonials
3. For each testimonial listed above:
   - Click on the testimonial
   - Scroll to the 'Image' field
   - Click 'Select an entry' or 'Add an entry'
   - Search for the Image ID shown above
   - Select and save

Alternatively, you can use the direct admin links shown above.
""")
