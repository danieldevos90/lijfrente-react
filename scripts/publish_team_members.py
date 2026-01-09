#!/usr/bin/env python3
"""
Publish team members in Strapi so they appear on the frontend
"""

import os
import sys
import requests
import json
from pathlib import Path
from datetime import datetime

# Try to load .env files from multiple locations
def load_env_file(env_path):
    """Manually parse .env file"""
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

# Load from frontend/.env.local (for API token)
frontend_env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
frontend_env_vars = load_env_file(frontend_env_path)

# Set environment variables from .env file
for key, value in frontend_env_vars.items():
    if key not in os.environ:
        os.environ[key] = value

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', os.getenv('STRAPI_API_TOKEN', ''))
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def get_team_member(name: str):
    """Get team member by name"""
    url = f"{STRAPI_URL}/api/team-members?filters[name][$eq]={name}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            members = data.get('data', [])
            if members:
                return members[0]
    except Exception as e:
        print(f"  ⚠️ Error fetching team member: {e}")
    return None

def publish_team_member(member_id: int):
    """Publish a team member"""
    url = f"{STRAPI_URL}/api/team-members/{member_id}"
    
    # Get current member data
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  ⚠️ Failed to fetch member: {response.status_code}")
            return False
        
        member_data = response.json()
        member_attrs = member_data.get('data', {}).get('attributes', member_data.get('data', {}))
        
        # Update with publishedAt timestamp
        update_data = {
            "data": {
                **member_attrs,
                "publishedAt": datetime.now().isoformat()
            }
        }
        
        # Remove id and other non-updatable fields
        if 'id' in update_data['data']:
            del update_data['data']['id']
        if 'documentId' in update_data['data']:
            del update_data['data']['documentId']
        if 'createdAt' in update_data['data']:
            del update_data['data']['createdAt']
        if 'updatedAt' in update_data['data']:
            del update_data['data']['updatedAt']
        
        # Publish via PUT
        response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        
        if response.status_code == 200:
            print(f"  ✅ Published successfully")
            return True
        else:
            print(f"  ⚠️ Failed to publish: {response.status_code}")
            print(f"  Response: {response.text[:300]}")
            return False
    except Exception as e:
        print(f"  ❌ Error publishing: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 80)
    print("📢 PUBLISHING TEAM MEMBERS IN STRAPI")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    team_names = ['Erik de Vos', 'Jan Dijkerman']
    success_count = 0
    
    for name in team_names:
        print(f"\n👤 Processing: {name}")
        print("-" * 80)
        
        member = get_team_member(name)
        if not member:
            print(f"  ⚠️ Team member '{name}' not found in Strapi")
            continue
        
        member_id = member.get('documentId') or member.get('id')
        if not member_id:
            print(f"  ⚠️ Could not get member ID")
            continue
        
        member_attrs = member.get('attributes', member)
        published_at = member_attrs.get('publishedAt')
        
        if published_at:
            print(f"  ℹ️  Already published at: {published_at}")
        else:
            print(f"  📢 Publishing...")
            if publish_team_member(member_id):
                success_count += 1
    
    print("\n" + "=" * 80)
    print(f"✅ Published {success_count} team members")
    print("=" * 80)
    print(f"\n📝 View in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::team-member.team-member")
    
    return success_count > 0

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
