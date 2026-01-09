#!/usr/bin/env python3
"""
Update site address via CLI/API
This script updates the site address fields after the schema has been updated.

USAGE:
    export STRAPI_TOKEN='your-token-here'
    python3 scripts/update_site_address_cli.py
"""

import os
import requests
import json
from typing import Dict, Any, Optional

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN', 'd99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad')

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
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"❌ Error fetching site: {e}")
    return None

def update_site_address():
    """Update site address to Roggestraat 7, 7311 ca apeldoorn"""
    print("📍 Updating site address...")
    site = get_existing_site()
    if not site:
        print("❌ Site not found")
        return False
    
    # Get site ID - try documentId first (Strapi v5), then id (Strapi v4)
    document_id = site.get('documentId')
    site_id = site.get('id')
    
    if not document_id and not site_id:
        print("❌ Could not find site ID")
        print(f"   Site keys: {list(site.keys())}")
        return False
    
    # Update data with address fields
    update_data = {
        "data": {
            "address": "Roggestraat 7",
            "postalCode": "7311 CA",
            "city": "Apeldoorn",
            "companyName": "GeldGeregeld B.V.",
            "country": "Nederland",
        }
    }
    
    # Try with documentId first (Strapi v5)
    if document_id:
        url = f"{STRAPI_URL}/api/sites/{document_id}"
        print(f"   Trying with documentId: {document_id}")
    else:
        url = f"{STRAPI_URL}/api/sites/{site_id}"
        print(f"   Trying with id: {site_id}")
    try:
        response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        if response.status_code == 200:
            print("✅ Site address updated successfully")
            return True
        else:
            print(f"❌ Failed to update address: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            print("\n⚠️  Note: If you see 'Invalid key address', the site schema needs to be updated first.")
            print("   The schema file has been updated in cms/src/api/site/content-types/site/schema.json")
            print("   You need to rebuild/redeploy the CMS for the changes to take effect.")
            return False
    except Exception as e:
        print(f"❌ Error updating address: {e}")
        return False

def main():
    print("🔄 Updating site address via CLI...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = update_site_address()
    
    if success:
        print("\n✅ Site address updated successfully!")
    else:
        print("\n❌ Failed to update site address")
        print("\nTo fix this:")
        print("1. The schema has been updated in cms/src/api/site/content-types/site/schema.json")
        print("2. Rebuild/redeploy your Strapi CMS")
        print("3. Run this script again")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
