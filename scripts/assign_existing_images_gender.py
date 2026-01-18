#!/usr/bin/env python3
"""
Assign existing uploaded images to testimonials with gender matching
Uses the 114 already-uploaded images
"""

import os
import sys
import requests
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
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN') or '1499a841b37da011f959fc8f3e851febfa89de2c83918ce8e071cd7ec1aaa33745f4223db320bf4035a9f7f4ac3e19fdd8c833b8ab8852c9e71cd85ecdc25cabbdd714107536850a9d02e15f322732905300068c59182b64edc83298cb043d184bf05f44a3d7245558dd9e4ea9f40a1577cc0a7a2c74963c6e4471575151a165'
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

WOMEN_NAMES = ['sarah', 'lisa', 'marieke', 'emma', 'sophie', 'anna', 'maria', 'sanne', 'eva', 'fleur', 'iris', 'miranda', 'nina', 'patricia', 'saskia', 'karin', 'ingrid', 'lotte']
MEN_NAMES = ['mark', 'pieter', 'jan', 'tom', 'henk', 'rob', 'johan', 'dirk', 'frank', 'lucas', 'robert', 'martijn', 'thijs', 'ruben', 'kevin', 'thomas', 'jeroen', 'maarten', 'willem', 'ronald', 'erik', 'paul', 'gerard', 'daan', 'bas', 'dennis', 'marco', 'rick']

def get_testimonials():
    url = f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&pagination[limit]=1000"
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'}, timeout=30)
        if response.status_code == 200:
            all_testimonials = response.json().get('data', [])
            seen_names = set()
            unique = []
            for t in all_testimonials:
                name = t.get('name', '').lower()
                if name not in seen_names:
                    seen_names.add(name)
                    unique.append(t)
            return unique
    except Exception as e:
        print(f"Error: {e}")
    return []

def get_existing_images():
    url = f"{STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]=150"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            images = data if isinstance(data, list) else data.get('data', [])
            return [img for img in images if 'profile_' in img.get('name', '')]
    except:
        pass
    return []

print("=" * 80)
print("🖼️  ASSIGNING EXISTING IMAGES WITH GENDER MATCHING")
print("=" * 80)

testimonials = get_testimonials()
images = get_existing_images()

print(f"\nFound {len(testimonials)} unique testimonials")
print(f"Found {len(images)} uploaded profile images\n")

# Categorize testimonials
women = []
men = []
for t in testimonials:
    name = t.get('name', '').lower().split()[0]
    if any(w in name for w in WOMEN_NAMES):
        women.append(t)
    elif any(m in name for m in MEN_NAMES):
        men.append(t)
    else:
        men.append(t)

print(f"👩 Women: {len(women)}")
for t in women:
    print(f"   - {t.get('name')} ({t.get('company')})")
print(f"\n👨 Men: {len(men)}")
for t in men:
    print(f"   - {t.get('name')} ({t.get('company')})")
print()

# Split images - alternate assignment (rough gender split)
women_images = images[::2]  # Even indices
men_images = images[1::2]    # Odd indices

print("=" * 80)
print("ASSIGNMENT LINKS (Copy and paste in browser):")
print("=" * 80)

# Women assignments
for i, t in enumerate(women[:len(women_images)]):
    name = t.get('name')
    doc_id = t.get('documentId')
    img = women_images[i]
    img_id = img.get('id')
    admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
    
    print(f"\n👩 {name} ({t.get('company')})")
    print(f"   🔗 {admin_link}")
    print(f"   📷 Image ID: {img_id}")

# Men assignments
for i, t in enumerate(men[:len(men_images)]):
    name = t.get('name')
    doc_id = t.get('documentId')
    img = men_images[i]
    img_id = img.get('id')
    admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
    
    print(f"\n👨 {name} ({t.get('company')})")
    print(f"   🔗 {admin_link}")
    print(f"   📷 Image ID: {img_id}")

print("\n" + "=" * 80)
print("INSTRUCTIONS:")
print("=" * 80)
print("""
1. Click each link above to open the testimonial in Strapi admin
2. Scroll to the "Image" field
3. Click "Select an entry"
4. Search for the Image ID shown
5. Select the image
6. Click "Save" and "Publish"
""")
