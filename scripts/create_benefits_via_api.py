#!/usr/bin/env python3
"""
Create benefit content type entries with SEO-optimized content
Adds two key benefits: geen wachttijden and geen bijkomende kosten
"""

import os
import sys
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_API_TOKEN', 'd99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_API_TOKEN is required")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

BENEFITS = [
    {
        'title': 'Geen wachttijden',
        'slug': 'geen-wachttijden',
        'description': 'Snel geregeld zonder lange wachttijden. Bij ons krijg je binnen 24 uur een beslissing op je aanvraag. Geen maanden wachten op goedkeuring - wij begrijpen dat tijd geld is voor jouw bedrijf.',
        'shortDescription': 'Snel geregeld zonder lange wachttijden',
        'metaTitle': 'Geen wachttijden - Snel zakelijke lening geregeld | GeldGeregeld',
        'metaDescription': 'Geen wachttijden bij GeldGeregeld. Snel een zakelijke lening geregeld binnen 24 uur. Geen maanden wachten - direct beslissing op je aanvraag.',
        'metaKeywords': 'geen wachttijden, snel zakelijke lening, snelle financiering, zakelijke lening zonder wachttijd, snel geld lenen zakelijk',
        'iconPath': '/icons/SVG/finance/clock-fast.svg',
        'color': '#fff2b2',
        'textColor': '#5e5515',
        'featured': True,
        'order': 1,
    },
    {
        'title': 'Geen bijkomende kosten',
        'slug': 'geen-bijkomende-kosten',
        'description': 'Transparante tarieven zonder verborgen kosten. Geen opstartkosten, geen verborgen fees, geen verrassingen. Je betaalt alleen wat je afspreekt - volledig transparant en eerlijk.',
        'shortDescription': 'Transparante tarieven zonder verborgen kosten',
        'metaTitle': 'Geen bijkomende kosten - Transparante zakelijke lening | GeldGeregeld',
        'metaDescription': 'Geen bijkomende kosten bij GeldGeregeld. Transparante tarieven zonder verborgen fees. Geen opstartkosten, geen verrassingen - volledig eerlijk.',
        'metaKeywords': 'geen bijkomende kosten, transparante zakelijke lening, geen opstartkosten, zakelijke lening zonder verborgen kosten, transparante financiering',
        'iconPath': '/icons/SVG/finance/wallet.svg',
        'color': '#fff2b2',
        'textColor': '#5e5515',
        'featured': True,
        'order': 2,
    },
]

def check_content_type_exists():
    """Check if benefit content type exists"""
    # Try Content Manager API
    url = f"{STRAPI_URL}/api/content-manager/collection-types/api::benefit.benefit"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return True
    except:
        pass
    
    # Try Content API
    url = f"{STRAPI_URL}/api/benefits"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 404:
            return True
    except:
        pass
    
    return False

def check_benefit_exists(slug):
    """Check if a benefit with given slug already exists"""
    url = f"{STRAPI_URL}/api/benefits?filters[slug][$eq]={slug}&filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"  ⚠️ Error checking benefit: {e}")
    return None

def create_or_update_benefit(benefit_data):
    """Create or update a benefit"""
    slug = benefit_data['slug']
    title = benefit_data['title']
    
    # Check if benefit already exists
    existing = check_benefit_exists(slug)
    
    strapi_data = {
        "data": {
            "siteId": SITE_ID,
            "slug": slug,
            "title": benefit_data['title'],
            "description": benefit_data['description'],
            "shortDescription": benefit_data.get('shortDescription'),
            "metaDescription": benefit_data.get('metaDescription'),
            "metaKeywords": benefit_data.get('metaKeywords'),
            "metaTitle": benefit_data.get('metaTitle'),
            "iconPath": benefit_data.get('iconPath'),
            "color": benefit_data.get('color', '#fff2b2'),
            "textColor": benefit_data.get('textColor', '#5e5515'),
            "featured": benefit_data.get('featured', False),
            "order": benefit_data.get('order', 0),
            "publishedAt": None,  # Will be published after creation
        }
    }
    
    # Update existing benefit
    if existing:
        benefit_id = existing['id']
        # Try Content Manager API first
        url = f"{STRAPI_URL}/api/content-manager/collection-types/api::benefit.benefit/{benefit_id}"
        try:
            print(f"  📝 Updating via Admin API: {title}")
            response = requests.put(url, headers=HEADERS, json=strapi_data, timeout=10)
            if response.status_code in [200, 201]:
                print(f"  ✅ Updated: {title}")
                # Publish
                publish_url = f"{STRAPI_URL}/api/content-manager/collection-types/api::benefit.benefit/{benefit_id}/actions/publish"
                requests.put(publish_url, headers=HEADERS, timeout=10)
                return True
        except Exception as e:
            print(f"  ⚠️ Admin API error: {e}")
        
        # Try Content API
        url = f"{STRAPI_URL}/api/benefits/{benefit_id}"
        try:
            print(f"  📝 Updating via Content API: {title}")
            response = requests.put(url, headers=HEADERS, json=strapi_data, timeout=10)
            if response.status_code in [200, 201]:
                print(f"  ✅ Updated: {title}")
                # Publish
                publish_url = f"{STRAPI_URL}/api/benefits/{benefit_id}/actions/publish"
                requests.put(publish_url, headers=HEADERS, timeout=10)
                return True
            else:
                print(f"  ⚠️ Failed: {response.status_code}")
                print(f"  Response: {response.text[:200]}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
    else:
        # Create new benefit
        # Try Content Manager API first
        url = f"{STRAPI_URL}/api/content-manager/collection-types/api::benefit.benefit"
        try:
            print(f"  📤 Creating via Admin API: {title}")
            response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
            if response.status_code in [200, 201]:
                print(f"  ✅ Created: {title}")
                benefit_id = response.json().get('data', {}).get('id')
                if benefit_id:
                    # Publish
                    publish_url = f"{STRAPI_URL}/api/content-manager/collection-types/api::benefit.benefit/{benefit_id}/actions/publish"
                    requests.put(publish_url, headers=HEADERS, timeout=10)
                return True
        except Exception as e:
            print(f"  ⚠️ Admin API error: {e}")
        
        # Try Content API
        url = f"{STRAPI_URL}/api/benefits"
        try:
            print(f"  📤 Creating via Content API: {title}")
            response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
            if response.status_code in [200, 201]:
                print(f"  ✅ Created: {title}")
                benefit_id = response.json().get('data', {}).get('id')
                if benefit_id:
                    # Publish
                    publish_url = f"{STRAPI_URL}/api/benefits/{benefit_id}/actions/publish"
                    requests.put(publish_url, headers=HEADERS, timeout=10)
                return True
            else:
                print(f"  ⚠️ Failed: {response.status_code}")
                print(f"  Response: {response.text[:200]}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    return False

def enable_permissions():
    """Enable public find and findOne permissions for benefits"""
    print("\n🔐 Enabling permissions for benefits...")
    
    url = f"{STRAPI_URL}/api/users-permissions/roles/public"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  ⚠️ Could not fetch role: {response.status_code}")
            return False
        
        role_data = response.json()
        permissions = role_data.get('permissions', [])
        
        # Find benefit permissions
        benefit_permissions = [p for p in permissions if 'benefit' in p.get('action', '')]
        
        if not benefit_permissions:
            print("  ⚠️ Benefit permissions not found. Content type may need to be created first.")
            return False
        
        # Enable find and findOne
        updates = {}
        for perm in benefit_permissions:
            action = perm.get('action', '')
            if 'find' in action or 'findone' in action:
                updates[perm['id']] = True
        
        if updates:
            update_url = f"{STRAPI_URL}/api/users-permissions/roles/public"
            update_data = {
                "permissions": [
                    {"id": pid, "enabled": enabled}
                    for pid, enabled in updates.items()
                ]
            }
            
            response = requests.put(update_url, headers=HEADERS, json=update_data, timeout=10)
            if response.status_code == 200:
                print("  ✅ Permissions enabled")
                return True
            else:
                print(f"  ⚠️ Failed to update permissions: {response.status_code}")
        
    except Exception as e:
        print(f"  ⚠️ Error: {e}")
    
    return False

def main():
    """Main execution"""
    print("=" * 80)
    print("✨ CREATING SEO-OPTIMIZED BENEFITS")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Benefits to create: {len(BENEFITS)}")
    print()
    
    # Check if content type exists
    print("📋 Checking if benefit content type exists...")
    if not check_content_type_exists():
        print("  ⚠️ Benefit content type not found!")
        print("  💡 Please ensure the CMS is deployed and the benefit content type is created.")
        print("  💡 You may need to:")
        print("     1. Deploy the CMS: cd cms && npm run deploy")
        print("     2. Wait for Strapi Cloud to sync (30-60 seconds)")
        print("     3. Run this script again")
        sys.exit(1)
    else:
        print("  ✅ Benefit content type exists")
    
    # Enable permissions
    enable_permissions()
    
    # Create benefits
    print(f"\n📝 Creating/updating {len(BENEFITS)} benefits...")
    success_count = 0
    
    for benefit in BENEFITS:
        print(f"\n📌 Processing: {benefit['title']}")
        if create_or_update_benefit(benefit):
            success_count += 1
        time.sleep(1)  # Rate limiting
    
    print("\n" + "=" * 80)
    print(f"✅ Successfully processed {success_count}/{len(BENEFITS)} benefits")
    print("=" * 80)
    
    if success_count == len(BENEFITS):
        print("\n🎉 All benefits created successfully!")
        print("\n📋 Created benefits:")
        for benefit in BENEFITS:
            print(f"   • {benefit['title']} (slug: {benefit['slug']})")
    else:
        print(f"\n⚠️ Some benefits failed to create. Check the errors above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
