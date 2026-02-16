#!/usr/bin/env python3
"""
Enable permissions for sector-page content type via Strapi Admin API
This script uses the admin API to enable permissions programmatically
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

def enable_sector_page_permissions():
    """Enable permissions for sector-page content type"""
    print("=" * 80)
    print("🔐 ENABLING PERMISSIONS FOR SECTOR-PAGE CONTENT TYPE")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}\n")

    try:
        # Step 1: Get the Public role
        print("1. Fetching Public role...")
        roles_url = f"{STRAPI_URL}/api/users-permissions/roles"
        roles_response = requests.get(roles_url, headers=HEADERS, timeout=10)
        
        if not roles_response.ok:
            print(f"❌ Failed to fetch roles: {roles_response.status_code}")
            print(f"Response: {roles_response.text}")
            return False

        roles_data = roles_response.json()
        public_role = None
        
        if isinstance(roles_data, dict) and 'roles' in roles_data:
            roles_list = roles_data['roles']
        else:
            roles_list = roles_data if isinstance(roles_data, list) else []

        for role in roles_list:
            if role.get('type') == 'public':
                public_role = role
                break

        if not public_role:
            print("❌ Public role not found")
            return False

        print(f"✅ Found Public role (ID: {public_role.get('id')})\n")

        # Step 2: Get current permissions
        print("2. Fetching current permissions...")
        role_id = public_role.get('id')
        role_url = f"{STRAPI_URL}/api/users-permissions/roles/{role_id}"
        role_response = requests.get(role_url, headers=HEADERS, timeout=10)

        if not role_response.ok:
            print(f"❌ Failed to fetch role permissions: {role_response.status_code}")
            print(f"Response: {role_response.text}")
            return False

        role_data = role_response.json()
        role_obj = role_data.get('role', {}) if isinstance(role_data, dict) else role_data
        
        # Handle different permission structures
        if isinstance(role_obj, dict):
            current_permissions = role_obj.get('permissions', [])
        elif isinstance(role_obj, list):
            current_permissions = role_obj
        else:
            current_permissions = []

        # Ensure permissions is a list
        if not isinstance(current_permissions, list):
            if isinstance(current_permissions, dict):
                # If it's a dict, try to extract permissions
                current_permissions = current_permissions.get('permissions', [])
            else:
                current_permissions = []

        print(f"✅ Found {len(current_permissions)} existing permissions\n")

        # Step 3: Add sector-page permissions
        print("3. Adding sector-page permissions...")
        sector_page_actions = [
            'api::sector-page.sector-page.find',
            'api::sector-page.sector-page.findOne',
            'api::sector-page.sector-page.create',
            'api::sector-page.sector-page.update',
        ]

        # Check which permissions already exist
        # Handle both string and object formats
        existing_actions = set()
        for p in current_permissions:
            if isinstance(p, str):
                existing_actions.add(p)
            elif isinstance(p, dict):
                action = p.get('action')
                if action:
                    existing_actions.add(action)
        
        new_permissions = []

        for action in sector_page_actions:
            if action not in existing_actions:
                new_permissions.append({
                    'action': action,
                    'subject': None,
                    'properties': {},
                    'conditions': [],
                    'role': role_id
                })
                print(f"   + Adding: {action}")
            else:
                print(f"   ✓ Already exists: {action}")

        if not new_permissions:
            print("\n✅ All sector-page permissions already exist!")
            return True

        # Merge permissions - ensure both are lists
        if not isinstance(current_permissions, list):
            current_permissions = []
        if not isinstance(new_permissions, list):
            new_permissions = []
        
        all_permissions = list(current_permissions) + list(new_permissions)

        # Step 4: Update role with new permissions
        print(f"\n4. Updating role with {len(new_permissions)} new permissions...")
        update_data = {
            'permissions': all_permissions
        }

        update_response = requests.put(
            role_url,
            headers=HEADERS,
            json=update_data,
            timeout=10
        )

        if not update_response.ok:
            print(f"❌ Failed to update permissions: {update_response.status_code}")
            print(f"Response: {update_response.text}")
            return False

        print("✅ Successfully updated permissions\n")

        # Step 5: Verify permissions
        print("5. Verifying permissions...")
        verify_response = requests.get(role_url, headers=HEADERS, timeout=10)
        verify_data = verify_response.json()
        verify_role = verify_data.get('role', {}) if isinstance(verify_data, dict) else verify_data
        verify_permissions = verify_role.get('permissions', []) if isinstance(verify_role, dict) else []

        # Handle both string and object permission formats
        sector_page_perms = []
        for p in verify_permissions:
            if isinstance(p, str):
                if p.startswith('api::sector-page.sector-page.'):
                    sector_page_perms.append(p)
            elif isinstance(p, dict):
                action = p.get('action', '')
                if action.startswith('api::sector-page.sector-page.'):
                    sector_page_perms.append(action)

        print(f"✅ Found {len(sector_page_perms)} sector-page permissions:")
        for perm in sector_page_perms:
            print(f"   - {perm}")

        print("\n" + "=" * 80)
        print("🎉 PERMISSIONS ENABLED SUCCESSFULLY!")
        print("=" * 80)
        print("\nYou can now create sector pages via API.")
        print("Run: python3 scripts/create_sector_page.py\n")

        return True

    except requests.exceptions.RequestException as e:
        print(f"\n❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = enable_sector_page_permissions()
    exit(0 if success else 1)

