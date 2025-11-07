#!/usr/bin/env python3
"""
Clean up duplicate navigation items in Strapi
Removes duplicates based on siteId + href combination
"""

import os
import requests
import json
from typing import Dict, List, Any
from collections import defaultdict

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def get_all_navigation_items():
    """Fetch all navigation items"""
    url = f"{STRAPI_URL}/api/navigation-items?pagination[limit]=1000&sort=order:asc"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', [])
        else:
            print(f"Error fetching navigation items: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching navigation items: {e}")
        return []

def cleanup_duplicates():
    """Remove duplicate navigation items, keeping the first occurrence by order"""
    items = get_all_navigation_items()
    
    if not items:
        print("No navigation items found")
        return
    
    # Group by siteId + href combination
    grouped = defaultdict(list)
    for item in items:
        # Handle both Strapi v4 (attributes) and v5 (flat) structures
        item_data = item.get('attributes', item)
        site_id = item_data.get('siteId')
        href = item_data.get('href')
        item_id = item.get('id')
        order = item_data.get('order', 999)
        
        if site_id and href:
            key = f"{site_id}::{href}"
            grouped[key].append({
                'id': item_id,
                'order': order,
                'item': item
            })
    
    # Find duplicates and remove them
    duplicates_removed = 0
    for key, group in grouped.items():
        if len(group) > 1:
            # Sort by order (keep first), then by id (keep oldest)
            group.sort(key=lambda x: (x['order'], x['id']))
            keep_item = group[0]
            duplicates = group[1:]
            
            site_id, href = key.split('::', 1)
            print(f"\n🔍 Found {len(group)} items for {site_id} -> {href}")
            print(f"   ✅ Keeping: ID {keep_item['id']} (order: {keep_item['order']})")
            
            for dup in duplicates:
                dup_id = dup['id']
                print(f"   🗑️  Deleting duplicate: ID {dup_id} (order: {dup['order']})")
                
                try:
                    delete_url = f"{STRAPI_URL}/api/navigation-items/{dup_id}"
                    delete_response = requests.delete(delete_url, headers=HEADERS)
                    if delete_response.status_code in [200, 204]:
                        duplicates_removed += 1
                        print(f"      ✅ Deleted successfully")
                    else:
                        print(f"      ⚠️  Failed to delete: {delete_response.status_code}")
                except Exception as e:
                    print(f"      ⚠️  Error deleting: {e}")
    
    print(f"\n✅ Cleanup complete! Removed {duplicates_removed} duplicate navigation items")

if __name__ == '__main__':
    print("🧹 Starting navigation items cleanup...")
    cleanup_duplicates()

