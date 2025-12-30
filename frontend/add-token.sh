#!/bin/bash
# Simple script to add Strapi token to .env.local

if [ -z "$1" ]; then
    echo "Usage: ./add-token.sh <your-strapi-token>"
    echo ""
    echo "To get a token:"
    echo "1. Visit: https://bright-smile-1f47bc9d67.strapiapp.com/admin"
    echo "2. Go to: Settings → API Tokens"
    echo "3. Create a new token and copy it"
    exit 1
fi

TOKEN="$1"
ENV_FILE=".env.local"

# Remove old token if exists
if [ -f "$ENV_FILE" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' '/^STRAPI_API_TOKEN=/d' "$ENV_FILE"
    else
        sed -i '/^STRAPI_API_TOKEN=/d' "$ENV_FILE"
    fi
fi

# Add new token
echo "STRAPI_API_TOKEN=$TOKEN" >> "$ENV_FILE"
echo "✅ Token added to $ENV_FILE"
echo ""
echo "📦 Next: Add to Vercel with: vercel env add STRAPI_API_TOKEN"
