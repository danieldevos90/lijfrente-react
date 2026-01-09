#!/usr/bin/env python3
"""
Upload Algemene Voorwaarden text to Strapi CMS
Reads the text content and updates the algemene-voorwaarden page in Strapi
"""

import os
import sys
import json
import requests
from pathlib import Path

# Load environment variables
def load_env():
    env_vars = {}
    env_file = Path(__file__).parent.parent / 'frontend' / '.env.local'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")
    
    # Also check environment variables
    strapi_url = os.getenv('NEXT_PUBLIC_STRAPI_URL') or env_vars.get('NEXT_PUBLIC_STRAPI_URL')
    strapi_token = os.getenv('STRAPI_TOKEN') or env_vars.get('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN') or env_vars.get('STRAPI_API_TOKEN')
    
    if not strapi_url:
        strapi_url = 'https://bright-smile-1f47bc9d67.strapiapp.com'
    
    return strapi_url, strapi_token

# Algemene Voorwaarden text (from PDF)
ALGEMENE_VOORWAARDEN_TEXT = """
ALGEMENE VOORWAARDEN - GELDGEREGELD.NL

## Artikel 1 – Identiteit

geldgeregel.nl is een handelsnaam van Interim Financiële Diensten, gevestigd aan Roggestraat 7, 7311 CD Apeldoorn, ingeschreven bij de Kamer van Koophandel onder KvK-nummer 64859525, hierna te noemen: geldgeregel.nl.

## Artikel 2 – Definities

Klant: iedere natuurlijke persoon handelend in de uitoefening van een beroep of bedrijf, dan wel rechtspersoon, die gebruikmaakt van de dienstverlening van geldgeregel.nl.

Dienstverlening: het verzamelen, beoordelen en doorgeleiden van gegevens van de klant ten behoeve van een financieringsaanvraag.

Financier: een bank, kredietverstrekker of andere derde partij die zelfstandig beslist over het verstrekken van financiering.

## Artikel 3 – Toepasselijkheid

1. Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, diensten, overeenkomsten en rechtsverhoudingen waarbij geldgeregel.nl betrokken is.
2. Afwijkingen zijn uitsluitend geldig indien schriftelijk overeengekomen.
3. Algemene voorwaarden van de klant worden uitdrukkelijk van de hand gewezen.

## Artikel 4 – Rol en positie

1. geldgeregel.nl treedt uitsluitend op als onafhankelijk bemiddelaar.
2. geldgeregel.nl is geen kredietverstrekker en verstrekt zelf geen leningen of kredieten.
3. De overeenkomst tot financiering komt uitsluitend tot stand tussen de klant en de financier.

## Artikel 5 – Totstandkoming dienstverlening

1. De dienstverlening vangt aan zodra de klant gegevens aanlevert ten behoeve van een financieringsaanvraag.
2. geldgeregel.nl is gerechtigd aanvragen zonder opgave van redenen te weigeren of te beëindigen.

## Artikel 6 – Gegevensverstrekking

1. De klant staat in voor de juistheid, volledigheid en actualiteit van alle verstrekte gegevens.
2. geldgeregel.nl is gerechtigd deze gegevens door te geven aan één of meerdere financiers.
3. geldgeregel.nl is niet verplicht de juistheid van aangeleverde gegevens te verifiëren.
4. Onjuiste of onvolledige informatie komt volledig voor rekening en risico van de klant.

## Artikel 7 – Privacy

1. Persoons- en bedrijfsgegevens worden verwerkt conform de Algemene Verordening Gegevensbescherming (AVG).
2. Gegevens worden uitsluitend gedeeld met financiers in het kader van een financieringsaanvraag.
3. geldgeregel.nl is niet verantwoordelijk voor de gegevensverwerking door financiers.

## Artikel 8 – Geen resultaatsverplichting

1. geldgeregel.nl heeft een inspanningsverplichting en geen resultaatsverplichting.
2. Er wordt geen garantie gegeven op acceptatie, voorwaarden, rentepercentages of uitbetaling van financiering.

## Artikel 9 – Vergoeding

1. geldgeregel.nl kan een vergoeding ontvangen van financiers voor haar bemiddelingswerkzaamheden.
2. Eventuele kosten voor de klant worden vooraf kenbaar gemaakt.

## Artikel 10 – Aansprakelijkheid

1. geldgeregeld.nl is niet aansprakelijk voor schade voortvloeiend uit besluiten of handelingen van financiers.
2. Iedere aansprakelijkheid is beperkt tot directe schade en maximaal tot het bedrag dat door de verzekering wordt uitgekeerd.
3. Aansprakelijkheid voor indirecte schade, gevolgschade en winstderving is uitgesloten.

## Artikel 11 – Overmacht

geldgeregeld.nl is niet gehouden tot nakoming indien sprake is van overmacht.

## Artikel 12 – Intellectuele eigendom

Alle rechten op teksten en materialen berusten bij geldgeregeld.nl.

## Artikel 13 – Klachten

Klachten dienen schriftelijk te worden ingediend. Klachten schorten verplichtingen niet op.

## Artikel 14 – Toepasselijk recht en forumkeuze

Op deze voorwaarden is uitsluitend Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter.

## Artikel 15 – Slotbepaling

Indien een bepaling ongeldig blijkt, blijven de overige bepalingen onverminderd van kracht.
"""

def upload_to_strapi(strapi_url, strapi_token, site_id='geldgeregeld'):
    """Upload algemene voorwaarden to Strapi"""
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {strapi_token}'
    }
    
    # First, check if page exists
    check_url = f"{strapi_url}/api/pages?filters[slug][$eq]=algemene-voorwaarden&filters[siteId][$eq]={site_id}"
    
    try:
        response = requests.get(check_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        page_data = data.get('data', [])
        
        if page_data:
            # Update existing page
            page_id = page_data[0]['id']
            update_url = f"{strapi_url}/api/pages/{page_id}"
            
            payload = {
                "data": {
                    "body": ALGEMENE_VOORWAARDEN_TEXT.strip(),
                    "metaDescription": "Algemene voorwaarden van GeldGeregeld.nl - Bekijk hier onze volledige algemene voorwaarden voor zakelijke financiering.",
                    "metaKeywords": "algemene voorwaarden, voorwaarden, geldgeregeld, zakelijke financiering, voorwaarden financiering"
                }
            }
            
            response = requests.put(update_url, headers=headers, json=payload)
            response.raise_for_status()
            print(f"✅ Successfully updated algemene-voorwaarden page (ID: {page_id})")
            return True
        else:
            # Create new page
            create_url = f"{strapi_url}/api/pages"
            
            payload = {
                "data": {
                    "siteId": site_id,
                    "slug": "algemene-voorwaarden",
                    "title": "Algemene Voorwaarden",
                    "body": ALGEMENE_VOORWAARDEN_TEXT.strip(),
                    "metaDescription": "Algemene voorwaarden van GeldGeregeld.nl - Bekijk hier onze volledige algemene voorwaarden voor zakelijke financiering.",
                    "metaKeywords": "algemene voorwaarden, voorwaarden, geldgeregeld, zakelijke financiering, voorwaarden financiering",
                    "publishedAt": "2025-01-01T00:00:00.000Z"
                }
            }
            
            response = requests.post(create_url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            print(f"✅ Successfully created algemene-voorwaarden page (ID: {result.get('data', {}).get('id', 'unknown')})")
            return True
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error uploading to Strapi: {e}")
        if hasattr(e.response, 'text'):
            print(f"   Response: {e.response.text}")
        return False

def main():
    print("📄 Uploading Algemene Voorwaarden to Strapi...")
    print("=" * 60)
    
    strapi_url, strapi_token = load_env()
    
    if not strapi_token:
        print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN not found")
        print("   Please set it in your .env.local file or as an environment variable")
        sys.exit(1)
    
    print(f"📍 Strapi URL: {strapi_url}")
    print(f"🔑 Token: {'*' * 20}...{strapi_token[-10:]}")
    print()
    
    success = upload_to_strapi(strapi_url, strapi_token)
    
    if success:
        print()
        print("✅ Done! Algemene voorwaarden have been uploaded to Strapi")
        print("   You can now fetch this content via the Strapi API")
    else:
        print()
        print("❌ Failed to upload algemene voorwaarden")
        sys.exit(1)

if __name__ == '__main__':
    main()
