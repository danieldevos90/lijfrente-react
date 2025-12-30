#!/usr/bin/env python3
"""
Create team member profiles for Jan Dijkerman and Erik de Vos via Strapi API
"""

import os
import requests
import json
import time
from typing import Dict, Any

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717'

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def get_existing_team_member(name: str) -> Dict:
    """Get existing team member by name"""
    url = f"{STRAPI_URL}/api/team-members?filters[name][$eq]={name}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"Error fetching team member {name}: {e}")
    return None

def create_or_update_team_member(name: str, member_data: Dict):
    """Create or update a team member"""
    existing = get_existing_team_member(name)
    
    if existing:
        # Handle both Strapi v4 (attributes) and v5 (flat) structures
        member_id = existing.get('id')
        document_id = existing.get('documentId')
        if not member_id and 'attributes' in existing:
            member_id = existing['attributes'].get('id')
            document_id = existing['attributes'].get('documentId')
        
        # Use documentId for Strapi v5, fallback to numeric id for v4
        update_id = document_id if document_id else member_id
        
        if update_id:
            if document_id:
                update_url = f"{STRAPI_URL}/api/team-members/{document_id}"
                print(f"📤 Updating team member {name} (documentId: {document_id})")
            else:
                update_url = f"{STRAPI_URL}/api/team-members/{member_id}"
                print(f"📤 Updating team member {name} (ID: {member_id})")
            
            try:
                update_response = requests.put(update_url, headers=HEADERS, json=member_data, timeout=10)
                print(f"📥 Response status: {update_response.status_code}")
                if update_response.status_code == 200:
                    print(f"✅ Updated team member: {name}")
                    return update_response.json()
                else:
                    # Try with numeric id if documentId didn't work
                    if document_id and member_id and document_id != member_id:
                        print(f"⚠️ Update with documentId failed, trying numeric ID...")
                        update_url = f"{STRAPI_URL}/api/team-members/{member_id}"
                        update_response = requests.put(update_url, headers=HEADERS, json=member_data, timeout=10)
                        print(f"📥 Response status (numeric ID): {update_response.status_code}")
                        if update_response.status_code == 200:
                            print(f"✅ Updated team member: {name}")
                            return update_response.json()
                    
                    try:
                        error_data = update_response.json()
                        error_msg = error_data.get('error', {}).get('message', f'Status {update_response.status_code}')
                        print(f"⚠️ Update failed for {name}: {error_msg}")
                    except:
                        print(f"⚠️ Update failed for {name}: Status {update_response.status_code}")
                        print(f"Response: {update_response.text[:500]}")
            except Exception as e:
                print(f"⚠️ Error updating team member {name}: {e}")
    
    # Create new team member if it doesn't exist
    url = f"{STRAPI_URL}/api/team-members"
    print(f"📤 Creating new team member: {name}")
    try:
        create_response = requests.post(url, headers=HEADERS, json=member_data, timeout=10)
        print(f"📥 Response status: {create_response.status_code}")
        if create_response.status_code == 200:
            print(f"✅ Created team member: {name}")
            return create_response.json()
        else:
            print(f"⚠️ Failed to create team member {name}: {create_response.status_code}")
            print(f"Response: {create_response.text[:500]}")
    except Exception as e:
        print(f"⚠️ Error creating team member {name}: {e}")
    
    return None

def create_team_members():
    """Create team member profiles for Jan Dijkerman and Erik de Vos"""
    
    # Erik de Vos profile
    erik_data = {
        "data": {
            "siteId": SITE_ID,
            "name": "Erik de Vos",
            "role": "Zakelijk Financieel Adviseur",
            "bio": "Met jarenlange ervaring als onafhankelijk hypotheekadviseur richt Erik de Vos zich nu volledig op zakelijke financieringen. Hij helpt bedrijven bij het verkrijgen van passende financieringsoplossingen die aansluiten op hun ambities en situatie.\n\nErik verdiept zich in uw onderneming, denkt mee en begeleidt het hele traject van aanvraag tot afronding. Zijn aanpak kenmerkt zich door heldere communicatie, onafhankelijk advies en persoonlijke betrokkenheid.",
            "order": 1,
            "featured": True
        }
    }
    
    # Jan Dijkerman profile
    jan_data = {
        "data": {
            "siteId": SITE_ID,
            "name": "Jan Dijkerman",
            "role": "Zakelijk Financieel Adviseur",
            "bio": "Jan Dijkerman werkt samen met Erik de Vos om ondernemers te helpen bij het vinden van de beste financieringsoplossingen. Met een scherp oog voor detail en jarenlange ervaring in de financiële sector, zorgt Jan ervoor dat elke ondernemer het best passende financieringsvoorstel krijgt.\n\nJan combineert technische expertise met een persoonlijke aanpak, waardoor complexe financiële vraagstukken worden vertaald naar duidelijke en haalbare oplossingen.",
            "order": 2,
            "featured": True
        }
    }
    
    print("=" * 80)
    print("👥 CREATING TEAM MEMBER PROFILES")
    print("=" * 80)
    print(f"\n📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    results = []
    
    # Create Erik de Vos profile
    print("\n1. Creating Erik de Vos profile...")
    erik_result = create_or_update_team_member("Erik de Vos", erik_data)
    results.append(("Erik de Vos", erik_result))
    time.sleep(1)
    
    # Create Jan Dijkerman profile
    print("\n2. Creating Jan Dijkerman profile...")
    jan_result = create_or_update_team_member("Jan Dijkerman", jan_data)
    results.append(("Jan Dijkerman", jan_result))
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    
    success_count = sum(1 for _, result in results if result)
    failed = [name for name, result in results if not result]
    
    if success_count == len(results):
        print(f"\n✅ Successfully created/updated {success_count} team member profile(s)!")
        print("\nTeam members created:")
        for name, result in results:
            if result:
                member_id = result.get('data', {}).get('id') or result.get('data', {}).get('documentId', 'N/A')
                print(f"  ✅ {name} (ID: {member_id})")
        return 0
    else:
        print(f"\n⚠️ Created/updated {success_count} out of {len(results)} team member profile(s)")
        if failed:
            print(f"\nFailed to create:")
            for name in failed:
                print(f"  ❌ {name}")
        return 1

def main():
    exit(create_team_members())

if __name__ == "__main__":
    main()
