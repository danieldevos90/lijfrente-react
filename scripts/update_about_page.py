#!/usr/bin/env python3
"""
Update the About Us page with content about Erik de Vos and Jan Dijkerman
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

def get_existing_page(slug: str) -> Dict:
    """Get existing page by slug"""
    url = f"{STRAPI_URL}/api/pages?filters[slug][$eq]={slug}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"🔍 Checking for existing page: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                page = data['data'][0]
                print(f"✅ Found existing page")
                # Print page structure for debugging
                page_id = page.get('id') or (page.get('attributes', {}) if 'attributes' in page else {}).get('id')
                print(f"📋 Page ID: {page_id}")
                return page
            else:
                print(f"ℹ️ No existing page found")
    except Exception as e:
        print(f"Error fetching page {slug}: {e}")
    return None

def create_or_update_page(slug: str, page_data: Dict):
    """Create or update a page"""
    existing = get_existing_page(slug)
    if existing:
        # Handle both Strapi v4 (attributes) and v5 (flat) structures
        # Strapi v5 uses documentId for updates, but also check for numeric id
        document_id = existing.get('documentId')
        page_id = existing.get('id')
        if not page_id and 'attributes' in existing:
            page_id = existing['attributes'].get('id')
            document_id = existing['attributes'].get('documentId')
        
        # Use documentId for Strapi v5, fallback to numeric id for v4
        update_id = document_id if document_id else page_id
        
        if update_id:
            # Try with documentId first (Strapi v5)
            if document_id:
                update_url = f"{STRAPI_URL}/api/pages/{document_id}"
                print(f"📤 Updating page {slug} (documentId: {document_id})")
            else:
                update_url = f"{STRAPI_URL}/api/pages/{page_id}"
                print(f"📤 Updating page {slug} (ID: {page_id})")
            
            try:
                update_response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=10)
                print(f"📥 Response status: {update_response.status_code}")
                if update_response.status_code == 200:
                    print(f"✅ Updated page: {slug}")
                    return update_response.json()
                else:
                    # Try with numeric id if documentId didn't work
                    if document_id and page_id and document_id != page_id:
                        print(f"⚠️ Update with documentId failed, trying numeric ID...")
                        update_url = f"{STRAPI_URL}/api/pages/{page_id}"
                        update_response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=10)
                        print(f"📥 Response status (numeric ID): {update_response.status_code}")
                        if update_response.status_code == 200:
                            print(f"✅ Updated page: {slug}")
                            return update_response.json()
                    
                    try:
                        error_data = update_response.json()
                        error_msg = error_data.get('error', {}).get('message', f'Status {update_response.status_code}')
                        print(f"⚠️ Update failed for {slug}: {error_msg}")
                        if 'details' in error_data.get('error', {}):
                            print(f"Details: {json.dumps(error_data['error']['details'], indent=2)}")
                    except:
                        print(f"⚠️ Update failed for {slug}: Status {update_response.status_code}")
                        print(f"Response: {update_response.text[:500]}")
            except Exception as e:
                print(f"⚠️ Error updating page {slug}: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"⚠️ Could not extract page ID from existing page")
    
    # Create new page if it doesn't exist
    if not existing:
        url = f"{STRAPI_URL}/api/pages"
        print(f"📤 Creating new page: {slug}")
        try:
            create_response = requests.post(url, headers=HEADERS, json=page_data, timeout=10)
            print(f"📥 Response status: {create_response.status_code}")
            if create_response.status_code == 200:
                print(f"✅ Created page: {slug}")
                return create_response.json()
            else:
                print(f"⚠️ Failed to create page {slug}: {create_response.status_code}")
                print(f"Response: {create_response.text[:500]}")
        except Exception as e:
            print(f"⚠️ Error creating page {slug}: {e}")
    return None

def get_team_members():
    """Get team member IDs for Erik de Vos and Jan Dijkerman"""
    url = f"{STRAPI_URL}/api/team-members?filters[siteId][$eq]={SITE_ID}&filters[featured][$eq]=true&sort=order:asc"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                # Return list of team member IDs
                team_member_ids = []
                for member in data['data']:
                    member_id = member.get('id') or member.get('documentId')
                    if member_id:
                        team_member_ids.append(member_id)
                return team_member_ids
    except Exception as e:
        print(f"⚠️ Error fetching team members: {e}")
    return []

def create_about_page():
    """Create/Update About Us page with Erik de Vos and Jan Dijkerman content"""
    
    # Get team member IDs
    team_member_ids = get_team_members()
    print(f"📋 Found {len(team_member_ids)} team member(s)")
    
    sections = [
        {
            "__component": "sections.hero-section",
            "title": "Zakelijke Financieringen – Erik de Vos/Jan Dijkerman",
            "subtitle": "Financiële ruimte voor groei",
            "variant": "gradient",
            "iconPath": "/icons/SVG/finance/wallet.svg"
        },
        {
            "__component": "sections.content-section",
            "title": "Ervaren adviseurs met oog voor uw situatie",
            "content": "Ondernemers hebben behoefte aan duidelijkheid, maatwerk en een adviseur die meedenkt. Met jarenlange ervaring als onafhankelijk hypotheekadviseur richt Erik de Vos zich nu volledig op zakelijke financieringen. Hij helpt bedrijven bij het verkrijgen van passende financieringsoplossingen die aansluiten op hun ambities en situatie.\n\nErik verdiept zich in uw onderneming, denkt mee en begeleidt het hele traject van aanvraag tot afronding. Samen met Jan Dijkerman zorgen zij ervoor dat u altijd het best passende financieringsvoorstel krijgt.",
            "layout": "image-left",
            "background": "white"
        }
    ]
    
    # Add team members section if we have team members
    if team_member_ids:
        sections.append({
            "__component": "sections.team-members-section",
            "title": "Ons Team",
            "subtitle": "Ontmoet de adviseurs achter GeldGeregeld",
            "backgroundColor": "white",
            "teamMemberIds": team_member_ids
        })
    
    sections.append({
        "__component": "sections.why-choose-section",
        "title": "Waarom kiezen voor Erik de Vos en Jan Dijkerman?",
        "subtitle": "De voordelen van samenwerken met ervaren adviseurs",
        "benefits": [
            {
                "iconPath": "/icons/SVG/interface/zap.svg",
                "title": "Ervaring in complexe financiële trajecten",
                "description": "Meer dan tien jaar ervaring in financiële advisering vormt de basis voor deskundig advies op maat.",
                "color": "#fff2b2",
                "textColor": "#5e5515"
            },
            {
                "iconPath": "/icons/SVG/interface/message.svg",
                "title": "Heldere communicatie in begrijpelijke taal",
                "description": "Financiële vraagstukken kunnen complex zijn. Erik vertaalt ze naar duidelijke oplossingen waar ondernemers direct mee verder kunnen.",
                "color": "#e4f2ff",
                "textColor": "#0f1720"
            },
            {
                "iconPath": "/icons/SVG/interface/shield.svg",
                "title": "Onafhankelijk en transparant advies",
                "description": "Als zelfstandig adviseur kijkt Erik naar alle beschikbare financieringsmogelijkheden, zodat de ondernemer altijd het best passende voorstel krijgt.",
                "color": "#bbe7be",
                "textColor": "#114e0b"
            },
            {
                "iconPath": "/icons/SVG/interface/user-add.svg",
                "title": "Persoonlijke betrokkenheid",
                "description": "Elke ondernemer en elk bedrijf is uniek. Erik verdiept zich in de onderneming, denkt mee en begeleidt het hele traject van aanvraag tot afronding.",
                "color": "#d7d0ff",
                "textColor": "#3b0b5e"
            }
        ]
    })
    
    data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "over-ons",
            "title": "Over Ons - Zakelijke Financieringen",
            "metaDescription": "Ontmoet Erik de Vos en Jan Dijkerman, ervaren adviseurs in zakelijke financieringen. Heldere communicatie, onafhankelijk advies en persoonlijke betrokkenheid.",
            "metaKeywords": "zakelijke financiering, erik de vos, jan dijkerman, bedrijfslening, mkb financiering",
            "sections": sections
        }
    }
    
    return create_or_update_page('over-ons', data)

def main():
    print("🔄 Updating About Us page...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    result = create_about_page()
    
    if result:
        print("\n✅ About Us page successfully updated!")
    else:
        print("\n❌ Failed to update About Us page")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
