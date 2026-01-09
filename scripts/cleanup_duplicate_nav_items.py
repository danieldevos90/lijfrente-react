#!/usr/bin/env python3
"""
Clean up duplicate navigation items in Strapi by keeping only one of each unique href.
"""

import requests
import os
import sys
from pathlib import Path
from collections import defaultdict

# Load environment variables from frontend/.env.local
def load_env_file(env_path):
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

# Load Strapi configuration
frontend_env_path = Path('frontend/.env.local')
env_vars = load_env_file(frontend_env_path)

STRAPI_URL = env_vars.get('NEXT_PUBLIC_STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = env_vars.get('STRAPI_API_TOKEN') or env_vars.get('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN') or os.getenv('STRAPI_TOKEN')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required")
    print("   Set it in frontend/.env.local or as an environment variable")
    sys.exit(1)

SITE_ID = env_vars.get('NEXT_PUBLIC_SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json',
}

def get_all_nav_items():
    """Fetch all navigation items for the site"""
    url = f"{STRAPI_URL}/api/navigation-items"
    params = {
        'filters[siteId][$eq]': SITE_ID,
        'sort': 'order:asc,createdAt:asc',  # Sort by order, then creation date (oldest first)
        'pagination[limit]': 1000  # Get all items
    }
    
    try:
        response = requests.get(url, headers=HEADERS, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get('data', [])
            print(f"📋 Found {len(items)} navigation items")
            return items
        else:
            print(f"❌ Error fetching navigation items: {response.status_code}")
            print(f"   Response: {response.text[:300]}")
            return []
    except Exception as e:
        print(f"❌ Error fetching navigation items: {e}")
        return []

def delete_nav_item(item_id, document_id=None):
    """Delete a navigation item by ID"""
    # Try using documentId if available (Strapi v5), otherwise use id
    if document_id:
        url = f"{STRAPI_URL}/api/navigation-items/{document_id}"
    else:
        url = f"{STRAPI_URL}/api/navigation-items/{item_id}"
    
    try:
        response = requests.delete(url, headers=HEADERS, timeout=10)
        # 200 (OK) and 204 (No Content) both indicate successful deletion
        if response.status_code in [200, 204]:
            return True
        else:
            print(f"  ⚠️ Failed to delete: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"  ❌ Error deleting: {e}")
        return False

def cleanup_duplicates():
    """Remove duplicate navigation items, keeping the oldest one for each unique href"""
    print(f"🔄 Cleaning up duplicate navigation items for site: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    items = get_all_nav_items()
    if not items:
        print("⚠️ No navigation items found")
        return
    
    # Group items by href
    href_groups = defaultdict(list)
    for item in items:
        item_data = item.get('attributes', item)
        href = item_data.get('href', '').strip()
        if href:
            href_groups[href].append(item)
    
    # Identify duplicates and items to delete
    items_to_delete = []
    items_to_keep = []
    
    for href, group in href_groups.items():
        if len(group) > 1:
            # Sort by creation date (oldest first) and order
            sorted_group = sorted(group, key=lambda x: (
                (x.get('attributes', x).get('order', 0) or 0),
                x.get('attributes', x).get('createdAt', '') or x.get('createdAt', '')
            ))
            
            # Keep the first one (oldest, lowest order)
            keep_item = sorted_group[0]
            delete_items = sorted_group[1:]
            
            keep_data = keep_item.get('attributes', keep_item)
            items_to_keep.append({
                'id': keep_item.get('id'),
                'documentId': keep_item.get('documentId'),
                'label': keep_data.get('label', ''),
                'href': href,
            })
            
            for delete_item in delete_items:
                delete_data = delete_item.get('attributes', delete_item)
                items_to_delete.append({
                    'id': delete_item.get('id'),
                    'documentId': delete_item.get('documentId'),
                    'label': delete_data.get('label', ''),
                    'href': href,
                })
    
    if not items_to_delete:
        print("✅ No duplicate navigation items found!")
        return
    
    print(f"📊 Summary:")
    print(f"   Total items: {len(items)}")
    print(f"   Unique hrefs: {len(href_groups)}")
    print(f"   Items to keep: {len(items_to_keep)}")
    print(f"   Items to delete: {len(items_to_delete)}\n")
    
    print("📋 Items to keep:")
    for item in items_to_keep:
        print(f"   ✓ {item['label']} ({item['href']})")
    
    print(f"\n🗑️  Items to delete ({len(items_to_delete)}):")
    for item in items_to_delete:
        print(f"   ✗ {item['label']} ({item['href']}) - ID: {item['id']}, DocID: {item.get('documentId', 'N/A')}")
    
    # Auto-confirm if running non-interactively (or check for --yes flag)
    auto_confirm = '--yes' in sys.argv or not sys.stdin.isatty()
    
    if not auto_confirm:
        print(f"\n⚠️  This will delete {len(items_to_delete)} duplicate navigation item(s).")
        confirm = input("   Continue? (yes/no): ").strip().lower()
        
        if confirm not in ['yes', 'y']:
            print("❌ Cancelled")
            return
    else:
        print(f"\n⚠️  Auto-confirming deletion of {len(items_to_delete)} duplicate navigation item(s)...")
    
    # Delete duplicates
    print(f"\n🗑️  Deleting duplicates...")
    deleted_count = 0
    failed_count = 0
    
    for item in items_to_delete:
        item_id = item['id']
        document_id = item.get('documentId')
        label = item['label']
        href = item['href']
        
        print(f"   Deleting: {label} ({href})...", end=' ')
        if delete_nav_item(item_id, document_id):
            print("✅")
            deleted_count += 1
        else:
            print("❌")
            failed_count += 1
    
    print(f"\n✅ Cleanup complete!")
    print(f"   Deleted: {deleted_count}")
    print(f"   Failed: {failed_count}")
    print(f"   Remaining: {len(items) - deleted_count} navigation items")

if __name__ == '__main__':
    cleanup_duplicates()
