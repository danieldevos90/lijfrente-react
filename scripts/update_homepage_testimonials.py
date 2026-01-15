#!/usr/bin/env python3
"""
Update homepage testimonials in Strapi with improved names, profile images, and varied ratings
"""

import os
import sys
import requests
import json
import time

# Add parent directory to path to import from populate_strapi_content
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configuration - using provided token
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN') or '83ae092f65606c25c63f583c739c6c5cd2877fdeac937ab30a4a161f38430489e3cc895394e5f06c5e43cf3c7587ca35d47db6a27a55a3b0f39de0ebc0b72c16956a09fec27492b7379d54eda4b8e304b86c27d27da24ca5c3c58a701b038e2eac43d8c12830b1a4190db25b7d079644816cbbc832d09b249bcea27a6daa664a'

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

def get_existing_page(slug: str):
    """Get existing page by slug"""
    url = f"{STRAPI_URL}/api/pages?filters[slug][$eq]={slug}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"Error fetching page {slug}: {e}")
    return {}

def create_or_update_page(slug: str, page_data: dict):
    """Create or update a page"""
    existing = get_existing_page(slug)
    if existing:
        page_id = existing.get('id') or existing.get('documentId')
        if not page_id and 'attributes' in existing:
            page_id = existing['attributes'].get('id') or existing['attributes'].get('documentId')
        update_id = existing.get('documentId') or existing.get('id') or page_id
        
        update_url = f"{STRAPI_URL}/api/pages/{update_id}"
        try:
            response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=15)
            if response.status_code == 200:
                print(f"✅ Updated page: {slug}")
                return response.json()
            else:
                print(f"⚠️ Update failed: {response.status_code} - {response.text[:200]}")
                return None
        except Exception as e:
            print(f"⚠️ Error updating: {e}")
            return None
    
    # Create new page
    create_url = f"{STRAPI_URL}/api/pages"
    try:
        response = requests.post(create_url, headers=HEADERS, json=page_data, timeout=15)
        if response.status_code in [200, 201]:
            print(f"✅ Created page: {slug}")
            return response.json()
        else:
            print(f"⚠️ Create failed: {response.status_code} - {response.text[:200]}")
            return None
    except Exception as e:
        print(f"⚠️ Error creating: {e}")
        return None

# Improved testimonials with better names and profile images
# Note: rating field is handled by the frontend component, not stored in Strapi
HOMEpage_TESTIMONIALS = [
    {
        "name": "Erik van der Berg",
        "role": "Café eigenaar",
        "text": "Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte.",
        "image": "/images/Erik.jpeg"
    },
    {
        "name": "Jan Jansen",
        "role": "Transport ondernemer",
        "text": "Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als MKB nodig hebben.",
        "image": "/images/Jan.jpeg"
    },
    {
        "name": "Lisa Vermeulen",
        "role": "Oprichter Webshop",
        "text": "Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden.",
        "image": "/images/pexels-amina-filkins-5414025.jpg"
    }
]

# Rating mapping for display (used by frontend)
TESTIMONIAL_RATINGS = {
    "Erik van der Berg": 5,
    "Jan Jansen": 4,
    "Lisa Vermeulen": 5
}


def get_homepage():
    """Get the homepage from Strapi"""
    return get_existing_page('home')


def create_or_update_homepage():
    """Create or update homepage with testimonials"""
    print(f"\n{'='*60}")
    print(f"🚀 Creating/Updating Homepage Testimonials")
    print(f"{'='*60}")
    print(f"Site ID: {SITE_ID}")
    print(f"Strapi URL: {STRAPI_URL}")
    print(f"{'='*60}\n")
    
    # Get homepage
    page = get_homepage()
    
    if page:
        # Get existing sections
        page_data = page.get('attributes', page)
        existing_sections = page_data.get('sections', [])
        
        print(f"📄 Found homepage with {len(existing_sections)} sections")
        
        # Clean sections - remove id fields and keep only data
        cleaned_sections = []
        updated = False
        
        for i, section in enumerate(existing_sections):
            section_data = section.get('attributes', section) if isinstance(section, dict) else section
            component = section_data.get('__component')
            
            # Create clean section without id fields
            clean_section = {k: v for k, v in section_data.items() if k not in ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt']}
            
            if component == 'sections.testimonials-carousel':
                print(f"✅ Found testimonials section at index {i}")
                clean_section['testimonials'] = HOMEpage_TESTIMONIALS
                clean_section['title'] = "Wat onze klanten zeggen"
                clean_section['subtitle'] = "Meer dan 1.000 ondernemers gingen je voor"
                clean_section['backgroundColor'] = "var(--color-bg)"
                updated = True
            
            cleaned_sections.append(clean_section)
        
        if not updated:
            print("⚠️  Testimonials section not found, adding it...")
            cleaned_sections.append({
                "__component": "sections.testimonials-carousel",
                "title": "Wat onze klanten zeggen",
                "subtitle": "Meer dan 1.000 ondernemers gingen je voor",
                "backgroundColor": "var(--color-bg)",
                "testimonials": HOMEpage_TESTIMONIALS
            })
        
        # Get page ID for update - try different ID fields
        page_id = None
        if 'documentId' in page:
            page_id = page['documentId']
        elif 'id' in page:
            page_id = page['id']
        elif 'attributes' in page:
            if 'documentId' in page['attributes']:
                page_id = page['attributes']['documentId']
            elif 'id' in page['attributes']:
                page_id = page['attributes']['id']
        
        if not page_id:
            print(f"❌ Could not find page ID. Page structure: {json.dumps(page, indent=2)[:500]}")
            return False
        
        print(f"📝 Using page ID: {page_id}")
        
        # Update page directly - try documentId first, then id
        update_url = f"{STRAPI_URL}/api/pages/{page_id}"
        payload = {
            "data": {
                "sections": cleaned_sections
            }
        }
        
        try:
            print(f"📝 Updating homepage (ID: {page_id})...")
            response = requests.put(update_url, headers=HEADERS, json=payload, timeout=15)
            
            if response.status_code == 200:
                print(f"✅ Successfully updated homepage testimonials!")
                print(f"\n📋 Updated testimonials:")
                for i, testimonial in enumerate(HOMEpage_TESTIMONIALS, 1):
                    rating = TESTIMONIAL_RATINGS.get(testimonial['name'], 5)
                    stars = "★" * rating + "☆" * (5 - rating)
                    print(f"  {i}. {testimonial['name']} ({testimonial['role']}) - {stars}")
                    print(f"     Image: {testimonial['image']}")
                print(f"\n✅ Done!")
                return True
            else:
                print(f"❌ Error updating homepage: {response.status_code}")
                print(f"   Response: {response.text[:500]}")
                return False
        except Exception as e:
            print(f"❌ Error updating homepage: {e}")
            import traceback
            traceback.print_exc()
            return False
    else:
        print("❌ Homepage not found. Please create it first using populate_strapi_content.py")
        return False


if __name__ == '__main__':
    success = create_or_update_homepage()
    exit(0 if success else 1)
