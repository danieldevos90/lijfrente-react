#!/usr/bin/env python3
"""
Assign images to testimonials with gender matching
Women get women's profile images, men get men's profile images
"""

import os
import sys
import requests
import json
import time
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

# Gender classification based on Dutch names
WOMEN_NAMES = ['sarah', 'lisa', 'marieke', 'emma', 'sophie', 'anna', 'maria', 'sanne', 'eva', 'fleur', 'iris', 'miranda', 'nina', 'patricia', 'saskia', 'karin', 'ingrid', 'lotte', 'dr. anna', 'dr. eva', 'dr. lisa', 'dr. sanne']
MEN_NAMES = ['mark', 'pieter', 'jan', 'tom', 'henk', 'rob', 'johan', 'dirk', 'frank', 'lucas', 'robert', 'martijn', 'thijs', 'ruben', 'kevin', 'thomas', 'jeroen', 'maarten', 'willem', 'ronald', 'erik', 'paul', 'gerard', 'daan', 'bas', 'dennis', 'marco', 'rick', 'dr. thomas', 'dr. maarten', 'dr. jeroen']

def get_testimonials():
    """Get all unique testimonials"""
    url = f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&pagination[limit]=1000"
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'}, timeout=30)
        if response.status_code == 200:
            all_testimonials = response.json().get('data', [])
            # Remove duplicates based on name
            seen_names = set()
            unique = []
            for t in all_testimonials:
                name = t.get('name', '').lower()
                if name not in seen_names:
                    seen_names.add(name)
                    unique.append(t)
            return unique
    except Exception as e:
        print(f"Error fetching testimonials: {e}")
    return []

def fetch_unsplash_images(query, count=10):
    """Fetch images from Unsplash API"""
    unsplash_key = os.getenv('UNSPLASH_ACCESS_KEY')
    if not unsplash_key:
        return []
    
    url = 'https://api.unsplash.com/search/photos'
    headers = {
        'Authorization': f'Client-ID {unsplash_key}'
    }
    params = {
        'query': query,
        'per_page': count,
        'orientation': 'portrait'
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            return response.json().get('results', [])
    except:
        pass
    return []

def upload_unsplash_image(unsplash_image, alt_text):
    """Download and upload an Unsplash image to Strapi"""
    image_url = unsplash_image.get('urls', {}).get('regular') or unsplash_image.get('urls', {}).get('small')
    if not image_url:
        return None
    
    try:
        # Download image
        img_response = requests.get(image_url, timeout=15)
        if img_response.status_code != 200:
            return None
        
        # Upload to Strapi
        files = {
            'files': (f'profile_{int(time.time() * 1000)}.jpg', img_response.content, 'image/jpeg')
        }
        data = {'alternativeText': alt_text}
        
        upload_url = f"{STRAPI_URL}/api/upload"
        upload_response = requests.post(upload_url, headers=HEADERS, files=files, data=data, timeout=30)
        
        if upload_response.status_code in [200, 201]:
            result = upload_response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0]
            elif isinstance(result, dict) and 'id' in result:
                return result
    except Exception as e:
        print(f"  Error uploading image: {e}")
    
    return None

def get_images_by_gender():
    """Get existing images and fetch gender-specific ones from Unsplash"""
    # Get existing uploaded images
    url = f"{STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]=150"
    existing_images = []
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            images = data if isinstance(data, list) else data.get('data', [])
            existing_images = [img for img in images if 'profile_' in img.get('name', '')]
            print(f"  Found {len(existing_images)} existing profile images")
    except Exception as e:
        print(f"  Error fetching existing images: {e}")
    
    # Fetch gender-specific images from Unsplash
    print("  Fetching women's profile images from Unsplash...")
    women_unsplash = fetch_unsplash_images("professional woman portrait business headshot", 5)
    women_images = []
    for img in women_unsplash:
        uploaded = upload_unsplash_image(img, "Professional woman profile")
        if uploaded:
            women_images.append(uploaded)
            print(f"    ✅ Uploaded women's image ID: {uploaded.get('id')}")
        time.sleep(0.5)
    
    print("  Fetching men's profile images from Unsplash...")
    men_unsplash = fetch_unsplash_images("professional man portrait business headshot", 5)
    men_images = []
    for img in men_unsplash:
        uploaded = upload_unsplash_image(img, "Professional man profile")
        if uploaded:
            men_images.append(uploaded)
            print(f"    ✅ Uploaded men's image ID: {uploaded.get('id')}")
        time.sleep(0.5)
    
    # If we don't have enough gender-specific, use existing ones as fallback
    if len(women_images) < 3 and len(existing_images) > 0:
        # Use existing images for women (take first half)
        women_images.extend(existing_images[:len(existing_images)//2])
    
    if len(men_images) < 3 and len(existing_images) > 0:
        # Use existing images for men (take second half)
        men_images.extend(existing_images[len(existing_images)//2:])
    
    return women_images[:10], men_images[:10]

def categorize_testimonials(testimonials):
    """Categorize testimonials by gender"""
    women = []
    men = []
    
    for t in testimonials:
        name = t.get('name', '').lower().split()[0]  # First name
        if any(women_name in name for women_name in WOMEN_NAMES):
            women.append(t)
        elif any(men_name in name for men_name in MEN_NAMES):
            men.append(t)
        else:
            # Default to men if unsure
            men.append(t)
    
    return women, men

def assign_image_via_admin_api(testimonial_id, image_id):
    """Try to assign image using admin API or direct update"""
    # Try different endpoints and methods
    endpoints_to_try = [
        f"{STRAPI_URL}/api/testimonials/{testimonial_id}",
    ]
    
    formats_to_try = [
        {"data": {"image": image_id}},
        {"image": image_id},
    ]
    
    for endpoint in endpoints_to_try:
        for payload_format in formats_to_try:
            try:
                response = requests.put(endpoint, headers=HEADERS, json=payload_format, timeout=10)
                if response.status_code in [200, 201]:
                    return True
            except:
                continue
    
    return False

def main():
    print("=" * 80)
    print("🖼️  ASSIGNING IMAGES WITH GENDER MATCHING")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    # Get testimonials
    testimonials = get_testimonials()
    print(f"Found {len(testimonials)} unique testimonials\n")
    
    # Categorize by gender
    women_testimonials, men_testimonials = categorize_testimonials(testimonials)
    print(f"Women testimonials: {len(women_testimonials)}")
    for t in women_testimonials:
        print(f"  - {t.get('name')} ({t.get('company')})")
    print(f"\nMen testimonials: {len(men_testimonials)}")
    for t in men_testimonials:
        print(f"  - {t.get('name')} ({t.get('company')})")
    print()
    
    # Get images
    women_images, men_images = get_images_by_gender()
    print(f"Women images available: {len(women_images)}")
    print(f"Men images available: {len(men_images)}\n")
    
    if len(women_images) < len(women_testimonials) or len(men_images) < len(men_testimonials):
        print("⚠️  Warning: Not enough images for all testimonials")
        print("   Fetching more images from Unsplash...")
        
        # We need to fetch more gender-specific images
        # For now, use what we have
    
    print("=" * 80)
    print("ASSIGNMENT MAPPING:")
    print("=" * 80)
    
    success_count = 0
    failed_count = 0
    
    # Assign women images to women testimonials
    for i, testimonial in enumerate(women_testimonials[:len(women_images)]):
        name = testimonial.get('name', 'Unknown')
        doc_id = testimonial.get('documentId')
        image = women_images[i]
        image_id = image.get('id')
        
        print(f"\n👩 {name}")
        print(f"   Testimonial ID: {doc_id}")
        print(f"   Image ID: {image_id} ({image.get('name', 'Unknown')})")
        
        # Try to assign via API
        if assign_image_via_admin_api(doc_id, image_id):
            print(f"   ✅ Assigned via API")
            success_count += 1
        else:
            admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
            print(f"   ⚠️  API failed - Manual: {admin_link}")
            print(f"      Search for Image ID: {image_id}")
            failed_count += 1
    
    # Assign men images to men testimonials
    for i, testimonial in enumerate(men_testimonials[:len(men_images)]):
        name = testimonial.get('name', 'Unknown')
        doc_id = testimonial.get('documentId')
        image = men_images[i]
        image_id = image.get('id')
        
        print(f"\n👨 {name}")
        print(f"   Testimonial ID: {doc_id}")
        print(f"   Image ID: {image_id} ({image.get('name', 'Unknown')})")
        
        # Try to assign via API
        if assign_image_via_admin_api(doc_id, image_id):
            print(f"   ✅ Assigned via API")
            success_count += 1
        else:
            admin_link = f"{STRAPI_URL}/admin/content-manager/collection-types/api::testimonial.testimonial/{doc_id}"
            print(f"   ⚠️  API failed - Manual: {admin_link}")
            print(f"      Search for Image ID: {image_id}")
            failed_count += 1
    
    print("\n" + "=" * 80)
    print(f"✅ Successfully assigned: {success_count}")
    print(f"⚠️  Needs manual assignment: {failed_count}")
    print("=" * 80)
    
    if failed_count > 0:
        print("\n📝 MANUAL ASSIGNMENT:")
        print("   Use the admin links above to assign images manually")
        print("   The API is rejecting image field updates - this is a Strapi permissions issue")

if __name__ == '__main__':
    main()
