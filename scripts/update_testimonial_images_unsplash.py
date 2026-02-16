#!/usr/bin/env python3
"""
Update testimonial images in Strapi using Unsplash profile images
Fetches profile images from Unsplash and uploads them to Strapi
"""

import os
import sys
import requests
import json
import tempfile
import time
from pathlib import Path
from typing import Dict, List, Any, Optional
from urllib.parse import urlparse

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
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")
    return env_vars

# Load from cms/.env
cms_env_path = Path(__file__).parent.parent / 'cms' / '.env'
env_vars = load_env_file(cms_env_path)

# Also load from frontend/.env.local (for API tokens)
frontend_env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
frontend_env_vars = load_env_file(frontend_env_path)
env_vars.update(frontend_env_vars)

# Set environment variables from .env files
for key, value in env_vars.items():
    if key not in os.environ:
        os.environ[key] = value

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN') or os.getenv('STRAPI_API_TOKEN')
UNSPLASH_ACCESS_KEY = os.getenv('UNSPLASH_ACCESS_KEY')
SITE_ID = os.getenv('SITE_ID', 'geldgeregeld')

if not STRAPI_TOKEN:
    print("❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required")
    print("   Set it in your .env.local or export it:")
    print("   export STRAPI_API_TOKEN='your-token-here'")
    sys.exit(1)

if not UNSPLASH_ACCESS_KEY:
    print("❌ Error: UNSPLASH_ACCESS_KEY environment variable is required")
    print("   Get your key from: https://unsplash.com/developers")
    print("   Set it in your .env.local or export it:")
    print("   export UNSPLASH_ACCESS_KEY='your-key-here'")
    sys.exit(1)

STRAPI_HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
}

UNSPLASH_HEADERS = {
    'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}',
}

UNSPLASH_API_URL = 'https://api.unsplash.com'


def get_testimonials() -> List[Dict[str, Any]]:
    """Fetch all testimonials from Strapi"""
    url = f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&populate=*&pagination[limit]=1000"
    
    try:
        # Try with auth first
        response = requests.get(url, headers={**STRAPI_HEADERS, 'Content-Type': 'application/json'}, timeout=30)
        if response.status_code == 401:
            # Try without auth (public endpoint)
            print("⚠️  Auth failed, trying public access for reading...")
            response = requests.get(url, headers={'Content-Type': 'application/json'}, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            testimonials = data.get('data', [])
            print(f"✅ Found {len(testimonials)} testimonials")
            return testimonials
        else:
            print(f"❌ Error fetching testimonials: {response.status_code}")
            print(f"Response: {response.text[:300]}")
            return []
    except Exception as e:
        print(f"❌ Error fetching testimonials: {e}")
        return []


def search_unsplash_profile_image(query: str = "profile image", per_page: int = 10) -> Optional[Dict[str, Any]]:
    """Search Unsplash for profile images"""
    url = f"{UNSPLASH_API_URL}/search/photos"
    params = {
        'query': query,
        'per_page': per_page,
        'orientation': 'portrait',  # Prefer portrait for profile images
    }
    
    try:
        response = requests.get(url, headers=UNSPLASH_HEADERS, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            if results:
                # Return a random result from the first few for variety
                import random
                return random.choice(results[:5])
            return None
        elif response.status_code == 403:
            print(f"  ⚠️ Unsplash API 403 - credentials may need activation")
            return None
        else:
            print(f"  ⚠️ Unsplash API error: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ⚠️ Error searching Unsplash: {e}")
        return None


def download_image(image_url: str, temp_dir: Path) -> Optional[Path]:
    """Download an image from URL to temporary file"""
    try:
        response = requests.get(image_url, timeout=15)
        if response.status_code == 200:
            # Get file extension from URL or content type
            parsed_url = urlparse(image_url)
            ext = os.path.splitext(parsed_url.path)[1] or '.jpg'
            if not ext.startswith('.'):
                ext = '.jpg'
            
            # Create temp file
            temp_file = temp_dir / f"profile_{int(time.time() * 1000)}{ext}"
            with open(temp_file, 'wb') as f:
                f.write(response.content)
            return temp_file
        else:
            print(f"  ⚠️ Failed to download image: {response.status_code}")
            return None
    except Exception as e:
        print(f"  ⚠️ Error downloading image: {e}")
        return None


def upload_image_to_strapi(image_path: Path, alt_text: str = None) -> Optional[Dict[str, Any]]:
    """Upload an image to Strapi and return the file data"""
    if not image_path.exists():
        print(f"  ❌ Image not found: {image_path}")
        return None
    
    print(f"  📤 Uploading to Strapi: {image_path.name}")
    
    # Determine content type
    ext = image_path.suffix.lower()
    content_type = 'image/jpeg'
    if ext == '.png':
        content_type = 'image/png'
    elif ext == '.webp':
        content_type = 'image/webp'
    
    # Prepare multipart form data
    with open(image_path, 'rb') as f:
        files = {
            'files': (image_path.name, f, content_type)
        }
        data = {}
        if alt_text:
            data['alternativeText'] = alt_text
        
        try:
            url = f"{STRAPI_URL}/api/upload"
            response = requests.post(url, headers=STRAPI_HEADERS, files=files, data=data, timeout=30)
            
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


def update_testimonial_image(testimonial_id, testimonial_data: Dict[str, Any], image_data: Dict[str, Any]) -> bool:
    """Update a testimonial with a new image"""
    url = f"{STRAPI_URL}/api/testimonials/{testimonial_id}"
    
    # Get image documentId (Strapi v5) or id (v4)
    image_doc_id = image_data.get('documentId')
    image_id = image_data.get('id')
    
    # Build update payload with all existing fields plus image
    # Handle both v4 (attributes) and v5 (flat) structures
    if 'attributes' in testimonial_data:
        attrs = testimonial_data.get('attributes', {})
    else:
        attrs = testimonial_data
    
    # Build update data with all fields
    update_data = {
        "name": attrs.get('name'),
        "company": attrs.get('company'),
        "text": attrs.get('text'),
        "rating": attrs.get('rating', 5),
        "siteId": attrs.get('siteId'),
        "featured": attrs.get('featured', False),
    }
    
    # Add optional fields if they exist
    if attrs.get('sector'):
        update_data["sector"] = attrs.get('sector')
    if attrs.get('role'):
        update_data["role"] = attrs.get('role')
    
    # Try different image formats
    image_formats_to_try = [
        image_doc_id if image_doc_id else None,
        image_id if image_id else None,
        {"documentId": image_doc_id} if image_doc_id else None,
        {"id": image_id} if image_id else None,
    ]
    image_formats_to_try = [f for f in image_formats_to_try if f is not None]
    
    for img_format in image_formats_to_try:
        update_data["image"] = img_format
        payload = {"data": update_data}
        
        try:
            response = requests.put(url, headers={**STRAPI_HEADERS, 'Content-Type': 'application/json'}, json=payload, timeout=10)
            
            if response.status_code in [200, 201]:
                return True
            elif img_format == image_formats_to_try[-1]:
                # Last format failed
                print(f"  ❌ Update failed: {response.status_code}")
                print(f"  Response: {response.text[:200]}")
                return False
        except Exception as e:
            if img_format == image_formats_to_try[-1]:
                print(f"  ❌ Error updating testimonial: {e}")
                return False
    
    return False


def track_unsplash_download(download_url: str):
    """Track Unsplash download (required by Unsplash API terms)"""
    try:
        requests.get(download_url, params={'client_id': UNSPLASH_ACCESS_KEY}, timeout=5)
    except:
        pass  # Don't fail if tracking fails


def main(force_update: bool = False):
    """Main execution function"""
    print("=" * 80)
    print("🖼️  UPDATING TESTIMONIAL IMAGES FROM UNSPLASH")
    print("=" * 80)
    print(f"\nStrapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Unsplash API: Configured")
    if force_update:
        print(f"⚠️  Force update mode: Will update all testimonials (even if they have images)")
    print()
    
    # Fetch all testimonials
    testimonials = get_testimonials()
    if not testimonials:
        print("❌ No testimonials found or error fetching testimonials")
        return
    
    # Create temporary directory for downloaded images
    temp_dir = Path(tempfile.mkdtemp())
    print(f"📁 Temporary directory: {temp_dir}\n")
    
    success_count = 0
    skipped_count = 0
    failed_count = 0
    
    for testimonial in testimonials:
        # Strapi v5 uses documentId, but also keep id for compatibility
        testimonial_id = testimonial.get('documentId') or testimonial.get('id')
        testimonial_numeric_id = testimonial.get('id')  # Keep numeric id for API calls
        
        # Handle both v4 (attributes) and v5 (flat) structures
        if 'attributes' in testimonial:
            attrs = testimonial.get('attributes', {})
        else:
            attrs = testimonial
        
        name = attrs.get('name', 'Unknown')
        company = attrs.get('company', '')
        
        # Check if testimonial already has an image (unless force update)
        if not force_update:
            existing_image = attrs.get('image', {})
            if existing_image:
                # Handle both v4 nested structure and v5 flat structure
                if isinstance(existing_image, dict):
                    if existing_image.get('data') or existing_image.get('id') or existing_image.get('documentId'):
                        print(f"\n👤 {name} ({company}) - Already has image, skipping...")
                        skipped_count += 1
                        continue
        
        print(f"\n👤 Processing: {name} ({company})")
        print("-" * 80)
        
        # Search for profile image on Unsplash
        print("  🔍 Searching Unsplash for profile image...")
        unsplash_image = search_unsplash_profile_image("profile image portrait")
        
        if not unsplash_image:
            print("  ⚠️ No image found on Unsplash, skipping...")
            failed_count += 1
            continue
        
        # Get image URL (use regular size, good quality)
        image_url = unsplash_image.get('urls', {}).get('regular') or unsplash_image.get('urls', {}).get('small')
        download_url = unsplash_image.get('links', {}).get('download_location')
        
        if not image_url:
            print("  ⚠️ No image URL found, skipping...")
            failed_count += 1
            continue
        
        # Download image
        print(f"  ⬇️  Downloading image from Unsplash...")
        image_path = download_image(image_url, temp_dir)
        
        if not image_path:
            print("  ⚠️ Failed to download image, skipping...")
            failed_count += 1
            continue
        
        # Upload to Strapi
        alt_text = f"{name} profile photo"
        image_data = upload_image_to_strapi(image_path, alt_text=alt_text)
        
        if not image_data:
            print("  ⚠️ Failed to upload image to Strapi, skipping...")
            failed_count += 1
            # Clean up temp file
            if image_path.exists():
                image_path.unlink()
            continue
        
        # Update testimonial - use documentId if available, otherwise id
        print(f"  🔄 Updating testimonial with new image...")
        update_id = testimonial.get('documentId') or testimonial.get('id')
        if update_testimonial_image(update_id, testimonial, image_data):
            print(f"  ✅ Successfully updated testimonial!")
            success_count += 1
            
            # Track Unsplash download
            if download_url:
                track_unsplash_download(download_url)
        else:
            print(f"  ⚠️ Failed to update testimonial")
            failed_count += 1
        
        # Clean up temp file
        if image_path.exists():
            image_path.unlink()
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    # Clean up temp directory
    try:
        temp_dir.rmdir()
    except:
        pass
    
    print("\n" + "=" * 80)
    print("✅ COMPLETED")
    print("=" * 80)
    print(f"Successfully updated: {success_count}")
    print(f"Skipped (already had image): {skipped_count}")
    print(f"Failed: {failed_count}")
    print(f"Total processed: {len(testimonials)}")
    print("=" * 80 + "\n")


if __name__ == '__main__':
    import sys
    force_update = '--force' in sys.argv or '-f' in sys.argv
    
    if '--help' in sys.argv or '-h' in sys.argv:
        print("\nUsage:")
        print("  python update_testimonial_images_unsplash.py           # Update only testimonials without images")
        print("  python update_testimonial_images_unsplash.py --force   # Update all testimonials (replace existing images)")
        print("\nRequirements:")
        print("  - STRAPI_API_TOKEN in frontend/.env.local")
        print("  - UNSPLASH_ACCESS_KEY in frontend/.env.local")
        print()
        sys.exit(0)
    
    main(force_update=force_update)
