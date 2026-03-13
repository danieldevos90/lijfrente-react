#!/bin/bash
# Script to add STRAPI_API_TOKEN to Vercel environment variables

set -e

echo "🔐 Adding STRAPI_API_TOKEN to Vercel"
echo "===================================="
echo ""

# Check if token is provided
if [ -z "$1" ]; then
    echo "❌ Error: Token required"
    echo ""
    echo "Usage:"
    echo "  ./scripts/add-vercel-strapi-token.sh <your-token>"
    echo ""
    echo "To get a token:"
    echo "  1. Visit: https://cms.geldgeregeld.nl/admin"
    echo "  2. Go to: Settings → API Tokens"
    echo "  3. Create a new token and copy it"
    exit 1
fi

TOKEN="$1"

echo "📦 Adding STRAPI_API_TOKEN to Vercel..."
echo ""

# Add to each environment
for env in "production" "preview" "development"; do
    echo "Adding to $env..."
    echo "$TOKEN" | vercel env add STRAPI_API_TOKEN "$env" 2>&1 | grep -v "Encrypted" || {
        echo "  ⚠️  Failed or already exists for $env"
    }
done

echo ""
echo "✅ Done! Token added to all environments"
echo ""
echo "📝 Next steps:"
echo "  1. Verify: vercel env ls | grep STRAPI_API_TOKEN"
echo "  2. Redeploy your application for changes to take effect"
echo ""
