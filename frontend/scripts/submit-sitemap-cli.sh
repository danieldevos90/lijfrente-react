#!/bin/bash

# Google Search Console Sitemap Submission via CLI
# 
# This script submits your sitemap to Google Search Console using curl.
# 
# Prerequisites:
# 1. Get your Google Search Console access token
# 2. Get your site URL (property URL)
# 
# Usage:
#   ./scripts/submit-sitemap-cli.sh [sitemap-url] [site-url] [access-token]
#
# To get access token:
# 1. Go to https://console.cloud.google.com/
# 2. Create OAuth 2.0 credentials
# 3. Use OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
# 4. Select "Search Console API v1" scope
# 5. Get access token

set -e

SITEMAP_URL="${1:-https://geldgeregeld.nl/sitemap.xml}"
SITE_URL="${2:-https://geldgeregeld.nl}"
ACCESS_TOKEN="${3:-$GOOGLE_SEARCH_CONSOLE_TOKEN}"

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Error: Access token not provided"
    echo ""
    echo "Usage:"
    echo "  ./scripts/submit-sitemap-cli.sh [sitemap-url] [site-url] [access-token]"
    echo ""
    echo "Or set GOOGLE_SEARCH_CONSOLE_TOKEN environment variable:"
    echo "  export GOOGLE_SEARCH_CONSOLE_TOKEN=your_token_here"
    echo ""
    echo "To get access token:"
    echo "1. Go to https://developers.google.com/oauthplayground/"
    echo "2. Select 'Search Console API v1' scope"
    echo "3. Authorize and get access token"
    exit 1
fi

# URL encode the site URL
ENCODED_SITE_URL=$(echo "$SITE_URL" | sed 's|:|%3A|g' | sed 's|/|%2F|g')
ENCODED_SITEMAP_URL=$(echo "$SITEMAP_URL" | sed 's|:|%3A|g' | sed 's|/|%2F|g')

echo "Submitting sitemap..."
echo "  Site: $SITE_URL"
echo "  Sitemap: $SITEMAP_URL"
echo ""

# Submit sitemap using Search Console API
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/sitemaps/${ENCODED_SITEMAP_URL}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    echo "✅ Sitemap submitted successfully!"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ Error submitting sitemap (HTTP $HTTP_CODE)"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    exit 1
fi
