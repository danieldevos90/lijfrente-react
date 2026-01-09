#!/usr/bin/env python3
"""
Create team-member content type and populate with data via Strapi API
Uses multiple API approaches to work around Strapi Cloud limitations
"""

import os
import sys
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_API_TOKEN', 'd99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_API_TOKEN is required")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

TEAM_MEMBERS = [
    {
        'name': 'Erik de Vos',
        'role': 'Oprichter & CEO',
        'bio': 'Met meer dan 15 jaar ervaring in de financiële sector heeft Erik een diepgaand begrip van de uitdagingen waar MKB-ondernemers mee te maken hebben. Zijn visie is om zakelijke financiering toegankelijk, transparant en snel te maken voor elke ondernemer.',
        'email': 'info@geldgeregeld.nl',
        'linkedin': 'https://www.linkedin.com/in/erik-de-vos-425ab120/',
        'order': 1,
    },
    {
        'name': 'Jan Dijkerman',
        'role': 'Mede-oprichter & CFO',
        'bio': 'Jan brengt uitgebreide expertise in risicomanagement en financiële analyse. Zijn focus ligt op het ontwikkelen van innovatieve financieringsoplossingen die perfect aansluiten bij de behoeften van moderne ondernemers.',
        'email': 'info@geldgeregeld.nl',
        'linkedin': 'https://www.linkedin.com/in/jan-dijkerman-b3a771393/',
        'order': 2,
    },
]

def check_content_type_exists():
    """Check if team-member content type exists"""
    # Try Content Manager API
    url = f"{STRAPI_URL}/api/content-manager/collection-types/api::team-member.team-member"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return True
    except:
        pass
    
    # Try Content API
    url = f"{STRAPI_URL}/api/team-members"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 404:
            return True
    except:
        pass
    
    return False

def create_content_type_via_content_manager():
    """Try to create content type via Content Manager API"""
    print("Attempting to create content type via Content Manager API...")
    
    # Try to create via content-manager/collection-types endpoint
    url = f"{STRAPI_URL}/api/content-manager/collection-types"
    data = {
        "contentType": {
            "kind": "collectionType",
            "collectionName": "team_members",
            "info": {
                "singularName": "team-member",
                "pluralName": "team-members",
                "displayName": "Team Member"
            },
            "options": {
                "draftAndPublish": True
            },
            "attributes": {
                "siteId": {"type": "string", "required": True},
                "name": {"type": "string", "required": True},
                "role": {"type": "string", "required": True},
                "bio": {"type": "text", "required": True},
                "email": {"type": "email"},
                "linkedin": {"type": "string"},
                "image": {"type": "media", "multiple": False},
                "order": {"type": "integer", "default": 0}
            }
        }
    }
    
    try:
        response = requests.post(url, headers=HEADERS, json=data, timeout=30)
        print(f"  Response: {response.status_code}")
        if response.status_code in [200, 201]:
            print("  ✅ Content type created!")
            return True
        else:
            print(f"  Response: {response.text[:300]}")
    except Exception as e:
        print(f"  Error: {e}")
    
    return False

def create_content_type_via_bootstrap():
    """Try to create via bootstrap/data endpoint"""
    print("Attempting to create content type via bootstrap API...")
    
    url = f"{STRAPI_URL}/api/content-type-builder/content-types"
    data = {
        "contentType": {
            "kind": "collectionType",
            "collectionName": "team_members",
            "info": {
                "singularName": "team-member",
                "pluralName": "team-members",
                "displayName": "Team Member"
            },
            "options": {
                "draftAndPublish": True
            },
            "attributes": {
                "siteId": {"type": "string", "required": True},
                "name": {"type": "string", "required": True},
                "role": {"type": "string", "required": True},
                "bio": {"type": "text", "required": True},
                "email": {"type": "email"},
                "linkedin": {"type": "string"},
                "image": {"type": "media", "multiple": False},
                "order": {"type": "integer", "default": 0}
            }
        }
    }
    
    try:
        response = requests.post(url, headers=HEADERS, json=data, timeout=30)
        print(f"  Response: {response.status_code}")
        if response.status_code in [200, 201]:
            print("  ✅ Content type created!")
            return True
        else:
            print(f"  Response: {response.text[:300]}")
    except Exception as e:
        print(f"  Error: {e}")
    
    return False

def enable_permissions():
    """Enable public permissions for team-member"""
    print("\nEnabling permissions...")
    
    url = f"{STRAPI_URL}/api/users-permissions/roles/1"
    try:
        # Get current role
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  ⚠️ Could not fetch role: {response.status_code}")
            return False
        
        role_data = response.json()
        permissions = role_data.get('permissions', {})
        
        # Update team-member permissions
        if 'api::team-member.team-member' not in permissions:
            permissions['api::team-member.team-member'] = {}
        
        team_perms = permissions['api::team-member.team-member']
        team_perms['find'] = True
        team_perms['findOne'] = True
        team_perms['create'] = False
        team_perms['update'] = False
        team_perms['delete'] = False
        
        # Update role
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
    
    # Try Content Manager API first
    url = f"{STRAPI_URL}/api/content-manager/collection-types/api::team-member.team-member"
    try:
        print(f"  📤 Creating via Admin API: {name}")
        response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {name}")
            return True
    except Exception as e:
        print(f"  ⚠️ Admin API error: {e}")
    
    # Try Content API
    url = f"{STRAPI_URL}/api/team-members"
    try:
        print(f"  📤 Creating via Content API: {name}")
        response = requests.post(url, headers=HEADERS, json=strapi_data, timeout=10)
        if response.status_code in [200, 201]:
            print(f"  ✅ Created: {name}")
            return True
        else:
            print(f"  ⚠️ Failed: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    return False

def main():
    """Main execution"""
    print("=" * 80)
    print("👥 CREATING TEAM MEMBER CONTENT TYPE AND DATA")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    # Check if content type exists
    print("1. Checking if content type exists...")
    if check_content_type_exists():
        print("  ✅ Content type already exists!")
    else:
        print("  ⚠️ Content type does not exist. Attempting to create...")
        
        # Try different methods to create content type
        if create_content_type_via_content_manager():
            time.sleep(3)  # Wait for Strapi to process
        elif create_content_type_via_bootstrap():
            time.sleep(3)  # Wait for Strapi to process
        else:
            print("\n❌ Could not create content type via API.")
            print("   Strapi Cloud may require manual creation.")
            print("   See scripts/TEAM_MEMBER_SETUP.md for manual steps.")
            return False
    
    # Enable permissions
    print("\n2. Enabling permissions...")
    enable_permissions()
    time.sleep(2)
    
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
    print(f"\n📝 Edit in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::team-member.team-member")
    print(f"🌐 View on site: https://geldgeregeld.nl/over-ons")
    
    return success_count == len(TEAM_MEMBERS)

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
