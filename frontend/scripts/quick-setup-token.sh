#!/bin/bash
# Quick setup script - tests existing token and adds to .env.local

set -e

STRAPI_URL="https://bright-smile-1f47bc9d67.strapiapp.com"
ENV_FILE=".env.local"
TOKEN="${1:-a96c4cade5ac4b12d9479f03d1bec6d0719e4f78747522f35e05b29bcba5d3571579ab84e88fd56f5d260ec5550654c61e0dba7625cfce335021d0b361c039e64d4cb24fd2e183c3e646cf5e5e037ccbb85c7ede948db96aed2319e8fdee0bcfea51cd2b97d670f57342a4f79558108f2ed57483892bca68b5cc71f35cdf1717}"

echo "🔐 Quick Strapi Token Setup"
echo "=========================="
echo ""

# Test token
echo "🧪 Testing token..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    "$STRAPI_URL/api/pages?pagination[pageSize]=1" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Token is valid!"
    
    # Add to .env.local
    if [ -f "$ENV_FILE" ]; then
        # Remove old token
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' '/^STRAPI_API_TOKEN=/d' "$ENV_FILE"
        else
            sed -i '/^STRAPI_API_TOKEN=/d' "$ENV_FILE"
        fi
    else
        touch "$ENV_FILE"
    fi
    
    echo "STRAPI_API_TOKEN=$TOKEN" >> "$ENV_FILE"
    echo "✅ Token added to $ENV_FILE"
    echo ""
    echo "📦 Next: Add to Vercel with:"
    echo "   vercel env add STRAPI_API_TOKEN"
    exit 0
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Token is invalid (401 Unauthorized)"
    echo ""
    echo "You need to get a new token:"
    echo "1. Visit: $STRAPI_URL/admin"
    echo "2. Go to: Settings → API Tokens"
    echo "3. Create a new token"
    echo "4. Run: ./scripts/quick-setup-token.sh <your-new-token>"
    exit 1
else
    echo "⚠️  Got HTTP $HTTP_CODE - token may be invalid"
    echo ""
    echo "If you have a valid token, run:"
    echo "  ./scripts/quick-setup-token.sh <your-token>"
    exit 1
fi
