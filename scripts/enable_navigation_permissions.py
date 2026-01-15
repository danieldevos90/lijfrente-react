#!/usr/bin/env python3
"""
Enable navigation-item public permissions in Strapi
This ensures navigation items can be accessed without authentication
"""

import os
import requests
import json

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_API_TOKEN environment variable is required")
    exit(1)

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
            # Handle different response formats
            if isinstance(data, dict):
                roles = data.get('roles', [])
            elif isinstance(data, list):
                roles = data
            else:
                roles = []
            
            for role in roles:
                if isinstance(role, dict) and role.get('type') == 'public':
                    return role
            print(f"⚠️  Found {len(roles)} roles but no 'public' role")
            print(f"   Role types found: {[r.get('type') for r in roles if isinstance(r, dict)]}")
    except Exception as e:
        print(f"❌ Error fetching roles: {e}")
        import traceback
        traceback.print_exc()
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
        # Format permissions correctly
        formatted_perms = []
        for perm in permissions:
            if isinstance(perm, dict):
                formatted_perms.append({
                    'id': perm.get('id'),
                    'action': perm.get('action'),
                    'subject': perm.get('subject'),
                    'properties': perm.get('properties', {}),
                    'conditions': perm.get('conditions', []),
                    'role': role_id,
                    'enabled': perm.get('enabled', True)
                })
        
        response = requests.put(
            url, 
            headers=HEADERS, 
            json={'permissions': formatted_perms}, 
            timeout=30
        )
        return response.status_code in [200, 201]
    except Exception as e:
        print(f"❌ Error updating permissions: {e}")
        return False

def enable_navigation_permissions():
    """Enable navigation-item permissions"""
    print("=" * 80)
    print("🔐 ENABLING NAVIGATION-ITEM PUBLIC PERMISSIONS")
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
        'api::navigation-item.navigation-item.find',
        'api::navigation-item.navigation-item.findOne',
    ]
    
    # Step 4: Check existing permissions and enable them
    print("3. Checking navigation-item permissions...")
    permission_map = {}
    
    for perm in current_permissions:
        if isinstance(perm, dict):
            action = perm.get('action', '')
            if action:
                permission_map[action] = perm
    
    # Step 5: Enable required permissions
    print("4. Enabling navigation-item permissions...")
    updated = False
    
    for action in required_actions:
        if action in permission_map:
            perm = permission_map[action]
            if not perm.get('enabled', False):
                perm['enabled'] = True
                updated = True
                print(f"   ✓ Enabling: {action}")
            else:
                print(f"   ✓ Already enabled: {action}")
        else:
            # Create new permission
            permission_map[action] = {
                'action': action,
                'subject': None,
                'properties': {},
                'conditions': [],
                'role': role_id,
                'enabled': True
            }
            updated = True
            print(f"   + Adding: {action}")
    
    if not updated:
        print("\n✅ All navigation-item permissions already enabled!")
    else:
        # Step 6: Update role
        print(f"\n5. Updating role permissions...")
        all_permissions = list(permission_map.values())
        if update_role_permissions(role_id, all_permissions):
            print("✅ Successfully updated permissions\n")
        else:
            print("❌ Failed to update permissions")
            return False
    
    # Step 7: Verify
    print("6. Verifying permissions...")
    import time
    time.sleep(2)  # Wait for update to propagate
    updated_permissions = get_role_permissions(role_id)
    nav_perms = [
        p for p in updated_permissions 
        if isinstance(p, dict) and 
        p.get('action', '').startswith('api::navigation-item.navigation-item.')
    ]
    
    print(f"✅ Found {len(nav_perms)} navigation-item permissions:")
    for perm in nav_perms:
        enabled = perm.get('enabled', False)
        status = "✓ Enabled" if enabled else "✗ Disabled"
        print(f"   {status}: {perm.get('action')}")
    
    # Step 8: Test public endpoint
    print("\n7. Testing public endpoint...")
    test_url = f"{STRAPI_URL}/api/navigation-items?filters[siteId][$eq]=geldgeregeld&sort=order:asc"
    try:
        test_response = requests.get(test_url, timeout=10)
        if test_response.status_code == 200:
            data = test_response.json()
            count = len(data.get('data', []))
            print(f"✅ Public endpoint works! Found {count} navigation items")
        else:
            print(f"⚠️  Public endpoint returned status {test_response.status_code}")
            print(f"   Response: {test_response.text[:200]}")
    except Exception as e:
        print(f"⚠️  Error testing endpoint: {e}")
    
    print("\n" + "=" * 80)
    print("🎉 NAVIGATION PERMISSIONS CONFIGURED!")
    print("=" * 80)
    print("\nNavigation items are now publicly accessible without authentication.\n")
    
    return True

if __name__ == '__main__':
    success = enable_navigation_permissions()
    exit(0 if success else 1)
