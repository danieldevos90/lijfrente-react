#!/bin/bash
# Complete CLI script to create team-member content type and populate data

set -e

STRAPI_URL="${STRAPI_URL:-https://bright-smile-1f47bc9d67.strapiapp.com}"
STRAPI_TOKEN="${STRAPI_API_TOKEN:-d99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad}"
SITE_ID="${SITE_ID:-geldgeregeld}"

echo "=================================================================================="
echo "👥 CREATING TEAM MEMBER CONTENT TYPE AND DATA VIA CLI"
echo "=================================================================================="
echo ""
echo "Strapi URL: $STRAPI_URL"
echo "Site ID: $SITE_ID"
echo ""

# Step 1: Deploy CMS to ensure content type is available
echo "Step 1: Deploying CMS to Strapi Cloud..."
cd "$(dirname "$0")/../cms" || exit 1
npm run build
npm run deploy -- --force
echo "✅ CMS deployed"
echo ""

# Step 2: Wait for deployment to sync
echo "Step 2: Waiting for Strapi Cloud to sync (30 seconds)..."
sleep 30
echo "✅ Wait complete"
echo ""

# Step 3: Check if content type exists
echo "Step 3: Checking if team-member content type exists..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $STRAPI_TOKEN" \
  -H "Content-Type: application/json" \
  "$STRAPI_URL/api/team-members")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "404" ]; then
  echo "✅ Content type exists! (HTTP $HTTP_CODE)"
  
  # Step 4: Enable permissions
  echo ""
  echo "Step 4: Enabling permissions..."
  python3 << 'PYTHON_SCRIPT'
import requests
import os
import sys

STRAPI_URL = os.getenv('STRAPI_URL')
STRAPI_TOKEN = os.getenv('STRAPI_TOKEN')

HEADERS = {
    'Authorization': f'Bearer {STRAPI_TOKEN}',
    'Content-Type': 'application/json'
}

# Get public role
url = f'{STRAPI_URL}/api/users-permissions/roles/1'
response = requests.get(url, headers=HEADERS, timeout=10)
if response.status_code == 200:
    role_data = response.json()
    permissions = role_data.get('permissions', {})
    
    if 'api::team-member.team-member' not in permissions:
        permissions['api::team-member.team-member'] = {}
    
    team_perms = permissions['api::team-member.team-member']
    team_perms['find'] = True
    team_perms['findOne'] = True
    team_perms['create'] = False
    team_perms['update'] = False
    team_perms['delete'] = False
    
    update_data = {**role_data, 'permissions': permissions}
    update_response = requests.put(url, headers=HEADERS, json=update_data, timeout=10)
    
    if update_response.status_code == 200:
        print("✅ Permissions enabled!")
    else:
        print(f"⚠️ Failed to enable permissions: {update_response.status_code}")
else:
    print(f"⚠️ Could not fetch role: {response.status_code}")
PYTHON_SCRIPT
  
  # Step 5: Create team members
  echo ""
  echo "Step 5: Creating team members..."
  export STRAPI_URL STRAPI_TOKEN SITE_ID
  python3 setup_team_members_complete.py
  
else
  echo "❌ Content type does not exist (HTTP 404)"
  echo ""
  echo "The content type needs to be created manually in Strapi Admin:"
  echo "1. Go to: $STRAPI_URL/admin"
  echo "2. Content-Type Builder → Create new collection type"
  echo "3. Name: 'Team Member', API ID: 'team-member' / 'team-members'"
  echo "4. Add fields and save"
  echo "5. Run this script again"
  exit 1
fi

echo ""
echo "=================================================================================="
echo "✅ COMPLETE!"
echo "=================================================================================="
