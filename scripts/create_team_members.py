#!/usr/bin/env python3
"""
Create team members in Strapi CMS
Creates Erik de Vos and Jan Dijkerman profiles
"""

import os
import sys
import requests
import json
from pathlib import Path

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
    print("   Set it in your .env.local or export it:")
    print("   export STRAPI_TOKEN='your-token-here'")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

TEAM_MEMBERS = [
    {
        'name': 'Erik de Vos',
        'role': 'mede-oprichter/consultant',
        'bio': 'Met meer dan 15 jaar ervaring in de financiële sector heeft Erik een diepgaand begrip van de uitdagingen waar MKB-ondernemers mee te maken hebben. Zijn visie is om zakelijke financiering toegankelijk, transparant en snel te maken voor elke ondernemer.',
        'email': 'info@geldgeregeld.nl',
        'linkedin': 'https://www.linkedin.com/in/erik-de-vos-425ab120/',
        'order': 1,
    },
    {
        'name': 'Jan Dijkerman',
        'role': 'mede-oprichter/consultant',
        'bio': 'Jan brengt uitgebreide expertise in risicomanagement en financiële analyse. Zijn focus ligt op het ontwikkelen van innovatieve financieringsoplossingen die perfect aansluiten bij de behoeften van moderne ondernemers.',
        'email': 'info@geldgeregeld.nl',
        'linkedin': 'https://www.linkedin.com/in/jan-dijkerman-b3a771393/',
        'order': 2,
    },
]

def get_existing_team_member(name: str):
    """Check if team member already exists"""
    url = f"{STRAPI_URL}/api/team-members?filters[name][$eq]={name}&filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            members = data.get('data', [])
            if members:
                return members[0]
    except Exception as e:
        print(f"  ⚠️ Error checking existing member: {e}")
    return None

def create_or_update_team_member(member_data: dict):
    """Create or update a team member"""
    name = member_data['name']
    existing = get_existing_team_member(name)
    
    # Prepare data for Strapi
    strapi_data = {
        "data": {
            "siteId": SITE_ID,
            "name": member_data['name'],
            "role": member_data['role'],
            "bio": member_data['bio'],
            "email": member_data.get('email'),
            "linkedin": member_data.get('linkedin'),
            "order": member_data.get('order', 0),
            "publishedAt": None,  # Will be published immediately
        }
    }
    
    if existing:
        # Update existing member
        member_id = existing.get('id') or existing.get('documentId')
        if member_id:
            url = f"{STRAPI_URL}/api/team-members/{member_id}"
            try:
                print(f"  📤 Updating: {name}")
                response = requests.put(url, headers=HEADERS, json=strapi_data, timeout=10)
                if response.status_code == 200:
                    print(f"  ✅ Updated: {name}")
                    return True
                else:
                    print(f"  ⚠️ Failed to update {name}: {response.status_code}")
                    print(f"  Response: {response.text[:200]}")
            except Exception as e:
                print(f"  ❌ Error updating {name}: {e}")
    
    # Try Content Manager API first (for Strapi Cloud)
    admin_url = f"{STRAPI_URL}/api/content-manager/collection-types/api::team-member.team-member"
    try:
        print(f"  📤 Creating via Admin API: {name}")
        response = requests.post(admin_url, headers=HEADERS, json=strapi_data, timeout=10)
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {name}")
            return True
        else:
            print(f"  ⚠️ Admin API returned: {response.status_code}")
            if response.status_code != 404:  # 404 means content type doesn't exist
                print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ⚠️ Admin API error: {e}")
    
    # Try Content API as fallback
    url = f"{STRAPI_URL}/api/team-members"
    try:
        print(f"  📤 Creating via Content API: {name}")
        response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
        if response.status_code == 200 or response.status_code == 201:
            print(f"  ✅ Created: {name}")
            return True
        else:
            if response.status_code == 405:
                print(f"  ❌ Content type 'team-member' does not exist in Strapi!")
                print(f"  Please create it manually in Strapi Admin first.")
            else:
                print(f"  ⚠️ Failed to create {name}: {response.status_code}")
                print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ❌ Error creating {name}: {e}")
    
    return False

def main():
    """Main execution function"""
    print("=" * 80)
    print("👥 CREATING TEAM MEMBERS IN STRAPI")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    success_count = 0
    for member in TEAM_MEMBERS:
        if create_or_update_team_member(member):
            success_count += 1
        print()  # Empty line between members
    
    print("=" * 80)
    if success_count == len(TEAM_MEMBERS):
        print(f"✅ SUCCESS! Created/updated {success_count} team members")
    else:
        print(f"⚠️ PARTIAL SUCCESS: {success_count}/{len(TEAM_MEMBERS)} team members created/updated")
    print("=" * 80)
    print(f"\n📝 Edit in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::team-member.team-member")
    print(f"🌐 View on site: https://geldgeregeld.nl/over-ons")

if __name__ == '__main__':
    import sys
    main()
