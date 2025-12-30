#!/bin/bash
# Complete script to fix Strapi 401 error on Vercel
# Adds both STRAPI_API_TOKEN and NEXT_PUBLIC_STRAPI_URL to Vercel

set -e

STRAPI_URL="https://bright-smile-1f47bc9d67.strapiapp.com"

echo "🔧 Fixing Strapi 401 Error on Vercel"
echo "===================================="
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the frontend directory"
    exit 1
fi

# Step 1: Add NEXT_PUBLIC_STRAPI_URL if not exists
echo "📝 Step 1: Checking NEXT_PUBLIC_STRAPI_URL..."
if vercel env ls 2>&1 | grep -q "NEXT_PUBLIC_STRAPI_URL"; then
    echo "✅ NEXT_PUBLIC_STRAPI_URL already exists"
else
    echo "Adding NEXT_PUBLIC_STRAPI_URL..."
    echo "$STRAPI_URL" | vercel env add NEXT_PUBLIC_STRAPI_URL production
    echo "$STRAPI_URL" | vercel env add NEXT_PUBLIC_STRAPI_URL preview
    echo "$STRAPI_URL" | vercel env add NEXT_PUBLIC_STRAPI_URL development
    echo "✅ NEXT_PUBLIC_STRAPI_URL added to all environments"
fi

echo ""

# Step 2: Add STRAPI_API_TOKEN
echo "📝 Step 2: Adding STRAPI_API_TOKEN..."

if [ -z "$1" ]; then
    echo ""
    echo "⚠️  STRAPI_API_TOKEN is required!"
    echo ""
    echo "To get your token:"
    echo "  1. Visit: $STRAPI_URL/admin"
    echo "  2. Go to: Settings → API Tokens"
    echo "  3. Create a new token (type: Read-only or Full-access)"
    echo "  4. Copy the token"
    echo ""
    echo "Then run:"
    echo "  ./scripts/fix-vercel-strapi.sh <your-token>"
    echo ""
    echo "Or add manually:"
    echo "  vercel env add STRAPI_API_TOKEN"
    exit 1
fi

TOKEN="$1"

# Test token first
echo "🧪 Testing token..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    "$STRAPI_URL/api/pages?pagination[pageSize]=1" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Token is valid!"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "⚠️  Warning: Token returned 401 - it may be invalid"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "⚠️  Warning: Got HTTP $HTTP_CODE - token may be invalid"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📦 Adding STRAPI_API_TOKEN to Vercel..."

for env in "production" "preview" "development"; do
    echo "  Adding to $env..."
    echo "$TOKEN" | vercel env add STRAPI_API_TOKEN "$env" 2>&1 | grep -v "Encrypted" || {
        echo "    ⚠️  May already exist or failed"
    }
done

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Summary:"
echo "  ✅ NEXT_PUBLIC_STRAPI_URL: $STRAPI_URL"
echo "  ✅ STRAPI_API_TOKEN: Added to all environments"
echo ""
echo "🔄 Next steps:"
echo "  1. Verify: vercel env ls | grep STRAPI"
echo "  2. Redeploy your application:"
echo "     vercel --prod"
echo "     (or trigger a new deployment from Vercel dashboard)"
echo ""
