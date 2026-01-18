#!/usr/bin/env python3
"""
Simple script to upload gender-specific images and assign them to testimonials
"""

import os
import sys
import requests
import json
import time
import tempfile
from pathlib import Path
from urllib.parse import urlparse

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
UNSPLASH_KEY = os.getenv('UNSPLASH_ACCESS_KEY', '4m8GFqQM0ejRjk13SkMPI5UW1QWnCaFzUHXk__XFQOE')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

STRAPI_HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
}

UNSPLASH_HEADERS = {
    'Authorization': f'Client-ID {UNSPLASH_KEY}',
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

def fetch_unsplash_images(query, count=5):
    url = 'https://api.unsplash.com/search/photos'
    params = {'query': query, 'per_page': count, 'orientation': 'portrait'}
    try:
        response = requests.get(url, headers=UNSPLASH_HEADERS, params=params, timeout=10)
        if response.status_code == 200:
            return response.json().get('results', [])
    except:
        pass
    return []

def download_and_upload_image(image_url, alt_text):
    try:
        print(f"    Downloading: {image_url[:80]}...")
        img_response = requests.get(image_url, timeout=15)
        if img_response.status_code != 200:
            print(f"    ❌ Download failed: {img_response.status_code}")
            return None
        
        files = {
            'files': (f'profile_{int(time.time() * 1000)}.jpg', img_response.content, 'image/jpeg')
        }
        data = {'alternativeText': alt_text}
        
        upload_url = f"{STRAPI_URL}/api/upload"
        upload_response = requests.post(upload_url, headers=STRAPI_HEADERS, files=files, data=data, timeout=30)
        
        if upload_response.status_code in [200, 201]:
            result = upload_response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0]
            elif isinstance(result, dict) and 'id' in result:
                return result
        else:
            print(f"    ❌ Upload failed: {upload_response.status_code} - {upload_response.text[:100]}")
    except Exception as e:
        print(f"    ❌ Error: {e}")
        import traceback
        traceback.print_exc()
    return None

def assign_image_to_testimonial(testimonial_id, image_id):
    """Try to assign image - will likely fail due to API restrictions"""
    url = f"{STRAPI_URL}/api/testimonials/{testimonial_id}"
    payload = {"data": {"image": image_id}}
    try:
        response = requests.put(url, headers={**STRAPI_HEADERS, 'Content-Type': 'application/json'}, json=payload, timeout=10)
        return response.status_code in [200, 201]
    except:
        return False

print("=" * 80)
print("🖼️  ASSIGNING GENDER-MATCHED IMAGES TO TESTIMONIALS")
print("=" * 80)

testimonials = get_testimonials()
print(f"\nFound {len(testimonials)} unique testimonials\n")

# Categorize
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

# Fetch and upload gender-specific images
print("📥 Fetching women's images from Unsplash...")
women_unsplash = fetch_unsplash_images("professional woman portrait business headshot", len(women) + 2)
women_images = []
for img in women_unsplash:
    uploaded = download_and_upload_image(img.get('urls', {}).get('regular'), "Professional woman")
    if uploaded:
        women_images.append(uploaded)
        print(f"   ✅ Uploaded image ID: {uploaded.get('id')}")
    time.sleep(0.5)

print(f"\n📥 Fetching men's images from Unsplash...")
men_unsplash = fetch_unsplash_images("professional man portrait business headshot", len(men) + 2)
men_images = []
for img in men_unsplash:
    uploaded = download_and_upload_image(img.get('urls', {}).get('regular'), "Professional man")
    if uploaded:
        men_images.append(uploaded)
        print(f"   ✅ Uploaded image ID: {uploaded.get('id')}")
    time.sleep(0.5)

print("\n" + "=" * 80)
print("ASSIGNMENT:")
print("=" * 80)

success = 0
manual = 0

# Assign women
for i, t in enumerate(women[:len(women_images)]):
    name = t.get('name')
    doc_id = t.get('documentId')
    img = women_images[i]
    img_id = img.get('id')
    
    print(f"\n👩 {name}")
    print(f"   Testimonial: {doc_id}")
    print(f"   Image ID: {img_id}")
    
    if assign_image_to_testimonial(doc_id, img_id):
        print(f"   ✅ Assigned via API")
        success += 1
    else:
        admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
        print(f"   🔗 Manual: {admin_link}")
        print(f"      Search Image ID: {img_id}")
        manual += 1

# Assign men
for i, t in enumerate(men[:len(men_images)]):
    name = t.get('name')
    doc_id = t.get('documentId')
    img = men_images[i]
    img_id = img.get('id')
    
    print(f"\n👨 {name}")
    print(f"   Testimonial: {doc_id}")
    print(f"   Image ID: {img_id}")
    
    if assign_image_to_testimonial(doc_id, img_id):
        print(f"   ✅ Assigned via API")
        success += 1
    else:
        admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
        print(f"   🔗 Manual: {admin_link}")
        print(f"      Search Image ID: {img_id}")
        manual += 1

print("\n" + "=" * 80)
print(f"✅ API assigned: {success}")
print(f"🔗 Manual needed: {manual}")
print("=" * 80)
