#!/usr/bin/env python3
"""
Complete setup script for team members
1. Attempts to create content type (will fail on Strapi Cloud - manual step required)
2. Creates team member entries once content type exists
"""

import os
import sys
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_API_TOKEN', 'd99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

TEAM_MEMBERS = [
    {
        'name': 'Erik de Vos',
        'role': 'Oprichter & CEO',
        'bio': 'Met meer dan 15 jaar ervaring in de financiële sector heeft Erik een diepgaand begrip van de uitdagingen waar MKB-ondernemers mee te maken hebben. Zijn visie is om zakelijke financiering toegankelijk, transparant en snel te maken voor elke ondernemer.',
        'email': 'erik@geldgeregeld.nl',
        'linkedin': 'https://linkedin.com/in/erikdevos',
        'order': 1,
    },
    {
        'name': 'Jan Dijkerman',
        'role': 'Mede-oprichter & CFO',
        'bio': 'Jan brengt uitgebreide expertise in risicomanagement en financiële analyse. Zijn focus ligt op het ontwikkelen van innovatieve financieringsoplossingen die perfect aansluiten bij de behoeften van moderne ondernemers.',
        'email': 'jan@geldgeregeld.nl',
        'linkedin': 'https://linkedin.com/in/jandijkerman',
        'order': 2,
    },
]

def check_content_type_exists():
    """Check if team-member content type exists"""
    url = f"{STRAPI_URL}/api/team-members"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        # 200 or 400 (bad request) means it exists, 404 means it doesn't
        return response.status_code != 404
    except:
        return False

def enable_permissions():
    """Enable public permissions"""
    print("\n2. Enabling permissions...")
    url = f"{STRAPI_URL}/api/users-permissions/roles/1"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  ⚠️ Could not fetch role: {response.status_code}")
            return False
        
        role_data = response.json()
        permissions = role_data.get('permissions', {})
        
        if 'api::team-member.team-member' not in permissions:
            permissions['api::team-member.team-member'] = {}
        
        team_perms = permissions['api::team-member.team-member']
        team_perms['find'] = True
        team_perms['findOne'] = True
        team_perms['create'] = False
        team_perms['update'] = False
        team_perms['delete'] = False
        
        update_data = {**role_data, 'permissions': permissions}
        update_response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        
        if update_response.status_code == 200:
            print("  ✅ Permissions enabled!")
            return True
        else:
            print(f"  ⚠️ Failed: {update_response.status_code}")
    except Exception as e:
        print(f"  ⚠️ Error: {e}")
    
    return False

def create_team_member(member_data):
    """Create a team member"""
    name = member_data['name']
    
    strapi_data = {
        "data": {
            "siteId": SITE_ID,
            "name": member_data['name'],
            "role": member_data['role'],
            "bio": member_data['bio'],
            "email": member_data.get('email'),
            "linkedin": member_data.get('linkedin'),
            "order": member_data.get('order', 0),
            "publishedAt": None,
        }
    }
    
    # Try Content API
    url = f"{STRAPI_URL}/api/team-members"
    try:
        print(f"  📤 Creating: {name}")
        response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {name}")
            return True
        else:
            print(f"  ⚠️ Failed: {response.status_code}")
            if response.status_code == 400:
                error_data = response.json().get('error', {})
                print(f"  Error: {error_data.get('message', 'Unknown error')}")
            else:
                print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    return False

def main():
    """Main execution"""
    print("=" * 80)
    print("👥 SETTING UP TEAM MEMBERS")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    # Check if content type exists
    print("1. Checking if content type exists...")
    if check_content_type_exists():
        print("  ✅ Content type exists!")
        
        # Enable permissions
        enable_permissions()
        time.sleep(1)
        
        # Create team members
        print("\n3. Creating team members...")
        success_count = 0
        for member in TEAM_MEMBERS:
            if create_team_member(member):
                success_count += 1
            print()
        
        print("=" * 80)
        if success_count == len(TEAM_MEMBERS):
            print(f"✅ SUCCESS! Created {success_count} team members")
        else:
            print(f"⚠️ PARTIAL: {success_count}/{len(TEAM_MEMBERS)} team members created")
        print("=" * 80)
        return success_count == len(TEAM_MEMBERS)
    else:
        print("  ❌ Content type 'team-member' does not exist!")
        print("\n" + "=" * 80)
        print("⚠️  MANUAL STEP REQUIRED")
        print("=" * 80)
        print("\nStrapi Cloud does not allow programmatic content type creation.")
        print("You must create the content type manually in Strapi Admin:\n")
        print("1. Go to: https://bright-smile-1f47bc9d67.strapiapp.com/admin")
        print("2. Content-Type Builder → Create new collection type")
        print("3. Name: 'Team Member', API ID: 'team-member' / 'team-members'")
        print("4. Add fields:")
        print("   - siteId (Text, Required)")
        print("   - name (Text, Required)")
        print("   - role (Text, Required)")
        print("   - bio (Long text, Required)")
        print("   - email (Email)")
        print("   - linkedin (Text)")
        print("   - image (Media, Single)")
        print("   - order (Number, Default: 0)")
        print("5. Save and wait for Strapi to restart")
        print("6. Enable permissions: Settings → Users & Permissions → Roles → Public")
        print("   Enable: find, findOne for Team-member")
        print("7. Run this script again: python3 scripts/setup_team_members_complete.py")
        print("\n" + "=" * 80)
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
