#!/usr/bin/env python3
"""
Generate sector pages for all markets using Unsplash images
Creates content for all 10 sectors in Strapi with relevant images from Unsplash
"""

import os
import requests
import json
import time
from typing import Dict, List, Any, Optional

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717')

# Unsplash API Configuration
UNSPLASH_ACCESS_KEY = '4m8GFqQM0ejRjk13SkMPI5UW1QWnCaFzUHXk__XFQOE'
UNSPLASH_SECRET_KEY = 'yqZ3MRNaxzTrPAyHWLEdSlG2qjCiGbA9f3URdMZQicU'
UNSPLASH_APP_ID = '848065'

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

UNSPLASH_HEADERS = {
    'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}',
    'Accept-Version': 'v1',
    'User-Agent': f'GeldGeregeld/{UNSPLASH_APP_ID}'
}

SITE_ID = 'geldgeregeld'

# Sector definitions with search terms for Unsplash
SECTORS = {
    'horeca': {
        'name': 'Horeca',
        'description': 'Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafés en hotels.',
        'keywords': ['horeca financiering', 'restaurant lening', 'café financiering', 'hotel financiering'],
        'unsplash_queries': ['restaurant kitchen', 'café interior', 'hotel lobby', 'bar counter']
    },
    'retail': {
        'name': 'Retail',
        'description': 'Financiering voor retailbedrijven. Van webshops tot fysieke winkels.',
        'keywords': ['retail financiering', 'winkel financiering', 'webshop lening', 'retail lening'],
        'unsplash_queries': ['retail store', 'shopping', 'shop interior', 'retail business']
    },
    'transport': {
        'name': 'Transport & Logistiek',
        'description': 'Zakelijke lening voor transport- en logistiekbedrijven.',
        'keywords': ['transport financiering', 'logistiek lening', 'vrachtwagen financiering', 'transportbedrijf lening'],
        'unsplash_queries': ['truck delivery', 'logistics warehouse', 'transportation', 'shipping']
    },
    'bouw': {
        'name': 'Bouw & Installatie',
        'description': 'Financiering voor bouwbedrijven en installateurs.',
        'keywords': ['bouw financiering', 'installatie lening', 'bouwbedrijf financiering', 'aannemer lening'],
        'unsplash_queries': ['construction site', 'building work', 'construction worker', 'building tools']
    },
    'ecommerce': {
        'name': 'E-commerce',
        'description': 'Zakelijke financiering voor online ondernemers en webshops.',
        'keywords': ['e-commerce financiering', 'webshop lening', 'online ondernemer financiering', 'e-commerce lening'],
        'unsplash_queries': ['online shopping', 'ecommerce', 'computer business', 'digital workspace']
    },
    'zorg': {
        'name': 'Zorg & Welzijn',
        'description': 'Financiering voor zorginstellingen en welzijnsorganisaties.',
        'keywords': ['zorg financiering', 'welzijn lening', 'zorginstelling financiering', 'zorgondernemer lening'],
        'unsplash_queries': ['healthcare', 'medical care', 'healthcare worker', 'caregiving']
    },
    'consultants': {
        'name': 'Advies & Consultancy',
        'description': 'Financiering voor adviesbureaus en consultants.',
        'keywords': ['consultancy financiering', 'adviesbureau lening', 'consultant financiering', 'advies lening'],
        'unsplash_queries': ['business meeting', 'consulting', 'business discussion', 'professional office']
    },
    'schoonmaak': {
        'name': 'Schoonmaak',
        'description': 'Zakelijke financiering voor schoonmaakbedrijven.',
        'keywords': ['schoonmaak financiering', 'schoonmaakbedrijf lening', 'schoonmaak lening'],
        'unsplash_queries': ['cleaning service', 'janitor', 'office cleaning', 'professional cleaning']
    },
    'automotive': {
        'name': 'Automotive',
        'description': 'Financiering voor automotive bedrijven en garages.',
        'keywords': ['automotive financiering', 'garage lening', 'autobedrijf financiering', 'automotive lening'],
        'unsplash_queries': ['car repair', 'automotive workshop', 'car service', 'garage']
    },
    'productie': {
        'name': 'Productie & Industrie',
        'description': 'Zakelijke lening voor productiebedrijven en industriële ondernemingen.',
        'keywords': ['productie financiering', 'industrie lening', 'productiebedrijf financiering', 'industrieel lening'],
        'unsplash_queries': ['manufacturing', 'factory production', 'industrial', 'production line']
    }
}

def get_unsplash_image(query: str, width: int = 1200, height: int = 800) -> Optional[str]:
    """Get a random image URL from Unsplash for the given query"""
    try:
        url = f'https://api.unsplash.com/photos/random'
        params = {
            'query': query,
            'orientation': 'landscape',
            'client_id': UNSPLASH_ACCESS_KEY  # Include client_id in params
        }
        # Try without Authorization header first (use client_id in params)
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            image_url = data.get('urls', {}).get('regular') or data.get('urls', {}).get('full')
            # Track download (required by Unsplash API)
            download_url = data.get('links', {}).get('download_location')
            if download_url:
                try:
                    requests.get(download_url, params={'client_id': UNSPLASH_ACCESS_KEY}, timeout=5)
                except:
                    pass  # Non-critical
            return image_url
        elif response.status_code == 403:
            # Try with Authorization header as fallback
            try:
                alt_response = requests.get(url, headers=UNSPLASH_HEADERS, params={'query': query}, timeout=10)
                if alt_response.status_code == 200:
                    data = alt_response.json()
                    return data.get('urls', {}).get('regular') or data.get('urls', {}).get('full')
            except:
                pass
            print(f"  ⚠️ Unsplash API 403 for '{query}' - credentials may need activation")
            return None
        else:
            print(f"  ⚠️ Unsplash API error for '{query}': {response.status_code}")
            return None
    except Exception as e:
        print(f"  ⚠️ Error fetching Unsplash image for '{query}': {e}")
        return None

def get_existing_sector_page(sector_slug: str):
    """Get existing sector page by slug"""
    url = f"{STRAPI_URL}/api/sector-pages?filters[sectorSlug][$eq]={sector_slug}&filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        # Silently fail - will create new if doesn't exist
        pass
    return None

def create_or_update_sector_page(sector_slug: str, page_data: dict):
    """Create or update a sector page"""
    existing = get_existing_sector_page(sector_slug)
    
    if existing:
        page_id = existing.get('id')
        if page_id:
            # Update existing page
            update_url = f"{STRAPI_URL}/api/sector-pages/{page_id}"
            try:
                print(f"  📤 Updating existing page...")
                update_response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=30)
                print(f"  📥 Response status: {update_response.status_code}")
                if update_response.status_code == 200:
                    print(f"  ✅ Updated sector page: {sector_slug}")
                    return update_response.json()
                else:
                    print(f"  ⚠️ Update failed ({update_response.status_code}): {update_response.text[:200]}")
            except Exception as e:
                print(f"  ⚠️ Error updating: {e}")
    
    # Try creating via Content Manager API (admin endpoint) first
    admin_url = f"{STRAPI_URL}/api/content-manager/collection-types/api::sector-page.sector-page"
    try:
        print(f"  📤 POST {admin_url} (Admin API)")
        admin_response = requests.post(admin_url, headers=HEADERS, json=page_data, timeout=30)
        print(f"  📥 Response status: {admin_response.status_code}")
        if admin_response.status_code in [200, 201]:
            print(f"  ✅ Created sector page via Admin API: {sector_slug}")
            return admin_response.json()
        else:
            print(f"  ⚠️ Admin API returned: {admin_response.status_code}")
            if admin_response.status_code != 404:
                print(f"  Response: {admin_response.text[:200]}")
    except Exception as e:
        print(f"  ⚠️ Admin API error: {e}")
    
    # Create new page via Content API
    url = f"{STRAPI_URL}/api/sector-pages"
    try:
        print(f"  📤 POST {url} (Content API)")
        response = requests.post(url, headers=HEADERS, json=page_data, timeout=30)
        print(f"  📥 Response status: {response.status_code}")
        if response.status_code in [200, 201]:
            print(f"  ✅ Created sector page: {sector_slug}")
            return response.json()
        else:
            print(f"  ❌ Failed to create ({response.status_code}): {response.text[:300]}")
            try:
                error_data = response.json()
                print(f"  Error JSON: {json.dumps(error_data, indent=2)[:500]}")
            except:
                pass
    except Exception as e:
        print(f"  ❌ Error creating: {e}")
    return None

def generate_sector_content(sector_slug: str, sector_info: Dict) -> Dict:
    """Generate content for a sector"""
    sector_name = sector_info['name']
    
    print(f"📝 Generating content for {sector_name}...")
    
    # Note: Unsplash image fetching is disabled due to API authentication issues
    # Images can be added manually via Strapi admin interface
    # Uncomment the code below once Unsplash API credentials are properly configured
    
    # # Get images from Unsplash
    # hero_image = None
    # use_case_images = []
    # 
    # # Get hero image
    # for query in sector_info['unsplash_queries'][:1]:
    #     hero_image = get_unsplash_image(query, width=1600, height=900)
    #     if hero_image:
    #         break
    #     time.sleep(0.5)
    # 
    # # Get use case images (4 images)
    # for query in sector_info['unsplash_queries']:
    #     if len(use_case_images) >= 4:
    #         break
    #     img = get_unsplash_image(query, width=800, height=600)
    #     if img:
    #         use_case_images.append(img)
    #     time.sleep(0.5)
    
    # Generate use cases based on sector
    # Note: Images parameter removed for now - can be added later
    use_cases = generate_use_cases(sector_slug, sector_name)
    
    # Generate benefits
    benefits = generate_benefits(sector_slug, sector_name)
    
    # Generate quote
    quote = generate_quote(sector_slug, sector_name)
    
    # Build page data
    page_data = {
        "data": {
            "siteId": SITE_ID,
            "sectorSlug": sector_slug,
            "sectorName": sector_name,
            "metaDescription": sector_info['description'],
            "metaKeywords": ", ".join(sector_info['keywords']),
            "heroTitle": f"Zakelijke financiering voor {sector_name.lower()}",
            "heroSubtitle": sector_info['description'],
            "quote": quote,
            "quoteAuthor": None,
            "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
            "easyLendingContent": generate_easy_lending_content(sector_name),
            "easyLendingImagePosition": "left",
            "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
            "useCasesSubtitle": f"Veelzijdige financieringsoplossingen speciaal voor {sector_name.lower()}",
            "useCases": use_cases,
            "benefitsTitle": "Waarom kiezen voor onze financiering?",
            "benefitsSubtitle": f"Voordelen speciaal voor {sector_name.lower()}",
            "benefits": benefits,
            "ctaTitle": "Klaar om te beginnen?",
            "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.",
            "ctaLabel": "Vraag financiering aan",
            "ctaHref": "/lead"
        }
    }
    
    # Add hero image URL if we got one (we'll use it as a URL, not upload to Strapi)
    # Note: Strapi media fields require upload, so we'll skip hero images for now
    # or use them in a different way
    
    return page_data

def generate_use_cases(sector_slug: str, sector_name: str, images: Optional[List[str]] = None) -> List[Dict]:
    """Generate use cases for a sector"""
    use_cases_templates = {
        'horeca': [
            {
                'title': 'Keukenapparatuur',
                'description': 'Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.'
            },
            {
                'title': 'Renovatie & Verbouwing',
                'description': 'Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.'
            },
            {
                'title': 'Terras & Uitbreiding',
                'description': 'Breid je terras uit of investeer in nieuwe buitenmeubels. Maak optimaal gebruik van het seizoen met flexibele financiering.'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Financier je dagelijkse operaties, voorraad of seizoensgebonden pieken in je omzet. Flexibel en snel geregeld.'
            }
        ],
        'retail': [
            {
                'title': 'Winkelverbouwing',
                'description': 'Financier verbouwingen en modernisering van je winkel. Maak je retailzaak aantrekkelijker voor klanten.'
            },
            {
                'title': 'Voorraad & Inventaris',
                'description': 'Investeer in voorraad zonder grote voorinvestering. Houd je schappen gevuld met flexibele financiering.'
            },
            {
                'title': 'Nieuwe locatie',
                'description': 'Financier een nieuwe winkel of uitbreiding naar meerdere locaties. Groei je retailbedrijf met vertrouwen.'
            },
            {
                'title': 'Online uitbreiding',
                'description': 'Investeer in je webshop, logistiek of online marketing. Breid je retailactiviteiten uit naar online.'
            }
        ],
        'transport': [
            {
                'title': 'Nieuwe voertuigen',
                'description': 'Financier nieuwe vrachtwagens, bestelauto\'s of andere voertuigen voor je transportbedrijf.'
            },
            {
                'title': 'Onderhoud & Reparatie',
                'description': 'Financier onderhoud, reparaties of upgrades aan je vloot. Houd je voertuigen in topconditie.'
            },
            {
                'title': 'Logistiek & Magazijn',
                'description': 'Investeer in magazijnruimte, laad- en losinstallaties of logistieke systemen.'
            },
            {
                'title': 'Groei & Uitbreiding',
                'description': 'Financier uitbreiding van je transportcapaciteit of nieuwe routes. Groei je transportbedrijf.'
            }
        ],
        'bouw': [
            {
                'title': 'Materiaal & Materieel',
                'description': 'Financier bouwmaterialen, gereedschappen en materieel voor je bouwprojecten.'
            },
            {
                'title': 'Voertuigen & Machines',
                'description': 'Investeer in bouwmachines, graafmachines of transportvoertuigen voor je bouwbedrijf.'
            },
            {
                'title': 'Kantoor & Werkplaats',
                'description': 'Financier een nieuwe werkplaats, kantoor of opslagruimte voor je bouwbedrijf.'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Financier je dagelijkse operaties en overbrug wachttijden tussen facturen en betalingen.'
            }
        ],
        'ecommerce': [
            {
                'title': 'Online marketing',
                'description': 'Investeer in advertenties, SEO of social media marketing om je webshop te laten groeien.'
            },
            {
                'title': 'Voorraad & Logistiek',
                'description': 'Financier voorraad, magazijnruimte of logistieke uitbreiding voor je webshop.'
            },
            {
                'title': 'Website & Platform',
                'description': 'Investeer in verbetering van je webshop, nieuwe features of migratie naar een beter platform.'
            },
            {
                'title': 'Internationale uitbreiding',
                'description': 'Financier uitbreiding naar nieuwe markten of landen. Groei je e-commerce bedrijf internationaal.'
            }
        ],
        'zorg': [
            {
                'title': 'Medische apparatuur',
                'description': 'Financier medische apparatuur, hulpmiddelen of technologie voor je zorginstelling.'
            },
            {
                'title': 'Praktijkverbouwing',
                'description': 'Financier verbouwingen, renovatie of uitbreiding van je zorginstelling of praktijk.'
            },
            {
                'title': 'Personeel & Opleiding',
                'description': 'Investeer in personeel, opleidingen of training om de kwaliteit van zorg te verbeteren.'
            },
            {
                'title': 'Digitalisering',
                'description': 'Financier digitale systemen, software of automatisering voor je zorgorganisatie.'
            }
        ],
        'consultants': [
            {
                'title': 'Kantoor & Uitrusting',
                'description': 'Financier kantoorruimte, meubilair of professionele uitrusting voor je adviesbureau.'
            },
            {
                'title': 'Software & Tools',
                'description': 'Investeer in software, tools of systemen om je consultancy efficiënter te maken.'
            },
            {
                'title': 'Marketing & Netwerken',
                'description': 'Financier marketing, netwerkevenementen of business development voor je adviesbureau.'
            },
            {
                'title': 'Opleiding & Certificering',
                'description': 'Investeer in opleidingen, certificeringen of bijscholing om je expertise uit te breiden.'
            }
        ],
        'schoonmaak': [
            {
                'title': 'Schoonmaakapparatuur',
                'description': 'Financier professionele schoonmaakapparatuur, machines en materialen voor je schoonmaakbedrijf.'
            },
            {
                'title': 'Voertuigen',
                'description': 'Investeer in bedrijfsvoertuigen voor transport van apparatuur en personeel naar klanten.'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Financier je dagelijkse operaties en overbrug wachttijden tussen facturen en betalingen.'
            },
            {
                'title': 'Uitbreiding & Groei',
                'description': 'Financier uitbreiding naar nieuwe klanten, locaties of groei van je schoonmaakbedrijf.'
            }
        ],
        'automotive': [
            {
                'title': 'Werkplaatsapparatuur',
                'description': 'Financier professionele gereedschappen, liften of diagnostische apparatuur voor je garage.'
            },
            {
                'title': 'Voorraad & Onderdelen',
                'description': 'Investeer in voorraad van onderdelen, banden of accessoires voor je automotive bedrijf.'
            },
            {
                'title': 'Werkplaatsverbouwing',
                'description': 'Financier verbouwing, uitbreiding of modernisering van je garage of werkplaats.'
            },
            {
                'title': 'Groei & Uitbreiding',
                'description': 'Financier uitbreiding van diensten, locaties of groei van je automotive bedrijf.'
            }
        ],
        'productie': [
            {
                'title': 'Productiemachines',
                'description': 'Financier nieuwe productiemachines, automatisering of verbetering van je productielijn.'
            },
            {
                'title': 'Magazijn & Opslag',
                'description': 'Investeer in magazijnruimte, opslag of logistieke faciliteiten voor je productiebedrijf.'
            },
            {
                'title': 'Grondstoffen & Materialen',
                'description': 'Financier grondstoffen, materialen of voorraad voor je productieprocessen.'
            },
            {
                'title': 'Innovatie & Ontwikkeling',
                'description': 'Investeer in onderzoek, ontwikkeling of innovatie van nieuwe producten of processen.'
            }
        ]
    }
    
    templates = use_cases_templates.get(sector_slug, [
        {
            'title': 'Werkkapitaal',
            'description': f'Financier je dagelijkse operaties en groei van je {sector_name.lower()} bedrijf.'
        },
        {
            'title': 'Investering',
            'description': f'Investeer in apparatuur, verbouwing of uitbreiding van je {sector_name.lower()} bedrijf.'
        },
        {
            'title': 'Groei',
            'description': f'Financier groei en uitbreiding van je {sector_name.lower()} bedrijf.'
        },
        {
            'title': 'Innovatie',
            'description': f'Investeer in innovatie en verbetering van je {sector_name.lower()} bedrijf.'
        }
    ])
    
    colors = ['#fff2b2', '#e4f2ff', '#fff2b2', '#e4f2ff']
    text_colors = ['#5e5515', '#0f1720', '#5e5515', '#0f1720']
    
    use_cases = []
    for i, template in enumerate(templates):
        use_case = {
            'title': template['title'],
            'description': template['description'],
            'color': colors[i % len(colors)],
            'textColor': text_colors[i % len(text_colors)],
            'buttonLabel': 'Vraag offerte aan',
            'buttonHref': '/lead'
        }
        # Note: Images are not included in the Strapi payload as they require media upload
        # The frontend supports imageUrl, but Strapi schema requires media type upload
        # Images can be added manually via Strapi admin interface or via image upload API
        use_cases.append(use_case)
    
    return use_cases

def generate_benefits(sector_slug: str, sector_name: str) -> List[Dict]:
    """Generate benefits for a sector"""
    benefits = [
        {
            'title': 'Snel geregeld',
            'description': 'Binnen 24 uur inzicht in je financieringsmogelijkheden. Geen weken wachten zoals bij traditionele banken.',
            'iconPath': '/icons/SVG/interface/zap.svg',
            'color': '#fff2b2',
            'textColor': '#5e5515'
        },
        {
            'title': 'Flexibel aflossen',
            'description': 'Pas je aflossingen aan op basis van je cashflow. Meer aflossen in goede maanden, minder in rustige periodes.',
            'iconPath': '/icons/SVG/interface/clock.svg',
            'color': '#e4f2ff',
            'textColor': '#0f1720'
        },
        {
            'title': 'Geen verborgen kosten',
            'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf. Boetevrij vervroegd aflossen mogelijk.',
            'iconPath': '/icons/SVG/interface/shield.svg',
            'color': '#fff2b2',
            'textColor': '#5e5515'
        },
        {
            'title': f'Specifiek voor {sector_name.lower()}',
            'description': f'We begrijpen de uitdagingen van de {sector_name.lower()} sector. Ons team heeft ervaring met {sector_name.lower()} bedrijven.',
            'iconPath': '/icons/SVG/interface/heart.svg',
            'color': '#e4f2ff',
            'textColor': '#0f1720'
        }
    ]
    return benefits

def generate_quote(sector_slug: str, sector_name: str) -> str:
    """Generate a quote for a sector"""
    quotes = {
        'horeca': 'Financiering die meegroeit met je horecazaak. Of je nu investeert in nieuwe keukenapparatuur, verbouwingen plant, of seizoensgebonden uitgaven moet overbruggen – wij begrijpen de unieke behoeften van de horecasector en bieden flexibele oplossingen die passen bij jouw bedrijf.',
        'retail': 'Financiering die past bij het ritme van je retailbedrijf. Of je nu investeert in voorraad, verbouwingen, of uitbreiding naar nieuwe locaties – wij helpen je groeien met flexibele financiering.',
        'transport': 'Financiering voor transportbedrijven die snel willen handelen. Van nieuwe voertuigen tot logistieke uitbreiding, wij begrijpen wat je nodig hebt om je transportbedrijf te laten groeien.',
        'bouw': 'Financiering die meegroeit met je bouwprojecten. Of je nu materiaal nodig hebt, machines wilt kopen, of werkplaatsen wilt uitbreiden – wij bieden flexibele oplossingen voor bouwbedrijven.',
        'ecommerce': 'Financiering voor online ondernemers die willen groeien. Investeer in marketing, voorraad, of internationale uitbreiding met flexibele financiering die past bij je webshop.',
        'zorg': 'Financiering die helpt om de beste zorg te leveren. Of je nu investeert in apparatuur, verbouwingen, of digitalisering – wij begrijpen de behoeften van zorginstellingen.',
        'consultants': 'Financiering die je helpt om je adviesbureau te laten groeien. Investeer in kantoor, software, of ontwikkeling van je expertise met flexibele financiering.',
        'schoonmaak': 'Financiering voor schoonmaakbedrijven die willen groeien. Van apparatuur tot voertuigen, wij helpen je om je schoonmaakbedrijf uit te breiden.',
        'automotive': 'Financiering voor garages en automotive bedrijven. Investeer in apparatuur, voorraad, of uitbreiding van je werkplaats met flexibele financiering.',
        'productie': 'Financiering die meegroeit met je productiebedrijf. Van machines tot materiaal, wij helpen je om je productiecapaciteit te vergroten en te innoveren.'
    }
    return quotes.get(sector_slug, f'Flexibele financiering speciaal voor {sector_name.lower()} bedrijven. Snel, transparant en zonder gedoe.')

def generate_easy_lending_content(sector_name: str) -> str:
    """Generate easy lending content"""
    return f"""Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon eenvoudig online aanvragen en snel een antwoord krijgen.

Ons proces is speciaal ontwikkeld voor {sector_name.lower()} ondernemers die snel willen handelen. We begrijpen dat timing cruciaal is - daarom zorgen we voor snelle beslissingen.

Geen uitgebreide jaarrekeningen nodig. We kijken naar je recente omzetcijfers en begrijpen de uitdagingen van de {sector_name.lower()} sector."""

def main():
    """Main execution"""
    print("=" * 80)
    print("🚀 GENERATING SECTOR PAGES WITH UNSPLASH IMAGES")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Sectors: {len(SECTORS)}\n")
    
    # Check permissions first
    print("🔍 Checking API permissions...")
    test_url = f"{STRAPI_URL}/api/sector-pages"
    test_response = requests.get(test_url, headers=HEADERS, timeout=10)
    if test_response.status_code == 404:
        print("⚠️  WARNING: sector-pages endpoint returns 404")
        print("   This might indicate a permissions or endpoint configuration issue.")
        print("   Please enable permissions in Strapi Admin:")
        print("   Settings → Users & Permissions Plugin → Roles → Public")
        print("   Enable: find, findOne, create, update for Sector-page\n")
    elif test_response.status_code == 200:
        print("✅ API endpoint is accessible\n")
    else:
        print(f"⚠️  API endpoint returned: {test_response.status_code}\n")
    
    results = []
    
    for sector_slug, sector_info in SECTORS.items():
        print(f"\n{'='*80}")
        print(f"📝 Processing: {sector_info['name']} ({sector_slug})")
        print(f"{'='*80}")
        
        try:
            # Generate content
            page_data = generate_sector_content(sector_slug, sector_info)
            
            # Create/update in Strapi
            result = create_or_update_sector_page(sector_slug, page_data)
            
            if result:
                results.append((sector_slug, True))
                print(f"  ✅ Success!")
            else:
                results.append((sector_slug, False))
                print(f"  ❌ Failed!")
            
            # Rate limiting - wait between requests
            time.sleep(1)
            
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
