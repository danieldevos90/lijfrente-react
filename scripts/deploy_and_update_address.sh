#!/bin/bash
# Script to deploy schema changes and update site address
# This script commits schema changes, waits for Strapi Cloud deployment, then updates the address

set -e

echo "🚀 Deploying schema changes and updating site address..."
echo ""

# Check if STRAPI_TOKEN is set
if [ -z "$STRAPI_TOKEN" ] && [ -z "$STRAPI_API_TOKEN" ]; then
    echo "❌ Error: STRAPI_TOKEN or STRAPI_API_TOKEN environment variable is required"
    echo "   export STRAPI_TOKEN='your-token-here'"
    exit 1
fi

TOKEN=${STRAPI_TOKEN:-$STRAPI_API_TOKEN}
export STRAPI_TOKEN=$TOKEN

# Step 1: Commit and push schema changes (if not already done)
if git diff --quiet cms/src/api/site/content-types/site/schema.json; then
    echo "✅ Schema changes already committed"
else
    echo "📝 Committing schema changes..."
    git add cms/src/api/site/content-types/site/schema.json
    git commit -m "Add address fields to site schema for CLI updates" || true
    echo "📤 Pushing to git..."
    git push || echo "⚠️  Git push failed or already up to date"
fi

echo ""
echo "⏳ Waiting for Strapi Cloud to deploy schema changes..."
echo "   (This usually takes 2-5 minutes)"
echo ""

# Step 2: Wait and retry update
MAX_ATTEMPTS=12
ATTEMPT=1
SUCCESS=false

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "🔄 Attempt $ATTEMPT/$MAX_ATTEMPTS: Trying to update address..."
    
    if python3 scripts/update_site_address_cli.py 2>&1 | grep -q "✅ Site address updated successfully"; then
        echo ""
        echo "✅ SUCCESS! Site address has been updated!"
        SUCCESS=true
        break
    fi
    
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        echo "   ⏳ Deployment not ready yet, waiting 30 seconds..."
        sleep 30
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$SUCCESS" = false ]; then
    echo ""
    echo "⚠️  Schema deployment may still be in progress."
    echo "   The schema has been updated and pushed to git."
    echo "   Strapi Cloud should deploy automatically."
    echo ""
    echo "   You can manually check deployment status at:"
    echo "   https://cloud.strapi.io"
    echo ""
    echo "   Once deployed, run:"
    echo "   python3 scripts/update_site_address_cli.py"
    exit 1
fi

exit 0
