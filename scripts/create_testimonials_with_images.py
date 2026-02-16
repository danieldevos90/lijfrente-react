#!/usr/bin/env python3
"""
Create testimonials via API with gender-matched images from Unsplash
"""

import os
import sys
import requests
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
UNSPLASH_KEY = os.getenv('UNSPLASH_ACCESS_KEY')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Missing STRAPI_TOKEN (or STRAPI_API_TOKEN). Refusing to run without an explicit token.", file=sys.stderr)
    sys.exit(1)
if not UNSPLASH_KEY:
    print("❌ Missing UNSPLASH_ACCESS_KEY. Refusing to run without an explicit key.", file=sys.stderr)
    sys.exit(1)

STRAPI_HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
}

UNSPLASH_HEADERS = {
    'Authorization': f'Client-ID {UNSPLASH_KEY}',
}

# Gender classification
WOMEN_NAMES = ['sarah', 'lisa', 'marieke', 'emma', 'sophie', 'anna', 'maria', 'sanne', 'eva', 'fleur', 'iris', 'miranda', 'nina', 'patricia', 'saskia', 'karin', 'ingrid', 'lotte']
MEN_NAMES = ['mark', 'pieter', 'jan', 'tom', 'henk', 'rob', 'johan', 'dirk', 'frank', 'lucas', 'robert', 'martijn', 'thijs', 'ruben', 'kevin', 'thomas', 'jeroen', 'maarten', 'willem', 'ronald', 'erik', 'paul', 'gerard', 'daan', 'bas', 'dennis', 'marco', 'rick']

# Testimonials data
TESTIMONIALS = [
    {
        "name": "Sarah van der Berg",
        "company": "Café de Hoek",
        "role": "Eigenaar",
        "text": "Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte. Perfect voor de horeca!",
        "rating": 5,
        "featured": True,
        "sector": "horeca"
    },
    {
        "name": "Mark Jansen",
        "company": "Transport BV",
        "role": "Directeur",
        "text": "Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als transportbedrijf nodig hebben voor onze nieuwe vrachtwagen.",
        "rating": 5,
        "featured": True,
        "sector": "transport"
    },
    {
        "name": "Lisa Vermeulen",
        "company": "Webshop Groen",
        "role": "Oprichter",
        "text": "Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden.",
        "rating": 5,
        "featured": True,
        "sector": "retail"
    },
    {
        "name": "Pieter Bakker",
        "company": "Restaurant De Gouden Leeuw",
        "role": "Restaurant Manager",
        "text": "We hebben onze keukenapparatuur kunnen upgraden zonder grote voorinvestering. De flexibele aflossing past perfect bij onze seizoensgebonden inkomsten.",
        "rating": 4,
        "featured": False,
        "sector": "horeca"
    },
    {
        "name": "Marieke de Vries",
        "company": "Hotel Amstelzicht",
        "role": "Eigenaar",
        "text": "Voor onze hotelrenovatie hadden we snel financiering nodig. GeldGeregeld begrijpt de horecasector en bood een oplossing op maat. Zeer tevreden!",
        "rating": 5,
        "featured": False,
        "sector": "horeca"
    },
    {
        "name": "Jan Smit",
        "company": "Modezaak De Stijl",
        "role": "Eigenaar",
        "text": "Onze nieuwe voorraad kon ik direct financieren zonder zorgen. De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn retailbedrijf.",
        "rating": 5,
        "featured": False,
        "sector": "retail"
    },
    {
        "name": "Tom de Wit",
        "company": "Retail Group BV",
        "role": "Directeur",
        "text": "Voor de uitbreiding van onze winkelketen was financiering essentieel. GeldGeregeld begrijpt retail en bood een oplossing die perfect aansloot bij onze behoeften.",
        "rating": 5,
        "featured": False,
        "sector": "retail"
    },
    {
        "name": "Henk van Dijk",
        "company": "Van Dijk Logistiek",
        "role": "Eigenaar",
        "text": "Voor onze vlootuitbreiding hadden we snel financiering nodig. Het aanbod kwam binnen 24 uur, maar de rente was iets hoger dan verwacht. Al met al tevreden.",
        "rating": 4,
        "featured": False,
        "sector": "transport"
    },
    {
        "name": "Rob Peters",
        "company": "Peters Transport & Logistiek",
        "role": "Operations Manager",
        "text": "De flexibele aflossing past perfect bij onze wisselende inkomsten. GeldGeregeld begrijpt de uitdagingen van transportbedrijven.",
        "rating": 5,
        "featured": False,
        "sector": "transport"
    }
]

def fetch_unsplash_image(query, page=1):
    """Fetch a single unique image from Unsplash with pagination for uniqueness"""
    url = 'https://api.unsplash.com/search/photos'
    params = {'query': query, 'per_page': 1, 'orientation': 'portrait', 'page': page}
    try:
        response = requests.get(url, headers=UNSPLASH_HEADERS, params=params, timeout=10)
        if response.status_code == 200:
            results = response.json().get('results', [])
            if results:
                return results[0].get('urls', {}).get('regular')
    except:
        pass
    return None

def upload_image_to_strapi(image_url, alt_text):
    """Download and upload image to Strapi"""
    try:
        img_response = requests.get(image_url, timeout=15)
        if img_response.status_code != 200:
            print(f"    ❌ Image download failed: {img_response.status_code}")
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
            print(f"    ❌ Upload failed: {upload_response.status_code} - {upload_response.text[:200]}")
    except Exception as e:
        print(f"    ❌ Error uploading: {e}")
        import traceback
        traceback.print_exc()
    return None

def get_gender_from_name(name):
    """Determine gender from first name"""
    first_name = name.lower().split()[0]
    if any(w in first_name for w in WOMEN_NAMES):
        return 'woman'
    elif any(m in first_name for m in MEN_NAMES):
        return 'man'
    return 'man'  # Default

def create_testimonial_with_image_url(testimonial_data, image_url):
    """Create testimonial with external image URL"""
    url = f"{STRAPI_URL}/api/testimonials"
    payload = {
        "data": {
            "siteId": SITE_ID,
            "name": testimonial_data["name"],
            "company": testimonial_data["company"],
            "text": testimonial_data["text"],
            "rating": testimonial_data.get("rating", 5),
            "featured": testimonial_data.get("featured", False),
            "imageUrl": image_url  # Try external URL field
        }
    }
    
    # Add optional fields
    if "role" in testimonial_data:
        payload["data"]["role"] = testimonial_data["role"]
    if "sector" in testimonial_data:
        payload["data"]["sector"] = testimonial_data["sector"]
    
    try:
        response = requests.post(url, headers={**STRAPI_HEADERS, 'Content-Type': 'application/json'}, json=payload, timeout=30)
        if response.status_code in [200, 201]:
            return response.json()
    except:
        pass
    return None

def create_testimonial(testimonial_data, image_id=None, image_url=None):
    """Create testimonial via API - try multiple image formats"""
    url = f"{STRAPI_URL}/api/testimonials"
    
    # Base payload with only required fields
    base_payload = {
        "data": {
            "siteId": SITE_ID,
            "name": testimonial_data["name"],
            "company": testimonial_data["company"],
            "text": testimonial_data["text"],
            "rating": testimonial_data.get("rating", 5),
            "featured": testimonial_data.get("featured", False),
        }
    }
    
    # Try creating without image first
    try:
        response = requests.post(url, headers={**STRAPI_HEADERS, 'Content-Type': 'application/json'}, json=base_payload, timeout=30)
        if response.status_code in [200, 201]:
            result = response.json()
            created_id = result.get('data', {}).get('documentId') or result.get('data', {}).get('id')
            
            if image_id and created_id:
                # Try to update with image using different formats
                update_url = f"{STRAPI_URL}/api/testimonials/{created_id}"
                
                # Try format 1: direct ID
                for img_format in [image_id, {"id": image_id}, {"documentId": image_id}]:
                    update_payload = {"data": {"image": img_format}}
                    update_response = requests.put(update_url, headers={**STRAPI_HEADERS, 'Content-Type': 'application/json'}, json=update_payload, timeout=30)
                    if update_response.status_code in [200, 201]:
                        print(f"    ✅ Image assigned using format: {type(img_format).__name__}")
                        return result
                
                print(f"    ⚠️  Created but image assignment failed - Image ID: {image_id}")
                return result
            else:
                return result
        else:
            print(f"    ❌ Failed: {response.status_code} - {response.text[:200]}")
    except Exception as e:
        print(f"    ❌ Error: {e}")
    return None

print("=" * 80)
print("🖼️  CREATING TESTIMONIALS WITH GENDER-MATCHED IMAGES")
print("=" * 80)
print(f"\nSite ID: {SITE_ID}")
print(f"Total testimonials: {len(TESTIMONIALS)}\n")

created_count = 0
failed_count = 0

for i, testimonial in enumerate(TESTIMONIALS):
    name = testimonial["name"]
    gender = get_gender_from_name(name)
    
    print(f"[{i+1}/{len(TESTIMONIALS)}] {name} ({gender})")
    
    # Fetch unique image for each person using pagination (page = i+1 for uniqueness)
    query = f"professional {gender} portrait business headshot"
    print(f"  📥 Fetching unique {gender}'s image from Unsplash (page {i+1})...")
    image_url = fetch_unsplash_image(query, page=i+1)
    
    if not image_url:
        print(f"  ❌ Failed to fetch image")
        failed_count += 1
        continue
    
    print(f"  📤 Uploading image to Strapi...")
    image_data = upload_image_to_strapi(image_url, f"Professional {gender} profile")
    
    image_id = None
    if image_data:
        image_id = image_data.get('id')
        print(f"  ✅ Image uploaded (ID: {image_id})")
    else:
        print(f"  ⚠️  Upload failed, will try with image URL directly")
    
    # Create testimonial with image
    print(f"  📝 Creating testimonial...")
    if image_id:
        result = create_testimonial(testimonial, image_id=image_id)
    else:
        # Try creating with image URL directly
        result = create_testimonial(testimonial, image_url=image_url)
    
    if result:
        print(f"  ✅ Testimonial created successfully!")
        created_count += 1
    else:
        print(f"  ❌ Failed to create testimonial")
        failed_count += 1
    
    # Rate limiting
    time.sleep(1)
    print()

print("=" * 80)
print(f"✅ Successfully created: {created_count}")
print(f"❌ Failed: {failed_count}")
print("=" * 80)
