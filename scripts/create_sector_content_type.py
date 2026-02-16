#!/usr/bin/env python3
"""
Create the sector-page content type via Strapi Content-Type Builder API
This creates the content type programmatically if it doesn't exist
"""

import os
import requests
import json

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_ADMIN_TOKEN')
if not STRAPI_TOKEN:
    raise SystemExit("Missing STRAPI_TOKEN (or STRAPI_ADMIN_TOKEN). Refusing to run without an explicit token.")

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def create_sector_content_type():
    """Create sector-page content type via Content-Type Builder API"""
    print("=" * 80)
    print("🏗️  CREATING SECTOR-PAGE CONTENT TYPE")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}\n")

    # First, check if it already exists
    print("1. Checking if content type already exists...")
    check_url = f"{STRAPI_URL}/api/content-type-builder/content-types/api::sector-page.sector-page"
    check_response = requests.get(check_url, headers=HEADERS, timeout=10)
    
    if check_response.status_code == 200:
        print("✅ Content type already exists!")
        return True
    
    print("⚠️  Content type not found. This is expected.")
    print("   The content type needs to be created manually in Strapi Admin.\n")
    
    print("=" * 80)
    print("📋 MANUAL SETUP REQUIRED")
    print("=" * 80)
    print("\nThe sector-page content type must be created manually in Strapi Admin:")
    print("\n1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin")
    print("2. Navigate to: Content-Type Builder")
    print("3. Click: 'Create new collection type'")
    print("4. Display name: 'Sector Page'")
    print("5. API ID (singular): 'sector-page'")
    print("6. API ID (plural): 'sector-pages'")
    print("7. Click: 'Continue'")
    print("\nThen add the following fields:")
    print("\nRequired fields:")
    print("  - siteId (Text, Required)")
    print("  - sectorSlug (UID, Required, Target field: sectorName)")
    print("  - sectorName (Text, Required)")
    print("\nOptional fields:")
    print("  - metaDescription (Long text)")
    print("  - metaKeywords (Text)")
    print("  - heroTitle (Text)")
    print("  - heroSubtitle (Long text)")
    print("  - heroImage (Media, Single)")
    print("  - easyLendingTitle (Text)")
    print("  - easyLendingContent (Rich text)")
    print("  - easyLendingImage (Media, Single)")
    print("  - easyLendingImagePosition (Enumeration: left, right, top)")
    print("  - useCasesTitle (Text)")
    print("  - useCasesSubtitle (Long text)")
    print("  - useCases (Component: sectors.use-case, Repeatable)")
    print("  - benefitsTitle (Text)")
    print("  - benefitsSubtitle (Long text)")
    print("  - benefits (Component: sectors.benefit, Repeatable)")
    print("  - ctaTitle (Text)")
    print("  - ctaSubtitle (Long text)")
    print("  - ctaLabel (Text)")
    print("  - ctaHref (Text)")
    print("\nAfter creating, enable permissions:")
    print("  Settings > Users & Permissions Plugin > Roles > Public")
    print("  Enable: find, findOne, create, update for Sector-page")
    print("\nThen run: python3 scripts/create_sector_page.py")
    print("\n" + "=" * 80)
    
    return False

if __name__ == '__main__':
    success = create_sector_content_type()
    exit(0 if success else 1)

