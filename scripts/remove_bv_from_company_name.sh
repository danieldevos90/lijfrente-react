#!/bin/bash
# Remove "B.V." from company name in footer via Strapi API
#
# USAGE:
#   export STRAPI_TOKEN='your-api-token-here'
#   bash scripts/remove_bv_from_company_name.sh
#
# OR:
#   STRAPI_TOKEN='your-api-token-here' bash scripts/remove_bv_from_company_name.sh

set -e

STRAPI_URL="${STRAPI_URL:-https://bright-smile-1f47bc9d67.strapiapp.com}"
STRAPI_TOKEN="${STRAPI_TOKEN:-${STRAPI_API_TOKEN}}"
SITE_ID="geldgeregeld"

if [ -z "$STRAPI_TOKEN" ]; then
    echo "❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required"
    echo "   Usage: STRAPI_TOKEN='your-token' bash scripts/remove_bv_from_company_name.sh"
    exit 1
fi

echo "🔄 Removing 'B.V.' from company name in footer..."
echo "📍 Site ID: $SITE_ID"
echo "🔗 Strapi URL: $STRAPI_URL"
echo ""

# Get existing site
echo "📥 Fetching site data..."
SITE_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $STRAPI_TOKEN" \
    -H "Content-Type: application/json" \
    "${STRAPI_URL}/api/sites?filters[siteId][\$eq]=${SITE_ID}&populate=*")

HTTP_CODE=$(echo "$SITE_RESPONSE" | tail -n1)
SITE_DATA=$(echo "$SITE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Failed to fetch site: HTTP $HTTP_CODE"
    echo "$SITE_DATA" | head -20
    exit 1
fi

# Extract site ID and company name
SITE_ID_VALUE=$(echo "$SITE_DATA" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
DOCUMENT_ID=$(echo "$SITE_DATA" | grep -o '"documentId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$SITE_ID_VALUE" ] && [ -z "$DOCUMENT_ID" ]; then
    echo "❌ Could not find site ID in response"
    exit 1
fi

CURRENT_NAME=$(echo "$SITE_DATA" | grep -o '"companyName":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "   Current company name: '$CURRENT_NAME'"

# Remove "B.V." (case-insensitive)
NEW_NAME=$(echo "$CURRENT_NAME" | sed 's/ B\.V\.//g' | sed 's/ B\.V//g' | sed 's/ b\.v\.//g' | sed 's/ b\.v//g' | xargs)

if [ "$NEW_NAME" = "$CURRENT_NAME" ]; then
    echo "   No 'B.V.' found in company name, nothing to update"
    exit 0
fi

echo "   New company name: '$NEW_NAME'"

# Update site
UPDATE_ID="${DOCUMENT_ID:-$SITE_ID_VALUE}"
echo "📤 Updating company name..."

if [ -n "$DOCUMENT_ID" ]; then
    # Try Content Manager API first
    UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Authorization: Bearer $STRAPI_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"data\":{\"companyName\":\"$NEW_NAME\"}}" \
        "${STRAPI_URL}/admin/content-manager/collection-types/api::site.site/${DOCUMENT_ID}")
    
    HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Company name updated successfully via Admin Content Manager API"
        exit 0
    fi
fi

# Fallback to Content API
UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
    -H "Authorization: Bearer $STRAPI_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"data\":{\"companyName\":\"$NEW_NAME\"}}" \
    "${STRAPI_URL}/api/sites/${UPDATE_ID}")

HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
UPDATE_BODY=$(echo "$UPDATE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Company name updated successfully via Content API"
    exit 0
else
    echo "❌ Failed to update company name: HTTP $HTTP_CODE"
    echo "$UPDATE_BODY" | head -20
    exit 1
fi
