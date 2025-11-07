#!/usr/bin/env python3
"""
Populate Strapi CMS with GeldGeregeld content
Multi-site architecture ready
"""

import os
import requests
import json
import time
from typing import Dict, List, Any

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717'

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def delete_all_pages_for_site():
    """Delete all existing pages for the site"""
    url = f"{STRAPI_URL}/api/pages?filters[siteId][$eq]={SITE_ID}&pagination[limit]=100"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            pages = data.get('data', [])
            if pages:
                print(f"\n🗑️ Found {len(pages)} existing pages, deleting...")
                for page in pages:
                    # Handle both Strapi v4 (attributes) and v5 (flat) structures
                    page_id = page.get('id')
                    if not page_id and 'attributes' in page:
                        page_id = page['attributes'].get('id')
                    
                    if page_id:
                        try:
                            # Unpublish first if published
                            try:
                                unpublish_url = f"{STRAPI_URL}/api/pages/{page_id}/actions/unpublish"
                                unpub_resp = requests.post(unpublish_url, headers=HEADERS, timeout=5)
                            except:
                                pass
                            
                            # Delete the page
                            delete_url = f"{STRAPI_URL}/api/pages/{page_id}"
                            delete_response = requests.delete(delete_url, headers=HEADERS, timeout=5)
                            if delete_response.status_code in [200, 204]:
                                slug = page.get('attributes', {}).get('slug') or page.get('slug', 'unknown')
                                print(f"  ✅ Deleted page: {slug}")
                            else:
                                print(f"  ⚠️ Failed to delete page {page_id}: {delete_response.status_code}")
                            time.sleep(0.3)  # Small delay between deletions
                        except Exception as e:
                            print(f"  ⚠️ Could not delete page {page_id}: {e}")
                print("✅ Finished deleting existing pages\n")
                
                # Verify deletions by checking again
                print("🔍 Verifying deletions...")
                time.sleep(2)
                verify_response = requests.get(url, headers=HEADERS)
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    remaining = verify_data.get('data', [])
                    if remaining:
                        print(f"⚠️ Warning: {len(remaining)} pages still exist, will retry deletion...")
                        # Try deleting again
                        for page in remaining:
                            page_id = page.get('id') or page.get('attributes', {}).get('id')
                            if page_id:
                                try:
                                    delete_url = f"{STRAPI_URL}/api/pages/{page_id}"
                                    requests.delete(delete_url, headers=HEADERS, timeout=5)
                                except:
                                    pass
                        time.sleep(3)
                    else:
                        print("✅ All pages successfully deleted\n")
                
                time.sleep(3)  # Wait longer for deletions to complete
            else:
                print("✅ No existing pages to delete\n")
    except Exception as e:
        print(f"⚠️ Error fetching pages to delete: {e}\n")

def get_existing_page(slug: str) -> Dict:
    """Get existing page by slug"""
    url = f"{STRAPI_URL}/api/pages?filters[slug][$eq]={slug}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"Error fetching page {slug}: {e}")
    return None

def create_or_update_page(slug: str, page_data: Dict):
    """Create or update a page - prioritize update over delete/create"""
    existing = get_existing_page(slug)
    if existing:
        # Handle both Strapi v4 (attributes) and v5 (flat) structures
        page_id = existing.get('id')
        if not page_id and 'attributes' in existing:
            page_id = existing['attributes'].get('id')
        
        if page_id:
            # Always try to update existing page first
            update_url = f"{STRAPI_URL}/api/pages/{page_id}"
            try:
                update_response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=10)
                if update_response.status_code == 200:
                    print(f"✅ Updated page: {slug}")
                    return update_response.json()
                elif update_response.status_code == 404:
                    # Page might have been deleted, try to create
                    print(f"⚠️ Page {slug} not found (404), will try to create new...")
                    return create_api_request('pages', page_data)
                else:
                    # If update fails, show error
                    try:
                        error_data = update_response.json()
                        error_msg = error_data.get('error', {}).get('message', f'Status {update_response.status_code}')
                        print(f"⚠️ Update failed for {slug}: {error_msg}")
                        if 'details' in error_data.get('error', {}):
                            details = error_data['error']['details']
                            if 'errors' in details:
                                for err in details['errors'][:2]:
                                    path = '.'.join(err.get('path', []))
                                    print(f"   - {path}: {err.get('message', '')}")
                    except:
                        print(f"⚠️ Update failed for {slug}: Status {update_response.status_code}")
            except Exception as e:
                print(f"⚠️ Error updating page {slug}: {e}")
                # Try to create if update fails
                return create_api_request('pages', page_data)
    
    # Create new page if it doesn't exist
    return create_api_request('pages', page_data)

def create_api_request(endpoint: str, data: Dict[str, Any], method: str = 'POST') -> Dict:
    """Make API request to Strapi"""
    url = f"{STRAPI_URL}/api/{endpoint}"
    
    try:
        if method == 'POST':
            response = requests.post(url, headers=HEADERS, json=data)
        elif method == 'PUT':
            response = requests.put(url, headers=HEADERS, json=data)
        
        if response.status_code == 400:
            error_data = response.json()
            error_msg = error_data.get('error', {}).get('message', 'Unknown error')
            # Only print full error for pages to avoid spam
            if endpoint == 'pages':
                print(f"⚠️ Validation error for {endpoint} ({data.get('data', {}).get('slug', 'unknown')}): {error_msg}")
                # Print key details if available
                if 'details' in error_data.get('error', {}):
                    details = error_data['error']['details']
                    if 'errors' in details:
                        for err in details['errors'][:2]:  # Show first 2 errors
                            path = '.'.join(err.get('path', []))
                            print(f"   - {path}: {err.get('message', '')}")
                    elif 'key' in details:
                        print(f"   - Invalid key: {details.get('key')}")
            else:
                print(f"⚠️ Validation error for {endpoint}: {error_msg}")
            return {}
        
        response.raise_for_status()
        print(f"✅ Created {endpoint}: {data.get('data', {}).get('title', data.get('data', {}).get('label', 'Success'))}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error creating {endpoint}: {e}")
        if hasattr(e, 'response') and e.response:
            try:
                error_data = e.response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Response: {e.response.text}")
        return {}

def update_site_with_footer():
    """Update site with footer content"""
    # First get existing site
    url = f"{STRAPI_URL}/api/sites?filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                site_id = data['data'][0]['id']
                # Update site with footer fields
                update_data = {
                    "data": {
                        "companyName": "GeldGeregeld B.V.",
                        "address": "Herengracht 282",
                        "postalCode": "1016 BX",
                        "city": "Amsterdam",
                        "country": "Nederland",
                        "linkedinUrl": "https://linkedin.com",
                        "linkedinText": "Volg ons op LinkedIn",
                        "description1": "GeldGeregeld B.V. is een Nederlandse financiële dienstverlener die ondernemers helpt bij het verkrijgen van passende zakelijke financiering. Wij werken samen met een netwerk van gerenommeerde kredietverstrekkers en bemiddelen tussen ondernemers en financiers.",
                        "description2": "Het verstrekken van financiering gebeurt door onze partnercrediteurs onder de voorwaarden die door hen worden gesteld. GeldGeregeld verstrekt zelf geen krediet. Wij helpen bij het vinden van de meest geschikte financiering voor uw onderneming.",
                        "description3": "Let op: lenen kost geld. Raadpleeg uw adviseur en vraag indien nodig advies over de voorwaarden en risico's. Alle financieringsvormen en voorwaarden zijn afhankelijk van goedkeuring door de crediteur. Restricties zijn van toepassing; zie de voorwaarden van de betreffende crediteur voor details.",
                        "copyright": "©2025 GeldGeregeld B.V. Alle rechten voorbehouden.",
                        "footerLinks": [
                            {"label": "Privacy", "href": "/privacy"},
                            {"label": "Cookies", "href": "/cookies"},
                            {"label": "Algemene Voorwaarden", "href": "/algemene-voorwaarden"},
                            {"label": "Disclaimer", "href": "/disclaimer"},
                            {"label": "Contact", "href": "/contact"}
                        ]
                    }
                }
                update_url = f"{STRAPI_URL}/api/sites/{site_id}"
                response = requests.put(update_url, headers=HEADERS, json=update_data)
                if response.status_code == 200:
                    print("✅ Updated site with footer content")
                    return True
    except Exception as e:
        print(f"⚠️ Could not update site footer (this is OK if schema doesn't have these fields): {e}")
    return False

# ============================================================================
# SITE CONFIGURATION
# ============================================================================

def create_site():
    """Create GeldGeregeld site"""
    data = {
        "data": {
            "siteId": SITE_ID,
            "name": "GeldGeregeld",
            "domain": "geldgeregeld.nl"
        }
    }
    return create_api_request('sites', data)

# ============================================================================
# NAVIGATION
# ============================================================================

def get_existing_navigation_item(site_id: str, href: str) -> Dict:
    """Get existing navigation item by siteId and href"""
    url = f"{STRAPI_URL}/api/navigation-items?filters[siteId][$eq]={site_id}&filters[href][$eq]={href}"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"Error fetching navigation item {site_id} -> {href}: {e}")
    return None

def create_or_update_navigation_item(site_id: str, nav_data: Dict):
    """Create or update navigation item - prevents duplicates"""
    href = nav_data.get('href')
    if not href:
        print("⚠️ Navigation item missing href, skipping")
        return None
    
    existing = get_existing_navigation_item(site_id, href)
    
    nav_item_data = {
        "data": {
            "siteId": site_id,
            **nav_data
        }
    }
    
    if existing:
        # Handle both Strapi v4 (attributes) and v5 (flat) structures
        item_id = existing.get('id')
        if not item_id and 'attributes' in existing:
            item_id = existing['attributes'].get('id')
        
        if item_id:
            # Update existing item
            update_url = f"{STRAPI_URL}/api/navigation-items/{item_id}"
            try:
                update_response = requests.put(update_url, headers=HEADERS, json=nav_item_data, timeout=10)
                if update_response.status_code == 200:
                    print(f"✅ Updated navigation item: {nav_data.get('label')} -> {href}")
                    return update_response.json()
                else:
                    print(f"⚠️ Failed to update navigation item {nav_data.get('label')}: {update_response.status_code}")
            except Exception as e:
                print(f"⚠️ Error updating navigation item {nav_data.get('label')}: {e}")
    
    # Create new item if it doesn't exist
    return create_api_request('navigation-items', nav_item_data)

def create_navigation():
    """Create or update navigation items (prevents duplicates)"""
    nav_items = [
        {"label": "Hoe werkt het", "href": "/hoe-werkt-het", "order": 1},
        {"label": "Over ons", "href": "/over-ons", "order": 2},
        {"label": "Contact", "href": "/contact", "order": 3},
    ]
    
    for item in nav_items:
        create_or_update_navigation_item(SITE_ID, item)

# ============================================================================
# TESTIMONIALS
# ============================================================================

def create_testimonials():
    """Create testimonials"""
    testimonials = [
        {
            "name": "Sarah van der Berg",
            "company": "Café de Hoek",
            "text": "Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte.",
            "rating": 5,
            "featured": True
        },
        {
            "name": "Mark Jansen",
            "company": "Transport BV",
            "text": "Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als MKB nodig hebben.",
            "rating": 5,
            "featured": True
        },
        {
            "name": "Lisa Vermeulen",
            "company": "Webshop Groen",
            "text": "Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden.",
            "rating": 5,
            "featured": True
        }
    ]
    
    for testimonial in testimonials:
        data = {
            "data": {
                "siteId": SITE_ID,
                **testimonial
            }
        }
        create_api_request('testimonials', data)

# ============================================================================
# HOMEPAGE
# ============================================================================

def create_homepage():
    """Create homepage with all sections"""
    
    homepage_data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "home",
            "title": "GeldGeregeld - Zakelijke Financiering Binnen 24 Uur",
            "metaDescription": "Zakelijke lening zonder gedoe. Aanvraag binnen 2 minuten, aanbod binnen 24 uur. Flexibel aflossen, geen opstartkosten.",
            "metaKeywords": "zakelijke lening, bedrijfslening, mkb financiering, snelle lening, flexibel aflossen",
            "sections": [
                {
                    "__component": "sections.hero-section",
                    "title": "Zakelijke financiering binnen 24 uur. Geen gedoe met de bank.",
                    "subtitle": "Van €5.000 tot €500.000. Flexibel aflossen. Binnen 2 minuten aangevraagd.",
                    "backgroundImage": "/images/pexels-ketut-subiyanto-4473496.jpg",
                    "variant": "image",
                    "primaryCta": {
                        "label": "Start aanvraag",
                        "href": "#aanvragen"
                    }
                },
                {
                    "__component": "sections.benefits-carousel",
                    "title": "Zakelijke lening zonder gedoe",
                    "subtitle": "Eenvoudig online aanvragen. Geen opstartkosten. Boetevrij aflossen.",
                    "backgroundColor": "var(--color-bg)",
                    "benefits": [
                        {
                            "iconPath": "/icons/SVG/interface/zap.svg",
                            "title": "Binnen 24 uur",
                            "description": "Aanvraag binnen 2 minuten. Aanbod binnen 24 uur. Sneller dan traditionele banken.",
                            "color": "#fff2b2",
                            "textColor": "#5e5515"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/shield.svg",
                            "title": "Geen verborgen kosten",
                            "description": "Transparante voorwaarden. Boetevrij vervroegd aflossen. Geen opstartkosten.",
                            "color": "#bbe7be",
                            "textColor": "#114e0b"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/clock.svg",
                            "title": "Flexibel aflossen",
                            "description": "Flexibele looptijd van 3 tot 36 maanden. Pas aan op basis van je cashflow.",
                            "color": "#aad5fc",
                            "textColor": "#0f1720"
                        },
                        {
                            "iconPath": "/icons/SVG/finance/trend-up.svg",
                            "title": "Tot €500.000",
                            "description": "Van kleine investeringen tot grote groeiplannen. Financiering op maat.",
                            "color": "#d7d0ff",
                            "textColor": "#3b0b5e"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/user-add.svg",
                            "title": "Persoonlijk advies",
                            "description": "Vaste contactpersoon via telefoon, e-mail of chat. Geen wachtlijnen.",
                            "color": "#f8e4e4",
                            "textColor": "#3b0b0b"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/trophy.svg",
                            "title": "Zonder onderpand",
                            "description": "Geen zakelijke zekerheden vereist. Ook als de bank je heeft afgewezen.",
                            "color": "#fcf8d8",
                            "textColor": "#5e5515"
                        }
                    ]
                },
                {
                    "__component": "sections.feature-section",
                    "title": "Flexibele aflossing op jouw voorwaarden",
                    "description": "Kies zelf wanneer je aflost. Geen vaste maandlasten, maar flexibiliteit die past bij jouw cashflow. Boetevrij vervroegd aflossen mogelijk wanneer het jou uitkomt.",
                    "buttonText": "Meer informatie",
                    "imagePath": "/images/pexels-tima-miroshnichenko-5198239.jpg",
                    "imagePosition": "left",
                    "backgroundColor": "white"
                },
                {
                    "__component": "sections.testimonials-carousel",
                    "title": "Wat onze klanten zeggen",
                    "subtitle": "Meer dan 1.000 ondernemers gingen je voor",
                    "backgroundColor": "var(--color-bg)",
                    "testimonials": [
                        {
                            "name": "Sarah van der Berg",
                            "role": "Eigenaar Café de Hoek",
                            "text": "Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte.",
                            "image": "/images/pexels-ketut-subiyanto-4559683.jpg"
                        },
                        {
                            "name": "Mark Jansen",
                            "role": "Directeur Transport BV",
                            "text": "Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als MKB nodig hebben.",
                            "image": "/images/pexels-yankrukov-4458386.jpg"
                        },
                        {
                            "name": "Lisa Vermeulen",
                            "role": "Oprichter Webshop Groen",
                            "text": "Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden.",
                            "image": "/images/pexels-amina-filkins-5414025.jpg"
                        }
                    ]
                },
                {
                    "__component": "sections.how-it-works-bento",
                    "title": "Zo werkt het",
                    "subtitle": "In 4 eenvoudige stappen naar uw zakelijke financiering"
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Zakelijke lening aanvragen?",
                    "subtitle": "Binnen 2 minuten aangevraagd. Aanbod binnen 24 uur.",
                    "ctaLabel": "Start je aanvraag nu",
                    "ctaHref": "#aanvragen",
                    "background": "dark"
                }
            ]
        }
    }
    
    return create_or_update_page('home', homepage_data)

# ============================================================================
# ADDITIONAL PAGES
# ============================================================================

def create_about_page():
    """Create About Us page"""
    
    data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "over-ons",
            "title": "Over GeldGeregeld - Zakelijke Financiering Made Easy",
            "metaDescription": "Leer meer over GeldGeregeld, jouw partner in zakelijke financiering. Transparant, snel en persoonlijk.",
            "metaKeywords": "over geldgeregeld, bedrijfslening, mkb financiering",
            "sections": [
                {
                    "__component": "sections.hero-section",
                    "title": "Zakelijke financiering zoals het zou moeten zijn",
                    "subtitle": "Snel, simpel en transparant. Voor elke ondernemer die vooruit wil.",
                    "variant": "gradient"
                },
                {
                    "__component": "sections.content-section",
                    "title": "Onze missie",
                    "content": "Bij GeldGeregeld geloven we dat elke ondernemer toegang moet hebben tot eerlijke, snelle en transparante financiering. Geen verborgen kosten, geen eindeloze wachttijden, geen onduidelijke voorwaarden.\n\nWe maken zakelijke financiering toegankelijk voor iedereen – van ZZP'er tot gevestigd MKB-bedrijf. Met onze moderne aanpak krijgt u binnen 24 uur reactie, zodat u zich kunt focussen op wat echt belangrijk is: uw bedrijf laten groeien.",
                    "layout": "image-left",
                    "background": "white"
                },
                {
                    "__component": "sections.why-choose-section",
                    "title": "Waarom GeldGeregeld?",
                    "subtitle": "Wij maken het verschil met persoonlijke service en moderne technologie",
                    "benefits": [
                        {
                            "iconPath": "/icons/SVG/interface/zap.svg",
                            "title": "Razendsnel",
                            "description": "Binnen 24 uur reactie op uw aanvraag. Geen weken wachten zoals bij traditionele banken. Aanvraag gedaan in 2 minuten, geld op uw rekening binnen 1-2 werkdagen.",
                            "color": "#fff2b2",
                            "textColor": "#5e5515"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/shield.svg",
                            "title": "100% Transparant",
                            "description": "Geen verborgen kosten of verrassingen. Wat u ziet is wat u krijgt. Heldere voorwaarden, eerlijke tarieven en boetevrij vervroegd aflossen mogelijk.",
                            "color": "#bbe7be",
                            "textColor": "#114e0b"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/user-add.svg",
                            "title": "Voor Elke Ondernemer",
                            "description": "Of u nu net bent begonnen of al jaren actief bent – wij hebben de juiste financieringsoplossing. Van ZZP tot MKB, van €5.000 tot €500.000.",
                            "color": "#f8e4e4",
                            "textColor": "#3b0b0b"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/lock.svg",
                            "title": "Veilig & Vertrouwd",
                            "description": "Uw gegevens zijn bij ons in goede handen. We werken volgens de hoogste veiligheidsstandaarden en zijn volledig AVG-compliant.",
                            "color": "#d7d0ff",
                            "textColor": "#3b0b5e"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/tablet.svg",
                            "title": "Eenvoudig Online",
                            "description": "Alles 100% online geregeld. Geen onnodig papierwerk, geen fysieke afspraken. Aanvraag doen waar en wanneer het u uitkomt.",
                            "color": "#aad5fc",
                            "textColor": "#0f1720"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/message.svg",
                            "title": "Persoonlijke Service",
                            "description": "Een vast contactpersoon die begrijpt waar uw bedrijf voor staat. Bereikbaar via telefoon, e-mail of chat. Persoonlijk advies op maat.",
                            "color": "#fcf8d8",
                            "textColor": "#5e5515"
                        }
                    ]
                },
                {
                    "__component": "sections.faq-section",
                    "title": "Onze kernwaarden",
                    "subtitle": "De principes die ons werk en onze beslissingen bepalen",
                    "faqItems": [
                        {
                            "question": "Eerlijkheid & Transparantie",
                            "answer": "We geloven in open communicatie. Geen kleine lettertjes, geen verborgen agenda's. Wat we beloven, maken we waar. U krijgt altijd het complete plaatje voordat u een beslissing neemt."
                        },
                        {
                            "question": "Snelheid & Efficiëntie",
                            "answer": "Als ondernemer is tijd geld. Daarom hebben we onze processen geoptimaliseerd voor maximale snelheid zonder concessies te doen aan kwaliteit. Moderne technologie maakt het mogelijk om binnen 24 uur reactie te geven."
                        },
                        {
                            "question": "Toegankelijkheid",
                            "answer": "Zakelijke financiering moet voor iedereen toegankelijk zijn. Of u nu een beginnend eenmanszaak bent of een gevestigd MKB-bedrijf – bij ons krijgt u de aandacht en het maatwerk dat u verdient."
                        },
                        {
                            "question": "Innovatie",
                            "answer": "We omarmen technologie om betere financiële oplossingen te bieden. Door slimme automatisering en data-analyse kunnen we sneller beslissingen nemen en u beter van dienst zijn."
                        }
                    ]
                },
                {
                    "__component": "sections.content-section",
                    "title": "Hoe we werken",
                    "content": "Bij GeldGeregeld combineren we de snelheid en efficiëntie van moderne technologie met de persoonlijke benadering waar u als ondernemer recht op heeft.",
                    "layout": "image-left",
                    "background": "gray"
                },
                {
                    "__component": "sections.process-steps",
                    "title": "Ons proces",
                    "steps": [
                        {
                            "number": "01",
                            "title": "Uw aanvraag in 2 minuten",
                            "description": "Vul het online formulier in met uw basisgegevens. Door onze slimme automatisering hebben we maar weinig gegevens nodig om u een eerste indicatie te kunnen geven. Geen urenlange formulieren invullen.",
                            "details": [],
                            "imagePath": "/images/pexels-ketut-subiyanto-4559683.jpg"
                        },
                        {
                            "number": "02",
                            "title": "Binnen 24 uur reactie",
                            "description": "Ons team beoordeelt uw aanvraag en neemt binnen één werkdag contact met u op. U krijgt een persoonlijk voorstel op maat, inclusief alle voorwaarden en kosten. Geen weken wachten op onduidelijke antwoorden.",
                            "details": [],
                            "imagePath": "/images/pexels-yankrukov-4458386.jpg"
                        },
                        {
                            "number": "03",
                            "title": "Geld op uw rekening",
                            "description": "Na uw akkoord zorgen we dat het geld snel op uw rekening staat – meestal binnen 1-2 werkdagen. U kunt meteen aan de slag met uw plannen. Dát is pas geld geregeld!",
                            "details": [],
                            "imagePath": "/images/pexels-tima-miroshnichenko-5198239.jpg"
                        }
                    ]
                },
                {
                    "__component": "sections.trust-section",
                    "title": "Veiligheid & vertrouwen",
                    "variant": "centered",
                    "badges": [
                        {
                            "icon": "/icons/SVG/interface/lock.svg",
                            "text": "SSL Versleuteling"
                        },
                        {
                            "icon": "/icons/SVG/interface/shield.svg",
                            "text": "AVG-Compliant"
                        },
                        {
                            "icon": "/icons/SVG/finance/bank.svg",
                            "text": "Veilige Banking"
                        }
                    ]
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Klaar om uw financiering te regelen?",
                    "subtitle": "Doe vandaag nog een vrijblijvende aanvraag en ontvang binnen 24 uur een persoonlijk voorstel.",
                    "ctaLabel": "Start uw aanvraag",
                    "ctaHref": "#aanvragen",
                    "background": "dark"
                }
            ]
        }
    }
    return create_or_update_page('over-ons', data)

def create_hoe_werkt_het_page():
    """Create Hoe werkt het page"""
    
    data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "hoe-werkt-het",
            "title": "Hoe werkt het? - GeldGeregeld",
            "metaDescription": "Van aanvraag tot uitbetaling in 4 eenvoudige stappen. Wij maken zakelijke financiering toegankelijk, transparant en snel.",
            "metaKeywords": "hoe werkt het, aanvraagproces, zakelijke lening proces",
            "sections": [
                {
                    "__component": "sections.hero-section",
                    "title": "Hoe werkt het?",
                    "subtitle": "Van aanvraag tot uitbetaling in 4 eenvoudige stappen. Wij maken zakelijke financiering toegankelijk, transparant en snel.",
                    "iconPath": "/icons/SVG/interface/bulb.svg",
                    "variant": "gradient"
                },
                {
                    "__component": "sections.process-steps",
                    "title": "Ons proces in 4 stappen",
                    "steps": [
                        {
                            "number": "01",
                            "title": "Aanvraag indienen",
                            "description": "Vul in 2 minuten het online formulier in met uw bedrijfsgegevens en financieringswens.",
                            "details": [
                                "Geen uitgebreide documentatie nodig",
                                "Volledig online en veilig",
                                "Geen verplichtingen"
                            ],
                            "imagePath": "/images/pexels-ketut-subiyanto-4473496.jpg"
                        },
                        {
                            "number": "02",
                            "title": "Beoordeling",
                            "description": "Wij analyseren uw aanvraag en selecteren de meest geschikte financieringspartners.",
                            "details": [
                                "Automatische matching met partners",
                                "Beoordeling binnen 1 werkdag",
                                "Persoonlijk contactmoment"
                            ],
                            "imagePath": "/images/pexels-tima-miroshnichenko-6693637.jpg"
                        },
                        {
                            "number": "03",
                            "title": "Aanbod ontvangen",
                            "description": "Ontvang binnen 24 uur meerdere aanbiedingen van verschillende financiers.",
                            "details": [
                                "Duidelijk overzicht van voorwaarden",
                                "Vergelijk rente en looptijden",
                                "Geen verrassingen"
                            ],
                            "imagePath": "/images/pexels-amina-filkins-5414025.jpg"
                        },
                        {
                            "number": "04",
                            "title": "Financiering regelen",
                            "description": "Kies het beste aanbod en wij regelen de rest. Het geld staat snel op uw rekening.",
                            "details": [
                                "Hulp bij het maken van de juiste keuze",
                                "Snelle afhandeling",
                                "Uitbetaling binnen enkele dagen"
                            ],
                            "imagePath": "/images/pexels-ketut-subiyanto-4559683.jpg"
                        }
                    ]
                },
                {
                    "__component": "sections.why-choose-section",
                    "title": "Waarom kiezen voor GeldGeregeld?",
                    "benefits": [
                        {
                            "iconPath": "/icons/SVG/interface/zap.svg",
                            "title": "Snel proces",
                            "description": "Van aanvraag tot uitbetaling in enkele dagen. Geen lange wachttijden of eindeloze procedures.",
                            "color": "#fff2b2",
                            "textColor": "#5e5515"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/user-add.svg",
                            "title": "Persoonlijke begeleiding",
                            "description": "Een vaste contactpersoon gedurende het hele proces. Altijd bereikbaar voor uw vragen.",
                            "color": "#f8e4e4",
                            "textColor": "#3b0b0b"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/shield.svg",
                            "title": "Transparant",
                            "description": "Duidelijke voorwaarden en kosten. Geen verborgen kosten of verrassingen achteraf.",
                            "color": "#bbe7be",
                            "textColor": "#114e0b"
                        }
                    ]
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Klaar om te starten?",
                    "subtitle": "Dien binnen 2 minuten uw aanvraag in en ontvang binnen 24 uur een aanbod op maat",
                    "ctaLabel": "Start uw aanvraag",
                    "ctaHref": "#aanvragen",
                    "background": "dark"
                }
            ]
        }
    }
    return create_or_update_page('hoe-werkt-het', data)

def create_contact_page():
    """Create Contact page"""
    
    data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "contact",
            "title": "Contact - GeldGeregeld",
            "metaDescription": "Heeft u vragen of wilt u meer weten over onze diensten? We helpen u graag verder.",
            "metaKeywords": "contact, geldgeregeld, vragen, zakelijke financiering",
            "sections": [
                {
                    "__component": "sections.hero-section",
                    "title": "Neem contact op",
                    "subtitle": "Heeft u vragen of wilt u meer weten over onze diensten? We helpen u graag verder.",
                    "iconPath": "/icons/SVG/interface/message.svg",
                    "variant": "gradient"
                },
                {
                    "__component": "sections.content-section",
                    "title": "Contactgegevens",
                    "content": "Bereik ons via telefoon, e-mail of bezoek ons op kantoor. We zijn bereikbaar van maandag tot vrijdag tussen 09:00 en 18:00.",
                    "layout": "image-left",
                    "background": "white"
                },
                {
                    "__component": "sections.services-section",
                    "title": "Contactmogelijkheden",
                    "subtitle": "Kies de manier die het beste bij u past",
                    "services": [
                        {
                            "icon": "/icons/SVG/interface/phone.svg",
                            "title": "Bel ons",
                            "description": "Ma-Vr: 09:00 - 18:00\n020-1234567",
                            "href": "tel:0201234567"
                        },
                        {
                            "icon": "/icons/SVG/interface/mail.svg",
                            "title": "E-mail ons",
                            "description": "Reactie binnen 24 uur\ninfo@geldgeregeld.nl",
                            "href": "mailto:info@geldgeregeld.nl"
                        },
                        {
                            "icon": "/icons/SVG/interface/map-pin.svg",
                            "title": "Bezoek ons",
                            "description": "Op afspraak\nHerengracht 282, 1016 BX Amsterdam",
                            "href": "#"
                        }
                    ]
                },
                {
                    "__component": "sections.content-section",
                    "title": "Openingstijden",
                    "content": "Maandag - Vrijdag: 09:00 - 18:00\nZaterdag - Zondag: Gesloten",
                    "layout": "image-left",
                    "background": "blue"
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Staat uw vraag er niet bij?",
                    "subtitle": "Neem contact met ons op. We helpen u graag verder met al uw vragen.",
                    "ctaLabel": "Contact opnemen",
                    "ctaHref": "/contact",
                    "background": "dark"
                }
            ]
        }
    }
    return create_or_update_page('contact', data)

def create_faq_page():
    """Create FAQ page"""
    
    data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "faq",
            "title": "Veelgestelde Vragen - GeldGeregeld",
            "metaDescription": "Vind antwoorden op de meest gestelde vragen over zakelijke leningen, aanvraagproces en voorwaarden.",
            "metaKeywords": "faq, veelgestelde vragen, zakelijke lening, voorwaarden",
            "sections": [
                {
                    "__component": "sections.hero-section",
                    "title": "Veelgestelde vragen",
                    "subtitle": "Heeft u een vraag? Bekijk hier de antwoorden op de meest gestelde vragen.",
                    "iconPath": "/icons/SVG/interface/question.svg",
                    "variant": "gradient"
                },
                {
                    "__component": "sections.faq-section",
                    "title": "Veelgestelde vragen",
                    "subtitle": "Vind snel antwoord op uw vraag",
                    "faqItems": [
                        {
                            "question": "Hoe lang duurt het voordat ik een beslissing krijg?",
                            "answer": "In de meeste gevallen ontvangt u binnen 24 uur een eerste reactie op uw aanvraag. De complete beoordeling en beslissing duurt gemiddeld 2-3 werkdagen, afhankelijk van de volledigheid van uw aanvraag en de beschikbaarheid van aanvullende informatie."
                        },
                        {
                            "question": "Wat zijn de voorwaarden voor een zakelijke lening?",
                            "answer": "De voorwaarden variëren per type lening en uw specifieke situatie. Over het algemeen kijken we naar uw bedrijfsresultaten van de afgelopen jaren, uw kredietwaardigheid, en het doel van de financiering. We werken graag samen met ondernemers die al minimaal 1 jaar actief zijn."
                        },
                        {
                            "question": "Kan ik een lening aanvragen als ik een startende ondernemer ben?",
                            "answer": "Ja, ook startende ondernemers kunnen bij ons terecht. Voor starters hebben we speciale programma's en voorwaarden. We kijken dan bijvoorbeeld naar uw businessplan, eventuele persoonlijke zekerheden, en uw ervaring in de branche. Het is belangrijk dat u een goed doordacht plan heeft."
                        },
                        {
                            "question": "Welke documenten heb ik nodig voor mijn aanvraag?",
                            "answer": "Voor een complete aanvraag hebben we doorgaans nodig: uw laatste jaarrekening, BTW-aangiftes van het afgelopen jaar, een recent bankoverzicht, en een kopie van uw identiteitsbewijs. Afhankelijk van uw situatie kunnen er aanvullende documenten nodig zijn."
                        },
                        {
                            "question": "Zijn er kosten verbonden aan het aanvragen?",
                            "answer": "Nee, het aanvragen van een offerte is volledig kosteloos en vrijblijvend. U betaalt alleen als u daadwerkelijk een lening afsluit. Alle kosten en voorwaarden worden vooraf helder met u gecommuniceerd, zodat u precies weet waar u aan toe bent."
                        },
                        {
                            "question": "Kan ik vervroegd aflossen?",
                            "answer": "Ja, vervroegd aflossen is mogelijk. Afhankelijk van het type lening en de afspraken kunnen hier kosten aan verbonden zijn. We adviseren u graag over de mogelijkheden en eventuele kosten van vervroegd aflossen bij uw specifieke lening."
                        }
                    ]
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Staat uw vraag er niet bij?",
                    "subtitle": "Neem contact met ons op. We helpen u graag verder met al uw vragen.",
                    "ctaLabel": "Contact opnemen",
                    "ctaHref": "/contact",
                    "background": "dark"
                }
            ]
        }
    }
    return create_or_update_page('faq', data)

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution function"""
    print("=" * 80)
    print("🚀 POPULATING STRAPI CMS - GELDGEREGELD")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    # Delete all existing pages first
    print("🗑️ Cleaning up existing pages...")
    delete_all_pages_for_site()
    
    # Create site
    print("\n📍 Creating site configuration...")
    create_site()
    update_site_with_footer()
    
    # Create navigation
    print("\n🧭 Creating navigation...")
    create_navigation()
    
    # Create testimonials
    print("\n💬 Creating testimonials...")
    create_testimonials()
    
    # Create pages
    print("\n📄 Creating pages...")
    create_homepage()
    create_about_page()
    create_hoe_werkt_het_page()
    create_contact_page()
    create_faq_page()
    
    print("\n" + "=" * 80)
    print("✅ CONTENT POPULATION COMPLETE!")
    print("=" * 80)
    print(f"\n🎉 Your Strapi CMS is ready for GeldGeregeld!")
    print(f"🌐 Visit: {STRAPI_URL}/admin")

if __name__ == '__main__':
    main()
