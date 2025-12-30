# Strapi Deployment Troubleshooting

## Issue: "I don't see the build in Strapi"

If you don't see the deployment in Strapi Cloud or the content type isn't appearing, follow these steps:

## Step 1: Check Deployment Status

1. **Go to Strapi Cloud Dashboard:**
   - URL: https://cloud.strapi.io/projects
   - Login if needed
   - Select your project: **lijfrente-cms**
   - Click on the **"Deployments"** tab

2. **Check Latest Deployment:**
   - Look for the most recent deployment
   - Status should be one of:
     - ✅ **Success** - Deployment completed successfully
     - 🔄 **Building** - Deployment in progress
     - ❌ **Failed** - Deployment failed (check logs)
     - ⏸️ **Pending** - Waiting to start

3. **View Deployment Logs:**
   - Click on the latest deployment
   - Review the build logs for errors
   - Look for TypeScript compilation errors
   - Check for missing dependencies

## Step 2: Verify Content Type Registration

1. **Check Strapi Admin UI:**
   - URL: https://bright-smile-1f47bc9d67.strapiapp.com/admin
   - Go to: **Content Manager** (left sidebar)
   - Look for: **"Sector Page"** in the content types list

2. **Check Content-Type Builder:**
   - Go to: **Settings** → **Content-Type Builder**
   - Look for: **"Sector Page"** in the list
   - If it's not there, the content type isn't registered

3. **Check Permissions:**
   - Go to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
   - Look for: **"Sector-page"** in the permissions list
   - If not visible, content type isn't registered yet

## Step 3: Verify Files Are Deployed

The following files should exist in your Strapi Cloud deployment:

```
cms/src/api/sector-page/
├── content-types/
│   └── sector-page/
│       └── schema.json
├── controllers/
│   └── sector-page.ts
├── routes/
│   └── sector-page.ts
└── services/
    └── sector-page.ts
```

**To verify:**
1. Check git repository: Files are committed and pushed
2. Check deployment logs: No errors during build
3. Check Strapi admin: Content type appears in UI

## Step 4: Common Issues

### Issue: Deployment Shows "Failed"

**Check build logs for:**
- TypeScript compilation errors
- Missing dependencies
- Syntax errors in files
- Missing files or directories

**Solution:**
- Fix errors in local code
- Commit and push changes
- Redeploy

### Issue: Deployment Shows "Success" but Content Type Not Visible

**Possible causes:**
1. Strapi hasn't restarted yet (wait 2-5 minutes)
2. Bootstrap code hasn't run (permissions not enabled)
3. Content type schema has errors

**Solution:**
1. Wait a few minutes for Strapi to fully restart
2. Check Strapi admin UI again
3. Check deployment logs for bootstrap errors
4. Manually check Content-Type Builder

### Issue: Content Type Visible but API Returns 404

**Possible causes:**
1. Permissions not enabled for Public role
2. Routes not properly registered
3. API endpoint path incorrect

**Solution:**
1. Enable permissions in Settings → Roles → Public → Sector-page
2. Check bootstrap code ran successfully
3. Verify routes file exists and is correct

## Step 5: Manual Verification

Run this script to check deployment status:

```bash
./scripts/check_deployment_status.sh
```

Or manually test the API:

```bash
curl -I https://bright-smile-1f47bc9d67.strapiapp.com/api/sector-pages
```

Expected responses:
- **404** - Content type not registered yet (wait or redeploy)
- **403** - Content type exists but permissions not enabled
- **200** - Content type is registered and accessible ✅

## Step 6: Redeploy if Needed

If the deployment failed or content type isn't appearing:

```bash
cd cms
npm run deploy -- --force
```

This will:
1. Build the application
2. Upload to Strapi Cloud
3. Trigger a new deployment
4. Run bootstrap code (enables permissions)

## Still Having Issues?

1. **Check Strapi Cloud Status Page:** https://status.strapi.io/
2. **Review Deployment Logs:** Full error messages
3. **Verify Git Repository:** All files committed and pushed
4. **Check Bootstrap Code:** `cms/src/index.ts` includes sector-page permissions
5. **Contact Support:** If deployment consistently fails
