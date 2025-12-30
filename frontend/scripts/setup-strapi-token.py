#!/usr/bin/env python3
"""
Automated script to set up Strapi API token
Tests token and adds to .env.local and optionally Vercel
"""

import os
import sys
import subprocess
import requests
from pathlib import Path

STRAPI_URL = os.getenv('NEXT_PUBLIC_STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
ENV_FILE = Path('.env.local')

def test_token(token: str) -> bool:
    """Test if a Strapi API token is valid"""
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(
            f'{STRAPI_URL}/api/pages?pagination[pageSize]=1',
            headers=headers,
            timeout=10
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing token: {e}")
        return False

def update_env_file(token: str):
    """Update .env.local file with the token"""
    # Read existing file
    lines = []
    if ENV_FILE.exists():
        with open(ENV_FILE, 'r') as f:
            lines = f.readlines()
    
    # Remove old STRAPI_API_TOKEN line
    lines = [line for line in lines if not line.startswith('STRAPI_API_TOKEN=')]
    
    # Add new token
    lines.append(f'STRAPI_API_TOKEN={token}\n')
    
    # Write back
    with open(ENV_FILE, 'w') as f:
        f.writelines(lines)
    
    print(f"✅ Token added to {ENV_FILE}")

def add_to_vercel(token: str):
    """Add token to Vercel environment variables"""
    print("\n📦 Adding to Vercel...")
    try:
        # Add to all environments
        for env in ['production', 'preview', 'development']:
            print(f"  Adding to {env}...")
            result = subprocess.run(
                ['vercel', 'env', 'add', 'STRAPI_API_TOKEN', env],
                input=token,
                text=True,
                capture_output=True,
                timeout=30
            )
            if result.returncode == 0:
                print(f"  ✅ Added to {env}")
            else:
                print(f"  ⚠️  Failed to add to {env}: {result.stderr}")
    except subprocess.TimeoutExpired:
        print("  ⚠️  Vercel command timed out - you may need to add manually")
    except FileNotFoundError:
        print("  ⚠️  Vercel CLI not found - skipping Vercel setup")
        print("  You can add it manually: vercel env add STRAPI_API_TOKEN")
    except Exception as e:
        print(f"  ⚠️  Error adding to Vercel: {e}")

def main():
    print("🔐 Strapi API Token Setup")
    print("=" * 50)
    print(f"\nStrapi URL: {STRAPI_URL}\n")
    
    # Check if token provided as argument
    if len(sys.argv) > 1:
        token = sys.argv[1]
    else:
        # Check if token is in environment
        token = os.getenv('STRAPI_API_TOKEN')
        if not token:
            print("❌ No token provided!")
            print("\nUsage:")
            print("  python3 scripts/setup-strapi-token.py <your-token>")
            print("\nOr set STRAPI_API_TOKEN environment variable:")
            print("  export STRAPI_API_TOKEN='your-token'")
            print("  python3 scripts/setup-strapi-token.py")
            print("\nTo get a token:")
            print(f"  1. Go to {STRAPI_URL}/admin")
            print("  2. Navigate to: Settings → API Tokens")
            print("  3. Create a new token (type: Read-only or Full-access)")
            print("  4. Copy the token value")
            sys.exit(1)
    
    # Test token
    print("🧪 Testing token...")
    if test_token(token):
        print("✅ Token is valid!")
    else:
        print("❌ Token test failed - it may be invalid or expired")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Update .env.local
    print(f"\n📝 Updating {ENV_FILE}...")
    update_env_file(token)
    
    # Ask about Vercel
    print("\n📦 Add to Vercel?")
    add_vercel = input("Add STRAPI_API_TOKEN to Vercel environment variables? (y/N): ")
    if add_vercel.lower() == 'y':
        add_to_vercel(token)
    
    print("\n✅ Setup complete!")
    print("\nNext steps:")
    print("  1. Restart your dev server if running")
    print("  2. The token is now in .env.local")
    if add_vercel.lower() != 'y':
        print("  3. Add to Vercel manually: vercel env add STRAPI_API_TOKEN")

if __name__ == '__main__':
    main()
