#!/usr/bin/env python3
"""
Update site content via Strapi API:
1. Change address to Roggestraat 7, 7311 ca apeldoorn
2. Update "Over Ons" title to "Specialist in zakelijke financieringen"
3. Change copy from "I" form to "we" form in Dutch
4. Update "Meer dan 10 jaar" to "25 jaar"
5. Change "Waarom kiezen voor..." title to "Waarom kiezen voor geldgeregeld.nl"
6. Update team member roles to "mede-oprichter/consultant"

USAGE:
    export STRAPI_TOKEN='your-token-here'
    python3 scripts/update_site_content.py

Or set STRAPI_API_TOKEN environment variable instead.
"""

import os
import requests
import json
from typing import Dict, Any, Optional

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')
if not STRAPI_TOKEN:
    raise SystemExit("Missing STRAPI_TOKEN (or STRAPI_API_TOKEN). Refusing to run without an explicit token.")

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def get_existing_site() -> Optional[Dict]:
    """Get existing site"""
    url = f"{STRAPI_URL}/api/sites?filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response keys: {list(data.keys())}")
            if data.get('data') and len(data['data']) > 0:
                site = data['data'][0]
                print(f"   Found site: {site.get('id') or site.get('documentId')}")
                return site
            else:
                print(f"   No data found in response")
        else:
            print(f"   Error response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Error fetching site: {e}")
        import traceback
        traceback.print_exc()
    return None

def update_site_address():
    """Update site address to Roggestraat 7, 7311 ca apeldoorn"""
    print("\n📍 Updating site address...")
    site = get_existing_site()
    if not site:
        print("❌ Site not found")
        return False
    
    # Handle both Strapi v4 (attributes) and v5 (flat) structures
    site_attrs = site.get('attributes', {}) if 'attributes' in site else site
    document_id = site.get('documentId') or site_attrs.get('documentId')
    site_id = site.get('id') or site_attrs.get('id')
    
    if not document_id and not site_id:
        print("❌ Could not find site ID")
        print(f"   Site keys: {list(site.keys())}")
        return False
    
    # Update data with all footer fields
    update_data = {
        "data": {
            "address": "Roggestraat 7",
            "postalCode": "7311 CA",
            "city": "Apeldoorn",
            "companyName": "GeldGeregeld B.V.",
            "country": "Nederland",
        }
    }
    
    # Try Content Manager API first (more flexible, works with documentId)
    # Use the admin endpoint path
    if document_id:
        admin_url = f"{STRAPI_URL}/admin/content-manager/collection-types/api::site.site/{document_id}"
        try:
            print(f"   Trying Admin Content Manager API (documentId: {document_id})...")
            response = requests.put(admin_url, headers=HEADERS, json=update_data, timeout=10)
            if response.status_code == 200:
                print("✅ Site address updated successfully via Admin Content Manager API")
                return True
            else:
                print(f"   Admin Content Manager API returned: {response.status_code}")
                if response.status_code != 404:
                    print(f"   Response: {response.text[:300]}")
        except Exception as e:
            print(f"   Admin Content Manager API error: {e}")
    
    # Fallback to Content API - use documentId first (Strapi v5)
    if document_id:
        url = f"{STRAPI_URL}/api/sites/{document_id}"
        print(f"   Trying Content API (documentId: {document_id})...")
    else:
        url = f"{STRAPI_URL}/api/sites/{site_id}"
        print(f"   Trying Content API (id: {site_id})...")
    
    try:
        response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
        if response.status_code == 200:
            print("✅ Site address updated successfully via Content API")
            return True
        else:
            print(f"❌ Failed to update address: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            # Try with just the fields that exist
            print("   Trying with minimal fields...")
            minimal_data = {
                "data": {
                    "address": "Roggestraat 7",
                    "postalCode": "7311 ca",
                    "city": "apeldoorn",
                }
            }
            response2 = requests.put(url, headers=HEADERS, json=minimal_data, timeout=10)
            if response2.status_code == 200:
                print("✅ Site address updated successfully (minimal fields)")
                return True
            return False
    except Exception as e:
        print(f"❌ Error updating address: {e}")
        return False

def get_existing_page(slug: str) -> Optional[Dict]:
    """Get existing page by slug"""
    url = f"{STRAPI_URL}/api/pages?filters[slug][$eq]={slug}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response keys: {list(data.keys())}")
            if data.get('data') and len(data['data']) > 0:
                page = data['data'][0]
                print(f"   Found page: {page.get('id') or page.get('documentId')}")
                return page
            else:
                print(f"   No data found in response")
        else:
            print(f"   Error response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Error fetching page {slug}: {e}")
        import traceback
        traceback.print_exc()
    return None

def update_about_page():
    """Update About Us page with new content"""
    print("\n📄 Updating About Us page...")
    
    page = get_existing_page('over-ons')
    if not page:
        print("❌ About Us page not found")
        return False
    
    # Handle both Strapi v4 (attributes) and v5 (flat) structures
    page_attrs = page.get('attributes', {}) if 'attributes' in page else page
    document_id = page.get('documentId') or page_attrs.get('documentId')
    page_id = page.get('id') or page_attrs.get('id')
    
    if not document_id and not page_id:
        print("❌ Could not find page ID")
        print(f"   Page keys: {list(page.keys())}")
        return False
    
    # Use documentId for update (Strapi v5)
    update_id = document_id if document_id else page_id
    
    # Get current sections - handle nested structure
    sections = []
    if 'attributes' in page:
        sections = page['attributes'].get('sections', {}).get('data', []) if isinstance(page['attributes'].get('sections'), dict) else page['attributes'].get('sections', [])
    else:
        sections = page.get('sections', {}).get('data', []) if isinstance(page.get('sections'), dict) else page.get('sections', [])
    
    # Extract actual section data (remove attributes wrapper if present)
    clean_sections = []
    for section in sections:
        if isinstance(section, dict):
            if 'attributes' in section:
                clean_sections.append(section['attributes'])
            elif 'id' in section and '__component' in section:
                # Already clean, but remove id if present
                clean_section = {k: v for k, v in section.items() if k != 'id' and k != 'documentId'}
                clean_sections.append(clean_section)
            else:
                clean_sections.append(section)
        else:
            clean_sections.append(section)
    
    # Update title
    update_data = {
        "data": {
            "title": "Specialist in zakelijke financieringen",
            "metaDescription": "Specialist in zakelijke financieringen. Wij helpen ondernemers met passende financieringsoplossingen die aansluiten op hun ambities en situatie.",
            "metaKeywords": "zakelijke financiering, bedrijfslening, mkb financiering, specialist zakelijke financieringen",
        }
    }
    
    # Update sections - change "I" form to "we" form and update years
    updated_sections = []
    for section in clean_sections:
        section_data = section.copy() if isinstance(section, dict) else section
        
        # Update hero section title
        if isinstance(section_data, dict) and section_data.get('__component') == 'sections.hero-section':
            updated_section = section_data.copy()
            updated_section['title'] = "Specialist in zakelijke financieringen"
            updated_sections.append(updated_section)
        
        # Update content section - change "I" to "we" form
        elif isinstance(section_data, dict) and section_data.get('__component') == 'sections.content-section':
            updated_section = section_data.copy()
            content = updated_section.get('content', '')
            # Change from "I" form to "we" form
            content = content.replace('Erik de Vos richt zich', 'Wij richten ons')
            content = content.replace('Hij helpt', 'Wij helpen')
            content = content.replace('Erik verdiept zich', 'Wij verdiepen ons')
            content = content.replace('denkt mee', 'denken mee')
            content = content.replace('begeleidt', 'begeleiden')
            content = content.replace('Samen met Jan Dijkerman zorgen zij ervoor', 'Samen zorgen wij ervoor')
            content = content.replace('de ondernemer', 'ondernemers')
            content = content.replace('uw onderneming', 'uw onderneming')
            content = content.replace('uw', 'uw')  # Keep "uw" as it's already correct
            updated_section['content'] = content
            updated_sections.append(updated_section)
        
        # Update why-choose section
        elif isinstance(section_data, dict) and section_data.get('__component') == 'sections.why-choose-section':
            updated_section = section_data.copy()
            updated_section['title'] = "Waarom kiezen voor geldgeregeld.nl"
            
            # Update benefits - change "Meer dan tien jaar" to "25 jaar" and "I" to "we"
            benefits = updated_section.get('benefits', [])
            if isinstance(benefits, dict) and 'data' in benefits:
                benefits = benefits['data']
            updated_benefits = []
            for benefit in benefits:
                if isinstance(benefit, dict):
                    benefit_data = benefit.get('attributes', benefit) if 'attributes' in benefit else benefit
                    updated_benefit = {k: v for k, v in benefit_data.items() if k not in ['id', 'documentId']}
                else:
                    updated_benefit = benefit
                
                description = updated_benefit.get('description', '')
                # Change "Meer dan tien jaar" to "25 jaar"
                description = description.replace('Meer dan tien jaar', '25 jaar')
                description = description.replace('Meer dan 10 jaar', '25 jaar')
                description = description.replace('meer dan tien jaar', '25 jaar')
                description = description.replace('meer dan 10 jaar', '25 jaar')
                
                # Change "I" form to "we" form
                description = description.replace('Erik vertaalt', 'Wij vertalen')
                description = description.replace('Erik kijkt', 'Wij kijken')
                description = description.replace('Erik verdiept zich', 'Wij verdiepen ons')
                description = description.replace('de ondernemer', 'ondernemers')
                description = description.replace('uw onderneming', 'uw onderneming')
                
                updated_benefit['description'] = description
                updated_benefits.append(updated_benefit)
            
            updated_section['benefits'] = updated_benefits
            updated_sections.append(updated_section)
        
        else:
            # Keep other sections as-is
            updated_sections.append(section_data)
    
    update_data['data']['sections'] = updated_sections
    
    url = f"{STRAPI_URL}/api/pages/{update_id}"
    try:
        response = requests.put(url, headers=HEADERS, json=update_data)
        if response.status_code == 200:
            print("✅ About Us page updated successfully")
            return True
        else:
            print(f"❌ Failed to update page: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
    except Exception as e:
        print(f"❌ Error updating page: {e}")
        import traceback
        traceback.print_exc()
        return False

def get_team_members():
    """Get team members"""
    url = f"{STRAPI_URL}/api/team-members?filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response keys: {list(data.keys())}")
            members = data.get('data', [])
            print(f"   Found {len(members)} team member(s)")
            return members
        else:
            print(f"   Error response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Error fetching team members: {e}")
        import traceback
        traceback.print_exc()
    return []

def update_team_members():
    """Update team member roles to mede-oprichter/consultant"""
    print("\n👥 Updating team members...")
    
    team_members = get_team_members()
    if not team_members:
        print("❌ No team members found")
        return False
    
    success_count = 0
    for member in team_members:
        # Handle both Strapi v4 (attributes) and v5 (flat) structures
        member_attrs = member.get('attributes', {}) if 'attributes' in member else member
        member_id = member.get('id') or member.get('documentId') or member_attrs.get('id') or member_attrs.get('documentId')
        if not member_id:
            print(f"   Skipping member - no ID found. Keys: {list(member.keys())}")
            continue
        
        name = member_attrs.get('name', '') if 'attributes' in member else member.get('name', '')
        
        update_data = {
            "data": {
                "role": "mede-oprichter/consultant"
            }
        }
        
        # Try documentId first, then numeric id
        url = f"{STRAPI_URL}/api/team-members/{member.get('documentId') or member_id}"
        try:
            response = requests.put(url, headers=HEADERS, json=update_data)
            if response.status_code == 200:
                print(f"✅ Updated {name}")
                success_count += 1
            else:
                print(f"❌ Failed to update {name}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error updating {name}: {e}")
    
    if success_count > 0:
        print(f"✅ Updated {success_count} team member(s)")
        return True
    else:
        print("❌ No team members were updated")
        return False

def update_algemene_voorwaarden_address():
    """Update address in algemene-voorwaarden page (hardcoded)"""
    print("\n📄 Note: algemene-voorwaarden page has hardcoded address")
    print("   This needs to be updated manually in frontend/app/algemene-voorwaarden/page.tsx")
    print("   Change: Herengracht 282, 1016 BX Amsterdam")
    print("   To: Roggestraat 7, 7311 ca apeldoorn")

def main():
    print("🔄 Updating site content...")
    print(f"📍 Site ID: {SITE_ID}")
    print(f"🔗 Strapi URL: {STRAPI_URL}\n")
    
    results = []
    
    # 1. Update address
    results.append(("Address", update_site_address()))
    
    # 2. Update About Us page
    results.append(("About Us Page", update_about_page()))
    
    # 3. Update team members
    results.append(("Team Members", update_team_members()))
    
    # 4. Note about algemene-voorwaarden
    update_algemene_voorwaarden_address()
    
    print("\n" + "="*50)
    print("📊 Summary:")
    for name, success in results:
        status = "✅" if success else "❌"
        print(f"  {status} {name}")
    
    all_success = all(result[1] for result in results)
    return 0 if all_success else 1

if __name__ == "__main__":
    exit(main())
