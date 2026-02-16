#!/usr/bin/env python3
"""
Populate Strapi CMS with sector-specific testimonials
CLI script to add Dutch, SEO-optimized testimonials for each sector
"""

import os
import requests
import json
import time
import sys
from typing import Dict, List, Any

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')

if not STRAPI_TOKEN:
    print("❌ Missing STRAPI_TOKEN (or STRAPI_API_TOKEN). Refusing to run without an explicit token.", file=sys.stderr)
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

# Sector-specific testimonials in Dutch
SECTOR_TESTIMONIALS = {
    'horeca': [
        {
            'name': 'Sarah van der Berg',
            'role': 'Eigenaar',
            'company': 'Café de Hoek',
            'text': 'Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte. Perfect voor de horeca!',
            'rating': 5,
            'sector': 'horeca'
        },
        {
            'name': 'Pieter Bakker',
            'role': 'Restaurant Manager',
            'company': 'Restaurant De Gouden Leeuw',
            'text': 'We hebben onze keukenapparatuur kunnen upgraden zonder grote voorinvestering. De flexibele aflossing past perfect bij onze seizoensgebonden inkomsten.',
            'rating': 5,
            'sector': 'horeca'
        },
        {
            'name': 'Marieke de Vries',
            'role': 'Eigenaar',
            'company': 'Hotel Amstelzicht',
            'text': 'Voor onze hotelrenovatie hadden we snel financiering nodig. GeldGeregeld begrijpt de horecasector en bood een oplossing op maat. Zeer tevreden!',
            'rating': 5,
            'sector': 'horeca'
        }
    ],
    'retail': [
        {
            'name': 'Jan Smit',
            'role': 'Eigenaar',
            'company': 'Modezaak De Stijl',
            'text': 'Onze nieuwe voorraad kon ik direct financieren zonder zorgen. De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn retailbedrijf.',
            'rating': 5,
            'sector': 'retail'
        },
        {
            'name': 'Lisa Vermeulen',
            'role': 'Oprichter',
            'company': 'Webshop Groen',
            'text': 'Als webshop eigenaar had ik flexibele financiering nodig voor groei. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
            'rating': 5,
            'sector': 'retail'
        },
        {
            'name': 'Tom de Wit',
            'role': 'Directeur',
            'company': 'Retail Group BV',
            'text': 'Voor de uitbreiding van onze winkelketen was financiering essentieel. GeldGeregeld begrijpt retail en bood een oplossing die perfect aansloot bij onze behoeften.',
            'rating': 5,
            'sector': 'retail'
        }
    ],
    'transport': [
        {
            'name': 'Mark Jansen',
            'role': 'Directeur',
            'company': 'Transport BV',
            'text': 'Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als transportbedrijf nodig hebben voor onze nieuwe vrachtwagen.',
            'rating': 5,
            'sector': 'transport'
        },
        {
            'name': 'Henk van Dijk',
            'role': 'Eigenaar',
            'company': 'Van Dijk Logistiek',
            'text': 'Voor onze vlootuitbreiding hadden we snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor de transportsector!',
            'rating': 5,
            'sector': 'transport'
        },
        {
            'name': 'Rob Peters',
            'role': 'Operations Manager',
            'company': 'Peters Transport & Logistiek',
            'text': 'De flexibele aflossing past perfect bij onze wisselende inkomsten. GeldGeregeld begrijpt de uitdagingen van transportbedrijven.',
            'rating': 5,
            'sector': 'transport'
        }
    ],
    'bouw': [
        {
            'name': 'Johan Peters',
            'role': 'CEO',
            'company': 'Bouwbedrijf Solid',
            'text': 'Voor onze nieuwe bouwprojecten hadden we betrouwbare financiering nodig. GeldGeregeld bood een oplossing die perfect aansloot bij onze cashflow.',
            'rating': 5,
            'sector': 'bouw'
        },
        {
            'name': 'Dirk van der Berg',
            'role': 'Eigenaar',
            'company': 'Van der Berg Installaties',
            'text': 'Als installateur heb ik regelmatig financiering nodig voor nieuwe apparatuur. GeldGeregeld maakt het proces eenvoudig en snel.',
            'rating': 5,
            'sector': 'bouw'
        },
        {
            'name': 'Frank de Boer',
            'role': 'Directeur',
            'company': 'De Boer Bouw & Renovatie',
            'text': 'Voor onze verbouwingsprojecten is flexibele financiering cruciaal. GeldGeregeld biedt precies wat we nodig hebben: snel, transparant en betrouwbaar.',
            'rating': 5,
            'sector': 'bouw'
        }
    ],
    'ecommerce': [
        {
            'name': 'Emma van den Berg',
            'role': 'Oprichter',
            'company': 'E-commerce Store NL',
            'text': 'Voor de groei van mijn webshop had ik snel financiering nodig. GeldGeregeld begrijpt e-commerce en bood een oplossing die perfect aansloot bij mijn behoeften.',
            'rating': 5,
            'sector': 'ecommerce'
        },
        {
            'name': 'Lucas Meijer',
            'role': 'CEO',
            'company': 'Online Retail Solutions',
            'text': 'De snelle goedkeuring en flexibele voorwaarden maakten het verschil voor mijn online onderneming. GeldGeregeld is echt gespecialiseerd in e-commerce.',
            'rating': 5,
            'sector': 'ecommerce'
        },
        {
            'name': 'Sophie de Vries',
            'role': 'Eigenaar',
            'company': 'Webshop Fashion Forward',
            'text': 'Voor mijn webshop had ik financiering nodig voor voorraad en marketing. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
            'rating': 5,
            'sector': 'ecommerce'
        }
    ],
    'zorg': [
        {
            'name': 'Dr. Anna van der Meer',
            'role': 'Directeur',
            'company': 'Zorginstelling De Zorgvlied',
            'text': 'Voor onze zorginstelling was betrouwbare financiering essentieel. GeldGeregeld begrijpt de zorgsector en bood een oplossing op maat.',
            'rating': 5,
            'sector': 'zorg'
        },
        {
            'name': 'Peter van Houten',
            'role': 'Manager',
            'company': 'Welzijnsorganisatie Thuiszorg Plus',
            'text': 'De flexibele aflossing past perfect bij onze budgetcyclus. GeldGeregeld maakte het financieringsproces eenvoudig en transparant.',
            'rating': 5,
            'sector': 'zorg'
        },
        {
            'name': 'Maria Jansen',
            'role': 'Eigenaar',
            'company': 'Fysiotherapie Praktijk Jansen',
            'text': 'Voor de uitbreiding van mijn praktijk had ik snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor zorgondernemers!',
            'rating': 5,
            'sector': 'zorg'
        }
    ],
    'consultants': [
        {
            'name': 'Robert de Wit',
            'role': 'Partner',
            'company': 'Adviesbureau De Wit & Partners',
            'text': 'Als consultancy hebben we regelmatig financiering nodig voor projecten. GeldGeregeld biedt flexibele oplossingen die perfect aansluiten bij onze behoeften.',
            'rating': 5,
            'sector': 'consultants'
        },
        {
            'name': 'Laura Bakker',
            'role': 'Eigenaar',
            'company': 'Bakker Consultancy',
            'text': 'Voor mijn adviesbureau had ik financiering nodig voor groei. GeldGeregeld begrijpt consultancy en bood een oplossing die perfect aansloot bij mijn situatie.',
            'rating': 5,
            'sector': 'consultants'
        },
        {
            'name': 'Martijn Smit',
            'role': 'Directeur',
            'company': 'Smit Strategisch Advies',
            'text': 'De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn adviesbureau. GeldGeregeld is echt gespecialiseerd in consultancy.',
            'rating': 5,
            'sector': 'consultants'
        }
    ],
    'schoonmaak': [
        {
            'name': 'Karin van der Berg',
            'role': 'Eigenaar',
            'company': 'Schoonmaakbedrijf Sparkle',
            'text': 'Voor nieuwe schoonmaakapparatuur had ik snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor schoonmaakbedrijven!',
            'rating': 5,
            'sector': 'schoonmaak'
        },
        {
            'name': 'Hans de Vries',
            'role': 'Directeur',
            'company': 'De Vries Schoonmaak Services',
            'text': 'De flexibele aflossing past perfect bij onze wisselende inkomsten. GeldGeregeld begrijpt de schoonmaaksector en bood een oplossing op maat.',
            'rating': 5,
            'sector': 'schoonmaak'
        },
        {
            'name': 'Ingrid Meijer',
            'role': 'Manager',
            'company': 'Meijer Schoonmaak & Onderhoud',
            'text': 'Voor de uitbreiding van mijn schoonmaakbedrijf was financiering essentieel. GeldGeregeld maakte het proces eenvoudig en snel.',
            'rating': 5,
            'sector': 'schoonmaak'
        }
    ],
    'automotive': [
        {
            'name': 'Willem van Dijk',
            'role': 'Eigenaar',
            'company': 'Garage Van Dijk',
            'text': 'Voor nieuwe garageapparatuur had ik snel financiering nodig. GeldGeregeld begrijpt automotive en bood een oplossing die perfect aansloot bij mijn behoeften.',
            'rating': 5,
            'sector': 'automotive'
        },
        {
            'name': 'Ronald Peters',
            'role': 'Directeur',
            'company': 'Peters Auto Service',
            'text': 'De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn autobedrijf. GeldGeregeld is echt gespecialiseerd in automotive.',
            'rating': 5,
            'sector': 'automotive'
        },
        {
            'name': 'Erik de Boer',
            'role': 'Eigenaar',
            'company': 'De Boer Car Service',
            'text': 'Voor de uitbreiding van mijn garage had ik financiering nodig. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
            'rating': 5,
            'sector': 'automotive'
        }
    ],
    'productie': [
        {
            'name': 'Jan van der Meer',
            'role': 'CEO',
            'company': 'Productiebedrijf Van der Meer',
            'text': 'Voor nieuwe productiemachines had ik snel financiering nodig. GeldGeregeld leverde binnen 24 uur een aanbod. Perfect voor productiebedrijven!',
            'rating': 5,
            'sector': 'productie'
        },
        {
            'name': 'Paul Jansen',
            'role': 'Directeur',
            'company': 'Jansen Industriële Productie',
            'text': 'De flexibele aflossing past perfect bij onze productiecyclus. GeldGeregeld begrijpt de industrie en bood een oplossing op maat.',
            'rating': 5,
            'sector': 'productie'
        },
        {
            'name': 'Gerard Smit',
            'role': 'Operations Manager',
            'company': 'Smit Manufacturing BV',
            'text': 'Voor onze productieuitbreiding was financiering essentieel. GeldGeregeld maakte het proces eenvoudig en snel. Zeer tevreden!',
            'rating': 5,
            'sector': 'productie'
        }
    ],
    'zzp': [
        {
            'name': 'Daan van der Laan',
            'role': 'ZZP\'er',
            'company': 'Van der Laan Marketing',
            'text': 'Als ZZP\'er had ik flexibele financiering nodig voor mijn nieuwe laptop en kantoorinrichting. GeldGeregeld begrijpt de behoeften van zelfstandigen zonder personeel.',
            'rating': 5,
            'sector': 'zzp'
        },
        {
            'name': 'Femke de Jong',
            'role': 'Freelance Consultant',
            'company': 'De Jong Advies',
            'text': 'Voor mijn ZZP-bedrijf was snel financiering belangrijk. GeldGeregeld bood een oplossing zonder ingewikkelde voorwaarden. Perfect voor zelfstandigen!',
            'rating': 5,
            'sector': 'zzp'
        },
        {
            'name': 'Bas Smit',
            'role': 'Zelfstandig Professional',
            'company': 'Smit IT Services',
            'text': 'De flexibele aflossing past perfect bij mijn wisselende inkomsten als ZZP\'er. GeldGeregeld maakt financiering toegankelijk voor zelfstandigen.',
            'rating': 5,
            'sector': 'zzp'
        }
    ],
    'starters': [
        {
            'name': 'Thijs Bakker',
            'role': 'Oprichter',
            'company': 'Bakker Startups',
            'text': 'Als startende ondernemer had ik financiering nodig zonder jarenlange historie. GeldGeregeld bood precies wat ik zocht: snel en zonder gedoe.',
            'rating': 5,
            'sector': 'starters'
        },
        {
            'name': 'Lotte van den Berg',
            'role': 'Startup Founder',
            'company': 'Van den Berg Innovations',
            'text': 'Voor mijn startup was betrouwbare financiering essentieel. GeldGeregeld begrijpt starters en bood een oplossing die perfect aansloot bij mijn situatie.',
            'rating': 5,
            'sector': 'starters'
        },
        {
            'name': 'Ruben de Vries',
            'role': 'Oprichter',
            'company': 'De Vries Tech Solutions',
            'text': 'De snelle goedkeuring maakte het verschil voor mijn nieuwe onderneming. GeldGeregeld is echt gespecialiseerd in startersfinanciering.',
            'rating': 5,
            'sector': 'starters'
        }
    ],
    'franchise': [
        {
            'name': 'Miranda Jansen',
            'role': 'Franchisenemer',
            'company': 'Jansen Franchise Group',
            'text': 'Voor mijn franchise had ik snel financiering nodig. GeldGeregeld begrijpt franchising en bood een oplossing die perfect aansloot bij mijn behoeften.',
            'rating': 5,
            'sector': 'franchise'
        },
        {
            'name': 'Kevin Peters',
            'role': 'Franchise Eigenaar',
            'company': 'Peters Franchise BV',
            'text': 'De flexibele voorwaarden maakten het verschil voor mijn franchise-onderneming. GeldGeregeld is echt gespecialiseerd in franchise financiering.',
            'rating': 5,
            'sector': 'franchise'
        },
        {
            'name': 'Nina van Dijk',
            'role': 'Franchisenemer',
            'company': 'Van Dijk Franchise Services',
            'text': 'Voor de uitbreiding van mijn franchise had ik financiering nodig. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
            'rating': 5,
            'sector': 'franchise'
        }
    ],
    'medisch': [
        {
            'name': 'Dr. Thomas van der Meer',
            'role': 'Huisarts',
            'company': 'Huisartsenpraktijk Van der Meer',
            'text': 'Voor nieuwe medische apparatuur had ik snel financiering nodig. GeldGeregeld begrijpt medische praktijken en bood een oplossing op maat.',
            'rating': 5,
            'sector': 'medisch'
        },
        {
            'name': 'Dr. Eva Bakker',
            'role': 'Specialist',
            'company': 'Medisch Centrum Bakker',
            'text': 'De snelle goedkeuring en transparante voorwaarden maakten het verschil voor mijn praktijk. GeldGeregeld is echt gespecialiseerd in medische financiering.',
            'rating': 5,
            'sector': 'medisch'
        },
        {
            'name': 'Dr. Maarten Smit',
            'role': 'Arts',
            'company': 'Smit Medische Praktijk',
            'text': 'Voor de uitbreiding van mijn praktijk had ik financiering nodig. GeldGeregeld bood precies wat ik zocht: snel, transparant en betrouwbaar.',
            'rating': 5,
            'sector': 'medisch'
        }
    ],
    'tandarts': [
        {
            'name': 'Dr. Lisa van der Berg',
            'role': 'Tandarts',
            'company': 'Tandartspraktijk Van der Berg',
            'text': 'Voor nieuwe tandheelkundige apparatuur had ik snel financiering nodig. GeldGeregeld begrijpt tandartspraktijken en bood een oplossing die perfect aansloot.',
            'rating': 5,
            'sector': 'tandarts'
        },
        {
            'name': 'Dr. Jeroen de Vries',
            'role': 'Tandarts',
            'company': 'De Vries Tandheelkunde',
            'text': 'De flexibele aflossing past perfect bij onze praktijk. GeldGeregeld maakte het financieringsproces eenvoudig en snel voor tandartsen.',
            'rating': 5,
            'sector': 'tandarts'
        },
        {
            'name': 'Dr. Sanne Meijer',
            'role': 'Tandarts',
            'company': 'Meijer Tandartspraktijk',
            'text': 'Voor de verbouwing van mijn praktijk was financiering essentieel. GeldGeregeld bood een oplossing die perfect aansloot bij mijn behoeften.',
            'rating': 5,
            'sector': 'tandarts'
        }
    ],
    'groothandel': [
        {
            'name': 'Martijn van Houten',
            'role': 'Directeur',
            'company': 'Van Houten Groothandel BV',
            'text': 'Voor onze voorraadfinanciering hadden we snel kapitaal nodig. GeldGeregeld begrijpt groothandel en bood een oplossing die perfect aansloot bij onze behoeften.',
            'rating': 5,
            'sector': 'groothandel'
        },
        {
            'name': 'Saskia de Wit',
            'role': 'Eigenaar',
            'company': 'De Wit Distributie',
            'text': 'De snelle goedkeuring maakte het verschil voor onze groothandel. GeldGeregeld is echt gespecialiseerd in wholesale financiering.',
            'rating': 5,
            'sector': 'groothandel'
        },
        {
            'name': 'Rick Jansen',
            'role': 'Operations Manager',
            'company': 'Jansen Groothandel & Distributie',
            'text': 'Voor onze distributie-uitbreiding was financiering essentieel. GeldGeregeld bood precies wat we nodig hadden: snel, flexibel en transparant.',
            'rating': 5,
            'sector': 'groothandel'
        }
    ],
    'schoonheid': [
        {
            'name': 'Sanne van der Laan',
            'role': 'Eigenaar',
            'company': 'Schoonheidssalon Van der Laan',
            'text': 'Voor nieuwe schoonheidsapparatuur had ik snel financiering nodig. GeldGeregeld begrijpt de schoonheidsindustrie en bood een oplossing op maat.',
            'rating': 5,
            'sector': 'schoonheid'
        },
        {
            'name': 'Fleur Bakker',
            'role': 'Kapper',
            'company': 'Kapperszaak Bakker',
            'text': 'De flexibele aflossing past perfect bij mijn kapperszaak. GeldGeregeld maakte het financieringsproces eenvoudig en snel.',
            'rating': 5,
            'sector': 'schoonheid'
        },
        {
            'name': 'Iris de Jong',
            'role': 'Eigenaar',
            'company': 'De Jong Wellness & Beauty',
            'text': 'Voor de uitbreiding van mijn schoonheidssalon was financiering essentieel. GeldGeregeld bood precies wat ik zocht: snel, transparant en zonder gedoe.',
            'rating': 5,
            'sector': 'schoonheid'
        }
    ],
    'kasstroom': [
        {
            'name': 'Dennis van der Berg',
            'role': 'CFO',
            'company': 'Van der Berg Bedrijven',
            'text': 'Voor ons werkkapitaal hadden we snel financiering nodig. GeldGeregeld begrijpt cashflow management en bood een oplossing die perfect aansloot.',
            'rating': 5,
            'sector': 'kasstroom'
        },
        {
            'name': 'Marco Smit',
            'role': 'Financieel Manager',
            'company': 'Smit Business Solutions',
            'text': 'De snelle goedkeuring maakte het verschil voor onze liquiditeitsfinanciering. GeldGeregeld is echt gespecialiseerd in werkkapitaal.',
            'rating': 5,
            'sector': 'kasstroom'
        },
        {
            'name': 'Patricia de Vries',
            'role': 'Directeur',
            'company': 'De Vries Finance BV',
            'text': 'Voor het overbruggen van betalingsachterstanden was financiering essentieel. GeldGeregeld bood precies wat we nodig hadden: snel, flexibel en betrouwbaar.',
            'rating': 5,
            'sector': 'kasstroom'
        }
    ]
}


def create_testimonial(testimonial_data: Dict[str, Any]) -> bool:
    """Create a single testimonial in Strapi"""
    url = f"{STRAPI_URL}/api/testimonials"
    
    payload = {
        "data": {
            "siteId": SITE_ID,
            "name": testimonial_data['name'],
            "company": testimonial_data['company'],
            "role": testimonial_data.get('role', ''),
            "text": testimonial_data['text'],
            "rating": testimonial_data.get('rating', 5),
            "sector": testimonial_data['sector'],
            "featured": False
        }
    }
    
    try:
        response = requests.post(url, headers=HEADERS, json=payload, timeout=10)
        
        if response.status_code in [200, 201]:
            data = response.json()
            testimonial = data.get("data", {})
            attrs = testimonial.get("attributes", {})
            print(f"  ✅ Created: {attrs.get('name')} - {attrs.get('company')} ({attrs.get('sector')})")
            return True
        else:
            print(f"  ✗ Error creating {testimonial_data['name']}: {response.status_code} - {response.text[:200]}")
            return False
    except Exception as e:
        print(f"  ✗ Error creating {testimonial_data['name']}: {e}")
        return False


def delete_existing_testimonials(sector: str = None):
    """Delete existing testimonials, optionally filtered by sector"""
    url = f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}"
    if sector:
        url += f"&filters[sector][$eq]={sector}"
    url += "&pagination[limit]=100"
    
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            testimonials = data.get('data', [])
            if testimonials:
                print(f"\n🗑️  Found {len(testimonials)} existing testimonials, deleting...")
                for testimonial in testimonials:
                    testimonial_id = testimonial.get('id')
                    if testimonial_id:
                        try:
                            delete_url = f"{STRAPI_URL}/api/testimonials/{testimonial_id}"
                            delete_response = requests.delete(delete_url, headers=HEADERS, timeout=5)
                            if delete_response.status_code in [200, 204]:
                                attrs = testimonial.get('attributes', {})
                                name = attrs.get('name', 'Unknown')
                                print(f"  ✅ Deleted: {name}")
                            time.sleep(0.2)
                        except Exception as e:
                            print(f"  ⚠️  Could not delete testimonial {testimonial_id}: {e}")
                print("✅ Finished deleting existing testimonials\n")
                time.sleep(2)
    except Exception as e:
        print(f"⚠️  Error fetching testimonials to delete: {e}\n")


def populate_all_testimonials(delete_existing: bool = False):
    """Populate all sector-specific testimonials"""
    total_testimonials = sum(len(testimonials) for testimonials in SECTOR_TESTIMONIALS.values())
    
    print(f"\n{'='*60}")
    print(f"🚀 Populating Sector-Specific Testimonials")
    print(f"{'='*60}")
    print(f"Site ID: {SITE_ID}")
    print(f"Strapi URL: {STRAPI_URL}")
    print(f"Total testimonials: {total_testimonials}")
    print(f"Sectors: {len(SECTOR_TESTIMONIALS)}")
    print(f"{'='*60}\n")
    
    if delete_existing:
        delete_existing_testimonials()
    
    created_count = 0
    failed_count = 0
    
    for sector, testimonials in SECTOR_TESTIMONIALS.items():
        print(f"\n📝 Processing sector: {sector.upper()}")
        print(f"   Testimonials: {len(testimonials)}")
        
        for testimonial in testimonials:
            if create_testimonial(testimonial):
                created_count += 1
            else:
                failed_count += 1
            time.sleep(0.3)  # Small delay between requests
    
    print(f"\n{'='*60}")
    print(f"✅ COMPLETED")
    print(f"{'='*60}")
    print(f"Created: {created_count}")
    print(f"Failed: {failed_count}")
    print(f"Total: {created_count + failed_count}")
    print(f"{'='*60}\n")


def populate_sector_testimonials(sector: str, delete_existing: bool = False):
    """Populate testimonials for a specific sector"""
    if sector not in SECTOR_TESTIMONIALS:
        print(f"❌ Error: Sector '{sector}' not found")
        print(f"Available sectors: {', '.join(SECTOR_TESTIMONIALS.keys())}")
        return
    
    testimonials = SECTOR_TESTIMONIALS[sector]
    
    print(f"\n{'='*60}")
    print(f"🚀 Populating Testimonials for Sector: {sector.upper()}")
    print(f"{'='*60}")
    print(f"Site ID: {SITE_ID}")
    print(f"Testimonials: {len(testimonials)}")
    print(f"{'='*60}\n")
    
    if delete_existing:
        delete_existing_testimonials(sector)
    
    created_count = 0
    failed_count = 0
    
    for testimonial in testimonials:
        if create_testimonial(testimonial):
            created_count += 1
        else:
            failed_count += 1
        time.sleep(0.3)
    
    print(f"\n{'='*60}")
    print(f"✅ COMPLETED")
    print(f"{'='*60}")
    print(f"Created: {created_count}")
    print(f"Failed: {failed_count}")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--delete-all':
            delete_existing_testimonials()
            populate_all_testimonials(delete_existing=False)
        elif sys.argv[1] == '--sector' and len(sys.argv) > 2:
            sector = sys.argv[2]
            delete_existing = '--delete' in sys.argv
            populate_sector_testimonials(sector, delete_existing=delete_existing)
        elif sys.argv[1] == '--list':
            print("\n📋 Available sectors:")
            for sector in sorted(SECTOR_TESTIMONIALS.keys()):
                count = len(SECTOR_TESTIMONIALS[sector])
                print(f"  • {sector}: {count} testimonials")
            print()
        else:
            print("\nUsage:")
            print("  python populate_sector_testimonials.py                    # Populate all testimonials")
            print("  python populate_sector_testimonials.py --delete-all       # Delete all and populate")
            print("  python populate_sector_testimonials.py --sector <sector>  # Populate specific sector")
            print("  python populate_sector_testimonials.py --sector <sector> --delete  # Delete sector testimonials first")
            print("  python populate_sector_testimonials.py --list             # List all sectors")
            print("\nExample:")
            print("  python populate_sector_testimonials.py --sector horeca")
            print("  python populate_sector_testimonials.py --sector zzp --delete")
    else:
        populate_all_testimonials(delete_existing=False)
