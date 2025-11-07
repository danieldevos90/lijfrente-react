#!/usr/bin/env python3
"""
Create a default sector page (Horeca) in Strapi
"""

import os
import requests
import json
import time

# Configuration - Use Strapi Cloud
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', 'a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

def get_existing_sector_page(sector_slug: str):
    """Get existing sector page by slug"""
    url = f"{STRAPI_URL}/api/sector-pages?filters[sectorSlug][$eq]={sector_slug}&filters[siteId][$eq]={SITE_ID}"
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                return data['data'][0]
    except Exception as e:
        print(f"Error fetching sector page {sector_slug}: {e}")
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
                update_response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=10)
                if update_response.status_code == 200:
                    print(f"✅ Updated sector page: {sector_slug}")
                    return update_response.json()
                else:
                    print(f"⚠️ Failed to update sector page {sector_slug}: {update_response.status_code}")
                    print(f"Response: {update_response.text}")
            except Exception as e:
                print(f"⚠️ Error updating sector page {sector_slug}: {e}")
    
    # Create new page
    url = f"{STRAPI_URL}/api/sector-pages"
    try:
        response = requests.post(url, headers=HEADERS, json=page_data, timeout=10)
        if response.status_code == 200:
            print(f"✅ Created sector page: {sector_slug}")
            return response.json()
        else:
            print(f"❌ Failed to create sector page {sector_slug}: {response.status_code}")
            print(f"Response: {response.text}")
            try:
                error_data = response.json()
                if 'error' in error_data:
                    print(f"Error: {error_data['error']}")
            except:
                pass
    except Exception as e:
        print(f"❌ Error creating sector page {sector_slug}: {e}")
    return None

def create_horeca_sector_page():
    """Create default Horeca sector page with complete content"""
    
    page_data = {
        "data": {
            "siteId": SITE_ID,
            "sectorSlug": "horeca",
            "sectorName": "Horeca",
            "metaDescription": "Zakelijke financiering speciaal voor restaurants, cafés en hotels. Snel, flexibel en zonder gedoe. Binnen 24 uur inzicht.",
            "metaKeywords": "horeca financiering, restaurant lening, café financiering, hotel financiering, horeca bedrijfslening",
            "heroTitle": "Zakelijke financiering voor de horeca",
            "heroSubtitle": "Financiering op maat voor restaurants, cafés en hotels. Snel geregeld, zonder gedoe.",
            "quote": "Financiering die meegroeit met je horecazaak. Of je nu investeert in nieuwe keukenapparatuur, verbouwingen plant, of seizoensgebonden uitgaven moet overbruggen – wij begrijpen de unieke behoeften van de horecasector en bieden flexibele oplossingen die passen bij jouw bedrijf.",
            "quoteAuthor": None,
            "easyLendingTitle": "Zo eenvoudig is het om financiering te krijgen",
            "easyLendingContent": "Binnen 24 uur weet je of je in aanmerking komt voor financiering. Geen papierwerk, geen gedoe. Gewoon eenvoudig online aanvragen en snel een antwoord krijgen.\n\nOns proces is speciaal ontwikkeld voor horeca-ondernemers die snel willen handelen. We begrijpen dat in de horeca timing cruciaal is - daarom zorgen we voor snelle beslissingen.\n\nGeen uitgebreide jaarrekeningen nodig. We kijken naar je recente omzetcijfers en begrijpen de seizoensgebonden uitdagingen van de horeca.",
            "easyLendingImagePosition": "left",
            "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
            "useCasesSubtitle": "Veelzijdige financieringsoplossingen speciaal voor de horeca",
            "useCases": [
                {
                    "title": "Keukenapparatuur",
                    "description": "Investeer in professionele keukenapparatuur voor je restaurant of café. Van ovens tot koelinstallaties, wij helpen je de juiste apparatuur te financieren.",
                    "color": "#fff2b2",
                    "textColor": "#5e5515",
                    "buttonLabel": "Vraag offerte aan",
                    "buttonHref": "/lead"
                },
                {
                    "title": "Renovatie & Verbouwing",
                    "description": "Financier verbouwingen en renovaties voor je horecazaak. Maak je zaak klaar voor de toekomst met flexibele financiering.",
                    "color": "#e4f2ff",
                    "textColor": "#0f1720",
                    "buttonLabel": "Meer informatie",
                    "buttonHref": "/lead"
                },
                {
                    "title": "Terras & Uitbreiding",
                    "description": "Breid je terras uit of investeer in nieuwe buitenmeubels. Maak optimaal gebruik van het seizoen met flexibele financiering.",
                    "color": "#fff2b2",
                    "textColor": "#5e5515",
                    "buttonLabel": "Vraag offerte aan",
                    "buttonHref": "/lead"
                },
                {
                    "title": "Werkkapitaal",
                    "description": "Financier je dagelijkse operaties, voorraad of seizoensgebonden pieken in je omzet. Flexibel en snel geregeld.",
                    "color": "#e4f2ff",
                    "textColor": "#0f1720",
                    "buttonLabel": "Meer informatie",
                    "buttonHref": "/lead"
                }
            ],
            "benefitsTitle": "Waarom kiezen voor onze financiering?",
            "benefitsSubtitle": "Voordelen speciaal voor horeca-ondernemers",
            "benefits": [
                {
                    "title": "Snel geregeld",
                    "description": "Binnen 24 uur inzicht in je financieringsmogelijkheden. Geen weken wachten zoals bij traditionele banken.",
                    "iconPath": "/icons/SVG/interface/zap.svg",
                    "color": "#fff2b2",
                    "textColor": "#5e5515"
                },
                {
                    "title": "Flexibel aflossen",
                    "description": "Pas je aflossingen aan op basis van je seizoensgebonden omzet. Meer aflossen in goede maanden, minder in rustige periodes.",
                    "iconPath": "/icons/SVG/interface/clock.svg",
                    "color": "#e4f2ff",
                    "textColor": "#0f1720"
                },
                {
                    "title": "Geen verborgen kosten",
                    "description": "Transparante voorwaarden en kosten. Geen verrassingen achteraf. Boetevrij vervroegd aflossen mogelijk.",
                    "iconPath": "/icons/SVG/interface/shield.svg",
                    "color": "#fff2b2",
                    "textColor": "#5e5515"
                },
                {
                    "title": "Horeca-specialisten",
                    "description": "We begrijpen de uitdagingen van de horeca. Ons team heeft ervaring met restaurants, cafés en hotels.",
                    "iconPath": "/icons/SVG/interface/heart.svg",
                    "color": "#e4f2ff",
                    "textColor": "#0f1720"
                }
            ],
            "ctaTitle": "Klaar om te beginnen?",
            "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.",
            "ctaLabel": "Vraag financiering aan",
            "ctaHref": "/lead"
        }
    }
    
    return create_or_update_sector_page("horeca", page_data)

def main():
    """Main execution"""
    print("=" * 80)
    print("🚀 CREATING DEFAULT SECTOR PAGE (HORECA)")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    result = create_horeca_sector_page()
    
    if result:
        print("\n" + "=" * 80)
        print("✅ SECTOR PAGE CREATED SUCCESSFULLY!")
        print("=" * 80)
        print(f"\n🌐 View at: /sectoren/horeca")
        print(f"📝 Edit in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::sector-page.sector-page")
    else:
        print("\n❌ Failed to create sector page. Check errors above.")

if __name__ == '__main__':
    main()

