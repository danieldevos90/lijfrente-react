# Quick Start: Deploy Password Protection to Vercel

## 5-Minute Setup

### Step 1: Commit Changes (1 min)
```bash
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/lijfrente-react/frontend
git add -A
git commit -m "Add password protection - ready for Vercel deployment"
git push origin main
```

### Step 2: Set Environment Variables on Vercel (2 min)

**Go to:** https://vercel.com/dashboard

1. Click your project
2. Go to **Settings** → **Environment Variables**
3. Add these two variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_PASSWORD_PROTECTION`
- Value: `true`
- Environment: Production (and Preview if testing)
- Save

**Variable 2:**
- Name: `SITE_PASSWORD`
- Value: `YourChosenPassword123` (use a strong password!)
- Environment: Production (and Preview if testing)
- Type: Secret
- Save

### Step 3: Trigger Deployment (2 min)

**Option A: Automatic**
- Push a commit to main branch
- Vercel auto-deploys
- Wait ~2-5 minutes for deployment

**Option B: Manual**
- Go to Vercel Dashboard
- Click "Deployments"
- Click three dots on latest deploy
- Click "Redeploy"

## What's Already Configured

✅ Middleware (`frontend/middleware.ts`) - Protects pages
✅ API Route (`frontend/app/api/verify-password/route.ts`) - Verifies passwords
✅ Password Page (`frontend/app/password/page.tsx`) - Beautiful UI
✅ Vercel Config (`frontend/vercel.json`) - Prevents caching

## Testing

### Test It Works
1. Go to your Vercel URL
2. Should see password page immediately
3. Enter the password you set in Step 2
4. Should redirect to home page
5. Refresh page - should stay on home page (cookie saved)

### Clear Cookie to Test Again
In browser DevTools (F12):
- Application → Cookies
- Find `site-password-verified`
- Delete it
- Refresh page
- Should see password page again

## Local Development

**To test locally with password protection:**

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_PASSWORD_PROTECTION=true
SITE_PASSWORD=testpassword123
```

Run:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` and test with password `testpassword123`

**To disable for local development:**
```env
NEXT_PUBLIC_PASSWORD_PROTECTION=false
```

## Change Password Later

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Edit `SITE_PASSWORD`
4. Redeploy
5. Done! (existing users' cookies last 7 days)

## Disable Password Protection

1. Set `NEXT_PUBLIC_PASSWORD_PROTECTION=false` in Vercel
2. Redeploy
3. No more password prompt

---

**Status:** ✅ All components deployed and ready!

