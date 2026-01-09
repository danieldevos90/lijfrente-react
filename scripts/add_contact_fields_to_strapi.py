#!/usr/bin/env python3
"""
Add email, phone, and kvkNumber fields to Site content type via Strapi API
This uses the Content-Type Builder API to add fields programmatically.

USAGE:
    export STRAPI_API_TOKEN='your-token-here'
    python3 scripts/add_contact_fields_to_strapi.py
"""

import os
import requests
import json
from typing import Dict, Any

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_API_TOKEN environment variable is required")
    print("   export STRAPI_API_TOKEN='your-token-here'")
    exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def get_content_type():
    """Get the Site content type structure"""
    url = f"{STRAPI_URL}/api/content-type-builder/content-types/api::site.site"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:300]}")
            return None
    except Exception as e:
        print(f"❌ Error fetching content type: {e}")
        return None

def add_fields_to_content_type():
    """Add email, phone, and kvkNumber fields to Site content type"""
    print("\n📝 Adding contact fields to Site content type...")
    
    # Get current content type structure
    content_type = get_content_type()
    if not content_type:
        print("❌ Could not fetch content type structure")
        return False
    
    # Extract current attributes
    current_attrs = content_type.get('data', {}).get('schema', {}).get('attributes', {})
    
    # Check if fields already exist
    if 'email' in current_attrs:
        print("✅ Field 'email' already exists")
    else:
        current_attrs['email'] = {
            'type': 'string'
        }
    
    if 'phone' in current_attrs:
        print("✅ Field 'phone' already exists")
    else:
        current_attrs['phone'] = {
            'type': 'string'
        }
    
    if 'kvkNumber' in current_attrs:
        print("✅ Field 'kvkNumber' already exists")
    else:
        current_attrs['kvkNumber'] = {
            'type': 'string'
        }
    
    # Update content type
    update_data = {
        'contentType': {
            'schema': {
                'name': 'site',
                'attributes': current_attrs
            }
        }
    }
    
    url = f"{STRAPI_URL}/api/content-type-builder/content-types/api::site.site"
    try:
        response = requests.put(url, headers=HEADERS, json=update_data)
        if response.status_code == 200:
            print("✅ Successfully added contact fields to Site content type")
            print("   - email")
            print("   - phone")
            print("   - kvkNumber")
            print("\n⚠️  Note: You may need to restart Strapi for changes to take effect")
            return True
        else:
            print(f"❌ Failed to update content type: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Error updating content type: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🔄 Adding contact fields to Strapi Site content type...")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    success = add_fields_to_content_type()
    
    if success:
        print("\n✅ Fields added successfully!")
        print("\n📝 Next steps:")
        print("   1. Restart Strapi if needed")
        print("   2. Run: python3 scripts/update_site_contact_info.py")
        return 0
    else:
        print("\n❌ Failed to add fields")
        print("\n💡 Alternative: Add fields manually via Strapi Admin:")
        print("   1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin")
        print("   2. Navigate to: Content-Type Builder → Site")
        print("   3. Add fields: email (Text), phone (Text), kvkNumber (Text)")
        print("   4. Save")
        return 1

if __name__ == "__main__":
    exit(main())
