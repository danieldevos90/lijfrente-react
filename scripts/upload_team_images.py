#!/usr/bin/env python3
"""
Upload team member images to Strapi and link them to team members
"""

import os
import sys
import requests
import json
from pathlib import Path

# Try to load .env files from multiple locations
def load_env_file(env_path):
    """Manually parse .env file"""
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

# Load from cms/.env
cms_env_path = Path(__file__).parent.parent / 'cms' / '.env'
env_vars = load_env_file(cms_env_path)

# Also load from frontend/.env.local (for API token)
frontend_env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
frontend_env_vars = load_env_file(frontend_env_path)
env_vars.update(frontend_env_vars)

# Set environment variables from .env files
for key, value in env_vars.items():
    if key not in os.environ:
        os.environ[key] = value

STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN', os.getenv('STRAPI_API_TOKEN', ''))
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')
isDev = os.getenv('NODE_ENV') == 'development'

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required")
    print("   Set it in your .env.local or export it:")
    print("   export STRAPI_TOKEN='your-token-here'")
    sys.exit(1)

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
}

# Map team member names to image files, LinkedIn URLs, and email
TEAM_DATA = {
    'Erik de Vos': {
        'image': 'frontend/public/images/Erik.jpeg',
        'linkedin': 'https://www.linkedin.com/in/erik-de-vos-425ab120/',
        'email': 'info@geldgeregeld.nl',
    },
    'Jan Dijkerman': {
        'image': 'frontend/public/images/Jan.jpeg',
        'linkedin': 'https://www.linkedin.com/in/jan-dijkerman-b3a771393/',
        'email': 'info@geldgeregeld.nl',
    },
}

def upload_image(image_path: str, alt_text: str = None) -> dict:
    """Upload an image to Strapi and return the file data"""
    if not os.path.exists(image_path):
        print(f"  ❌ Image not found: {image_path}")
        return None
    
    print(f"  📤 Uploading: {os.path.basename(image_path)}")
    
    # Prepare multipart form data
    with open(image_path, 'rb') as f:
        files = {
            'files': (os.path.basename(image_path), f, 'image/jpeg')
        }
        data = {}
        if alt_text:
            data['alternativeText'] = alt_text
        
        try:
            url = f"{STRAPI_URL}/api/upload"
            response = requests.post(url, headers=HEADERS, files=files, data=data, timeout=30)
            
            if response.status_code in [200, 201]:
                result = response.json()
                # Strapi returns an array of uploaded files
                if isinstance(result, list) and len(result) > 0:
                    file_data = result[0]
                    print(f"  ✅ Uploaded successfully (ID: {file_data.get('id')})")
                    return file_data
                elif isinstance(result, dict) and 'id' in result:
                    print(f"  ✅ Uploaded successfully (ID: {result.get('id')})")
                    return result
                else:
                    print(f"  ⚠️ Unexpected response format: {result}")
                    return None
            else:
                print(f"  ❌ Upload failed: {response.status_code}")
                print(f"  Response: {response.text[:300]}")
                return None
        except Exception as e:
            print(f"  ❌ Error uploading: {e}")
            return None

def get_team_member(name: str) -> dict:
    """Get team member by name"""
    url = f"{STRAPI_URL}/api/team-members?filters[name][$eq]={name}&filters[siteId][$eq]={SITE_ID}&populate=*"
    try:
        response = requests.get(url, headers={**HEADERS, 'Content-Type': 'application/json'}, timeout=10)
        if response.status_code == 200:
            data = response.json()
            members = data.get('data', [])
            if members:
                member = members[0]
                if isDev:
                    print(f"  🔍 Found member: {member}")
                return member
        else:
            print(f"  ⚠️ Failed to fetch: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ⚠️ Error fetching team member: {e}")
    return None

def update_team_member(member_id: int, image_id: int = None, linkedin: str = None, email: str = None) -> bool:
    """Update team member with image, LinkedIn URL, and/or email"""
    url = f"{STRAPI_URL}/api/team-members/{member_id}"
    
    # Build update data
    update_data = {}
    if image_id:
        update_data["image"] = image_id  # Just the ID for single media relation
    if linkedin:
        update_data["linkedin"] = linkedin
    if email:
        update_data["email"] = email
    
    if not update_data:
        return False
    
    data = {
        "data": update_data
    }
    
    headers = {
        **HEADERS,
        'Content-Type': 'application/json'
    }
    
    try:
        updates = []
        if image_id:
            updates.append("image")
        if linkedin:
            updates.append("LinkedIn URL")
        if email:
            updates.append("email")
        
        if updates:
            print(f"  🔗 Updating: {', '.join(updates)}...")
        
        response = requests.put(url, headers=headers, json=data, timeout=10)
        
        if response.status_code == 200:
            print(f"  ✅ Updated successfully")
            return True
        else:
            print(f"  ⚠️ Failed to update: {response.status_code}")
            print(f"  Response: {response.text[:300]}")
            return False
    except Exception as e:
        print(f"  ❌ Error updating: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 80)
    print("📸 UPLOADING TEAM MEMBER IMAGES TO STRAPI")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}\n")
    
    success_count = 0
    total_count = len(TEAM_DATA)
    
    for member_name, member_info in TEAM_DATA.items():
        print(f"\n👤 Processing: {member_name}")
        print("-" * 80)
        
        # Get team member
        member = get_team_member(member_name)
        if not member:
            print(f"  ⚠️ Team member '{member_name}' not found in Strapi")
            print(f"  Please create the team member first using scripts/create_team_members.py")
            continue
        
        # Try different ID field names (Strapi v5 uses 'documentId', v4 uses 'id')
        member_id = member.get('documentId') or member.get('id')
        if not member_id:
            print(f"  ⚠️ Could not get member ID from: {member.keys()}")
            if isDev:
                print(f"  Full member data: {json.dumps(member, indent=2)}")
            continue
        
        if isDev:
            print(f"  ✅ Found member ID: {member_id}")
        
        image_id = None
        image_path = member_info.get('image')
        linkedin = member_info.get('linkedin')
        email = member_info.get('email')
        
        # Upload image if path provided
        if image_path:
            image_data = upload_image(image_path, alt_text=f"{member_name} profile photo")
            if image_data:
                image_id = image_data.get('id')
                if not image_id:
                    print(f"  ⚠️ Could not get image ID from upload response")
        
        # Update team member with image, LinkedIn, and/or email
        if update_team_member(member_id, image_id=image_id, linkedin=linkedin, email=email):
            success_count += 1
    
    print("\n" + "=" * 80)
    if success_count == total_count:
        print(f"✅ SUCCESS! Uploaded and linked {success_count}/{total_count} images")
    else:
        print(f"⚠️ PARTIAL SUCCESS: {success_count}/{total_count} images uploaded and linked")
    print("=" * 80)
    print(f"\n📝 View in Strapi: {STRAPI_URL}/admin/content-manager/collection-types/api::team-member.team-member")
    print(f"🌐 View on site: Check your team section")
    
    return success_count == total_count

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
