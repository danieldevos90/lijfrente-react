#!/usr/bin/env python3
"""
Update all testimonial roles/titles to general titles instead of company names
Example: "Café de Hoek" -> "Barber" or "Shop owner"
"""

import requests
import os
import sys
from typing import Dict, List, Optional

# Strapi configuration
STRAPI_URL = os.getenv("STRAPI_URL", "https://bright-smile-1f47bc9d67.strapiapp.com")
# Try multiple token sources - use fallback token that works for updates
STRAPI_TOKEN = (os.getenv("STRAPI_TOKEN") or 
                os.getenv("STRAPI_API_TOKEN") or 
                'd99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad')

# If no token provided, try to read from .env.local
if not STRAPI_TOKEN or STRAPI_TOKEN == 'd99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad':
    try:
        env_path = os.path.join(os.path.dirname(__file__), "..", "frontend", ".env.local")
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith("STRAPI_API_TOKEN="):
                        token = line.split("=", 1)[1].strip()
                        if token:  # Only use if not empty
                            STRAPI_TOKEN = token
                            break
                    elif line.startswith("STRAPI_TOKEN="):
                        token = line.split("=", 1)[1].strip()
                        if token:  # Only use if not empty
                            STRAPI_TOKEN = token
                            break
    except Exception as e:
        print(f"Warning: Could not read token from .env.local: {e}")

if not STRAPI_TOKEN:
    print("❌ ERROR: No STRAPI_TOKEN found. Updates will fail.")
    print("   Set STRAPI_TOKEN or STRAPI_API_TOKEN environment variable")
    print("   Or add it to frontend/.env.local")
    sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {STRAPI_TOKEN}" if STRAPI_TOKEN else "",
    "Content-Type": "application/json"
}

# Mapping of company names/types to general roles
# This is a fallback - we'll try to infer from company name
COMPANY_TO_ROLE_MAPPING = {
    # Horeca
    "café": "Café eigenaar",
    "restaurant": "Restaurant eigenaar",
    "bar": "Bar eigenaar",
    "hotel": "Hotel eigenaar",
    "horeca": "Horeca ondernemer",
    
    # Retail
    "shop": "Winkelier",
    "winkel": "Winkelier",
    "retail": "Winkelier",
    "webshop": "Webshop eigenaar",
    "online": "Webshop eigenaar",
    
    # Services
    "barber": "Kapper",
    "kapper": "Kapper",
    "salon": "Salon eigenaar",
    "beauty": "Beauty salon eigenaar",
    
    # Transport
    "transport": "Transport ondernemer",
    "logistiek": "Logistiek ondernemer",
    "vrachtwagen": "Transporteur",
    
    # Construction
    "bouw": "Bouwondernemer",
    "construction": "Bouwondernemer",
    
    # General
    "bv": "Ondernemer",
    "b.v.": "Ondernemer",
    "bedrijf": "Ondernemer",
}

# General roles to use when we can't infer from company name
GENERAL_ROLES = [
    "Ondernemer",
    "Zakelijk eigenaar",
    "Bedrijfseigenaar",
    "Shop eigenaar",
    "Winkelier",
    "Horeca ondernemer",
    "Transport ondernemer",
]

def infer_role_from_company(company: str) -> str:
    """Infer a general role from company name"""
    company_lower = company.lower()
    
    # Check for specific mappings
    for key, role in COMPANY_TO_ROLE_MAPPING.items():
        if key in company_lower:
            return role
    
    # Check for common patterns
    if any(word in company_lower for word in ["café", "coffee", "koffie"]):
        return "Café eigenaar"
    elif any(word in company_lower for word in ["restaurant", "eetcafé"]):
        return "Restaurant eigenaar"
    elif any(word in company_lower for word in ["bar", "pub"]):
        return "Bar eigenaar"
    elif any(word in company_lower for word in ["shop", "winkel", "store"]):
        return "Winkelier"
    elif any(word in company_lower for word in ["web", "online", "e-commerce"]):
        return "Webshop eigenaar"
    elif any(word in company_lower for word in ["barber", "kapper", "hair"]):
        return "Kapper"
    elif any(word in company_lower for word in ["transport", "logistiek", "vracht"]):
        return "Transport ondernemer"
    elif any(word in company_lower for word in ["bouw", "construction", "bouwbedrijf"]):
        return "Bouwondernemer"
    elif any(word in company_lower for word in ["hotel", "accommodatie"]):
        return "Hotel eigenaar"
    
    # Default fallback
    return "Ondernemer"

def fetch_all_testimonials() -> List[Dict]:
    """Fetch all testimonials from Strapi"""
    url = f"{STRAPI_URL}/api/testimonials?populate=*"
    
    try:
        # Try with auth first, then without
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 401:
            # Try without auth (public endpoint)
            response = requests.get(url, headers={"Content-Type": "application/json"}, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            return data.get("data", [])
        else:
            print(f"Error fetching testimonials: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return []
    except Exception as e:
        print(f"Error fetching testimonials: {e}")
        return []

def update_testimonial_role(testimonial_id: str, role: str) -> bool:
    """Update a testimonial's role field"""
    url = f"{STRAPI_URL}/api/testimonials/{testimonial_id}"
    
    payload = {
        "data": {
            "role": role
        }
    }
    
    try:
        # Try with auth first
        response = requests.put(url, headers=HEADERS, json=payload, timeout=10)
        
        if response.status_code == 401:
            error_data = response.json() if response.text else {}
            error_msg = error_data.get('error', {}).get('message', 'Unauthorized')
            print(f"  ⚠️  Authentication failed: {error_msg}")
            print(f"      Token length: {len(STRAPI_TOKEN)}")
            print(f"      Token preview: {STRAPI_TOKEN[:20]}...")
            return False
        
        if response.status_code == 200:
            return True
        else:
            error_text = response.text[:300]
            print(f"  ✗ Error updating: {response.status_code}")
            print(f"      Response: {error_text}")
            return False
    except Exception as e:
        print(f"  ✗ Error updating: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 60)
    print("Update Testimonial Roles")
    print("=" * 60)
    print(f"Strapi URL: {STRAPI_URL}")
    print(f"Has Token: {'Yes' if STRAPI_TOKEN else 'No (will try public access)'}")
    print()
    
    # Fetch all testimonials
    print("📥 Fetching testimonials...")
    testimonials = fetch_all_testimonials()
    
    if not testimonials:
        print("❌ No testimonials found or error fetching")
        return
    
    print(f"✅ Found {len(testimonials)} testimonials\n")
    
    # Process each testimonial
    updated = 0
    skipped = 0
    failed = 0
    
    for testimonial in testimonials:
        # Get testimonial data
        attrs = testimonial.get("attributes", {}) if "attributes" in testimonial else testimonial
        testimonial_id = testimonial.get("documentId") or testimonial.get("id")
        name = attrs.get("name", "Unknown")
        company = attrs.get("company", "")
        current_role = attrs.get("role", "")
        
        # Skip if already has a general role (not a company name)
        if current_role and current_role.lower() not in company.lower() and len(current_role) < 30:
            print(f"⏭️  Skipping {name} - Already has role: '{current_role}'")
            skipped += 1
            continue
        
        # Infer role from company name
        new_role = infer_role_from_company(company)
        
        print(f"📝 Updating {name} ({company})")
        print(f"   Current role: '{current_role or '(empty)'}'")
        print(f"   New role: '{new_role}'")
        
        if not testimonial_id:
            print(f"   ✗ No ID found for testimonial")
            failed += 1
            continue
        
        # Update testimonial
        if update_testimonial_role(testimonial_id, new_role):
            print(f"   ✅ Updated successfully\n")
            updated += 1
        else:
            print(f"   ✗ Failed to update\n")
            failed += 1
    
    # Summary
    print("=" * 60)
    print("Summary:")
    print(f"  ✅ Updated: {updated}")
    print(f"  ⏭️  Skipped: {skipped}")
    print(f"  ✗ Failed: {failed}")
    print(f"  📊 Total: {len(testimonials)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
