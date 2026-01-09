#!/usr/bin/env python3
"""
Fix contact page services using Content Manager API

USAGE:
    export STRAPI_API_TOKEN='your-token-here'
    python3 scripts/fix_contact_services_final.py
"""

import os
import requests
import json
from typing import Dict, Any, Optional

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_API_TOKEN environment variable is required")
    exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def get_contact_page() -> Optional[Dict]:
    """Get contact page from Strapi"""
    url = f"{STRAPI_URL}/api/pages?filters[slug][$eq]=contact&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
        return None
    except Exception as e:
        print(f"❌ Error fetching contact page: {e}")
        return None

def fix_contact_services():
    """Fix contact page services using Content Manager API"""
    print("\n🔧 Fixing contact page services...")
    page = get_contact_page()
    if not page:
        print("❌ Contact page not found")
        return False
    
    # Handle both Strapi v4 (attributes) and v5 (flat) structures
    page_attrs = page.get('attributes', {}) if 'attributes' in page else page
    document_id = page.get('documentId') or page_attrs.get('documentId')
    page_id = page.get('id') or page_attrs.get('id')
    
    if not document_id and not page_id:
        print("❌ Could not find page ID")
        return False
    
    # Get current sections
    sections = []
    if 'attributes' in page:
        sections = page['attributes'].get('sections', {}).get('data', []) if isinstance(page['attributes'].get('sections'), dict) else page['attributes'].get('sections', [])
    else:
        sections = page.get('sections', {}).get('data', []) if isinstance(page.get('sections'), dict) else page.get('sections', [])
    
    # Build full sections array with all data (excluding id fields)
    full_sections = []
    for section in sections:
        if isinstance(section, dict):
            if 'attributes' in section:
                # Remove id fields from attributes
                sec_data = {k: v for k, v in section['attributes'].items() if k not in ['id', 'documentId']}
                full_sections.append(sec_data)
            else:
                # Remove id fields
                sec_data = {k: v for k, v in section.items() if k not in ['id', 'documentId']}
                full_sections.append(sec_data)
        else:
            full_sections.append(section)
    
    # Update services-section
    for i, section in enumerate(full_sections):
        if isinstance(section, dict):
            if section.get('__component') == 'sections.services-section' and (
                section.get('title') == 'Contactmogelijkheden' or 
                'contact' in section.get('title', '').lower()
            ):
                # Add services field
                full_sections[i]['services'] = [
                    {
                        "icon": "/icons/SVG/interface/phone.svg",
                        "title": "Bel ons",
                        "description": "Ma-Vr: 09:00 - 18:00\n085-0480881",
                        "href": "tel:0850480881"
                    },
                    {
                        "icon": "/icons/SVG/interface/mail.svg",
                        "title": "E-mail ons",
                        "description": "Reactie binnen 24 uur\ninfo@geldgeregeld.nl",
                        "href": "mailto:info@geldgeregeld.nl"
                    }
                ]
                print(f"   ✅ Updated section {i} with 2 services")
    
    # Try Content Manager API first
    update_id = document_id if document_id else page_id
    
    # Method 1: Content Manager API
    admin_url = f"{STRAPI_URL}/admin/content-manager/collection-types/api::page.page/{update_id}"
    update_data = {
        "sections": full_sections
    }
    
    try:
        print(f"   Trying Content Manager API (ID: {update_id})...")
        response = requests.put(admin_url, headers=HEADERS, json=update_data, timeout=10)
        if response.status_code == 200:
            print("✅ Successfully updated via Content Manager API")
            return True
        else:
            print(f"   Content Manager API returned: {response.status_code}")
            print(f"   Response: {response.text[:300]}")
    except Exception as e:
        print(f"   Content Manager API error: {e}")
    
    # Method 2: Content API with proper structure
    url = f"{STRAPI_URL}/api/pages/{update_id}"
    update_data = {
        "data": {
            "sections": full_sections
        }
    }
    
    try:
        print(f"   Trying Content API (ID: {update_id})...")
        response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        if response.status_code == 200:
            print("✅ Successfully updated via Content API")
            return True
        else:
            print(f"❌ Failed to update: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Error updating: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔄 Fixing contact page services...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = fix_contact_services()
    
    if success:
        print("\n✅ Contact page services fixed!")
        return 0
    else:
        print("\n❌ Failed to fix contact page services")
        return 1

if __name__ == "__main__":
    exit(main())
