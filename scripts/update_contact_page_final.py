#!/usr/bin/env python3
"""
Update contact page with correct structure for services component

USAGE:
    export STRAPI_API_TOKEN='your-token-here'
    python3 scripts/update_contact_page_final.py
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

def update_contact_page():
    """Update contact page with full structure"""
    print("\n🔧 Updating contact page...")
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
    
    # Build sections array - keep structure but update specific sections
    updated_sections = []
    for section in sections:
        sec_data = section.get('attributes', section) if 'attributes' in section else section
        
        # Remove id/documentId fields
        clean_section = {k: v for k, v in sec_data.items() if k not in ['id', 'documentId']}
        
        # Update content-section
        if clean_section.get('__component') == 'sections.content-section' and clean_section.get('title') == 'Contactgegevens':
            clean_section['content'] = "Bereik ons via telefoon of e-mail. We zijn bereikbaar van maandag tot vrijdag tussen 09:00 en 18:00."
            print("   ✅ Updated Contactgegevens content")
        
        # Update services-section - use component structure (without __component in nested items)
        elif clean_section.get('__component') == 'sections.services-section' and clean_section.get('title') == 'Contactmogelijkheden':
            clean_section['services'] = [
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
            print("   ✅ Updated Contactmogelijkheden services (2 services)")
        
        updated_sections.append(clean_section)
    
    # Update page
    update_id = document_id if document_id else page_id
    url = f"{STRAPI_URL}/api/pages/{update_id}"
    
    update_data = {
        "data": {
            "sections": updated_sections
        }
    }
    
    try:
        print(f"   Updating page {update_id}...")
        response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        if response.status_code == 200:
            print("✅ Successfully updated contact page")
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
    print("🔄 Updating contact page...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = update_contact_page()
    
    if success:
        print("\n✅ Contact page updated successfully!")
        return 0
    else:
        print("\n❌ Failed to update contact page")
        return 1

if __name__ == "__main__":
    exit(main())
