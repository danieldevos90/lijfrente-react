#!/usr/bin/env python3
"""
Generate comprehensive SEO-optimized Dutch content for sector pages using Google Gemini AI
Updates all sector pages with AI-generated content including use cases, benefits, and why choose sections
"""

import os
import sys
import requests
import json
import time

# Use Gemini REST API directly (no SDK needed)
# Using gemini-2.5-flash (latest available model)
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateContent"

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'b16b5a26631fb6e94de7fe8ac5e5fbaaeb97b28cb27a5497a151c0be226fe27ebe5e3341500f8539b14a60a82811f9b53536bea775e8e2649d3d8e6e92547712b1a226b6dfe579a47af90cbb1a65af8e7103c8fb3e0b9321f61fdf00e398d04c8a8068a152273b35a0fc4880803107f9e90f602c761951f557cd9a33b1cec0ac')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCZh9VBAsN79xpreicedUHUlQvAlbv8Xi4')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

# Sector information
SECTORS = {
    'automotive': {
        'name': 'Automotive',
        'description': 'Zakelijke financiering voor automotive bedrijven en garages'
    },
    'horeca': {
        'name': 'Horeca',
        'description': 'Zakelijke financiering speciaal voor de horeca'
    },
    'retail': {
        'name': 'Retail',
        'description': 'Financiering voor retailbedrijven'
    },
    'transport': {
        'name': 'Transport & Logistiek',
        'description': 'Zakelijke lening voor transport- en logistiekbedrijven'
    },
    'bouw': {
        'name': 'Bouw & Installatie',
        'description': 'Financiering voor bouwbedrijven en installateurs'
    },
    'ecommerce': {
        'name': 'E-commerce',
        'description': 'Zakelijke financiering voor online ondernemers en webshops'
    },
    'zorg': {
        'name': 'Zorg & Welzijn',
        'description': 'Financiering voor zorginstellingen en welzijnsorganisaties'
    },
    'consultants': {
        'name': 'Advies & Consultancy',
        'description': 'Financiering voor adviesbureaus en consultants'
    },
    'schoonmaak': {
        'name': 'Schoonmaak',
        'description': 'Zakelijke financiering voor schoonmaakbedrijven'
    },
    'productie': {
        'name': 'Productie & Industrie',
        'description': 'Zakelijke lening voor productiebedrijven en industriële ondernemingen'
    }
}

def generate_content_with_gemini(sector_slug: str, sector_info: dict):
    """Generate comprehensive SEO content using Gemini AI"""
    sector_name = sector_info['name']
    
    prompt = f"""Je bent een SEO-expert die Nederlandse zakelijke financieringscontent schrijft voor GeldGeregeld, een platform voor zakelijke leningen.

Sector: {sector_name}
Sector beschrijving: {sector_info['description']}

Genereer SEO-geoptimaliseerde Nederlandse content in JSON formaat met de volgende structuur:

{{
  "metaDescription": "Korte, krachtige SEO-beschrijving (150-160 karakters) voor {sector_name}",
  "metaKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "heroSubtitle": "Aantrekkelijke subtitle voor hero sectie (max 120 karakters)",
  "quote": "Inspirerende quote over financiering voor {sector_name} (2-3 zinnen)",
  "easyLendingContent": "HTML content (gebruik <p> tags) over hoe eenvoudig het is om financiering te krijgen voor {sector_name} (3-4 paragrafen)",
  "useCases": [
    {{
      "title": "Use case 1 titel",
      "description": "Gedetailleerde beschrijving (2-3 zinnen) waarom deze use case relevant is voor {sector_name}"
    }},
    {{
      "title": "Use case 2 titel",
      "description": "Gedetailleerde beschrijving (2-3 zinnen)"
    }},
    {{
      "title": "Use case 3 titel",
      "description": "Gedetailleerde beschrijving (2-3 zinnen)"
    }},
    {{
      "title": "Use case 4 titel",
      "description": "Gedetailleerde beschrijving (2-3 zinnen)"
    }}
  ],
  "benefits": [
    {{
      "title": "Voordeel 1 titel",
      "description": "Uitleg waarom dit voordeel belangrijk is voor {sector_name} (2 zinnen)"
    }},
    {{
      "title": "Voordeel 2 titel",
      "description": "Uitleg waarom dit voordeel belangrijk is voor {sector_name} (2 zinnen)"
    }},
    {{
      "title": "Voordeel 3 titel",
      "description": "Uitleg waarom dit voordeel belangrijk is voor {sector_name} (2 zinnen)"
    }},
    {{
      "title": "Voordeel 4 titel",
      "description": "Uitleg waarom dit voordeel belangrijk is voor {sector_name} (2 zinnen)"
    }}
  ]
}}

Belangrijke richtlijnen:
- Gebruik natuurlijk, overtuigend Nederlands
- Focus op voordelen voor {sector_name} bedrijven
- Gebruik relevante sector-specifieke termen
- Maak content SEO-vriendelijk maar leesbaar
- Use cases moeten praktisch en relevant zijn
- Benefits moeten uniek zijn voor GeldGeregeld
- Alle content moet in het Nederlands zijn
- Return ALLEEN de JSON, geen andere tekst

Genereer nu de content voor {sector_name}:"""

    try:
        print(f"  🤖 Generating content with Gemini AI...")
        
        # Call Gemini REST API
        api_url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(api_url, json=payload, timeout=60)
        
        if response.status_code != 200:
            print(f"  ❌ Gemini API error: {response.status_code}")
            print(f"  Response: {response.text[:300]}")
            return None
        
        result = response.json()
        
        # Extract text from response
        if 'candidates' in result and len(result['candidates']) > 0:
            text = result['candidates'][0]['content']['parts'][0]['text'].strip()
        else:
            print(f"  ❌ Unexpected response format: {result}")
            return None
        
        # Remove markdown code blocks if present
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        
        # Parse JSON
        content = json.loads(text)
        print(f"  ✅ Content generated successfully!")
        return content
        
    except json.JSONDecodeError as e:
        print(f"  ❌ Error parsing JSON: {e}")
        print(f"  Response text: {text[:500]}")
        return None
    except Exception as e:
        print(f"  ❌ Error generating content: {e}")
        return None

def get_existing_sector_page(sector_slug: str):
    """Get existing sector page"""
    url = f"{STRAPI_URL}/api/sector-pages?filters[sectorSlug][$eq]={sector_slug}&filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            pages = data.get('data', [])
            if pages:
                return pages[0]
    except Exception as e:
        print(f"  ⚠️ Error fetching existing page: {e}")
    return None

def update_sector_page(sector_slug: str, sector_info: dict, ai_content: dict):
    """Update sector page with AI-generated content"""
    existing = get_existing_sector_page(sector_slug)
    
    if not existing:
        print(f"  ⚠️  Sector page not found: {sector_slug} - skipping")
        return False
    
    # Get ID (try documentId first for Strapi v5, then id)
    page_id = existing.get('documentId') or existing.get('id')
    if not page_id:
        print(f"  ❌ No ID found for sector page: {sector_slug}")
        return False
    
    sector_name = sector_info['name']
    
    # Prepare use cases with colors and buttons
    use_cases = []
    colors = ['#fff2b2', '#e4f2ff', '#d7d0ff', '#bbe7be']
    text_colors = ['#5e5515', '#0f1720', '#3b0b5e', '#114e0b']
    icons = [
        '/icons/SVG/interface/tool.svg',
        '/icons/SVG/e-commerce/package.svg',
        '/icons/SVG/interface/home.svg',
        '/icons/SVG/e-commerce/truck.svg'
    ]
    
    for i, uc in enumerate(ai_content.get('useCases', [])[:4]):
        use_cases.append({
            'title': uc.get('title', ''),
            'description': uc.get('description', ''),
            'iconPath': icons[i % len(icons)],
            'color': colors[i % len(colors)],
            'textColor': text_colors[i % len(text_colors)],
            'buttonLabel': 'Vraag offerte aan',
            'buttonHref': '/lead'
        })
    
    # Prepare benefits with colors and icons
    benefits = []
    benefit_icons = [
        '/icons/SVG/interface/zap.svg',
        '/icons/SVG/interface/clock.svg',
        '/icons/SVG/interface/shield.svg',
        '/icons/SVG/interface/heart.svg'
    ]
    
    for i, benefit in enumerate(ai_content.get('benefits', [])[:4]):
        benefits.append({
            'title': benefit.get('title', ''),
            'description': benefit.get('description', ''),
            'iconPath': benefit_icons[i % len(benefit_icons)],
            'color': colors[i % len(colors)],
            'textColor': text_colors[i % len(text_colors)]
        })
    
    # Build update data
    page_data = {
        "data": {
            "heroTitle": f"Zakelijke financiering voor {sector_name.lower()}",
            "heroSubtitle": ai_content.get('heroSubtitle', sector_info['description']),
            "metaDescription": ai_content.get('metaDescription', sector_info['description']),
            "metaKeywords": ai_content.get('metaKeywords', ''),
            "quote": ai_content.get('quote', ''),
            "quoteAuthor": None,
            "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
            "easyLendingContent": ai_content.get('easyLendingContent', ''),
            "easyLendingImagePosition": "left",
            "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
            "useCasesSubtitle": f"Veelzijdige financieringsoplossingen speciaal voor {sector_name.lower()}",
            "useCases": use_cases,
            "benefitsTitle": "Waarom kiezen voor GeldGeregeld?",
            "benefitsSubtitle": f"Voordelen speciaal voor {sector_name.lower()}",
            "benefits": benefits,
            "ctaTitle": "Klaar om te beginnen?",
            "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.",
            "ctaLabel": "Vraag financiering aan",
            "ctaHref": "/lead",
            "publishedAt": existing.get('publishedAt') or None
        }
    }
    
    # Update via Content API
    update_url = f"{STRAPI_URL}/api/sector-pages/{page_id}"
    try:
        print(f"  📤 Updating {sector_slug} in Strapi...")
        response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=30)
        
        if response.status_code == 200:
            print(f"  ✅ Updated {sector_slug} successfully!")
            return True
        else:
            print(f"  ❌ Failed to update {sector_slug}: {response.status_code}")
            print(f"  Response: {response.text[:300]}")
            return False
    except Exception as e:
        print(f"  ❌ Error updating {sector_slug}: {e}")
        return False

def main():
    print("=" * 80)
    print("🤖 GENERATING SECTOR PAGES WITH GEMINI AI")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Sectors to process: {len(SECTORS)}\n")
    
    # Test Gemini API
    print("🔍 Testing Gemini API...")
    test_payload = {
        "contents": [{
            "parts": [{
                "text": "Say 'OK' if you can read this."
            }]
        }]
    }
    test_url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
    try:
        test_response = requests.post(test_url, json=test_payload, timeout=30)
        if test_response.status_code == 200:
            result = test_response.json()
            if 'candidates' in result:
                print(f"✅ Gemini API access confirmed (model: {GEMINI_MODEL})\n")
            else:
                print(f"⚠️  Unexpected response format\n")
        else:
            print(f"⚠️  Gemini API returned: {test_response.status_code}")
            print(f"Response: {test_response.text[:200]}\n")
    except Exception as e:
        print(f"⚠️  Error testing Gemini API: {e}\n")
    
    # Test API access
    print("🔍 Testing Strapi API access...")
    test_url = f"{STRAPI_URL}/api/sector-pages?pagination[pageSize]=1"
    test_response = requests.get(test_url, headers=HEADERS, timeout=10)
    if test_response.status_code == 200:
        print("✅ Strapi API access confirmed\n")
    else:
        print(f"⚠️  Strapi API returned: {test_response.status_code}")
        if test_response.status_code == 401:
            print("❌ Authentication failed - check your STRAPI_TOKEN")
            sys.exit(1)
        print()
    
    results = []
    
    for sector_slug, sector_info in SECTORS.items():
        print(f"\n{'='*80}")
        print(f"📄 Processing: {sector_info['name']} ({sector_slug})")
        print(f"{'='*80}")
        
        try:
            # Generate content with Gemini
            ai_content = generate_content_with_gemini(sector_slug, sector_info)
            
            if not ai_content:
                print(f"  ❌ Failed to generate content for {sector_slug}")
                results.append((sector_slug, False))
                continue
            
            # Update page in Strapi
            if update_sector_page(sector_slug, sector_info, ai_content):
                results.append((sector_slug, True))
            else:
                results.append((sector_slug, False))
            
            # Rate limiting
            time.sleep(2)  # Wait between requests
            
        except Exception as e:
            print(f"  ❌ Error processing {sector_slug}: {e}")
            import traceback
            traceback.print_exc()
            results.append((sector_slug, False))
            time.sleep(1)
    
    # Summary
    print(f"\n{'='*80}")
    print("📊 SUMMARY")
    print(f"{'='*80}\n")
    
    success_count = sum(1 for _, success in results if success)
    failed_count = len(results) - success_count
    
    for sector_slug, success in results:
        status = "✅" if success else "❌"
        sector_name = SECTORS[sector_slug]['name']
        print(f"{status} {sector_name:30} ({sector_slug})")
    
    print(f"\n✅ Success: {success_count}/{len(SECTORS)}")
    if failed_count > 0:
        print(f"❌ Failed: {failed_count}/{len(SECTORS)}")
    
    print(f"\n🌐 View pages at: /sectoren/[sector-slug]")
    print(f"📝 Edit in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::sector-page.sector-page")

if __name__ == '__main__':
    main()
