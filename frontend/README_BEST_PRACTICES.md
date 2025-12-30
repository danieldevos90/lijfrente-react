# Best Practices Quick Reference

## 🚀 Quick Start

1. **Read the guides:**
   - `STRAPI_BEST_PRACTICES.md` - Complete best practices guide
   - `SECURITY_CHECKLIST.md` - Security checklist
   - `VERCEL_STRAPI_FIX.md` - Vercel setup guide

2. **Run security audit:**
   ```bash
   ./scripts/security-audit.sh
   ```

3. **Before committing:**
   - Run security audit
   - Check no tokens in code
   - Verify .env files not committed

## 📋 Essential Practices

### ✅ DO:
- Use API routes for client-side Strapi calls
- Store tokens in environment variables
- Use Read-only tokens when possible
- Test locally before deploying
- Document environment variables

### ❌ DON'T:
- Call Strapi directly from client components
- Hardcode tokens in code
- Commit .env files
- Use Full-access tokens unnecessarily
- Expose tokens to browser

## 🔗 Key Files

- `STRAPI_BEST_PRACTICES.md` - Complete guide
- `SECURITY_CHECKLIST.md` - Security practices
- `scripts/security-audit.sh` - Security checker
- `ENV_STATUS.md` - Environment variable status
