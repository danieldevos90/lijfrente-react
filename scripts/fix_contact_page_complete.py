#!/usr/bin/env python3
"""
Complete fix for contact page: update content and services

USAGE:
    export STRAPI_API_TOKEN='your-token-here'
    python3 scripts/fix_contact_page_complete.py
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

def fix_contact_page():
    """Fix contact page: update content and services"""
    print("\n🔧 Fixing contact page...")
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
    
    # Clean sections (remove attributes wrapper if present)
    clean_sections = []
    for section in sections:
        if isinstance(section, dict):
            if 'attributes' in section:
                clean_sections.append(section['attributes'])
            elif '__component' in section:
                clean_sections.append({k: v for k, v in section.items() if k not in ['id', 'documentId']})
            else:
                clean_sections.append(section)
        else:
            clean_sections.append(section)
    
    # Update sections
    updated_sections = []
    for section in clean_sections:
        if isinstance(section, dict):
            updated_section = section.copy()
            
            # Fix content-section with "Contactgegevens" title
            if updated_section.get('__component') == 'sections.content-section' and (
                updated_section.get('title') == 'Contactgegevens' or 
                'contactgegevens' in updated_section.get('title', '').lower()
            ):
                updated_section['content'] = "Bereik ons via telefoon of e-mail. We zijn bereikbaar van maandag tot vrijdag tussen 09:00 en 18:00."
                print("   ✅ Fixed Contactgegevens content")
            
            # Fix services-section with "Contactmogelijkheden" title
            elif updated_section.get('__component') == 'sections.services-section' and (
                updated_section.get('title') == 'Contactmogelijkheden' or 
                'contact' in updated_section.get('title', '').lower()
            ):
                updated_section['services'] = [
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
                print("   ✅ Fixed Contactmogelijkheden services (2 services)")
            
            updated_sections.append(updated_section)
        else:
            updated_sections.append(section)
    
    # Update page
    update_data = {
        "data": {
            "sections": updated_sections
        }
    }
    
    update_id = document_id if document_id else page_id
    url = f"{STRAPI_URL}/api/pages/{update_id}"
    
    try:
        response = requests.put(url, headers=HEADERS, json=update_data)
        if response.status_code == 200:
            print("✅ Successfully updated contact page")
            return True
        else:
            print(f"❌ Failed to update page: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Error updating page: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔄 Fixing contact page completely...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = fix_contact_page()
    
    if success:
        print("\n✅ Contact page fixed successfully!")
        return 0
    else:
        print("\n❌ Failed to fix contact page")
        return 1

if __name__ == "__main__":
    exit(main())
