#!/usr/bin/env python3
"""
Fill all sector pages with comprehensive SEO-optimized Dutch content
Standalone script with all content templates included
"""

import os
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')
if not STRAPI_TOKEN:
    raise SystemExit("Missing STRAPI_TOKEN (or STRAPI_API_TOKEN). Refusing to run without an explicit token.")
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

# All sector definitions
SECTORS = {
    'horeca': {
        'name': 'Horeca',
        'description': 'Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafés en hotels – flexibele financiering die meegroeit met je horecazaak.',
        'keywords': ['horeca financiering', 'restaurant lening', 'café financiering', 'hotel financiering', 'horeca lening']
    },
    'retail': {
        'name': 'Retail',
        'description': 'Financiering voor retailbedrijven. Van webshops tot fysieke winkels – flexibele financiering voor de retail sector.',
        'keywords': ['retail financiering', 'winkel financiering', 'webshop lening', 'retail lening', 'winkel lening']
    },
    'transport': {
        'name': 'Transport & Logistiek',
        'description': 'Zakelijke lening voor transport- en logistiekbedrijven. Van nieuwe voertuigen tot logistieke uitbreiding – flexibele financiering op maat.',
        'keywords': ['transport financiering', 'logistiek lening', 'vrachtwagen financiering', 'transportbedrijf lening', 'logistiek financiering']
    },
    'bouw': {
        'name': 'Bouw & Installatie',
        'description': 'Financiering voor bouwbedrijven en installateurs. Van materiaal tot machines – flexibele financiering voor de bouwsector.',
        'keywords': ['bouw financiering', 'installatie lening', 'bouwbedrijf financiering', 'aannemer lening', 'bouw lening']
    },
    'ecommerce': {
        'name': 'E-commerce',
        'description': 'Zakelijke financiering voor online ondernemers en webshops. Van marketing tot voorraad – flexibele financiering voor e-commerce.',
        'keywords': ['e-commerce financiering', 'webshop lening', 'online ondernemer financiering', 'e-commerce lening', 'webshop financiering']
    },
    'zorg': {
        'name': 'Zorg & Welzijn',
        'description': 'Financiering voor zorginstellingen en welzijnsorganisaties. Van apparatuur tot verbouwing – flexibele financiering voor de zorgsector.',
        'keywords': ['zorg financiering', 'welzijn lening', 'zorginstelling financiering', 'zorgondernemer lening', 'zorg lening']
    },
    'consultants': {
        'name': 'Advies & Consultancy',
        'description': 'Financiering voor adviesbureaus en consultants. Van kantoor tot software – flexibele financiering voor consultancy.',
        'keywords': ['consultancy financiering', 'adviesbureau lening', 'consultant financiering', 'advies lening', 'consultancy lening']
    },
    'schoonmaak': {
        'name': 'Schoonmaak',
        'description': 'Zakelijke financiering voor schoonmaakbedrijven. Van apparatuur tot voertuigen – flexibele financiering voor schoonmaak.',
        'keywords': ['schoonmaak financiering', 'schoonmaakbedrijf lening', 'schoonmaak lening', 'schoonmaakbedrijf financiering']
    },
    'automotive': {
        'name': 'Automotive',
        'description': 'Zakelijke financiering voor automotive bedrijven en garages. Van werkplaatsapparatuur tot voorraad en uitbreiding – flexibele financiering op maat voor de automotive sector.',
        'keywords': ['automotive financiering', 'garage lening', 'autobedrijf financiering', 'automotive lening', 'garage financiering', 'autowerkplaats lening']
    },
    'productie': {
        'name': 'Productie & Industrie',
        'description': 'Zakelijke lening voor productiebedrijven en industriële ondernemingen. Van machines tot materiaal – flexibele financiering voor productie.',
        'keywords': ['productie financiering', 'industrie lening', 'productiebedrijf financiering', 'industrieel lening', 'productie lening']
    }
}

# Use cases templates for each sector
USE_CASES = {
    'horeca': [
        {'title': 'Keukenapparatuur', 'description': 'Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.'},
        {'title': 'Renovatie & Verbouwing', 'description': 'Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.'},
        {'title': 'Terras & Uitbreiding', 'description': 'Breid je terras uit of investeer in nieuwe buitenmeubels. Maak optimaal gebruik van het seizoen met flexibele financiering.'},
        {'title': 'Werkkapitaal', 'description': 'Financier je dagelijkse operaties, voorraad of seizoensgebonden pieken in je omzet. Flexibel en snel geregeld voor de horeca.'}
    ],
    'retail': [
        {'title': 'Winkelverbouwing', 'description': 'Financier verbouwingen en modernisering van je winkel. Maak je retailzaak aantrekkelijker voor klanten met flexibele financiering.'},
        {'title': 'Voorraad & Inventaris', 'description': 'Investeer in voorraad zonder grote voorinvestering. Houd je schappen gevuld met flexibele financiering.'},
        {'title': 'Nieuwe locatie', 'description': 'Financier een nieuwe winkel of uitbreiding naar meerdere locaties. Groei je retailbedrijf met vertrouwen.'},
        {'title': 'Online uitbreiding', 'description': 'Investeer in je webshop, logistiek of online marketing. Breid je retailactiviteiten uit naar online.'}
    ],
    'transport': [
        {'title': 'Nieuwe voertuigen', 'description': 'Financier nieuwe vrachtwagens, bestelauto\'s of andere voertuigen voor je transportbedrijf. Uitbreiden van je vloot of vervangen van oude voertuigen – wij helpen je verder.'},
        {'title': 'Onderhoud & Reparatie', 'description': 'Financier onderhoud, reparaties of upgrades aan je vloot. Houd je voertuigen in topconditie en voorkom onverwachte kosten.'},
        {'title': 'Logistiek & Magazijn', 'description': 'Investeer in magazijnruimte, laad- en losinstallaties of logistieke systemen. Verbeter je logistieke processen met flexibele financiering.'},
        {'title': 'Groei & Uitbreiding', 'description': 'Financier uitbreiding van je transportcapaciteit of nieuwe routes. Groei je transportbedrijf met vertrouwen.'}
    ],
    'bouw': [
        {'title': 'Materiaal & Materieel', 'description': 'Financier bouwmaterialen, gereedschappen en materieel voor je bouwprojecten. Houd je projecten op schema met flexibele materiaalfinanciering.'},
        {'title': 'Voertuigen & Machines', 'description': 'Investeer in bouwmachines, graafmachines of transportvoertuigen voor je bouwbedrijf. Uitbreiden van je machinepark zonder grote voorinvestering.'},
        {'title': 'Kantoor & Werkplaats', 'description': 'Financier een nieuwe werkplaats, kantoor of opslagruimte voor je bouwbedrijf. Investeer in de infrastructuur van je bedrijf.'},
        {'title': 'Werkkapitaal', 'description': 'Financier je dagelijkse operaties en overbrug wachttijden tussen facturen en betalingen. Flexibel werkkapitaal voor bouwbedrijven.'}
    ],
    'ecommerce': [
        {'title': 'Online marketing', 'description': 'Investeer in advertenties, SEO of social media marketing om je webshop te laten groeien. Verhoog je online zichtbaarheid met flexibele marketingfinanciering.'},
        {'title': 'Voorraad & Logistiek', 'description': 'Financier voorraad, magazijnruimte of logistieke uitbreiding voor je webshop. Houd je voorraad op peil zonder grote voorinvestering.'},
        {'title': 'Website & Platform', 'description': 'Investeer in verbetering van je webshop, nieuwe features of migratie naar een beter platform. Moderniseer je online aanwezigheid.'},
        {'title': 'Internationale uitbreiding', 'description': 'Financier uitbreiding naar nieuwe markten of landen. Groei je e-commerce bedrijf internationaal met flexibele financiering.'}
    ],
    'zorg': [
        {'title': 'Medische apparatuur', 'description': 'Financier medische apparatuur, hulpmiddelen of technologie voor je zorginstelling. Investeer in de beste zorg voor je cliënten.'},
        {'title': 'Praktijkverbouwing', 'description': 'Financier verbouwingen, renovatie of uitbreiding van je zorginstelling of praktijk. Creëer een betere omgeving voor zorgverlening.'},
        {'title': 'Personeel & Opleiding', 'description': 'Investeer in personeel, opleidingen of training om de kwaliteit van zorg te verbeteren. Ontwikkel je team met flexibele financiering.'},
        {'title': 'Digitalisering', 'description': 'Financier digitale systemen, software of automatisering voor je zorgorganisatie. Moderniseer je zorgprocessen met flexibele financiering.'}
    ],
    'consultants': [
        {'title': 'Kantoor & Uitrusting', 'description': 'Financier kantoorruimte, meubilair of professionele uitrusting voor je adviesbureau. Creëer een professionele werkomgeving.'},
        {'title': 'Software & Tools', 'description': 'Investeer in software, tools of systemen om je consultancy efficiënter te maken. Automatiseer je processen en verhoog je productiviteit.'},
        {'title': 'Marketing & Netwerken', 'description': 'Financier marketing, netwerkevenementen of business development voor je adviesbureau. Groei je klantenbestand met strategische investeringen.'},
        {'title': 'Opleiding & Certificering', 'description': 'Investeer in opleidingen, certificeringen of bijscholing om je expertise uit te breiden. Blijf voorop lopen in je vakgebied.'}
    ],
    'schoonmaak': [
        {'title': 'Schoonmaakapparatuur', 'description': 'Financier professionele schoonmaakapparatuur, machines en materialen voor je schoonmaakbedrijf. Investeer in efficiënte schoonmaakoplossingen.'},
        {'title': 'Voertuigen', 'description': 'Investeer in bedrijfsvoertuigen voor transport van apparatuur en personeel naar klanten. Uitbreiden van je vloot zonder grote voorinvestering.'},
        {'title': 'Werkkapitaal', 'description': 'Financier je dagelijkse operaties en overbrug wachttijden tussen facturen en betalingen. Flexibel werkkapitaal voor schoonmaakbedrijven.'},
        {'title': 'Uitbreiding & Groei', 'description': 'Financier uitbreiding naar nieuwe klanten, locaties of groei van je schoonmaakbedrijf. Investeer in de toekomst van je bedrijf.'}
    ],
    'automotive': [
        {'title': 'Werkplaatsapparatuur', 'description': 'Financier professionele gereedschappen, diagnoseapparatuur en werkplaatsinstallaties. Van liftinstallaties tot computergestuurde systemen – investeer in de toekomst van je garage.'},
        {'title': 'Voorraad & Onderdelen', 'description': 'Financier je voorraad onderdelen en accessoires zonder grote voorinvestering. Houd je magazijn gevuld en je klanten tevreden met flexibele voorraadfinanciering.'},
        {'title': 'Werkplaatsverbouwing', 'description': 'Financier uitbreiding of modernisering van je werkplaats. Creëer meer ruimte, verbeter je workflow en investeer in de groei van je automotive bedrijf.'},
        {'title': 'Voertuigen & Vervoer', 'description': 'Financier bedrijfsvoertuigen, bestelauto\'s of servicewagens voor je automotive bedrijf. Uitbreiden van je vloot of vervangen van oude voertuigen – wij helpen je verder.'}
    ],
    'productie': [
        {'title': 'Productiemachines', 'description': 'Financier nieuwe productiemachines, automatisering of verbetering van je productielijn. Investeer in efficiëntie en productiviteit van je productiebedrijf.'},
        {'title': 'Magazijn & Opslag', 'description': 'Investeer in magazijnruimte, opslag of logistieke faciliteiten voor je productiebedrijf. Optimaliseer je voorraadbeheer met flexibele financiering.'},
        {'title': 'Grondstoffen & Materialen', 'description': 'Financier grondstoffen, materialen of voorraad voor je productieprocessen. Houd je productie draaiende zonder grote voorinvestering.'},
        {'title': 'Innovatie & Ontwikkeling', 'description': 'Investeer in onderzoek, ontwikkeling of innovatie van nieuwe producten of processen. Blijf voorop lopen met innovatieve productieoplossingen.'}
    ]
}

# Benefits templates (same for all sectors, but can be customized)
def get_benefits(sector_name: str):
    return [
        {
            'title': 'Snel geregeld',
            'description': f'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen lange wachttijden, geen ingewikkelde procedures. Perfect voor {sector_name.lower()} bedrijven die snel moeten handelen.',
            'iconPath': '/icons/SVG/interface/zap.svg',
            'color': '#fff2b2',
            'textColor': '#1e2021'
        },
        {
            'title': 'Flexibel aflossen',
            'description': f'Pas je aflossingen aan op basis van je cashflow. Meer aflossen in goede maanden, minder in rustige periodes. Volledige flexibiliteit voor je {sector_name.lower()} bedrijf.',
            'iconPath': '/icons/SVG/interface/clock.svg',
            'color': '#e4f2ff',
            'textColor': '#0f1720'
        },
        {
            'title': 'Geen verborgen kosten',
            'description': 'Transparante voorwaarden zonder verrassingen. Geen opstartkosten, geen verborgen fees. Je weet precies waar je aan toe bent met onze financiering.',
            'iconPath': '/icons/SVG/interface/shield.svg',
            'color': '#d7d0ff',
            'textColor': '#3b0b5e'
        },
        {
            'title': f'Specifiek voor {sector_name.lower()}',
            'description': f'Wij begrijpen de unieke behoeften van {sector_name.lower()} bedrijven. Van seizoensgebonden pieken tot investeringen in specialistische apparatuur – wij hebben ervaring met jouw sector.',
            'iconPath': '/icons/SVG/interface/heart.svg',
            'color': '#bbe7be',
            'textColor': '#114e0b'
        }
    ]

# Quotes for each sector
QUOTES = {
    'horeca': 'Financiering die meegroeit met je horecazaak. Of je nu investeert in nieuwe keukenapparatuur, verbouwingen plant, of seizoensgebonden uitgaven moet overbruggen – wij begrijpen de unieke behoeften van de horecasector en bieden flexibele oplossingen die passen bij jouw bedrijf.',
    'retail': 'Financiering die past bij het ritme van je retailbedrijf. Of je nu investeert in voorraad, verbouwingen, of uitbreiding naar nieuwe locaties – wij helpen je groeien met flexibele financiering.',
    'transport': 'Financiering voor transportbedrijven die snel willen handelen. Van nieuwe voertuigen tot logistieke uitbreiding, wij begrijpen wat je nodig hebt om je transportbedrijf te laten groeien.',
    'bouw': 'Financiering die meegroeit met je bouwprojecten. Of je nu materiaal nodig hebt, machines wilt kopen, of werkplaatsen wilt uitbreiden – wij bieden flexibele oplossingen voor bouwbedrijven.',
    'ecommerce': 'Financiering voor online ondernemers die willen groeien. Investeer in marketing, voorraad, of internationale uitbreiding met flexibele financiering die past bij je webshop.',
    'zorg': 'Financiering die helpt om de beste zorg te leveren. Of je nu investeert in apparatuur, verbouwingen, of digitalisering – wij begrijpen de behoeften van zorginstellingen.',
    'consultants': 'Financiering die je helpt om je adviesbureau te laten groeien. Investeer in kantoor, software, of ontwikkeling van je expertise met flexibele financiering.',
    'schoonmaak': 'Financiering voor schoonmaakbedrijven die willen groeien. Van apparatuur tot voertuigen, wij helpen je om je schoonmaakbedrijf uit te breiden.',
    'automotive': 'Financiering voor garages en automotive bedrijven. Investeer in apparatuur, voorraad, of uitbreiding van je werkplaats met flexibele financiering die past bij jouw bedrijf.',
    'productie': 'Financiering die meegroeit met je productiebedrijf. Van machines tot materiaal, wij helpen je om je productiecapaciteit te vergroten en te innoveren.'
}

def get_easy_lending_content(sector_name: str):
    return f"""<p>Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon online aanvragen en binnen een dag een antwoord.</p>
<p>Voor {sector_name.lower()} bedrijven bieden wij flexibele financieringsoplossingen die meegroeien met je bedrijf. Of je nu investeert in nieuwe apparatuur, je bedrijf uitbreidt, of seizoensgebonden uitgaven moet overbruggen – wij helpen je verder.</p>
<p>Onze specialisten begrijpen de {sector_name.lower()} sector en weten wat belangrijk is voor bedrijven zoals het jouwe. Daarom bieden wij financiering op maat, zonder onnodige rompslomp.</p>"""

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

def update_sector_page(sector_slug: str, sector_info: dict):
    """Update existing sector page with comprehensive content"""
    existing = get_existing_sector_page(sector_slug)
    
    if not existing:
        print(f"  ⚠️  Sector page not found: {sector_slug} - skipping")
        return False
    
    # Strapi v5 uses documentId
    page_id = existing.get('documentId') or existing.get('id')
    if not page_id:
        print(f"  ❌ No ID found for sector page: {sector_slug}")
        return False
    
    sector_name = sector_info['name']
    use_cases_templates = USE_CASES.get(sector_slug, [])
    
    # Format use cases with colors
    colors = ['#fff2b2', '#e4f2ff', '#d7d0ff', '#bbe7be']
    text_colors = ['#1e2021', '#1e2021', '#1e2021', '#1e2021']
    icon_paths = [
        '/icons/SVG/interface/tool.svg',
        '/icons/SVG/e-commerce/package.svg',
        '/icons/SVG/interface/home.svg',
        '/icons/SVG/e-commerce/truck.svg'
    ]
    
    use_cases = []
    for i, template in enumerate(use_cases_templates):
        use_cases.append({
            'title': template['title'],
            'description': template['description'],
            'iconPath': icon_paths[i % len(icon_paths)],
            'color': colors[i % len(colors)],
            'textColor': text_colors[i % len(text_colors)],
            'buttonLabel': 'Vraag offerte aan',
            'buttonHref': '/lead'
        })
    
    benefits = get_benefits(sector_name)
    quote = QUOTES.get(sector_slug, f'Flexibele financiering speciaal voor {sector_name.lower()} bedrijven. Snel, transparant en zonder gedoe.')
    easy_lending_content = get_easy_lending_content(sector_name)
    
    # Build update data
    page_data = {
        "data": {
            "heroTitle": f"Zakelijke financiering voor {sector_name.lower()}",
            "heroSubtitle": sector_info['description'],
            "metaDescription": sector_info['description'],
            "metaKeywords": ", ".join(sector_info['keywords']),
            "quote": quote,
            "quoteAuthor": None,
            "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
            "easyLendingContent": easy_lending_content,
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
    
    # Update via Content API using documentId
    update_url = f"{STRAPI_URL}/api/sector-pages/{page_id}"
    try:
        print(f"  📤 Updating {sector_slug} (ID: {page_id})...")
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
    print("📝 FILLING SECTOR PAGES WITH COMPREHENSIVE SEO CONTENT")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Sectors to update: {len(SECTORS)}\n")
    
    # Test token first
    print("🔍 Testing API access...")
    test_url = f"{STRAPI_URL}/api/sector-pages?pagination[pageSize]=1"
    test_response = requests.get(test_url, headers=HEADERS, timeout=10)
    if test_response.status_code == 200:
        print("✅ API access confirmed\n")
    else:
        print(f"⚠️  API returned: {test_response.status_code}")
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
            if update_sector_page(sector_slug, sector_info):
                results.append((sector_slug, True))
            else:
                results.append((sector_slug, False))
            
            time.sleep(1)  # Rate limiting
            
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
    import sys
    main()
