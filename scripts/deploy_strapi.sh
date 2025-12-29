#!/bin/bash
# Deploy Strapi to Strapi Cloud via CLI
# This will trigger a deployment and run the bootstrap code to enable permissions

cd "$(dirname "$0")/../cms"

echo "🚀 Deploying Strapi to Cloud..."
echo ""
echo "Note: You may need to login to Strapi Cloud first if not already authenticated"
echo ""

# Run deploy command with --force to bypass confirmation
npx strapi deploy --force

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "After deployment completes:"
echo "1. The bootstrap code in src/index.ts will run automatically"
echo "2. Sector-page permissions will be enabled"
echo "3. You can then run: python3 scripts/generate_sector_pages_unsplash.py"
