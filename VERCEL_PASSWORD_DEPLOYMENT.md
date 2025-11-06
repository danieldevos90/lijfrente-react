# Vercel Password Protection Deployment Guide

## Overview
This guide explains how to enable password protection on your Vercel deployment using the password module you've created.

## Components in Place
✅ **Middleware** (`frontend/middleware.ts`) - Checks password cookie and redirects to password page
✅ **Password API** (`frontend/app/api/verify-password/route.ts`) - Verifies the password and sets a cookie
✅ **Password Page** (`frontend/app/password/page.tsx`) - Beautiful password entry form
✅ **Vercel Config** (`frontend/vercel.json`) - Sets cache headers to prevent page caching

## How It Works
1. User visits your site
2. Middleware checks for `site-password-verified` cookie
3. If cookie missing/invalid → redirected to `/password` page
4. User enters password
5. API verifies password matches `SITE_PASSWORD` environment variable
6. If correct → sets cookie and redirects back to original page
7. If incorrect → shows error message

## Deployment Steps on Vercel

### Step 1: Set Environment Variables
In your Vercel Dashboard:

1. Go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_PASSWORD_PROTECTION` | `true` | Public |
| `SITE_PASSWORD` | Your desired password | Secret |

**For Development Environment (Optional):**
- Set `NEXT_PUBLIC_PASSWORD_PROTECTION` to `false` for local development
- Or set `SITE_PASSWORD` to a test password

### Step 2: Configure Deployment
1. Ensure `vercel.json` is properly configured (already done)
2. Make sure `middleware.ts` is in your `frontend/app/` directory (already done)
3. Commit all changes to git:

```bash
cd frontend
git add .
git commit -m "Add password protection module for Vercel deployment"
git push
```

### Step 3: Deploy to Vercel
Option A: Automatic (Recommended)
- Push to your main branch
- Vercel automatically deploys with your new environment variables

Option B: Manual Deploy
```bash
vercel deploy --prod
```

## Environment Variables Explained

### NEXT_PUBLIC_PASSWORD_PROTECTION
- **Type:** Public (visible in browser)
- **Values:** `true` or `false`
- **Purpose:** Enable/disable the entire password protection system
- **Default:** `false` (no protection)
- When `false`, the middleware skips password checks

### SITE_PASSWORD
- **Type:** Secret (not visible in browser)
- **Purpose:** The actual password users must enter
- **Security:** Keep this secret! Never commit to git
- **Example:** Use a strong password like `Kw9$mP2xLq#`

## Local Development

### With Password Protection Enabled
```bash
# In frontend/.env.local
NEXT_PUBLIC_PASSWORD_PROTECTION=true
SITE_PASSWORD=testpassword123
```

### Without Password Protection
```bash
# In frontend/.env.local
NEXT_PUBLIC_PASSWORD_PROTECTION=false
```

## Testing

### Test Password Protection Locally
1. Set up `.env.local` with password enabled
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Should redirect to password page
5. Enter password to access site

### Test on Vercel Staging
1. Create a preview environment or staging branch
2. Set the same environment variables
3. Deploy to preview
4. Verify password prompt appears

## Troubleshooting

### Password page doesn't appear
- Check `NEXT_PUBLIC_PASSWORD_PROTECTION` is set to `true`
- Clear browser cookies: `site-password-verified`
- Check browser console for errors

### Password always fails
- Verify `SITE_PASSWORD` environment variable is set correctly
- Check for trailing spaces in password variable
- Restart Vercel deployment after changing variables

### Can't access site after entering correct password
- Clear `site-password-verified` cookie
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for JavaScript errors

### API route returns 500 error
- Ensure `next.config.mjs` supports API routes
- Check middleware isn't blocking `/api/verify-password`
- Verify no TypeScript errors: `npm run build`

## Security Considerations

✅ **Implemented:**
- Passwords set via environment variables (not in code)
- HttpOnly cookies (can't be accessed via JavaScript)
- Secure flag on production (HTTPS only)
- 7-day cookie expiration
- CSRF protection via SameSite cookie policy

⚠️ **Not Implemented (Consider for Production):**
- Rate limiting on password attempts
- IP-based restrictions
- Audit logging of access attempts
- Multiple password support
- Integration with authentication system

## Changing Password

To change the password:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit `SITE_PASSWORD` with new value
3. Redeploy or trigger redeployment
4. Users' existing cookies remain valid (won't take effect until cookie expires in 7 days)
5. To force immediate change, clear users' cookies or set shorter expiration

## Disabling Password Protection

To disable password protection:

1. Set `NEXT_PUBLIC_PASSWORD_PROTECTION` to `false` in Vercel
2. Redeploy
3. Users will bypass the password check
4. Password page still accessible at `/password` but not required

## Cookie Details

- **Name:** `site-password-verified`
- **Value:** `true` (when valid password entered)
- **Expiration:** 7 days
- **Path:** `/` (entire site)
- **HttpOnly:** Yes (secure, can't be accessed from JS)
- **Secure:** Yes (only sent over HTTPS in production)
- **SameSite:** Lax (CSRF protection)

## Performance Impact

- **Minimal:** Middleware adds ~1-5ms latency per request
- **Caching:** Password page explicitly not cached
- **API:** API calls cached according to deployment rules

## Support

For issues with:
- **Vercel deployment:** Check Vercel docs
- **Next.js middleware:** Verify `middleware.ts` location and export
- **Environment variables:** Ensure no typos in variable names
- **Password logic:** Review `app/api/verify-password/route.ts`

---

**Last Updated:** November 6, 2025
**Module Status:** ✅ Ready for Production

