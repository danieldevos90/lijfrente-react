#!/usr/bin/env python3
"""
Seed testimonials into Strapi CMS
"""

import requests
import os
import sys

# Strapi configuration
STRAPI_URL = os.getenv("STRAPI_URL", "http://localhost:1337")
STRAPI_TOKEN = os.getenv("STRAPI_TOKEN", "")

if not STRAPI_TOKEN:
    print("Error: STRAPI_TOKEN environment variable is required")
    sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json"
}

# Dutch testimonials for financial services
TESTIMONIALS = [
    {
        "name": "Pieter van der Berg",
        "company": "Bouwbedrijf Van der Berg",
        "text": "Dankzij deze financiering kon ik mijn bedrijf uitbreiden met nieuwe machines. De aanvraag was simpel en het geld stond snel op mijn rekening.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Sophie Jansen",
        "company": "Jansen Marketing",
        "text": "Ik was aangenaam verrast door de snelheid van het proces. Binnen 48 uur had ik de bevestiging en kon ik verder met mijn groeiplans.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Marco de Vries",
        "company": "De Vries Transport",
        "text": "Als transportbedrijf heb ik regelmatig behoefte aan extra kapitaal. Deze dienst biedt flexibiliteit en transparantie waar ik naar op zoek was.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Lisa Mulder",
        "company": "Mulder Bloemen",
        "text": "Voor mijn bloemenwinkel had ik financiering nodig voor de verbouwing. Alles werd goed uitgelegd en ik voelde me goed begeleid.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Jan Bakker",
        "company": "Bakkerij Bakker",
        "text": "Na 20 jaar in het vak wilde ik een tweede vestiging openen. Deze zakelijke lening maakte dat mogelijk. Top service!",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Emma Visser",
        "company": "Visser Webdesign",
        "text": "Als startende ondernemer was ik nerveus over financiering. Het proces was verrassend eenvoudig en het team was zeer behulpzaam.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Tom Hendrix",
        "company": "Hendrix Horeca",
        "text": "Voor de renovatie van mijn restaurant had ik snel geld nodig. De aanvraag duurde geen 10 minuten en binnen een week was alles geregeld.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Anna de Jong",
        "company": "De Jong Consultancy",
        "text": "Ik waardeer de transparantie en eerlijkheid. Geen verborgen kosten, duidelijke voorwaarden. Precies wat een ondernemer nodig heeft.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Robert Smit",
        "company": "Smit Elektrotechniek",
        "text": "Voor de aanschaf van nieuwe apparatuur was deze financiering perfect. Flexibele aflossing en correcte rente.",
        "rating": 4,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Sarah Koster",
        "company": "Koster Mode",
        "text": "Mijn kledingwinkel draait nu al drie jaar en deze financiering hielp me door een moeilijke periode. Dankbaar voor de snelle hulp.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Kevin Peters",
        "company": "Peters IT Solutions",
        "text": "Als IT-bedrijf moet je investeren in de nieuwste technologie. Deze lening gaf me de ruimte om te groeien zonder cashflow problemen.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Melissa Groot",
        "company": "Groot Kappers",
        "text": "Voor de uitbreiding van mijn kapsalon naar een tweede locatie was dit de ideale oplossing. Aanrader!",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Dennis Vermeulen",
        "company": "Vermeulen Autohandel",
        "text": "In de autobranche heb je soms snel kapitaal nodig voor voorraadinkooop. Dit platform begrijpt die urgentie en levert.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Laura Dijkstra",
        "company": "Dijkstra Fotografie",
        "text": "Als zelfstandig fotograaf wilde ik investeren in betere apparatuur. De aanvraag was laagdrempelig en het resultaat perfect.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Michael Boer",
        "company": "Boer Bouw",
        "text": "Voor een groot project had ik werkkapitaal nodig. Deze financiering kwam op het juiste moment en met faire voorwaarden.",
        "rating": 4,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Jessica Kramer",
        "company": "Kramer Yoga Studio",
        "text": "Mijn yogastudio kon eindelijk een groter pand betrekken dankzij deze lening. Het hele proces verliep soepel en professioneel.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Frank Willems",
        "company": "Willems Schilderwerken",
        "text": "Als schilder moet je soms voorfinancieren. Deze dienst geeft me de flexibiliteit die ik nodig heb om grotere projecten aan te nemen.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    },
    {
        "name": "Nicole van Dam",
        "company": "Van Dam Advocatuur",
        "text": "Voor de start van mijn praktijk was deze financiering essentieel. Goede begeleiding en realistische afspraken.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Paul de Wit",
        "company": "De Wit Catering",
        "text": "Mijn cateringbedrijf groeide sneller dan verwacht. Deze lening hielp me om mee te groeien met de vraag.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": False
    },
    {
        "name": "Miranda Scholten",
        "company": "Scholten Beauty",
        "text": "Voor mijn beautysalon wilde ik investeren in nieuwe behandelingen. Dankzij deze financiering kon ik snel schakelen.",
        "rating": 5,
        "siteId": "geldgeregeld",
        "featured": True
    }
]

def create_testimonial(testimonial_data):
    """Create a single testimonial in Strapi"""
    url = f"{STRAPI_URL}/api/testimonials"
    
    payload = {
        "data": testimonial_data
    }
    
    try:
        response = requests.post(url, json=payload, headers=HEADERS)
        response.raise_for_status()
        
        data = response.json()
        testimonial = data.get("data", {})
        attrs = testimonial.get("attributes", {})
        
        print(f"✓ Created testimonial: {attrs.get('name')} - {attrs.get('company')}")
        return testimonial
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error creating testimonial {testimonial_data['name']}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"  Response: {e.response.text}")
        return None

def main():
    """Main function to seed all testimonials"""
    print(f"Connecting to Strapi at {STRAPI_URL}...")
    print(f"Creating {len(TESTIMONIALS)} testimonials...\n")
    
    created = 0
    failed = 0
    
    for testimonial_data in TESTIMONIALS:
        result = create_testimonial(testimonial_data)
        if result:
            created += 1
        else:
            failed += 1
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Created: {created}")
    print(f"  Failed:  {failed}")
    print(f"  Total:   {len(TESTIMONIALS)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()



