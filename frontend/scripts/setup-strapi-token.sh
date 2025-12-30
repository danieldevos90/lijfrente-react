#!/bin/bash
# Script to set up Strapi API token in environment variables

set -e

STRAPI_URL="${NEXT_PUBLIC_STRAPI_URL:-https://bright-smile-1f47bc9d67.strapiapp.com}"
ENV_FILE=".env.local"

echo "🔐 Strapi API Token Setup"
echo "========================="
echo ""
echo "Strapi URL: $STRAPI_URL"
echo ""

# Check if token is already set
if [ -f "$ENV_FILE" ] && grep -q "STRAPI_API_TOKEN" "$ENV_FILE"; then
    echo "⚠️  STRAPI_API_TOKEN already exists in $ENV_FILE"
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping token update."
        exit 0
    fi
fi

echo ""
echo "To get your Strapi API token:"
echo "1. Go to: $STRAPI_URL/admin"
echo "2. Navigate to: Settings → API Tokens"
echo "3. Create a new token (or use existing)"
echo "4. Copy the token value"
echo ""
read -p "Enter your Strapi API token: " STRAPI_TOKEN

if [ -z "$STRAPI_TOKEN" ]; then
    echo "❌ Token cannot be empty"
    exit 1
fi

# Test the token
echo ""
echo "🧪 Testing token..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $STRAPI_TOKEN" \
    "$STRAPI_URL/api/pages?pagination[pageSize]=1" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Token is valid!"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Token is invalid (401 Unauthorized)"
    exit 1
else
    echo "⚠️  Got HTTP $HTTP_CODE - token may still work, but test failed"
fi

# Add to .env.local
echo ""
echo "📝 Adding token to $ENV_FILE..."

# Remove old STRAPI_API_TOKEN if exists
if [ -f "$ENV_FILE" ]; then
    # Use sed to remove existing line (works on both macOS and Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' '/^STRAPI_API_TOKEN=/d' "$ENV_FILE"
    else
        sed -i '/^STRAPI_API_TOKEN=/d' "$ENV_FILE"
    fi
else
    touch "$ENV_FILE"
fi

# Add new token
echo "STRAPI_API_TOKEN=$STRAPI_TOKEN" >> "$ENV_FILE"

echo "✅ Token added to $ENV_FILE"
echo ""
echo "Next steps:"
echo "1. The token is now in your local .env.local file"
echo "2. To add it to Vercel, run:"
echo "   vercel env add STRAPI_API_TOKEN"
echo "   (Then paste the token when prompted)"
echo ""
