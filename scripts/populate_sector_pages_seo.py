#!/usr/bin/env python3
"""
Populate all sector pages with comprehensive SEO-optimized Dutch content
Includes: use cases, benefits, why choose GeldGeregeld, and rich descriptions
"""

import os
import sys
import requests
import json
import time

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'b16b5a26631fb6e94de7fe8ac5e5fbaaeb97b28cb27a5497a151c0be226fe27ebe5e3341500f8539b14a60a82811f9b53536bea775e8e2649d3d8e6e92547712b1a226b6dfe579a47af90cbb1a65af8e7103c8fb3e0b9321f61fdf00e398d04c8a8068a152273b35a0fc4880803107f9e90f602c761951f557cd9a33b1cec0ac')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

# Comprehensive SEO content for each sector
SECTOR_CONTENT = {
    'automotive': {
        'name': 'Automotive',
        'description': 'Zakelijke financiering voor automotive bedrijven en garages. Van werkplaatsapparatuur tot voorraad en uitbreiding – flexibele financiering op maat voor de automotive sector.',
        'keywords': ['automotive financiering', 'garage lening', 'autobedrijf financiering', 'automotive lening', 'garage financiering', 'autowerkplaats lening'],
        'quote': 'Financiering voor garages en automotive bedrijven. Investeer in apparatuur, voorraad, of uitbreiding van je werkplaats met flexibele financiering die past bij jouw bedrijf.',
        'useCases': [
            {
                'title': 'Werkplaatsapparatuur',
                'description': 'Financier professionele gereedschappen, diagnoseapparatuur en werkplaatsinstallaties. Van liftinstallaties tot computergestuurde systemen – investeer in de toekomst van je garage.',
                'iconPath': '/icons/SVG/interface/tool.svg',
                'color': '#fff2b2',
                'textColor': '#5e5515',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Voorraad & Onderdelen',
                'description': 'Financier je voorraad onderdelen en accessoires zonder grote voorinvestering. Houd je magazijn gevuld en je klanten tevreden met flexibele voorraadfinanciering.',
                'iconPath': '/icons/SVG/e-commerce/package.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Werkplaatsverbouwing',
                'description': 'Financier uitbreiding of modernisering van je werkplaats. Creëer meer ruimte, verbeter je workflow en investeer in de groei van je automotive bedrijf.',
                'iconPath': '/icons/SVG/interface/home.svg',
                'color': '#d7d0ff',
                'textColor': '#3b0b5e',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Voertuigen & Vervoer',
                'description': 'Financier bedrijfsvoertuigen, bestelauto\'s of servicewagens voor je automotive bedrijf. Uitbreiden van je vloot of vervangen van oude voertuigen – wij helpen je verder.',
                'iconPath': '/icons/SVG/e-commerce/truck.svg',
                'color': '#bbe7be',
                'textColor': '#114e0b',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen lange wachttijden, geen ingewikkelde procedures. Perfect voor automotive bedrijven die snel moeten handelen.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#5e5515'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je seizoensgebonden inkomsten. In drukke periodes meer aflossen, in rustige periodes minder – volledige flexibiliteit voor je automotive bedrijf.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden zonder verrassingen. Geen opstartkosten, geen verborgen fees. Je weet precies waar je aan toe bent met onze automotive financiering.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#d7d0ff',
                'textColor': '#3b0b5e'
            },
            {
                'title': 'Specifiek voor automotive',
                'description': 'Wij begrijpen de unieke behoeften van automotive bedrijven. Van seizoensgebonden pieken tot investeringen in specialistische apparatuur – wij hebben ervaring met jouw sector.',
                'iconPath': '/icons/SVG/e-commerce/truck.svg',
                'color': '#bbe7be',
                'textColor': '#114e0b'
            }
        ],
        'easyLendingContent': '<p>Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon online aanvragen en binnen een dag een antwoord.</p><p>Voor automotive bedrijven bieden wij flexibele financieringsoplossingen die meegroeien met je bedrijf. Of je nu investeert in nieuwe apparatuur, je voorraad uitbreidt, of je werkplaats moderniseert – wij helpen je verder.</p><p>Onze specialisten begrijpen de automotive sector en weten wat belangrijk is voor garages en autobedrijven. Daarom bieden wij financiering op maat, zonder onnodige rompslomp.</p>'
    },
    'horeca': {
        'name': 'Horeca',
        'description': 'Zakelijke financiering speciaal voor de horeca. Van restaurants tot cafés en hotels – flexibele financiering die meegroeit met je horecazaak.',
        'keywords': ['horeca financiering', 'restaurant lening', 'café financiering', 'hotel financiering', 'horeca lening'],
        'quote': 'Financiering die meegroeit met je horecazaak. Of je nu investeert in nieuwe keukenapparatuur, verbouwingen plant, of seizoensgebonden uitgaven moet overbruggen – wij begrijpen de unieke behoeften van de horecasector.',
        'useCases': [
            {
                'title': 'Keukenapparatuur',
                'description': 'Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.',
                'iconPath': '/icons/SVG/food/cutlery.svg',
                'color': '#fff2b2',
                'textColor': '#5e5515',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Renovatie & Verbouwing',
                'description': 'Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.',
                'iconPath': '/icons/SVG/interface/home.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Terras & Uitbreiding',
                'description': 'Breid je terras uit of investeer in nieuwe buitenmeubels. Maak optimaal gebruik van het seizoen met flexibele financiering.',
                'iconPath': '/icons/SVG/interface/magic-wand.svg',
                'color': '#d7d0ff',
                'textColor': '#3b0b5e',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Financier je dagelijkse operaties, voorraad of seizoensgebonden pieken in je omzet. Flexibel en snel geregeld voor de horeca.',
                'iconPath': '/icons/SVG/finance/wallet.svg',
                'color': '#bbe7be',
                'textColor': '#114e0b',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snelle goedkeuring',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Perfect voor horecazaken die snel moeten handelen.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#5e5515'
            },
            {
                'title': 'Flexibele aflossing',
                'description': 'Pas je aflossingen aan op je seizoensgebonden inkomsten. In drukke zomermaanden meer, in rustige periodes minder.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Geen onderpand nodig',
                'description': 'Voor bedragen tot €250.000 heb je geen onderpand nodig. Ideaal voor horecazaken zonder grote bezittingen.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#d7d0ff',
                'textColor': '#3b0b5e'
            },
            {
                'title': 'Specifiek voor horeca',
                'description': 'Wij begrijpen de unieke behoeften van de horecasector. Seizoensgebonden pieken, wisselende inkomsten – wij hebben ervaring met jouw uitdagingen.',
                'iconPath': '/icons/SVG/food/cutlery.svg',
                'color': '#bbe7be',
                'textColor': '#114e0b'
            }
        ],
        'easyLendingContent': '<p>Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon online aanvragen en binnen een dag een antwoord.</p><p>Voor horecazaken bieden wij flexibele financieringsoplossingen die meegroeien met je bedrijf. Of je nu investeert in nieuwe keukenapparatuur, je terras uitbreidt, of seizoensgebonden uitgaven moet overbruggen – wij helpen je verder.</p><p>Onze specialisten begrijpen de horecasector en weten wat belangrijk is voor restaurants, cafés en hotels. Daarom bieden wij financiering op maat, zonder onnodige rompslomp.</p>'
    },
    'retail': {
        'name': 'Retail',
        'description': 'Financiering voor retailbedrijven. Van webshops tot fysieke winkels – flexibele financiering voor de retail sector.',
        'keywords': ['retail financiering', 'winkel financiering', 'webshop lening', 'retail lening', 'winkel lening'],
        'quote': 'Financiering voor retailbedrijven die willen groeien. Investeer in voorraad, verbouw je winkel, of breid uit naar online – wij helpen je verder met flexibele financiering.',
        'useCases': [
            {
                'title': 'Winkelverbouwing',
                'description': 'Financier verbouwingen en modernisering van je winkel. Maak je retailzaak aantrekkelijker voor klanten met flexibele financiering.',
                'iconPath': '/icons/SVG/interface/home.svg',
                'color': '#fff2b2',
                'textColor': '#5e5515',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Voorraad & Inventaris',
                'description': 'Investeer in voorraad zonder grote voorinvestering. Houd je schappen gevuld met flexibele financiering.',
                'iconPath': '/icons/SVG/e-commerce/package.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Nieuwe locatie',
                'description': 'Financier een nieuwe winkel of uitbreiding naar meerdere locaties. Groei je retailbedrijf met vertrouwen.',
                'iconPath': '/icons/SVG/interface/magic-wand.svg',
                'color': '#d7d0ff',
                'textColor': '#3b0b5e',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Online uitbreiding',
                'description': 'Investeer in je webshop, logistiek of online marketing. Breid je retailactiviteiten uit naar online.',
                'iconPath': '/icons/SVG/e-commerce/shopping-cart.svg',
                'color': '#bbe7be',
                'textColor': '#114e0b',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Perfect voor retailbedrijven die snel moeten handelen.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#5e5515'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je seizoensgebonden verkopen. In drukke periodes meer, in rustige periodes minder.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden zonder verrassingen. Je weet precies waar je aan toe bent.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#d7d0ff',
                'textColor': '#3b0b5e'
            },
            {
                'title': 'Specifiek voor retail',
                'description': 'Wij begrijpen de unieke behoeften van retailbedrijven. Van voorraad tot uitbreiding – wij hebben ervaring met jouw sector.',
                'iconPath': '/icons/SVG/e-commerce/shop.svg',
                'color': '#bbe7be',
                'textColor': '#114e0b'
            }
        ],
        'easyLendingContent': '<p>Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon online aanvragen en binnen een dag een antwoord.</p><p>Voor retailbedrijven bieden wij flexibele financieringsoplossingen die meegroeien met je bedrijf. Of je nu investeert in voorraad, je winkel verbouwt, of uitbreidt naar online – wij helpen je verder.</p><p>Onze specialisten begrijpen de retailsector en weten wat belangrijk is voor winkels en webshops. Daarom bieden wij financiering op maat, zonder onnodige rompslomp.</p>'
    },
    # Add other sectors similarly...
}

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

def update_sector_page(sector_slug: str, content: dict):
    """Update sector page with comprehensive content"""
    existing = get_existing_sector_page(sector_slug)
    
    if not existing:
        print(f"  ❌ Sector page not found: {sector_slug}")
        return False
    
    page_id = existing.get('id') or existing.get('documentId')
    if not page_id:
        print(f"  ❌ No ID found for sector page: {sector_slug}")
        return False
    
    # Build update data
    page_data = {
        "data": {
            "heroTitle": f"Zakelijke financiering voor {content['name'].lower()}",
            "heroSubtitle": content['description'],
            "metaDescription": content['description'],
            "metaKeywords": ", ".join(content['keywords']),
            "quote": content['quote'],
            "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
            "easyLendingContent": content['easyLendingContent'],
            "easyLendingImagePosition": "left",
            "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
            "useCasesSubtitle": f"Veelzijdige financieringsoplossingen speciaal voor {content['name'].lower()}",
            "useCases": content['useCases'],
            "benefitsTitle": "Waarom kiezen voor GeldGeregeld?",
            "benefitsSubtitle": f"Voordelen speciaal voor {content['name'].lower()}",
            "benefits": content['benefits'],
            "ctaTitle": "Klaar om te beginnen?",
            "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.",
            "ctaLabel": "Vraag financiering aan",
            "ctaHref": "/lead",
            "publishedAt": existing.get('publishedAt') or None  # Keep existing publish date
        }
    }
    
    # Update via Content API
    update_url = f"{STRAPI_URL}/api/sector-pages/{page_id}"
    try:
        print(f"  📤 Updating {sector_slug}...")
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
    print("📝 POPULATING SECTOR PAGES WITH SEO CONTENT")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    # For now, let's add comprehensive content for all 10 sectors
    # I'll create a simplified version that updates automotive first
    # Then we can expand to all sectors
    
    sectors_to_update = ['automotive', 'horeca', 'retail', 'transport', 'bouw', 
                        'ecommerce', 'zorg', 'consultants', 'schoonmaak', 'productie']
    
    # For automotive, use the detailed content above
    # For others, we'll need to add similar content
    
    success_count = 0
    for sector_slug in sectors_to_update:
        if sector_slug in SECTOR_CONTENT:
            print(f"\n📄 Processing {sector_slug}...")
            if update_sector_page(sector_slug, SECTOR_CONTENT[sector_slug]):
                success_count += 1
            time.sleep(1)  # Rate limiting
        else:
            print(f"\n⚠️  No content template for {sector_slug} yet")
    
    print("\n" + "=" * 80)
    print(f"✅ Completed! Updated {success_count}/{len(sectors_to_update)} sector pages")
    print("=" * 80)

if __name__ == '__main__':
    main()
