# Deploy Strapi Schema Changes via CLI

## Current Status
✅ Schema changes committed locally  
✅ CMS built successfully  
⏳ Ready to deploy to Strapi Cloud

## Deployment Steps

### Option 1: Deploy via CLI (Recommended)

1. **Open terminal and navigate to CMS directory:**
   ```bash
   cd cms
   ```

2. **Run deploy command:**
   ```bash
   npm run deploy -- --force
   ```

3. **When prompted to login:**
   - Press `Y` and Enter
   - A browser window will open
   - Complete the authentication in your browser
   - Return to terminal - deployment will proceed automatically

4. **Wait for deployment to complete** (2-5 minutes)

5. **After deployment, update contact info:**
   ```bash
   cd ..
   STRAPI_API_TOKEN="d99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad" python3 scripts/update_site_contact_info.py
   ```

### Option 2: Manual Field Addition (If CLI fails)

If the CLI deployment doesn't work, add fields manually:

1. **Go to Strapi Admin:**
   - URL: https://bright-smile-1f47bc9d67.strapiapp.com/admin

2. **Navigate to Content-Type Builder:**
   - Click **Content-Type Builder** in left sidebar
   - Find and click **Site**

3. **Add Fields:**
   - Click **"Add another field"**
   - Add `email` (type: **Text**)
   - Click **"Add another field"**
   - Add `phone` (type: **Text**)
   - Click **"Add another field"**
   - Add `kvkNumber` (type: **Text**)
   - Click **Save**

4. **Update contact info:**
   ```bash
   STRAPI_API_TOKEN="d99769076f02a2ce82aa21def32e0b23934127c16a95be87bc3d6909591b0e2be386a303de606e849b00e1c46a4d3f2a6a0bc9911f6511e80f5189f8d6d1d22a755015e3b8f0898007070a11366dfdc2570b3b568667be318f570a93f6ab7daef8ca2c5180c5a5f45794714b364aac4191c09a2bd138bbb837ca0061947e28ad" python3 scripts/update_site_contact_info.py
   ```

## Verification

After deployment and update, verify by checking:
- Components display contact info from Strapi
- API routes use Strapi email
- Contact forms work correctly
