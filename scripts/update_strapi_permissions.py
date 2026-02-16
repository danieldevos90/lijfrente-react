#!/usr/bin/env python3
"""
Update Strapi permissions via API
This script enables sector-page permissions for the Public role
"""

import os
import requests
import json
import time

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_ADMIN_TOKEN')
if not STRAPI_TOKEN:
    raise SystemExit("Missing STRAPI_TOKEN (or STRAPI_ADMIN_TOKEN). Refusing to run without an explicit token.")

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def get_public_role():
    """Get the Public role"""
    url = f"{STRAPI_URL}/api/users-permissions/roles"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            roles = data.get('roles', []) if isinstance(data, dict) else data
            for role in roles:
                if role.get('type') == 'public':
                    return role
    except Exception as e:
        print(f"❌ Error fetching roles: {e}")
    return None

def get_role_permissions(role_id):
    """Get current permissions for a role"""
    url = f"{STRAPI_URL}/api/users-permissions/roles/{role_id}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            role = data.get('role', {}) if isinstance(data, dict) else data
            return role.get('permissions', [])
    except Exception as e:
        print(f"❌ Error fetching permissions: {e}")
    return []

def update_role_permissions(role_id, permissions):
    """Update role permissions"""
    url = f"{STRAPI_URL}/api/users-permissions/roles/{role_id}"
    try:
        response = requests.put(url, headers=HEADERS, json={'permissions': permissions}, timeout=30)
        return response.status_code in [200, 201]
    except Exception as e:
        print(f"❌ Error updating permissions: {e}")
        return False

def enable_sector_page_permissions():
    """Enable sector-page permissions"""
    print("=" * 80)
    print("🔐 UPDATING STRAPI PERMISSIONS VIA API")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}\n")
    
    # Step 1: Get Public role
    print("1. Fetching Public role...")
    public_role = get_public_role()
    if not public_role:
        print("❌ Public role not found")
        return False
    
    role_id = public_role.get('id')
    print(f"✅ Found Public role (ID: {role_id})\n")
    
    # Step 2: Get current permissions
    print("2. Fetching current permissions...")
    current_permissions = get_role_permissions(role_id)
    print(f"✅ Found {len(current_permissions)} existing permissions\n")
    
    # Step 3: Define required permissions
    required_actions = [
        'api::sector-page.sector-page.find',
        'api::sector-page.sector-page.findOne',
        'api::sector-page.sector-page.create',
        'api::sector-page.sector-page.update',
    ]
    
    # Step 4: Check existing permissions
    print("3. Checking sector-page permissions...")
    existing_actions = set()
    permission_objects = []
    
    for perm in current_permissions:
        if isinstance(perm, dict):
            action = perm.get('action', '')
            if action:
                existing_actions.add(action)
                permission_objects.append(perm)
        elif isinstance(perm, str):
            existing_actions.add(perm)
            permission_objects.append({'action': perm})
    
    # Step 5: Add missing permissions
    print("4. Adding missing permissions...")
    new_permissions = []
    for action in required_actions:
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
        print("\n✅ All sector-page permissions already enabled!")
        return True
    
    # Step 6: Merge permissions
    all_permissions = permission_objects + new_permissions
    
    # Step 7: Update role
    print(f"\n5. Updating role with {len(new_permissions)} new permissions...")
    if update_role_permissions(role_id, all_permissions):
        print("✅ Successfully updated permissions\n")
    else:
        print("❌ Failed to update permissions")
        return False
    
    # Step 8: Verify
    print("6. Verifying permissions...")
    time.sleep(2)  # Wait for update to propagate
    updated_permissions = get_role_permissions(role_id)
    sector_perms = [p for p in updated_permissions if isinstance(p, dict) and p.get('action', '').startswith('api::sector-page.sector-page.')]
    
    print(f"✅ Found {len(sector_perms)} sector-page permissions:")
    for perm in sector_perms:
        print(f"   - {perm.get('action')}")
    
    print("\n" + "=" * 80)
    print("🎉 PERMISSIONS UPDATED SUCCESSFULLY!")
    print("=" * 80)
    print("\nYou can now create sector pages via API.")
    print("Run: python3 scripts/generate_sector_pages_unsplash.py\n")
    
    return True

if __name__ == '__main__':
    success = enable_sector_page_permissions()
    exit(0 if success else 1)
