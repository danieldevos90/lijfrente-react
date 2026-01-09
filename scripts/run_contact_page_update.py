#!/usr/bin/env python3
"""
Run contact page update using populate script function

USAGE:
    export STRAPI_API_TOKEN='your-token-here'
    python3 scripts/run_contact_page_update.py
"""

import sys
import os

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import from populate script
from populate_strapi_content import create_contact_page, STRAPI_URL, SITE_ID

def main():
    print("🔄 Updating contact page using populate script...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    try:
        result = create_contact_page()
        if result:
            print("\n✅ Contact page updated successfully!")
            return 0
        else:
            print("\n❌ Failed to update contact page")
            return 1
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
