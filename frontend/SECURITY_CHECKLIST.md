# Security Checklist

## 🔒 Pre-Commit Security Checklist

Before committing code, verify:

- [ ] **No API tokens in code**
  - Search for: `STRAPI.*TOKEN|API.*KEY|SECRET`
  - No hardcoded tokens in `.ts`, `.tsx`, `.js`, `.jsx` files

- [ ] **No environment files committed**
  - `.env.local` is in `.gitignore`
  - `.env` is in `.gitignore`
  - No `.env.*` files in git

- [ ] **No credentials in comments**
  - No tokens in code comments
  - No passwords in documentation

- [ ] **Client-side code is secure**
  - No `NEXT_PUBLIC_*` variables with sensitive data
  - Client components use API routes, not direct API calls
  - No tokens exposed to browser

## 🚀 Pre-Deployment Security Checklist

Before deploying to Vercel:

- [ ] **Environment variables set**
  - `STRAPI_API_TOKEN` set in Vercel
  - `NEXT_PUBLIC_STRAPI_URL` set in Vercel
  - All required variables present

- [ ] **Token security**
  - Using Read-only tokens when possible
  - Tokens not expired
  - Different tokens for dev/staging/prod

- [ ] **Error handling**
  - Errors don't expose sensitive information
  - No stack traces in production
  - Graceful fallbacks implemented

- [ ] **API routes secured**
  - Input validation on all API routes
  - Rate limiting considered (if needed)
  - Proper error responses

## 🔍 Security Audit Commands

```bash
# Check for hardcoded tokens
cd frontend
grep -r "STRAPI.*TOKEN" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v "process.env" | grep -v "NEXT_PUBLIC"

# Check for API keys
grep -r "api.*key\|API.*KEY\|secret\|SECRET" --include="*.ts" --include="*.tsx" | grep -v "process.env" | grep -v "NEXT_PUBLIC"

# Verify .env files are gitignored
git check-ignore .env.local .env

# Check for exposed tokens in client code
grep -r "STRAPI_API_TOKEN" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "process.env" | grep -v "NEXT_PUBLIC"
```

## 🛡️ Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate tokens regularly** - Every 90 days recommended
3. **Use least privilege** - Read-only tokens when possible
4. **Separate environments** - Different tokens for dev/prod
5. **Monitor access** - Check Strapi admin for token usage
6. **Audit regularly** - Review code for security issues

## 📋 Quick Security Fixes

If you find a security issue:

1. **Immediately rotate the exposed token**
   - Go to Strapi Admin → Settings → API Tokens
   - Delete the exposed token
   - Create a new token
   - Update in Vercel

2. **Remove from git history** (if committed)
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Update all environments**
   - Update Vercel environment variables
   - Update local `.env.local`
   - Redeploy all environments
