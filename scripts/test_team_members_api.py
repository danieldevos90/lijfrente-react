#!/usr/bin/env python3
"""
Test fetching team members from Strapi API to debug frontend issues
"""

import os
import sys
import requests
import json
from pathlib import Path

# Try to load .env files
def load_env_file(env_path):
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

frontend_env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
frontend_env_vars = load_env_file(frontend_env_path)

for key, value in frontend_env_vars.items():
    if key not in os.environ:
        os.environ[key] = value

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', os.getenv('STRAPI_API_TOKEN', ''))
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN required")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

def test_fetch():
    """Test fetching team members"""
    url = f"{STRAPI_URL}/api/team-members?filters[siteId][$eq]={SITE_ID}&populate[image][populate]=*&sort=order:asc"
    
    print("=" * 80)
    print("🧪 TESTING TEAM MEMBERS API")
    print("=" * 80)
    print(f"\nURL: {url}")
    print(f"Token: {STRAPI_TOKEN[:20]}...\n")
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Success!")
            print(f"Data keys: {list(data.keys())}")
            
            if 'data' in data:
                members = data['data']
                print(f"\nFound {len(members)} team members:\n")
                
                for i, member in enumerate(members, 1):
                    print(f"{i}. Member structure:")
                    print(f"   Keys: {list(member.keys())}")
                    
                    # Try different ways to access attributes
                    attrs = member.get('attributes', member)
                    if not attrs or attrs == member:
                        # Maybe it's flat?
                        attrs = member
                    
                    print(f"   Full member (first 500 chars): {json.dumps(member, indent=2)[:500]}...")
                    print(f"   Name: {attrs.get('name', 'NOT FOUND')}")
                    print(f"   Role: {attrs.get('role', 'NOT FOUND')}")
                    print(f"   Email: {attrs.get('email', 'NOT FOUND')}")
                    print(f"   LinkedIn: {attrs.get('linkedin', 'NOT FOUND')}")
                    
                    # Check image structure
                    image = attrs.get('image', {})
                    print(f"   Image keys: {list(image.keys()) if isinstance(image, dict) else 'Not a dict'}")
                    print()
            else:
                print(f"\n⚠️ No 'data' key in response")
                print(f"Response: {json.dumps(data, indent=2)[:500]}")
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_fetch()
