# Setting Up cms.geldgeregeld.nl for Strapi

## Current Setup
- **Strapi Cloud URL:** `https://bright-smile-1f47bc9d67.strapiapp.com`
- **Target Custom Domain:** `https://cms.geldgeregeld.nl`

---

## Step 1: Add Custom Domain in Strapi Cloud

1. **Login to Strapi Cloud:**
   - Go to: https://cloud.strapi.io
   - Navigate to your project: `lijfrente-cms`

2. **Open Domain Settings:**
   - Click **Settings** in the left sidebar
   - Click **Domains**

3. **Add the Custom Domain:**
   - Click **"Add domain"** button
   - Enter: `cms.geldgeregeld.nl`
   - Click **Save**

4. **Note the CNAME Target:**
   - Strapi will display a CNAME target (e.g., `cname.strapiapp.com` or your specific subdomain)
   - Copy this value for the next step

---

## Step 2: Configure DNS

Add a **CNAME record** at your DNS provider (where geldgeregeld.nl is registered):

### Option A: If using Cloudflare DNS
1. Go to Cloudflare Dashboard → geldgeregeld.nl → DNS
2. Add record:
   - **Type:** CNAME
   - **Name:** `cms`
   - **Target:** `bright-smile-1f47bc9d67.strapiapp.com` (or the CNAME from Strapi Cloud)
   - **Proxy status:** DNS only (grey cloud) - required for SSL to work
3. Save

### Option B: If using Vercel DNS
1. Go to Vercel Dashboard → Domains → geldgeregeld.nl
2. Add record:
   - **Type:** CNAME
   - **Name:** `cms`
   - **Value:** `bright-smile-1f47bc9d67.strapiapp.com`
3. Save

### Option C: If using another DNS provider
Add a CNAME record:
| Type | Host/Name | Value/Target | TTL |
|------|-----------|--------------|-----|
| CNAME | `cms` | `bright-smile-1f47bc9d67.strapiapp.com` | 3600 |

---

## Step 3: Wait for Propagation

- DNS changes typically take 5-30 minutes
- You can check propagation at: https://dnschecker.org/#CNAME/cms.geldgeregeld.nl
- Strapi Cloud will automatically provision an SSL certificate

---

## Step 4: Verify the Domain Works

Once propagated, verify:
- Admin panel: https://cms.geldgeregeld.nl/admin
- API endpoint: https://cms.geldgeregeld.nl/api/sites

---

## Step 5: Update Frontend Environment Variables

After the custom domain is working, update the Strapi URL in Vercel:

### In Vercel Dashboard:
1. Go to: https://vercel.com/danieldevos90s-projects/geldgeregeld2
2. Navigate to **Settings** → **Environment Variables**
3. Find or add `NEXT_PUBLIC_STRAPI_URL`
4. Update value to: `https://cms.geldgeregeld.nl`
5. Click **Save**
6. **Redeploy** the application

### Environment Variables to Update:
| Variable | Old Value | New Value |
|----------|-----------|-----------|
| `NEXT_PUBLIC_STRAPI_URL` | `https://bright-smile-1f47bc9d67.strapiapp.com` | `https://cms.geldgeregeld.nl` |

---

## Step 6: Test Everything

After updating:
1. Visit your frontend site
2. Check that data still loads correctly
3. Test the admin panel at https://cms.geldgeregeld.nl/admin

---

## Troubleshooting

### SSL Certificate Issues
- Make sure Cloudflare proxy is **OFF** (grey cloud) if using Cloudflare
- Wait up to 24 hours for SSL provisioning in some cases

### Domain Not Resolving
- Check DNS propagation: https://dnschecker.org
- Verify CNAME record is correct
- Clear browser cache or try incognito

### API Errors After Domain Change
- Ensure `NEXT_PUBLIC_STRAPI_URL` uses `https://` (not `http://`)
- Verify CORS settings in Strapi if needed
- Check that the domain is added to Strapi Cloud's allowed origins

---

## Quick Commands

Check DNS:
```bash
# Check if CNAME is propagated
dig cms.geldgeregeld.nl CNAME

# Or use nslookup
nslookup cms.geldgeregeld.nl
```

Test API:
```bash
# Test the new domain
curl -s "https://cms.geldgeregeld.nl/api/sites" | head -20
```

---

## Summary Checklist

- [ ] Add `cms.geldgeregeld.nl` in Strapi Cloud dashboard
- [ ] Add CNAME record in DNS provider
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Verify https://cms.geldgeregeld.nl works
- [ ] Update `NEXT_PUBLIC_STRAPI_URL` in Vercel
- [ ] Redeploy frontend
- [ ] Test frontend still loads data correctly
