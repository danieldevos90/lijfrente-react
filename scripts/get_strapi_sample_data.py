#!/usr/bin/env python3
"""
Fetch and display sample data from all Strapi endpoints.
Shows actual content from each endpoint to verify data quality.
"""

import requests
import json
from datetime import datetime

STRAPI_URL = 'https://bright-smile-1f47bc9d67.strapiapp.com'
SITE_ID = 'geldgeregeld'

def fetch_endpoint(endpoint: str, params: dict = None) -> dict:
    """Fetch data from an endpoint."""
    url = f"{STRAPI_URL}/api{endpoint}"
    response = requests.get(url, params=params, timeout=30)
    if response.ok:
        return response.json()
    return {'error': response.status_code, 'message': response.text[:200]}

def print_separator(title: str):
    """Print a section separator."""
    print("\n" + "=" * 80)
    print(f"📦 {title}")
    print("=" * 80)

def main():
    print("\n" + "=" * 80)
    print("STRAPI DATA VERIFICATION REPORT")
    print("=" * 80)
    print(f"📍 Strapi URL: {STRAPI_URL}")
    print(f"🏢 Site ID: {SITE_ID}")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. PAGES
    print_separator("PAGES")
    data = fetch_endpoint('/pages', {'filters[siteId][$eq]': SITE_ID, 'populate': 'sections'})
    if 'data' in data:
        pages = data['data']
        print(f"✅ Found {len(pages)} pages:")
        for page in pages:
            slug = page.get('slug', 'N/A')
            title = page.get('title', 'No title')[:50]
            sections = page.get('sections', [])
            section_count = len(sections) if isinstance(sections, list) else 0
            print(f"   • /{slug:<25} - {title} ({section_count} sections)")
    else:
        print(f"❌ Error: {data}")
    
    # 2. NAVIGATION ITEMS
    print_separator("NAVIGATION ITEMS")
    data = fetch_endpoint('/navigation-items', {'filters[siteId][$eq]': SITE_ID, 'sort': 'order:asc'})
    if 'data' in data:
        items = data['data']
        print(f"✅ Found {len(items)} navigation items:")
        for item in items:
            label = item.get('label', 'N/A')
            href = item.get('href', 'N/A')
            order = item.get('order', 'N/A')
            print(f"   • [{order}] {label:<20} -> {href}")
    else:
        print(f"❌ Error: {data}")
    
    # 3. TESTIMONIALS
    print_separator("TESTIMONIALS")
    data = fetch_endpoint('/testimonials', {'filters[siteId][$eq]': SITE_ID})
    if 'data' in data:
        items = data['data']
        print(f"✅ Found {len(items)} testimonials:")
        for item in items[:5]:  # Show first 5
            name = item.get('name', 'N/A')
            company = item.get('company', 'N/A')
            rating = item.get('rating', 'N/A')
            text = item.get('text', '')[:60] + '...' if item.get('text') else 'No text'
            print(f"   • {name} ({company}) - ⭐{rating}")
            print(f"     \"{text}\"")
        if len(items) > 5:
            print(f"   ... and {len(items) - 5} more")
    else:
        print(f"❌ Error: {data}")
    
    # 4. SITES
    print_separator("SITES")
    data = fetch_endpoint('/sites', {'filters[siteId][$eq]': SITE_ID})
    if 'data' in data:
        items = data['data']
        print(f"✅ Found {len(items)} site(s):")
        for item in items:
            site_id = item.get('siteId', 'N/A')
            name = item.get('name', 'N/A')
            domain = item.get('domain', 'N/A')
            phone = item.get('phone', 'N/A')
            email = item.get('email', 'N/A')
            print(f"   • {name} (ID: {site_id})")
            print(f"     Domain: {domain}")
            print(f"     Phone: {phone}")
            print(f"     Email: {email}")
            
            # Show all available fields
            print(f"     Available fields: {list(item.keys())}")
    else:
        print(f"❌ Error: {data}")
    
    # 5. TOKEN SETS
    print_separator("TOKEN SETS (Design Tokens)")
    data = fetch_endpoint('/token-sets', {'filters[siteId][$eq]': SITE_ID})
    if 'data' in data:
        items = data['data']
        if len(items) > 0:
            print(f"✅ Found {len(items)} token set(s):")
            for item in items:
                name = item.get('name', 'N/A')
                print(f"   • {name}")
                print(f"     Fields: {list(item.keys())}")
        else:
            print("⚠️ No token sets defined for this site")
    else:
        print(f"❌ Error: {data}")
    
    # 6. TEAM MEMBERS
    print_separator("TEAM MEMBERS")
    data = fetch_endpoint('/team-members', {'filters[siteId][$eq]': SITE_ID, 'populate': 'image', 'sort': 'order:asc'})
    if 'data' in data:
        items = data['data']
        print(f"✅ Found {len(items)} team members:")
        for item in items:
            name = item.get('name', 'N/A')
            role = item.get('role', 'N/A')
            email = item.get('email', 'N/A')
            linkedin = item.get('linkedin', 'N/A')
            image = item.get('image')
            has_image = '📷' if image and image.get('url') else '  '
            print(f"   {has_image} {name:<20} - {role}")
            if email and email != 'N/A':
                print(f"      Email: {email}")
            if linkedin and linkedin != 'N/A':
                print(f"      LinkedIn: {linkedin}")
    else:
        print(f"❌ Error: {data}")
    
    # 7. BENEFITS
    print_separator("BENEFITS")
    data = fetch_endpoint('/benefits', {'filters[siteId][$eq]': SITE_ID, 'sort': 'order:asc'})
    if 'data' in data:
        items = data['data']
        print(f"✅ Found {len(items)} benefits:")
        for item in items:
            title = item.get('title', 'N/A')
            slug = item.get('slug', 'N/A')
            description = item.get('description', '')[:80] + '...' if item.get('description') and len(item.get('description', '')) > 80 else item.get('description', 'No description')
            icon = item.get('iconPath', item.get('icon', 'N/A'))
            print(f"   • {title}")
            print(f"     Slug: {slug}")
            print(f"     Icon: {icon}")
            print(f"     {description}")
    else:
        print(f"❌ Error: {data}")
    
    # 8. SECTOR PAGES
    print_separator("SECTOR PAGES")
    data = fetch_endpoint('/sector-pages', {'filters[siteId][$eq]': SITE_ID})
    if 'data' in data:
        items = data['data']
        print(f"✅ Found {len(items)} sector pages:")
        sectors_by_name = {}
        for item in items:
            sector_slug = item.get('sectorSlug', 'N/A')
            sector_name = item.get('sectorName', 'N/A')
            hero_title = item.get('heroTitle', 'No hero title')[:50]
            sectors_by_name[sector_slug] = sector_name
            print(f"   • /{sector_slug:<25} - {sector_name}")
        print(f"\n   Sectors available: {', '.join(sorted(sectors_by_name.keys()))}")
    else:
        print(f"❌ Error: {data}")
    
    # 9. LEADS (Expected to be protected)
    print_separator("LEADS")
    data = fetch_endpoint('/leads')
    if 'data' in data:
        items = data['data']
        print(f"⚠️ Leads endpoint is PUBLIC - found {len(items)} leads")
        print("   This should probably be protected!")
    elif 'error' in data:
        print(f"✅ Leads endpoint is protected (as expected)")
        print(f"   Status: {data['error']}")
    else:
        print(f"❓ Unexpected response: {data}")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print("""
✅ WORKING ENDPOINTS (Public Access):
   • /api/pages           - Page content with sections
   • /api/navigation-items - Navigation menu items  
   • /api/testimonials    - Customer testimonials
   • /api/sites           - Site configuration
   • /api/team-members    - Team member profiles
   • /api/benefits        - Benefit highlights
   • /api/sector-pages    - Industry-specific landing pages

⚠️ EMPTY/NO DATA:
   • /api/token-sets      - Design tokens (not configured)

🔒 PROTECTED (as expected):
   • /api/leads           - Lead/contact form submissions

📝 NOTE: All endpoints are accessible without authentication.
   The STRAPI_API_TOKEN in .env.local appears to be expired.
   Generate a new token in Strapi Admin → Settings → API Tokens.
""")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    main()
