#!/bin/bash
# Security audit script - checks for exposed secrets and security issues

set -e

echo "🔒 Security Audit"
echo "================="
echo ""

ISSUES=0

# Check 1: Hardcoded tokens in code (look for actual token values, not variable names)
echo "1. Checking for hardcoded tokens..."
# Look for long strings that look like tokens (64+ chars, alphanumeric)
TOKEN_MATCHES=$(grep -rE "[a-f0-9]{64,}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  app/ components/ lib/ 2>/dev/null | \
  grep -v "process.env" | \
  grep -v "//" | \
  grep -v "/\*" | \
  grep -v "\.md" | \
  wc -l | tr -d ' ')

if [ "$TOKEN_MATCHES" -gt 0 ]; then
    echo "   ❌ Found potential hardcoded tokens (long hex strings)!"
    grep -rE "[a-f0-9]{64,}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
      app/ components/ lib/ 2>/dev/null | \
      grep -v "process.env" | \
      grep -v "//" | \
      grep -v "/\*"
    ISSUES=$((ISSUES + 1))
else
    echo "   ✅ No hardcoded token values found"
fi

# Check 2: Environment files in git
echo ""
echo "2. Checking for committed environment files..."
if git ls-files | grep -q "\.env"; then
    echo "   ❌ Found .env files in git!"
    git ls-files | grep "\.env"
    ISSUES=$((ISSUES + 1))
else
    echo "   ✅ No .env files in git"
fi

# Check 3: Client-side token exposure (only in client components, not API routes)
echo ""
echo "3. Checking for client-side token exposure..."
# Check client components (not API routes) for direct token usage
CLIENT_EXPOSURE=$(find app components -name "*.tsx" -o -name "*.ts" 2>/dev/null | \
  grep -v "/api/" | \
  xargs grep -l "STRAPI_API_TOKEN\|STRAPI_TOKEN" 2>/dev/null | \
  xargs grep -v "process.env" 2>/dev/null | \
  grep -v "NEXT_PUBLIC" | \
  grep -v "//" | \
  grep -v "/\*" | \
  wc -l | tr -d ' ')

if [ "$CLIENT_EXPOSURE" -gt 0 ]; then
    echo "   ❌ Found potential client-side token exposure!"
    find app components -name "*.tsx" -o -name "*.ts" 2>/dev/null | \
      grep -v "/api/" | \
      xargs grep -l "STRAPI_API_TOKEN\|STRAPI_TOKEN" 2>/dev/null | \
      xargs grep -v "process.env" 2>/dev/null | \
      grep -v "NEXT_PUBLIC" | \
      grep -v "//" | \
      grep -v "/\*"
    ISSUES=$((ISSUES + 1))
else
    echo "   ✅ No client-side token exposure (tokens only in API routes/server code)"
fi

# Check 4: .gitignore configuration
echo ""
echo "4. Checking .gitignore configuration..."
if grep -q "\.env" .gitignore; then
    echo "   ✅ .env files are in .gitignore"
else
    echo "   ⚠️  .env files not in .gitignore"
    ISSUES=$((ISSUES + 1))
fi

# Check 5: API routes using server-side tokens
echo ""
echo "5. Checking API routes use server-side tokens..."
API_ROUTES=$(find app/api -name "route.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$API_ROUTES" -gt 0 ]; then
    echo "   ✅ Found $API_ROUTES API route(s)"
    # Check if they use process.env.STRAPI_API_TOKEN (not NEXT_PUBLIC)
    for route in app/api/**/route.ts; do
        if [ -f "$route" ]; then
            if grep -q "NEXT_PUBLIC_STRAPI_API_TOKEN" "$route"; then
                echo "   ❌ $route uses NEXT_PUBLIC_STRAPI_API_TOKEN (should use STRAPI_API_TOKEN)"
                ISSUES=$((ISSUES + 1))
            fi
        fi
    done
else
    echo "   ⚠️  No API routes found"
fi

# Summary
echo ""
echo "================="
if [ "$ISSUES" -eq 0 ]; then
    echo "✅ Security audit passed! No issues found."
    exit 0
else
    echo "❌ Security audit failed! Found $ISSUES issue(s)."
    echo ""
    echo "📚 See SECURITY_CHECKLIST.md for how to fix these issues."
    exit 1
fi
