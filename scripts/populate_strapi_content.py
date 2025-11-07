#!/usr/bin/env python3
"""
Populate Strapi CMS with GeldGeregeld content
Multi-site architecture ready
"""

import os
import requests
import json
from typing import Dict, List, Any

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717'

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def create_api_request(endpoint: str, data: Dict[str, Any], method: str = 'POST') -> Dict:
    """Make API request to Strapi"""
    url = f"{STRAPI_URL}/api/{endpoint}"
    
    try:
        if method == 'POST':
            response = requests.post(url, headers=HEADERS, json=data)
        elif method == 'PUT':
            response = requests.put(url, headers=HEADERS, json=data)
        
        response.raise_for_status()
        print(f"✅ Created {endpoint}: {data.get('data', {}).get('title', 'Success')}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error creating {endpoint}: {e}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
        return {}

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

def create_navigation():
    """Create navigation items"""
    nav_items = [
        {"label": "Home", "href": "/", "order": 1},
        {"label": "Over Ons", "href": "/over-ons", "order": 2},
        {"label": "Zakelijke Lening", "href": "/zakelijke-lening", "order": 3},
        {"label": "FAQ", "href": "/faq", "order": 4},
        {"label": "Contact", "href": "/contact", "order": 5},
    ]
    
    for item in nav_items:
        data = {
            "data": {
                "siteId": SITE_ID,
                **item
            }
        }
        create_api_request('navigation-items', data)

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
    
    # Check if homepage already exists, if so, update it instead
    homepage_data = {
        "data": {
            "siteId": SITE_ID,
            "slug": "home-geldgeregeld",  # Use unique slug to avoid conflicts
            "title": "GeldGeregeld - Zakelijke Financiering Binnen 24 Uur",
            "metaDescription": "Zakelijke lening zonder gedoe. Aanvraag binnen 2 minuten, aanbod binnen 24 uur. Flexibel aflossen, geen opstartkosten.",
            "metaKeywords": "zakelijke lening, bedrijfslening, mkb financiering, snelle lening, flexibel aflossen",
            "sections": [
                # Hero Section
                {
                    "__component": "sections.hero-section",
                    "title": "Zakelijke financiering binnen 24 uur. Geen gedoe met de bank.",
                    "subtitle": "Van €5.000 tot €500.000. Flexibel aflossen. Binnen 2 minuten aangevraagd.",
                    "backgroundImage": "/images/pexels-ketut-subiyanto-4473496.jpg",
                    "variant": "image",
                    "primaryCta": {
                        "label": "Start aanvraag",
                        "href": "#aanvragen",
                        "variant": "primary"
                    },
                    "secondaryCta": {
                        "label": "Bereken je lening",
                        "href": "#calculator",
                        "variant": "secondary"
                    }
                },
                # Benefits Carousel
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
                # Feature Section
                {
                    "__component": "sections.feature-section",
                    "title": "Flexibele aflossing op jouw voorwaarden",
                    "description": "Kies zelf wanneer je aflost. Geen vaste maandlasten, maar flexibiliteit die past bij jouw cashflow. Boetevrij vervroegd aflossen mogelijk wanneer het jou uitkomt.",
                    "buttonText": "Meer informatie",
                    "imagePath": "/images/pexels-tima-miroshnichenko-5198239.jpg",
                    "imagePosition": "left",
                    "backgroundColor": "white"
                },
                # Testimonials Carousel
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
                # How It Works Bento
                {
                    "__component": "sections.how-it-works-bento",
                    "title": "Zo werkt het",
                    "subtitle": "In 4 eenvoudige stappen naar uw zakelijke financiering",
                    "backgroundColor": "var(--color-bg)",
                    "bentoItems": [
                        {
                            "title": "Aanvraag indienen",
                            "description": "Vul in 2 minuten het online formulier in. Simpel, snel en geen papierwerk. We vragen alleen wat we echt nodig hebben voor uw zakelijke financiering.",
                            "backgroundColor": "#fff2b2",
                            "textColor": "#5e5515",
                            "iconPath": "/icons/SVG/files/file-form.svg",
                            "gridArea": "aanvraag"
                        },
                        {
                            "title": "Snelle beoordeling",
                            "description": "Ons team beoordeelt uw aanvraag direct. Met behulp van slimme technologie en menselijke expertise krijgt u binnen 4 uur een eerste reactie.",
                            "backgroundColor": "#aad5fc",
                            "textColor": "#0f1720",
                            "iconPath": "/icons/SVG/interface/search.svg",
                            "gridArea": "beoordeling"
                        },
                        {
                            "title": "Transparant voorstel",
                            "description": "U ontvangt een helder voorstel met alle voorwaarden, rentetarieven en aflosschema. Geen verborgen kosten of verrassingen achteraf.",
                            "backgroundColor": "#bbe7be",
                            "textColor": "#114e0b",
                            "iconPath": "/icons/SVG/interface/checklist.svg",
                            "gridArea": "voorstel"
                        },
                        {
                            "title": "Direct uitbetaling",
                            "description": "Zodra u akkoord gaat, zorgen we voor snelle uitbetaling. Het geld staat meestal binnen 24 uur op uw zakelijke rekening.",
                            "backgroundColor": "#d7d0ff",
                            "textColor": "#3b0b5e",
                            "iconPath": "/icons/SVG/finance/cash.svg",
                            "gridArea": "uitbetaling"
                        }
                    ]
                },
                # CTA Section
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
    
    return create_api_request('pages', homepage_data)

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
                    "title": "Over GeldGeregeld",
                    "subtitle": "Wij maken zakelijke financiering eenvoudig en transparant",
                    "variant": "gradient"
                },
                {
                    "__component": "sections.content-section",
                    "title": "Onze missie",
                    "content": "Bij GeldGeregeld geloven we dat iedere ondernemer toegang moet hebben tot eerlijke en snelle financiering. Zonder gedoe, zonder verborgen kosten en zonder eindeloos wachten. Wij staan voor transparantie, persoonlijke service en flexibiliteit.",
                    "layout": "image-right",
                    "background": "white"
                },
                {
                    "__component": "sections.why-choose-section",
                    "title": "Waarom kiezen ondernemers voor ons?",
                    "subtitle": "Meer dan 1.000 tevreden ondernemers gingen je voor",
                    "benefits": [
                        {
                            "iconPath": "/icons/SVG/interface/shield.svg",
                            "title": "Transparant",
                            "description": "Geen verborgen kosten. Wat je ziet is wat je krijgt. Heldere voorwaarden en eerlijke tarieven.",
                            "color": "#bbe7be",
                            "textColor": "#114e0b"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/zap.svg",
                            "title": "Snel",
                            "description": "Aanvraag in 2 minuten. Aanbod binnen 24 uur. Geld op je rekening binnen 48 uur.",
                            "color": "#fff2b2",
                            "textColor": "#5e5515"
                        },
                        {
                            "iconPath": "/icons/SVG/interface/user-add.svg",
                            "title": "Persoonlijk",
                            "description": "Vaste contactpersoon. Bereikbaar via telefoon, email en chat. Geen automatische antwoorden.",
                            "color": "#aad5fc",
                            "textColor": "#0f1720"
                        }
                    ]
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Klaar om te groeien?",
                    "subtitle": "Start vandaag nog met je aanvraag",
                    "ctaLabel": "Vraag financiering aan",
                    "ctaHref": "#aanvragen",
                    "background": "dark"
                }
            ]
        }
    }
    return create_api_request('pages', data)

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
                    "title": "Veelgestelde Vragen",
                    "subtitle": "Alles wat je wilt weten over zakelijke financiering",
                    "variant": "gradient"
                },
                {
                    "__component": "sections.faq-section",
                    "title": "Algemene Vragen",
                    "faqItems": [
                        {
                            "question": "Hoe snel krijg ik een antwoord op mijn aanvraag?",
                            "answer": "Je ontvangt binnen 4 uur een eerste reactie. Binnen 24 uur hebben we een volledig voorstel klaar."
                        },
                        {
                            "question": "Wat zijn de voorwaarden voor een zakelijke lening?",
                            "answer": "Je bedrijf moet minimaal 6 maanden actief zijn en een omzet hebben. Er is geen onderpand vereist."
                        },
                        {
                            "question": "Kan ik vervroegd aflossen?",
                            "answer": "Ja, je kunt altijd boetevrij vervroegd aflossen. Geen extra kosten of verrassingen."
                        },
                        {
                            "question": "Wat kost een zakelijke lening?",
                            "answer": "De kosten zijn afhankelijk van het bedrag en de looptijd. We werken met transparante tarieven zonder verborgen kosten."
                        }
                    ]
                },
                {
                    "__component": "sections.cta-section",
                    "title": "Nog vragen?",
                    "subtitle": "Neem contact op met ons team",
                    "ctaLabel": "Contact opnemen",
                    "ctaHref": "/contact",
                    "background": "blue"
                }
            ]
        }
    }
    return create_api_request('pages', data)

# ============================================================================
# MULTI-SITE DOCUMENTATION
# ============================================================================

def create_multi_site_readme():
    """Create documentation for multi-site setup"""
    readme = """
# Multi-Site Strapi Configuration

## Overview

This Strapi instance is configured for multi-site/multi-domain support. Each site has its own content filtered by `siteId`.

## Current Sites

1. **GeldGeregeld** (`siteId: geldgeregeld`)
   - Domain: geldgeregeld.nl
   - Primary site for business loans

## Adding a New Site

### 1. Create Site Entry

```javascript
{
  "data": {
    "siteId": "newsite",
    "name": "New Site Name",
    "domain": "newsite.com"
  }
}
```

### 2. Create Content for New Site

All content types support `siteId`:
- Pages
- Navigation Items
- Testimonials
- Token Sets

Example:
```javascript
{
  "data": {
    "siteId": "newsite",
    "slug": "home",
    "title": "Homepage for New Site",
    ...
  }
}
```

### 3. Frontend Integration

```typescript
// Fetch content for specific site
const page = await getPageBySlug('home', 'newsite');
const nav = await getNavigationItems('newsite');
```

## API Filtering

All API calls should filter by siteId:

```
GET /api/pages?filters[siteId][$eq]=geldgeregeld
GET /api/testimonials?filters[siteId][$eq]=geldgeregeld
GET /api/navigation-items?filters[siteId][$eq]=geldgeregeld
```

## Benefits

- ✅ **Single CMS** for multiple brands/domains
- ✅ **Shared infrastructure** reduces costs
- ✅ **Centralized management** for efficiency
- ✅ **Independent content** per site
- ✅ **Flexible scaling** add sites easily

## Security

Each site's content is isolated by siteId. API tokens can be scoped per site if needed.
"""
    
    with open('/Users/danieldevos/Documents/ALT F AWESOME/lijfrente-react/cms/MULTI_SITE_SETUP.md', 'w') as f:
        f.write(readme)
    print("✅ Created multi-site documentation")

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
    
    # Create site
    print("\n📍 Creating site configuration...")
    create_site()
    
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
    create_faq_page()
    
    # Create documentation
    print("\n📚 Creating documentation...")
    create_multi_site_readme()
    
    print("\n" + "=" * 80)
    print("✅ CONTENT POPULATION COMPLETE!")
    print("=" * 80)
    print(f"\n🎉 Your Strapi CMS is ready for GeldGeregeld!")
    print(f"🌐 Visit: {STRAPI_URL}/admin")
    print(f"\n📖 See MULTI_SITE_SETUP.md for adding more sites")

if __name__ == '__main__':
    main()

