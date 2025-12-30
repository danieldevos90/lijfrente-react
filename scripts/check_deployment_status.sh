#!/bin/bash
# Check Strapi Cloud Deployment Status

echo "🔍 Checking Strapi Deployment Status..."
echo ""

# Check if files are committed
echo "✅ Git Status:"
git log --oneline -1 -- cms/src/api/sector-page/
echo ""

# Check API endpoint
echo "📡 Testing API Endpoint:"
STRAPI_URL="https://bright-smile-1f47bc9d67.strapiapp.com"
echo "GET ${STRAPI_URL}/api/sector-pages"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}/api/sector-pages" 2>/dev/null)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "404" ]; then
  echo "   Response: $STATUS"
  if [ "$STATUS" = "404" ]; then
    echo "   ⚠️  Content type not registered yet"
  else
    echo "   ✅ API is responding"
  fi
else
  echo "   ❌ Error: $STATUS"
fi
echo ""

# Instructions
echo "📋 Next Steps:"
echo ""
echo "1. CHECK STRAPI CLOUD DASHBOARD:"
echo "   → Open: https://cloud.strapi.io/projects"
echo "   → Login if needed"
echo "   → Select: lijfrente-cms"
echo "   → Click: 'Deployments' tab"
echo "   → Check latest deployment status (should be 'Success' or 'Building')"
echo ""
echo "2. CHECK STRAPI ADMIN UI:"
echo "   → Open: https://bright-smile-1f47bc9d67.strapiapp.com/admin"
echo "   → Go to: Content Manager (left sidebar)"
echo "   → Look for: 'Sector Page' in the content types list"
echo ""
echo "3. IF NOT VISIBLE:"
echo "   → Go to: Settings → Content-Type Builder"
echo "   → Check if 'Sector Page' is listed"
echo "   → If not listed, the deployment may have failed or content type isn't registered"
echo ""
echo "4. DEPLOYMENT LOGS:"
echo "   → https://cloud.strapi.io/projects/lijfrente-cms-0576b86ef3/deployments"
echo "   → Click on the latest deployment"
echo "   → Check for any build errors"
echo ""
