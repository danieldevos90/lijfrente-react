#!/bin/bash
# Complete CLI script to create benefit content type and populate with SEO-optimized benefits

set -e

STRAPI_URL="${STRAPI_URL:-https://bright-smile-1f47bc9d67.strapiapp.com}"
STRAPI_TOKEN="${STRAPI_API_TOKEN:-d99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad}"
SITE_ID="${SITE_ID:-geldgeregeld}"

echo "=================================================================================="
echo "✨ CREATING BENEFIT CONTENT TYPE AND SEO-OPTIMIZED BENEFITS VIA CLI"
echo "=================================================================================="
echo ""
echo "Strapi URL: $STRAPI_URL"
echo "Site ID: $SITE_ID"
echo ""

# Step 1: Deploy CMS to ensure content type is available
echo "Step 1: Building CMS..."
cd "$(dirname "$0")/../cms" || exit 1
npm run build
echo "✅ CMS built"
echo ""

# Step 2: Deploy to Strapi Cloud
echo "Step 2: Deploying CMS to Strapi Cloud..."
npm run deploy -- --force
echo "✅ CMS deployed"
echo ""

# Step 3: Wait for deployment to sync
echo "Step 3: Waiting for Strapi Cloud to sync (60 seconds)..."
sleep 60
echo "✅ Wait complete"
echo ""

# Step 4: Create content type via API
echo "Step 4: Creating benefit content type via API..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

python3 << 'PYTHON_SCRIPT'
import os
import sys
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN')
SITE_ID = os.getenv('SITE_ID')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def create_benefit_content_type():
    """Create benefit content type via Content-Type Builder API"""
    print("  📤 Creating benefit content type...")
    
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
            error_msg = error_data.get('error', {}).get('message', 'Unknown error')
            if 'already exists' in error_msg.lower() or 'duplicate' in error_msg.lower():
                print("  ⚠️  Content type already exists (this is OK)")
                return True
            print(f"  ⚠️  Failed: {error_msg}")
        else:
            print(f"  ⚠️  Failed: {response.status_code}")
            print(f"  Response: {response.text[:300]}")
    except Exception as e:
        print(f"  ⚠️  Error: {e}")
    
    return False

def enable_permissions():
    """Enable public find and findOne permissions"""
    print("  🔐 Enabling permissions...")
    
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
            print("  ⚠️  Benefit permissions not found yet. Will be set after content type is created.")
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

def create_benefits():
    """Create the two SEO-optimized benefits"""
    print("  📝 Creating benefits...")
    
    benefits = [
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
    
    success_count = 0
    
    for benefit in benefits:
        slug = benefit['slug']
        title = benefit['title']
        
        # Check if exists
        check_url = f"{STRAPI_URL}/api/benefits?filters[slug][$eq]={slug}&filters[siteId][$eq]={SITE_ID}"
        try:
            check_response = requests.get(check_url, headers=HEADERS, timeout=10)
            if check_response.status_code == 200:
                data = check_response.json()
                if data.get('data') and len(data['data']) > 0:
                    print(f"    ⚠️  {title} already exists, skipping...")
                    success_count += 1
                    continue
        except:
            pass
        
        # Create benefit
        strapi_data = {
            "data": {
                "siteId": SITE_ID,
                "slug": slug,
                "title": benefit['title'],
                "description": benefit['description'],
                "shortDescription": benefit.get('shortDescription'),
                "metaDescription": benefit.get('metaDescription'),
                "metaKeywords": benefit.get('metaKeywords'),
                "metaTitle": benefit.get('metaTitle'),
                "iconPath": benefit.get('iconPath'),
                "color": benefit.get('color', '#fff2b2'),
                "textColor": benefit.get('textColor', '#1e2021'),
                "featured": benefit.get('featured', False),
                "order": benefit.get('order', 0),
                "publishedAt": None,
            }
        }
        
        url = f"{STRAPI_URL}/api/benefits"
        try:
            print(f"    📤 Creating: {title}")
            response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
            if response.status_code in [200, 201]:
                benefit_id = response.json().get('data', {}).get('id')
                if benefit_id:
                    # Publish
                    publish_url = f"{STRAPI_URL}/api/benefits/{benefit_id}/actions/publish"
                    requests.put(publish_url, headers=HEADERS, timeout=10)
                print(f"    ✅ Created: {title}")
                success_count += 1
            else:
                print(f"    ⚠️  Failed: {response.status_code}")
                print(f"    Response: {response.text[:200]}")
        except Exception as e:
            print(f"    ❌ Error: {e}")
        
        time.sleep(1)
    
    return success_count == len(benefits)

# Main execution
if create_benefit_content_type():
    time.sleep(5)  # Wait for content type to be ready
    enable_permissions()
    time.sleep(2)
    if create_benefits():
        print("\n  🎉 All benefits created successfully!")
        sys.exit(0)
    else:
        print("\n  ⚠️  Some benefits failed to create")
        sys.exit(1)
else:
    print("\n  ⚠️  Content type creation failed or already exists")
    print("  💡 Trying to create benefits anyway...")
    time.sleep(5)
    if create_benefits():
        print("\n  🎉 Benefits created successfully!")
        sys.exit(0)
    else:
        print("\n  ❌ Failed to create benefits")
        sys.exit(1)
PYTHON_SCRIPT

echo ""
echo "=================================================================================="
echo "✅ COMPLETE"
echo "=================================================================================="
