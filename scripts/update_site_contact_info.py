#!/usr/bin/env python3
"""
Update site contact information (email, phone, KVK) via Strapi API

USAGE:
    export STRAPI_TOKEN='your-token-here'
    python3 scripts/update_site_contact_info.py

Or set STRAPI_API_TOKEN environment variable instead.
"""

import os
import requests
import json
from typing import Dict, Any, Optional

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN', 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def get_existing_site() -> Optional[Dict]:
    """Get existing site"""
    url = f"{STRAPI_URL}/api/sites?filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                site = data['data'][0]
                print(f"   Found site: {site.get('id') or site.get('documentId')}")
                return site
            else:
                print(f"   No data found in response")
        else:
            print(f"   Error response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Error fetching site: {e}")
        import traceback
        traceback.print_exc()
    return None

def update_site_contact_info():
    """Update site contact information"""
    print("\n📧 Updating site contact information...")
    site = get_existing_site()
    if not site:
        print("❌ Site not found")
        return False
    
    # Handle both Strapi v4 (attributes) and v5 (flat) structures
    site_attrs = site.get('attributes', {}) if 'attributes' in site else site
    document_id = site.get('documentId') or site_attrs.get('documentId')
    site_id = site.get('id') or site_attrs.get('id')
    
    if not document_id and not site_id:
        print("❌ Could not find site ID")
        print(f"   Site keys: {list(site.keys())}")
        return False
    
    # Update data with contact fields
    update_data = {
        "data": {
            "email": "info@geldgeregeld.nl",
            "phone": "085-0480881",
            "kvkNumber": "64859525",
        }
    }
    
    # Try Content Manager API first (more flexible, works with documentId)
    if document_id:
        admin_url = f"{STRAPI_URL}/admin/content-manager/collection-types/api::site.site/{document_id}"
        try:
            print(f"   Trying Admin Content Manager API (documentId: {document_id})...")
            response = requests.put(admin_url, headers=HEADERS, json=update_data, timeout=10)
            if response.status_code == 200:
                print("✅ Site contact info updated successfully via Admin Content Manager API")
                return True
            else:
                print(f"   Admin Content Manager API returned: {response.status_code}")
                if response.status_code != 404:
                    print(f"   Response: {response.text[:300]}")
        except Exception as e:
            print(f"   Admin Content Manager API error: {e}")
    
    # Fallback to Content API - use documentId first (Strapi v5)
    if document_id:
        url = f"{STRAPI_URL}/api/sites/{document_id}"
        print(f"   Trying Content API (documentId: {document_id})...")
    else:
        url = f"{STRAPI_URL}/api/sites/{site_id}"
        print(f"   Trying Content API (id: {site_id})...")
    
    try:
        response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        if response.status_code == 200:
            print("✅ Site contact info updated successfully via Content API")
            print(f"   Email: info@geldgeregeld.nl")
            print(f"   Phone: 085-0480881")
            print(f"   KVK: 64859525")
            return True
        else:
            print(f"❌ Failed to update contact info: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            print("\n⚠️  Note: If you see 'Invalid key email/phone/kvkNumber', the site schema needs to be updated first.")
            print("   The schema file has been updated in cms/src/api/site/content-types/site/schema.json")
            print("   You need to rebuild/redeploy the CMS for the changes to take effect.")
            return False
    except Exception as e:
        print(f"❌ Error updating contact info: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔄 Updating site contact information via CLI...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = update_site_contact_info()
    
    if success:
        print("\n✅ Contact information updated successfully!")
        print("\n📝 Next steps:")
        print("   1. Rebuild/redeploy the CMS if schema was updated")
        print("   2. Components will automatically fetch email, phone, and KVK from Strapi")
        return 0
    else:
        print("\n❌ Failed to update contact information")
        return 1

if __name__ == "__main__":
    exit(main())
