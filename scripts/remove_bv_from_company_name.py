#!/usr/bin/env python3
"""
Remove "B.V." from company name in footer via Strapi API

USAGE:
    python3 scripts/remove_bv_from_company_name.py --token YOUR_API_TOKEN
    
    OR
    
    export STRAPI_TOKEN='your-token-here'
    python3 scripts/remove_bv_from_company_name.py

Or set STRAPI_API_TOKEN environment variable instead.
"""

import os
import sys
import requests
import json
import argparse
from typing import Dict, Any, Optional

# Parse command line arguments
parser = argparse.ArgumentParser(description='Remove B.V. from company name in footer')
parser.add_argument('--token', help='Strapi API token')
args = parser.parse_args()

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = args.token or os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required")
    print("   Usage: python3 scripts/remove_bv_from_company_name.py --token YOUR_API_TOKEN")
    print("   Or: export STRAPI_TOKEN='your-token-here' && python3 scripts/remove_bv_from_company_name.py")
    exit(1)

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

def remove_bv_from_company_name():
    """Remove 'B.V.' from company name"""
    print("\n🏢 Removing 'B.V.' from company name...")
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
    
    # Get current company name
    current_company_name = site_attrs.get('companyName', '') if 'attributes' in site else site.get('companyName', '')
    print(f"   Current company name: '{current_company_name}'")
    
    # Remove "B.V." (case-insensitive, handle variations)
    new_company_name = current_company_name.replace(' B.V.', '').replace(' B.V', '').replace(' B.V.', '').strip()
    new_company_name = new_company_name.replace(' b.v.', '').replace(' b.v', '').strip()
    
    if new_company_name == current_company_name:
        print(f"   No 'B.V.' found in company name, nothing to update")
        return True
    
    print(f"   New company name: '{new_company_name}'")
    
    # Update data
    update_data = {
        "data": {
            "companyName": new_company_name
        }
    }
    
    # Try Content Manager API first (more flexible, works with documentId)
    if document_id:
        admin_url = f"{STRAPI_URL}/admin/content-manager/collection-types/api::site.site/{document_id}"
        try:
            print(f"   Trying Admin Content Manager API (documentId: {document_id})...")
            response = requests.put(admin_url, headers=HEADERS, json=update_data, timeout=10)
            if response.status_code == 200:
                print("✅ Company name updated successfully via Admin Content Manager API")
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
            print("✅ Company name updated successfully via Content API")
            return True
        else:
            print(f"❌ Failed to update company name: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Error updating company name: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔄 Removing 'B.V.' from company name in footer...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = remove_bv_from_company_name()
    
    print("\n" + "="*50)
    if success:
        print("✅ Successfully updated company name")
        return 0
    else:
        print("❌ Failed to update company name")
        return 1

if __name__ == "__main__":
    exit(main())
