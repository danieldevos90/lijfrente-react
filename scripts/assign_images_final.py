#!/usr/bin/env python3
"""
Get testimonials and recently uploaded images, create mapping for manual assignment
"""

import os
import sys
import requests
from datetime import datetime, timedelta

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

WOMEN_NAMES = ['sarah', 'lisa', 'marieke', 'emma', 'sophie', 'anna', 'maria', 'sanne', 'eva', 'fleur', 'iris', 'miranda', 'nina', 'patricia', 'saskia', 'karin', 'ingrid', 'lotte']
MEN_NAMES = ['mark', 'pieter', 'jan', 'tom', 'henk', 'rob', 'johan', 'dirk', 'frank', 'lucas', 'robert', 'martijn', 'thijs', 'ruben', 'kevin', 'thomas', 'jeroen', 'maarten', 'willem', 'ronald', 'erik', 'paul', 'gerard', 'daan', 'bas', 'dennis', 'marco', 'rick']

# Get testimonials
url = f'{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&sort=createdAt:desc&pagination[limit]=20'
r = requests.get(url, headers={'Content-Type': 'application/json'})
testimonials = r.json().get('data', [])

# Get recently uploaded images (last 20)
img_url = f'{STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]=20'
img_r = requests.get(img_url, headers=HEADERS)
images = img_r.json() if isinstance(img_r.json(), list) else img_r.json().get('data', [])

print("=" * 80)
print("🖼️  IMAGE ASSIGNMENT MAPPING")
print("=" * 80)
print(f"\nFound {len(testimonials)} testimonials")
print(f"Found {len(images)} recent images\n")

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

# Categorize images by filename/alt text
women_images = []
men_images = []
for img in images:
    alt = (img.get('alternativeText') or '').lower()
    name = (img.get('name') or '').lower()
    if 'woman' in alt or 'woman' in name:
        women_images.append(img)
    elif 'man' in alt or 'man' in name:
        men_images.append(img)
    else:
        # Default: alternate assignment
        if len(women_images) <= len(men_images):
            women_images.append(img)
        else:
            men_images.append(img)

print(f"👩 Women testimonials: {len(women)}")
print(f"👨 Men testimonials: {len(men)}")
print(f"👩 Women images: {len(women_images)}")
print(f"👨 Men images: {len(men_images)}\n")

print("=" * 80)
print("ASSIGNMENT LINKS:")
print("=" * 80)

# Assign women
for i, t in enumerate(women[:len(women_images)]):
    name = t.get('name')
    doc_id = t.get('documentId')
    img = women_images[i]
    img_id = img.get('id')
    admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
    
    print(f"\n👩 {name} ({t.get('company')})")
    print(f"   🔗 {admin_link}")
    print(f"   📷 Image ID: {img_id}")

# Assign men
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
print("1. Click each link above")
print("2. Scroll to 'Image' field")
print("3. Click 'Select an entry' or 'Media Library'")
print("4. Search for the Image ID shown")
print("5. Select the image")
print("6. Click 'Save' and 'Publish'")
print("=" * 80)
