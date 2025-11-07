#!/usr/bin/env python3
"""
Create sector-page content type and components via Strapi Content-Type Builder API
This uses the Strapi Admin API to create content types programmatically
"""

import os
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def create_component(component_data):
    """Create a component via Content-Type Builder API"""
    url = f"{STRAPI_URL}/api/content-type-builder/components"
    
    try:
        response = requests.post(url, headers=HEADERS, json=component_data, timeout=30)
        if response.status_code in [200, 201]:
            return True, response.json()
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def create_content_type(content_type_data):
    """Create a content type via Content-Type Builder API"""
    url = f"{STRAPI_URL}/api/content-type-builder/content-types"
    
    try:
        response = requests.post(url, headers=HEADERS, json=content_type_data, timeout=30)
        if response.status_code in [200, 201]:
            return True, response.json()
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def create_use_case_component():
    """Create the use-case component"""
    print("1. Creating use-case component...")
    
    component_data = {
        "component": {
            "category": "sectors",
            "displayName": "Use Case",
            "icon": "star",
            "attributes": {
                "title": {
                    "type": "string",
                    "required": True
                },
                "description": {
                    "type": "text",
                    "required": True
                },
                "iconPath": {
                    "type": "string"
                },
                "color": {
                    "type": "string",
                    "default": "#fff2b2"
                },
                "textColor": {
                    "type": "string",
                    "default": "#5e5515"
                }
            }
        }
    }
    
    success, result = create_component(component_data)
    if success:
        print("   ✅ Created use-case component")
        return True
    else:
        if "already exists" in str(result).lower() or "duplicate" in str(result).lower():
            print("   ⚠️  Component already exists (this is OK)")
            return True
        print(f"   ❌ Failed: {result}")
        return False

def create_benefit_component():
    """Create the benefit component"""
    print("2. Creating benefit component...")
    
    component_data = {
        "component": {
            "category": "sectors",
            "displayName": "Sector Benefit",
            "icon": "star",
            "attributes": {
                "title": {
                    "type": "string",
                    "required": True
                },
                "description": {
                    "type": "text",
                    "required": True
                },
                "iconPath": {
                    "type": "string"
                },
                "color": {
                    "type": "string",
                    "default": "#fff2b2"
                },
                "textColor": {
                    "type": "string",
                    "default": "#5e5515"
                }
            }
        }
    }
    
    success, result = create_component(component_data)
    if success:
        print("   ✅ Created benefit component")
        return True
    else:
        if "already exists" in str(result).lower() or "duplicate" in str(result).lower():
            print("   ⚠️  Component already exists (this is OK)")
            return True
        print(f"   ❌ Failed: {result}")
        return False

def create_sector_page_content_type():
    """Create the sector-page content type"""
    print("3. Creating sector-page content type...")
    
    content_type_data = {
        "contentType": {
            "kind": "collectionType",
            "collectionName": "sector_pages",
            "info": {
                "singularName": "sector-page",
                "pluralName": "sector-pages",
                "displayName": "Sector Page",
                "description": "Dedicated pages for industry sectors with structured content for SEO"
            },
            "options": {
                "draftAndPublish": True
            },
            "attributes": {
                "siteId": {
                    "type": "string",
                    "required": True
                },
                "sectorSlug": {
                    "type": "uid",
                    "targetField": "sectorName",
                    "required": True
                },
                "sectorName": {
                    "type": "string",
                    "required": True
                },
                "metaDescription": {
                    "type": "text"
                },
                "metaKeywords": {
                    "type": "string"
                },
                "heroTitle": {
                    "type": "string"
                },
                "heroSubtitle": {
                    "type": "text"
                },
                "heroImage": {
                    "type": "media",
                    "multiple": False,
                    "required": False,
                    "allowedTypes": ["images"]
                },
                "easyLendingTitle": {
                    "type": "string"
                },
                "easyLendingContent": {
                    "type": "richtext"
                },
                "easyLendingImage": {
                    "type": "media",
                    "multiple": False,
                    "required": False,
                    "allowedTypes": ["images"]
                },
                "easyLendingImagePosition": {
                    "type": "enumeration",
                    "enum": ["left", "right", "top"],
                    "default": "left"
                },
                "useCasesTitle": {
                    "type": "string"
                },
                "useCasesSubtitle": {
                    "type": "text"
                },
                "useCases": {
                    "type": "component",
                    "repeatable": True,
                    "component": "sectors.use-case"
                },
                "benefitsTitle": {
                    "type": "string"
                },
                "benefitsSubtitle": {
                    "type": "text"
                },
                "benefits": {
                    "type": "component",
                    "repeatable": True,
                    "component": "sectors.benefit"
                },
                "ctaTitle": {
                    "type": "string"
                },
                "ctaSubtitle": {
                    "type": "text"
                },
                "ctaLabel": {
                    "type": "string",
                    "default": "Vraag financiering aan"
                },
                "ctaHref": {
                    "type": "string",
                    "default": "/lead"
                }
            }
        }
    }
    
    success, result = create_content_type(content_type_data)
    if success:
        print("   ✅ Created sector-page content type")
        return True
    else:
        if "already exists" in str(result).lower() or "duplicate" in str(result).lower():
            print("   ⚠️  Content type already exists (this is OK)")
            return True
        print(f"   ❌ Failed: {result}")
        return False

def main():
    """Main execution"""
    print("=" * 80)
    print("🏗️  CREATING CONTENT TYPE VIA STRAPI API")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}\n")
    
    # Create components first
    if not create_use_case_component():
        print("\n⚠️  Failed to create use-case component. Continuing anyway...")
    
    time.sleep(2)  # Small delay between requests
    
    if not create_benefit_component():
        print("\n⚠️  Failed to create benefit component. Continuing anyway...")
    
    time.sleep(2)  # Small delay between requests
    
    # Create content type
    if create_sector_page_content_type():
        print("\n" + "=" * 80)
        print("✅ CONTENT TYPE CREATED SUCCESSFULLY!")
        print("=" * 80)
        print("\nNext steps:")
        print("1. Enable permissions: python3 scripts/enable_sector_permissions.py")
        print("2. Create content: python3 scripts/create_sector_page.py")
        print("\n" + "=" * 80)
        return True
    else:
        print("\n" + "=" * 80)
        print("❌ FAILED TO CREATE CONTENT TYPE")
        print("=" * 80)
        print("\nYou may need to create it manually in Strapi Admin.")
        print("See MANUAL_CONTENT_TYPE_SETUP.md for instructions.")
        print("\n" + "=" * 80)
        return False

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)

