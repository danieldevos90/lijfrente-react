#!/usr/bin/env python3
"""
Create the team-member content type via Strapi Content-Type Builder API
"""

import os
import sys
import requests
import json

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', os.getenv('STRAPI_API_TOKEN', ''))

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required")
    print("   Set it in your .env.local or export it:")
    print("   export STRAPI_TOKEN='your-token-here'")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def check_content_type_exists():
    """Check if team-member content type already exists"""
    url = f"{STRAPI_URL}/api/content-type-builder/content-types/api::team-member.team-member"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            print("✅ Team-member content type already exists!")
            return True
    except Exception as e:
        print(f"  ⚠️ Error checking: {e}")
    return False

def create_team_member_content_type():
    """Create the team-member content type via Content-Type Builder API"""
    print("=" * 80)
    print("🏗️  CREATING TEAM-MEMBER CONTENT TYPE")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}\n")
    
    # Check if it already exists
    print("1. Checking if content type already exists...")
    if check_content_type_exists():
        return True
    
    print("2. Creating team-member content type...")
    
    content_type_data = {
        "contentType": {
            "kind": "collectionType",
            "collectionName": "team_members",
            "info": {
                "singularName": "team-member",
                "pluralName": "team-members",
                "displayName": "Team Member",
                "description": "Team member profiles for the about us page"
            },
            "options": {
                "draftAndPublish": True
            },
            "attributes": {
                "siteId": {
                    "type": "string",
                    "required": True
                },
                "name": {
                    "type": "string",
                    "required": True
                },
                "role": {
                    "type": "string",
                    "required": True
                },
                "bio": {
                    "type": "text",
                    "required": True
                },
                "email": {
                    "type": "email"
                },
                "linkedin": {
                    "type": "string"
                },
                "image": {
                    "type": "media",
                    "multiple": False,
                    "required": False,
                    "allowedTypes": ["images"]
                },
                "order": {
                    "type": "integer",
                    "default": 0
                }
            }
        }
    }
    
    url = f"{STRAPI_URL}/api/content-type-builder/content-types"
    try:
        print(f"  📤 POST {url}")
        response = requests.post(url, headers=HEADERS, json=content_type_data, timeout=30)
        print(f"  📥 Response status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("  ✅ Content type created successfully!")
            return True
        else:
            print(f"  ⚠️ Failed to create: {response.status_code}")
            print(f"  Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"  ❌ Error creating content type: {e}")
        return False

def enable_permissions():
    """Enable public permissions for team-member"""
    print("\n3. Enabling public permissions...")
    
    # Get current permissions
    url = f"{STRAPI_URL}/api/users-permissions/roles/1"  # Public role ID is usually 1
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  ⚠️ Could not fetch permissions: {response.status_code}")
            return False
        
        role_data = response.json()
        permissions = role_data.get('permissions', {})
        
        # Update team-member permissions
        if 'api::team-member.team-member' not in permissions:
            permissions['api::team-member.team-member'] = {}
        
        team_perms = permissions['api::team-member.team-member']
        team_perms['find'] = True
        team_perms['findOne'] = True
        team_perms['create'] = False  # Public can't create
        team_perms['update'] = False  # Public can't update
        team_perms['delete'] = False  # Public can't delete
        
        # Update role
        update_url = f"{STRAPI_URL}/api/users-permissions/roles/1"
        update_data = {
            **role_data,
            'permissions': permissions
        }
        
        update_response = requests.put(update_url, headers=HEADERS, json=update_data, timeout=10)
        if update_response.status_code == 200:
            print("  ✅ Permissions enabled!")
            return True
        else:
            print(f"  ⚠️ Failed to update permissions: {update_response.status_code}")
            print(f"  Response: {update_response.text[:200]}")
            return False
    except Exception as e:
        print(f"  ⚠️ Error enabling permissions: {e}")
        print("  You may need to enable them manually in Strapi Admin:")
        print("  Settings > Users & Permissions Plugin > Roles > Public")
        print("  Enable: find, findOne for Team-member")
        return False

def main():
    """Main execution"""
    success = create_team_member_content_type()
    
    if success:
        # Wait a bit for Strapi to process
        import time
        time.sleep(2)
        
        # Try to enable permissions
        enable_permissions()
        
        print("\n" + "=" * 80)
        print("✅ CONTENT TYPE CREATED SUCCESSFULLY!")
        print("=" * 80)
        print("\nNext step: Run the script to create team members:")
        print("  python3 scripts/create_team_members.py")
        print("\n" + "=" * 80)
        return True
    else:
        print("\n" + "=" * 80)
        print("❌ FAILED TO CREATE CONTENT TYPE")
        print("=" * 80)
        print("\nYou may need to create it manually in Strapi Admin:")
        print("1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin")
        print("2. Navigate to: Content-Type Builder")
        print("3. Click: 'Create new collection type'")
        print("4. Display name: 'Team Member'")
        print("5. API ID (singular): 'team-member'")
        print("6. API ID (plural): 'team-members'")
        print("7. Add fields: siteId (Text, Required), name (Text, Required),")
        print("   role (Text, Required), bio (Text, Required), email (Email),")
        print("   linkedin (Text), image (Media, Single), order (Number)")
        print("8. Enable permissions: Settings > Users & Permissions > Roles > Public")
        print("   Enable: find, findOne for Team-member")
        print("\n" + "=" * 80)
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
