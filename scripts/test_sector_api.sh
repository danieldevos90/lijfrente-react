#!/bin/bash
# Test Sector-Page API endpoint

STRAPI_URL="https://bright-smile-1f47bc9d67.strapiapp.com"
STRAPI_TOKEN="f23be38b09e4560542c2ddbac2d685621a911af4f9e30a7fea23cb1e8b7857a727f67550acfc2bec227f023df2b21b4a2776e53c51867423e30fcdc25a9334ee2db86f69a47d4f9ea6d5186cebc1b52553a8d6fa29201cf0a5658774b9b2a2a5e5b6302f105ed5006fc004d7fedd6908556ac88692ce907456239363d877bcb4"

echo "🧪 Testing Sector-Page API"
echo "================================"
echo ""

# Test the API
response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer ${STRAPI_TOKEN}" \
  -H "Content-Type: application/json" \
  "${STRAPI_URL}/api/sector-pages" \
  --max-time 15)

# Extract status code (last line)
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "Status: $status_code"
echo ""

if [ "$status_code" = "200" ]; then
  echo "✅ API is working!"
  count=$(echo "$body" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('data', [])))" 2>/dev/null || echo "0")
  echo "Found $count sector page(s)"
elif [ "$status_code" = "404" ]; then
  echo "❌ 404 - Routes not registered"
  echo "💡 Bootstrap function should have created content though"
elif [ "$status_code" = "403" ]; then
  echo "⚠️  403 Forbidden - Check permissions"
elif [ "$status_code" = "000" ]; then
  echo "❌ Connection timeout - Strapi may still be restarting"
  echo "💡 Wait 2-5 minutes and try again"
else
  echo "Response: $body" | head -c 200
fi

echo ""
