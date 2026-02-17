#!/usr/bin/env python3
"""
Populate Strapi with content for the 8 new sectors
Creates comprehensive sector pages with use cases, benefits, and SEO content
"""

import os
import requests
import json
import time

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')

if not STRAPI_TOKEN:
    print("=" * 80)
    print("❌ ERROR: STRAPI_API_TOKEN not found!")
    print("=" * 80)
    print("\nTo get your Strapi API token:")
    print("1. Visit: https://bright-smile-1f47bc9d67.strapiapp.com/admin")
    print("2. Go to: Settings → API Tokens")
    print("3. Create a new token with 'Full-access' permissions")
    print("4. Copy the token")
    print("\nThen run this script with:")
    print("  STRAPI_API_TOKEN=your-token-here python3 scripts/populate_new_sectors.py")
    print("\nOr export it first:")
    print("  export STRAPI_API_TOKEN=your-token-here")
    print("  python3 scripts/populate_new_sectors.py")
    print("\n" + "=" * 80)
    exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = 'geldgeregeld'

# New sectors content definitions
NEW_SECTORS = {
    'zzp': {
        'name': 'ZZP',
        'metaDescription': 'Zakelijke financiering voor zelfstandigen zonder personeel. Flexibele lening voor ZZP\'ers. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'zzp lening, zzp financiering, zzp krediet, zelfstandige lening, zzp ondernemer financiering, zzp lening zonder bkr',
        'heroTitle': 'Zakelijke financiering voor ZZP\'ers',
        'heroSubtitle': 'Flexibele financiering speciaal voor zelfstandigen zonder personeel. Snel geregeld, zonder gedoe.',
        'quote': 'Als ZZP\'er heb je flexibiliteit nodig. Onze financiering past zich aan op jouw inkomsten. Geen vaste maandlasten die je onder druk zetten, maar flexibiliteit die meebeweegt met jouw opdrachten en projecten.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. Geen uitgebreide jaarrekeningen nodig - we kijken naar je recente omzet en begrijpen de flexibele aard van ZZP-werk.\n\nOns proces is speciaal ontwikkeld voor zelfstandigen. We vragen alleen de essentiële informatie en maken snel een beslissing. Perfect voor ZZP\'ers die snel willen handelen.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Apparatuur & Tools',
                'description': 'Investeer in professionele apparatuur, software of tools die je nodig hebt voor je werk. Van laptops tot camera\'s, van software tot gereedschap.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Overbrug de tijd tussen opdrachten met flexibel werkkapitaal. Perfect voor ZZP\'ers met wisselende inkomsten.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Opleiding & Cursussen',
                'description': 'Investeer in jezelf met opleidingen en cursussen. Blijf bij met de laatste ontwikkelingen in jouw vakgebied.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Kantoor & Werkruimte',
                'description': 'Financier je thuiswerkplek of huur een flexibele werkruimte. Investeer in een professionele omgeving.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snelle goedkeuring',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen weken wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je inkomsten. Meer aflossen in goede maanden, minder in rustige periodes.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Geen onderpand nodig',
                'description': 'Voor bedragen tot €250.000 heb je geen onderpand nodig. Ook zonder jarenlange historie.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Specifiek voor ZZP',
                'description': 'Wij begrijpen de unieke behoeften van zelfstandigen zonder personeel.',
                'iconPath': '/icons/SVG/interface/user.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'starters': {
        'name': 'Starters & Startups',
        'metaDescription': 'Financiering voor startende ondernemers en startups. Snel geregeld zonder jarenlange historie. Binnen 24 uur inzicht.',
        'metaKeywords': 'starterslening, startup financiering, startende ondernemer lening, nieuwe onderneming financiering, starters krediet',
        'heroTitle': 'Financiering voor startende ondernemers',
        'heroSubtitle': 'Snel geregeld zonder jarenlange historie. Perfect voor startups en nieuwe ondernemingen.',
        'quote': 'Elk succesvol bedrijf is ooit begonnen. Wij geloven in startende ondernemers en helpen je op weg met flexibele financiering die meegroeit met je bedrijf.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Ook zonder jarenlange historie kun je bij ons terecht. We kijken naar je businessplan, je ervaring en je visie. Binnen 24 uur weet je of je in aanmerking komt.\n\nOns proces is speciaal ontwikkeld voor starters. We vragen alleen de essentiële informatie en maken snel een beslissing. Perfect voor ondernemers die snel willen groeien.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Startkapitaal',
                'description': 'Financier je eerste investeringen en start je bedrijf met het juiste kapitaal. Van apparatuur tot voorraad.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Marketing & Branding',
                'description': 'Investeer in je merk en marketing. Bouw je naamsbekendheid op met professionele marketingcampagnes.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Overbrug de eerste maanden met flexibel werkkapitaal. Perfect voor startups die nog moeten groeien.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Uitbreiding',
                'description': 'Groeisnel? Financier je eerste uitbreiding. Van extra personeel tot nieuwe locatie.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen maanden wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Geen jarenlange historie nodig',
                'description': 'Ook zonder jarenlange historie kun je bij ons terecht. We kijken naar je potentieel.',
                'iconPath': '/icons/SVG/misc/rocket.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je groei. Meer aflossen wanneer het goed gaat.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Specifiek voor starters',
                'description': 'Wij begrijpen de uitdagingen van startende ondernemers.',
                'iconPath': '/icons/SVG/interface/bulb.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'franchise': {
        'name': 'Franchise',
        'metaDescription': 'Zakelijke financiering voor franchisenemers. Investeer in je franchise zonder gedoe. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'franchise lening, franchise financiering, franchisenemer lening, franchise krediet, franchise ondernemer financiering',
        'heroTitle': 'Financiering voor franchisenemers',
        'heroSubtitle': 'Investeer in je franchise zonder gedoe. Snel geregeld, flexibel aflossen.',
        'quote': 'Als franchisenemer investeer je in een bewezen concept. Wij helpen je met flexibele financiering die past bij jouw franchiseformule.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. We begrijpen de franchiseformule en helpen je snel op weg.\n\nOns proces is speciaal ontwikkeld voor franchisenemers. We werken graag samen met bekende franchiseformules en helpen je snel aan de slag.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Franchisefee',
                'description': 'Financier je franchisefee en start je franchise zonder grote voorinvestering.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Inrichting & Apparatuur',
                'description': 'Financier je inrichting en apparatuur volgens de franchiseformule. Van meubels tot apparatuur.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Start je franchise met voldoende werkkapitaal. Overbrug de eerste maanden met flexibele financiering.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Uitbreiding',
                'description': 'Open een tweede of derde vestiging. Groei je franchise met flexibele financiering.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Start snel je franchise.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Franchise-specialisten',
                'description': 'We begrijpen de franchiseformule en werken graag samen met bekende formules.',
                'iconPath': '/icons/SVG/interface/grid.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je omzet. Meer aflossen wanneer het goed gaat.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'medisch': {
        'name': 'Medische Praktijken',
        'metaDescription': 'Financiering voor medische praktijken en artsen. Speciaal voor de zorgsector. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'medische praktijk lening, arts financiering, praktijk financiering, medisch centrum lening, huisarts financiering',
        'heroTitle': 'Financiering voor medische praktijken',
        'heroSubtitle': 'Speciaal voor artsen en medische praktijken. Snel geregeld, zonder gedoe.',
        'quote': 'Als arts of medisch specialist investeer je in kwaliteit. Wij helpen je met flexibele financiering voor je praktijk, apparatuur en uitbreiding.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. We begrijpen de zorgsector en helpen je snel op weg.\n\nOns proces is speciaal ontwikkeld voor medische praktijken. We werken graag samen met artsen en medisch specialisten en helpen je snel aan de slag.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Medische Apparatuur',
                'description': 'Investeer in moderne medische apparatuur. Van röntgenapparaten tot behandelstoelen.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Praktijkverbouwing',
                'description': 'Financier verbouwingen en renovaties voor je praktijk. Maak je praktijk klaar voor de toekomst.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'IT & Software',
                'description': 'Investeer in moderne praktijksoftware en IT-systemen. Blijf bij met de laatste ontwikkelingen.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Uitbreiding',
                'description': 'Open een tweede praktijk of breid uit met nieuwe specialisaties. Groei je praktijk met flexibele financiering.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen maanden wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Zorg-specialisten',
                'description': 'We begrijpen de zorgsector en werken graag samen met medische praktijken.',
                'iconPath': '/icons/SVG/health/stethoscope.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je praktijkomzet. Meer aflossen wanneer het goed gaat.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'tandarts': {
        'name': 'Tandartspraktijken',
        'metaDescription': 'Zakelijke financiering voor tandartspraktijken. Investeer in apparatuur en verbouwingen. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'tandartspraktijk lening, tandarts financiering, tandarts krediet, tandartspraktijk krediet, tandheelkunde financiering',
        'heroTitle': 'Financiering voor tandartspraktijken',
        'heroSubtitle': 'Speciaal voor tandartsen en tandheelkundige praktijken. Snel geregeld, zonder gedoe.',
        'quote': 'Als tandarts investeer je in moderne apparatuur en een comfortabele praktijk. Wij helpen je met flexibele financiering die past bij jouw praktijk.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. We begrijpen de tandheelkundige sector en helpen je snel op weg.\n\nOns proces is speciaal ontwikkeld voor tandartspraktijken. We werken graag samen met tandartsen en helpen je snel aan de slag.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Tandheelkundige Apparatuur',
                'description': 'Investeer in moderne tandheelkundige apparatuur. Van behandelstoelen tot röntgenapparaten.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Praktijkverbouwing',
                'description': 'Financier verbouwingen en renovaties voor je praktijk. Maak je praktijk klaar voor de toekomst.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'IT & Software',
                'description': 'Investeer in moderne praktijksoftware en IT-systemen. Blijf bij met de laatste ontwikkelingen.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Uitbreiding',
                'description': 'Open een tweede praktijk of breid uit met nieuwe specialisaties. Groei je praktijk met flexibele financiering.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen maanden wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Tandheelkunde-specialisten',
                'description': 'We begrijpen de tandheelkundige sector en werken graag samen met tandartspraktijken.',
                'iconPath': '/icons/SVG/health/stethoscope.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je praktijkomzet. Meer aflossen wanneer het goed gaat.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'groothandel': {
        'name': 'Groothandel',
        'metaDescription': 'Financiering voor groothandels en distributiebedrijven. Werkkapitaal voor voorraad en groei. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'groothandel financiering, groothandel lening, wholesale financiering, distributie financiering, groothandel krediet',
        'heroTitle': 'Financiering voor groothandels',
        'heroSubtitle': 'Werkkapitaal voor voorraad en groei. Snel geregeld, flexibel aflossen.',
        'quote': 'Als groothandel heb je werkkapitaal nodig voor voorraad en groei. Wij helpen je met flexibele financiering die meegroeit met je bedrijf.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. We begrijpen de groothandel en helpen je snel op weg.\n\nOns proces is speciaal ontwikkeld voor groothandels. We werken graag samen met distributiebedrijven en helpen je snel aan de slag.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Voorraadfinanciering',
                'description': 'Financier je voorraad en investeer in nieuwe producten. Houd voldoende voorraad zonder zorgen.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Werkkapitaal',
                'description': 'Overbrug betalingsachterstanden en investeer in groei. Flexibel werkkapitaal voor je groothandel.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Magazijn & Logistiek',
                'description': 'Investeer in magazijnruimte en logistieke oplossingen. Groei je distributie met flexibele financiering.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Uitbreiding',
                'description': 'Open een tweede magazijn of breid uit met nieuwe productlijnen. Groei je groothandel met flexibele financiering.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen maanden wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Groothandel-specialisten',
                'description': 'We begrijpen de groothandel en werken graag samen met distributiebedrijven.',
                'iconPath': '/icons/SVG/e-commerce/shop.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je omzet. Meer aflossen wanneer het goed gaat.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'schoonheid': {
        'name': 'Schoonheidsindustrie',
        'metaDescription': 'Zakelijke financiering voor kappers, schoonheidssalons en wellnesscentra. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'kapper lening, schoonheidssalon financiering, schoonheidsindustrie lening, kapperszaak financiering, beauty salon lening',
        'heroTitle': 'Financiering voor schoonheidsindustrie',
        'heroSubtitle': 'Speciaal voor kappers, schoonheidssalons en wellnesscentra. Snel geregeld, zonder gedoe.',
        'quote': 'Als kapper of schoonheidsspecialist investeer je in kwaliteit en sfeer. Wij helpen je met flexibele financiering voor je salon, apparatuur en uitbreiding.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. We begrijpen de schoonheidsindustrie en helpen je snel op weg.\n\nOns proces is speciaal ontwikkeld voor kappers en schoonheidssalons. We werken graag samen met beauty professionals en helpen je snel aan de slag.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Saloninrichting',
                'description': 'Investeer in moderne saloninrichting. Van kappersstoelen tot behandelstoelen, van wasbakken tot spiegels.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Apparatuur & Tools',
                'description': 'Financier professionele apparatuur en tools. Van droogkappen tot stoomapparaten, van producten tot gereedschap.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Verbouwing & Renovatie',
                'description': 'Financier verbouwingen en renovaties voor je salon. Maak je salon klaar voor de toekomst.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Uitbreiding',
                'description': 'Open een tweede salon of breid uit met nieuwe behandelingen. Groei je salon met flexibele financiering.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen maanden wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Beauty-specialisten',
                'description': 'We begrijpen de schoonheidsindustrie en werken graag samen met kappers en salons.',
                'iconPath': '/icons/SVG/interface/magic-wand.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Flexibel aflossen',
                'description': 'Pas je aflossingen aan op je salonomzet. Meer aflossen wanneer het goed gaat.',
                'iconPath': '/icons/SVG/interface/clock.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    },
    'kasstroom': {
        'name': 'Kasstroom & Werkkapitaal',
        'metaDescription': 'Werkkapitaalfinanciering voor bedrijven. Overbrug betalingsachterstanden en investeer in groei. Snel geregeld binnen 24 uur.',
        'metaKeywords': 'kasstroom lening, werkkapitaal financiering, liquiditeitsfinanciering, werkkapitaal krediet, cashflow financiering',
        'heroTitle': 'Werkkapitaalfinanciering voor bedrijven',
        'heroSubtitle': 'Overbrug betalingsachterstanden en investeer in groei. Snel geregeld, flexibel aflossen.',
        'quote': 'Werkkapitaal is de levensader van je bedrijf. Wij helpen je met flexibele financiering die je cashflow ondersteunt en ruimte geeft voor groei.',
        'easyLendingTitle': 'Zo eenvoudig is het om financiering te krijgen',
        'easyLendingContent': 'Binnen 24 uur weet je of je in aanmerking komt. We begrijpen de uitdagingen van werkkapitaal en helpen je snel op weg.\n\nOns proces is speciaal ontwikkeld voor bedrijven die snel werkkapitaal nodig hebben. We werken graag samen met bedrijven die willen groeien.',
        'easyLendingImagePosition': 'left',
        'useCases': [
            {
                'title': 'Betalingsachterstanden',
                'description': 'Overbrug betalingsachterstanden en houd je cashflow gezond. Flexibel werkkapitaal wanneer je het nodig hebt.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Vraag offerte aan',
                'buttonHref': '/lead'
            },
            {
                'title': 'Seizoensgebonden pieken',
                'description': 'Financier seizoensgebonden pieken in je omzet. Overbrug rustige periodes met flexibel werkkapitaal.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Meer informatie',
                'buttonHref': '/lead'
            },
            {
                'title': 'Groei & Investering',
                'description': 'Investeer in groei zonder je cashflow te belasten. Flexibel werkkapitaal voor nieuwe projecten.',
                'color': '#fff2b2',
                'textColor': '#1e2021',
                'buttonLabel': 'Bekijk mogelijkheden',
                'buttonHref': '/lead'
            },
            {
                'title': 'Voorraad & Inventaris',
                'description': 'Financier je voorraad en inventaris zonder zorgen. Houd voldoende voorraad zonder cashflowproblemen.',
                'color': '#e4f2ff',
                'textColor': '#0f1720',
                'buttonLabel': 'Vraag financiering aan',
                'buttonHref': '/lead'
            }
        ],
        'benefits': [
            {
                'title': 'Snel geregeld',
                'description': 'Binnen 24 uur weet je of je financiering is goedgekeurd. Geen maanden wachten.',
                'iconPath': '/icons/SVG/interface/zap.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Flexibel werkkapitaal',
                'description': 'Neem op wanneer je het nodig hebt, los af wanneer het kan. Flexibel werkkapitaal op maat.',
                'iconPath': '/icons/SVG/finance/wallet.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            },
            {
                'title': 'Geen verborgen kosten',
                'description': 'Transparante voorwaarden en kosten. Geen verrassingen achteraf.',
                'iconPath': '/icons/SVG/interface/shield.svg',
                'color': '#fff2b2',
                'textColor': '#1e2021'
            },
            {
                'title': 'Cashflow-specialisten',
                'description': 'We begrijpen de uitdagingen van werkkapitaal en helpen je snel op weg.',
                'iconPath': '/icons/SVG/finance/trend-up.svg',
                'color': '#e4f2ff',
                'textColor': '#0f1720'
            }
        ]
    }
}

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
        pass
    return None

def create_or_update_sector_page(sector_slug: str, sector_data: dict):
    """Create or update a sector page"""
    existing = get_existing_sector_page(sector_slug)
    
    # Build page data structure
    page_data = {
        "data": {
            "siteId": SITE_ID,
            "sectorSlug": sector_slug,
            "sectorName": sector_data['name'],
            "metaDescription": sector_data['metaDescription'],
            "metaKeywords": sector_data['metaKeywords'],
            "heroTitle": sector_data['heroTitle'],
            "heroSubtitle": sector_data['heroSubtitle'],
            "quote": sector_data.get('quote', ''),
            "quoteAuthor": None,
            "easyLendingTitle": sector_data['easyLendingTitle'],
            "easyLendingContent": sector_data['easyLendingContent'],
            "easyLendingImagePosition": sector_data.get('easyLendingImagePosition', 'left'),
            "useCasesTitle": "Waarvoor kun je de financiering gebruiken?",
            "useCasesSubtitle": "Veelzijdige financieringsoplossingen speciaal voor jouw sector",
            "useCases": sector_data['useCases'],
            "benefitsTitle": "Waarom kiezen voor onze financiering?",
            "benefitsSubtitle": "Voordelen speciaal voor jouw sector",
            "benefits": sector_data['benefits'],
            "ctaTitle": "Klaar om te beginnen?",
            "ctaSubtitle": "Vraag binnen 2 minuten een vrijblijvend aanbod aan. Geen verplichtingen, geen gedoe.",
            "ctaLabel": "Vraag financiering aan",
            "ctaHref": "/lead"
        }
    }
    
    if existing:
        page_id = existing.get('id')
        if page_id:
            # Update existing page
            update_url = f"{STRAPI_URL}/api/sector-pages/{page_id}"
            try:
                print(f"  📤 Updating existing page...")
                update_response = requests.put(update_url, headers=HEADERS, json=page_data, timeout=30)
                if update_response.status_code == 200:
                    print(f"  ✅ Updated sector page: {sector_slug}")
                    return update_response.json()
                else:
                    print(f"  ⚠️ Update failed ({update_response.status_code}): {update_response.text[:200]}")
            except Exception as e:
                print(f"  ⚠️ Error updating: {e}")
    
    # Try creating via Content Manager API first
    admin_url = f"{STRAPI_URL}/api/content-manager/collection-types/api::sector-page.sector-page"
    try:
        admin_response = requests.post(admin_url, headers=HEADERS, json=page_data, timeout=30)
        if admin_response.status_code in [200, 201]:
            print(f"  ✅ Created sector page via Admin API: {sector_slug}")
            return admin_response.json()
    except Exception as e:
        pass
    
    # Create via Content API
    url = f"{STRAPI_URL}/api/sector-pages"
    try:
        response = requests.post(url, headers=HEADERS, json=page_data, timeout=30)
        if response.status_code in [200, 201]:
            print(f"  ✅ Created sector page: {sector_slug}")
            return response.json()
        else:
            print(f"  ❌ Failed to create ({response.status_code}): {response.text[:300]}")
    except Exception as e:
        print(f"  ❌ Error creating: {e}")
    
    return None

def main():
    """Main execution function"""
    print("=" * 80)
    print("🚀 POPULATING NEW SECTORS IN STRAPI")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Sectors to create: {len(NEW_SECTORS)}\n")
    
    success_count = 0
    failed_sectors = []
    
    for sector_slug, sector_data in NEW_SECTORS.items():
        print(f"\n📄 Processing sector: {sector_slug} ({sector_data['name']})")
        print("-" * 80)
        
        result = create_or_update_sector_page(sector_slug, sector_data)
        
        if result:
            success_count += 1
            print(f"✅ Successfully created/updated: {sector_slug}")
        else:
            failed_sectors.append(sector_slug)
            print(f"❌ Failed to create/update: {sector_slug}")
        
        # Small delay between requests
        time.sleep(1)
    
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    print(f"\n✅ Successfully created/updated: {success_count}/{len(NEW_SECTORS)} sectors")
    
    if failed_sectors:
        print(f"\n❌ Failed sectors: {', '.join(failed_sectors)}")
    else:
        print("\n🎉 All sectors created successfully!")
    
    print(f"\n🌐 View sectors at: /sectoren/[sector-slug]")
    print(f"📝 Edit in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::sector-page.sector-page")
    print("\n" + "=" * 80)

if __name__ == '__main__':
    main()
