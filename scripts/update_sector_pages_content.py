#!/usr/bin/env python3
"""
Update all existing sector pages with comprehensive SEO-optimized Dutch content
Uses PUT to update existing pages (not create new ones)
"""

import os
import sys
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'b16b5a26631fb6e94de7fe8ac5e5fbaaeb97b28cb27a5497a151c0be226fe27ebe5e3341500f8539b14a60a82811f9b53536bea775e8e2649d3d8e6e92547712b1a226b6dfe579a47af90cbb1a65af8e7103c8fb3e0b9321f61fdf00e398d04c8a8068a152273b35a0fc4880803107f9e90f602c761951f557cd9a33b1cec0ac')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

# Import content generation functions from existing script
sys.path.insert(0, os.path.dirname(__file__))
try:
    from generate_sector_pages_unsplash import (
        generate_use_cases,
        generate_benefits,
        generate_quote,
        generate_easy_lending_content,
        SECTORS
    )
except ImportError:
    print("⚠️  Could not import from generate_sector_pages_unsplash.py")
    print("   Make sure that file exists in the same directory")
    sys.exit(1)

def get_existing_sector_page(sector_slug: str):
    """Get existing sector page"""
    url = f"{STRAPI_URL}/api/sector-pages?filters[sectorSlug][$eq]={sector_slug}&filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            pages = data.get('data', [])
            if pages:
                return pages[0]
    except Exception as e:
        print(f"  ⚠️ Error fetching existing page: {e}")
    return None

def update_sector_page(sector_slug: str, sector_info: dict):
    """Update existing sector page with comprehensive content"""
    existing = get_existing_sector_page(sector_slug)
    
    if not existing:
        print(f"  ⚠️  Sector page not found: {sector_slug} - skipping")
        return False
    
    # Strapi v5 uses documentId, v4 uses id
    page_id = existing.get('documentId') or existing.get('id')
    if not page_id:
        print(f"  ❌ No ID found for sector page: {sector_slug}")
        print(f"  Existing keys: {list(existing.keys())}")
        return False
    
    print(f"  📋 Found page ID: {page_id}")
    
    sector_name = sector_info['name']
    
    # Generate comprehensive content
    use_cases = generate_use_cases(sector_slug, sector_name)
    benefits = generate_benefits(sector_slug, sector_name)
    quote = generate_quote(sector_slug, sector_name)
    easy_lending_content = generate_easy_lending_content(sector_name)
    
    # Convert easy lending content to HTML if it's plain text
    if not easy_lending_content.startswith('<'):
        easy_lending_content = '<p>' + easy_lending_content.replace('\n\n', '</p><p>').replace('\n', '<br>') + '</p>'
    
    # Build update data
    page_data = {
        "data": {
            "heroTitle": f"Zakelijke financiering voor {sector_name.lower()}",
            "heroSubtitle": sector_info['description'],
            "metaDescription": sector_info['description'],
            "metaKeywords": ", ".join(sector_info['keywords']),
            "quote": quote,
            "quoteAuthor": None,
            "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
            "easyLendingContent": easy_lending_content,
            "easyLendingImagePosition": "left",
            "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
            "useCasesSubtitle": f"Veelzijdige financieringsoplossingen speciaal voor {sector_name.lower()}",
            "useCases": use_cases,
            "benefitsTitle": "Waarom kiezen voor GeldGeregeld?",
            "benefitsSubtitle": f"Voordelen speciaal voor {sector_name.lower()}",
            "benefits": benefits,
            "ctaTitle": "Klaar om te beginnen?",
            "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.",
            "ctaLabel": "Vraag financiering aan",
            "ctaHref": "/lead",
            "publishedAt": existing.get('publishedAt') or None  # Keep existing publish date
        }
    }
    
    # Try both documentId and id formats
    for id_field in ['documentId', 'id']:
        test_id = existing.get(id_field)
        if not test_id:
            continue
            
        update_url = f"{STRAPI_URL}/api/sector-pages/{test_id}"
        try:
            print(f"  📤 Updating {sector_slug} (using {id_field}: {test_id})...")
            response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=30)
        
            if response.status_code == 200:
                print(f"  ✅ Updated {sector_slug} successfully!")
                return True
            elif response.status_code == 404:
                # Try next ID format
                continue
            else:
                print(f"  ⚠️  Got {response.status_code}, trying next ID format...")
                continue
        except Exception as e:
            print(f"  ⚠️  Error with {id_field}: {e}, trying next...")
            continue
    
    # If we get here, both ID formats failed
    print(f"  ❌ Failed to update {sector_slug} with both ID formats")
    print(f"  Response: {response.text[:300] if 'response' in locals() else 'No response'}")
    return False

def main():
    print("=" * 80)
    print("📝 UPDATING SECTOR PAGES WITH COMPREHENSIVE SEO CONTENT")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Sectors to update: {len(SECTORS)}\n")
    
    # Test token first
    print("🔍 Testing API access...")
    test_url = f"{STRAPI_URL}/api/sector-pages?pagination[pageSize]=1"
    test_response = requests.get(test_url, headers=HEADERS, timeout=10)
    if test_response.status_code == 200:
        print("✅ API access confirmed\n")
    else:
        print(f"⚠️  API returned: {test_response.status_code}")
        if test_response.status_code == 401:
            print("❌ Authentication failed - check your STRAPI_TOKEN")
            sys.exit(1)
        print()
    
    results = []
    
    for sector_slug, sector_info in SECTORS.items():
        print(f"\n{'='*80}")
        print(f"📄 Processing: {sector_info['name']} ({sector_slug})")
        print(f"{'='*80}")
        
        try:
            if update_sector_page(sector_slug, sector_info):
                results.append((sector_slug, True))
            else:
                results.append((sector_slug, False))
            
            time.sleep(1)  # Rate limiting
            
        except Exception as e:
            print(f"  ❌ Error processing {sector_slug}: {e}")
            import traceback
            traceback.print_exc()
            results.append((sector_slug, False))
            time.sleep(1)
    
    # Summary
    print(f"\n{'='*80}")
    print("📊 SUMMARY")
    print(f"{'='*80}\n")
    
    success_count = sum(1 for _, success in results if success)
    failed_count = len(results) - success_count
    
    for sector_slug, success in results:
        status = "✅" if success else "❌"
        sector_name = SECTORS[sector_slug]['name']
        print(f"{status} {sector_name:30} ({sector_slug})")
    
    print(f"\n✅ Success: {success_count}/{len(SECTORS)}")
    if failed_count > 0:
        print(f"❌ Failed: {failed_count}/{len(SECTORS)}")
    
    print(f"\n🌐 View pages at: /sectoren/[sector-slug]")
    print(f"📝 Edit in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::sector-page.sector-page")

if __name__ == '__main__':
    main()
