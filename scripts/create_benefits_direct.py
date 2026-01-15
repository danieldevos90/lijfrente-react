#!/usr/bin/env python3
"""
Create benefit content type and populate with SEO-optimized benefits via CLI
This script creates the content type via API and then adds the benefits
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
        'textColor': '#1e2021',
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
        'textColor': '#1e2021',
        'featured': True,
        'order': 2,
    },
]

def create_benefit_content_type():
    """Create benefit content type via Content-Type Builder API"""
    print("📤 Creating benefit content type via API...")
    
    content_type_data = {
        "contentType": {
            "kind": "collectionType",
            "collectionName": "benefits",
            "info": {
                "singularName": "benefit",
                "pluralName": "benefits",
                "displayName": "Benefit",
                "description": "SEO-optimized benefit content with metadata"
            },
            "options": {
                "draftAndPublish": True
            },
            "attributes": {
                "siteId": {"type": "string", "required": True},
                "slug": {"type": "uid", "targetField": "title", "required": True},
                "title": {"type": "string", "required": True},
                "description": {"type": "text", "required": True},
                "shortDescription": {"type": "string"},
                "metaDescription": {"type": "text"},
                "metaKeywords": {"type": "string"},
                "metaTitle": {"type": "string"},
                "iconPath": {"type": "string"},
                "color": {"type": "string", "default": "#fff2b2"},
                "textColor": {"type": "string", "default": "#1e2021"},
                "featured": {"type": "boolean", "default": False},
                "order": {"type": "integer", "default": 0}
            }
        }
    }
    
    url = f"{STRAPI_URL}/api/content-type-builder/content-types"
    try:
        response = requests.post(url, headers=HEADERS, json=content_type_data, timeout=30)
        if response.status_code in [200, 201]:
            print("  ✅ Content type created!")
            return True
        elif response.status_code == 400:
            error_data = response.json()
            error_msg = str(error_data.get('error', {}).get('message', 'Unknown error')).lower()
            if 'already exists' in error_msg or 'duplicate' in error_msg:
                print("  ⚠️  Content type already exists (this is OK)")
                return True
            print(f"  ⚠️  Failed: {error_data.get('error', {}).get('message', 'Unknown error')}")
        else:
            print(f"  ⚠️  Failed: {response.status_code}")
            print(f"  Response: {response.text[:300]}")
    except Exception as e:
        print(f"  ⚠️  Error: {e}")
    
    return False

def enable_permissions():
    """Enable public find and findOne permissions"""
    print("\n🔐 Enabling permissions...")
    
    url = f"{STRAPI_URL}/api/users-permissions/roles/public"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  ⚠️  Could not fetch role: {response.status_code}")
            return False
        
        role_data = response.json()
        permissions = role_data.get('permissions', [])
        
        benefit_permissions = [p for p in permissions if 'benefit' in p.get('action', '')]
        
        if not benefit_permissions:
            print("  ⚠️  Benefit permissions not found yet. May need to wait for content type to sync.")
            return False
        
        updates = {}
        for perm in benefit_permissions:
            action = perm.get('action', '')
            if 'find' in action.lower():
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
        
    except Exception as e:
        print(f"  ⚠️  Error: {e}")
    
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
        pass
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
            "textColor": benefit_data.get('textColor', '#1e2021'),
            "featured": benefit_data.get('featured', False),
            "order": benefit_data.get('order', 0),
            "publishedAt": None,
        }
    }
    
    # Update existing benefit
    if existing:
        benefit_id = existing['id']
        url = f"{STRAPI_URL}/api/benefits/{benefit_id}"
        try:
            print(f"  📝 Updating: {title}")
            response = requests.put(url, headers=HEADERS, json=strapi_data, timeout=10)
            if response.status_code in [200, 201]:
                print(f"  ✅ Updated: {title}")
                # Publish
                publish_url = f"{STRAPI_URL}/api/benefits/{benefit_id}/actions/publish"
                requests.put(publish_url, headers=HEADERS, timeout=10)
                return True
            else:
                print(f"  ⚠️  Failed: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
    else:
        # Create new benefit
        url = f"{STRAPI_URL}/api/benefits"
        try:
            print(f"  📤 Creating: {title}")
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
                print(f"  ⚠️  Failed: {response.status_code}")
                print(f"  Response: {response.text[:200]}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    return False

def main():
    """Main execution"""
    print("=" * 80)
    print("✨ CREATING BENEFIT CONTENT TYPE AND SEO-OPTIMIZED BENEFITS")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Benefits to create: {len(BENEFITS)}")
    print()
    
    # Step 1: Create content type
    content_type_created = create_benefit_content_type()
    
    if content_type_created:
        print("\n⏳ Waiting 5 seconds for content type to sync...")
        time.sleep(5)
    
    # Step 2: Enable permissions
    enable_permissions()
    time.sleep(2)
    
    # Step 3: Create benefits
    print(f"\n📝 Creating/updating {len(BENEFITS)} benefits...")
    success_count = 0
    
    for benefit in BENEFITS:
        if create_or_update_benefit(benefit):
            success_count += 1
        time.sleep(1)
    
    print("\n" + "=" * 80)
    print(f"✅ Successfully processed {success_count}/{len(BENEFITS)} benefits")
    print("=" * 80)
    
    if success_count == len(BENEFITS):
        print("\n🎉 All benefits created successfully!")
        print("\n📋 Created benefits:")
        for benefit in BENEFITS:
            print(f"   • {benefit['title']} (slug: {benefit['slug']})")
        return 0
    else:
        print(f"\n⚠️  Some benefits failed to create. Check the errors above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
