# Deploy Strapi to Cloud via CLI

## Quick Deploy

```bash
cd cms
npm run deploy
```

## First Time Setup

If this is your first time deploying, you'll need to login:

1. Run `npm run deploy`
2. When prompted, enter `Y` to login
3. Follow the browser authentication flow
4. After login, the deployment will proceed

## What Happens on Deploy

1. **Build** - Strapi builds your application
2. **Upload** - Code is uploaded to Strapi Cloud
3. **Bootstrap** - The bootstrap code in `cms/src/index.ts` runs automatically
4. **Permissions** - Sector-page permissions are automatically enabled via bootstrap code

## Bootstrap Code

The bootstrap code (lines 50-100 in `cms/src/index.ts`) automatically enables:
- Sector-page permissions (find, findOne, create, update)
- Other API permissions for Public role

## After Deployment

Once deployment completes:

1. **Verify permissions** - Check Strapi Admin → Settings → Roles → Public
2. **Generate sector pages**:
   ```bash
   python3 scripts/generate_sector_pages_unsplash.py
   ```

## Alternative: Manual Deploy

If you prefer not to use CLI, Strapi Cloud also deploys automatically from git:

1. Push changes to git
2. Strapi Cloud detects changes
3. Automatic deployment triggers
4. Bootstrap code runs on deployment

## Troubleshooting

### "We couldn't find a valid token"

You need to login first:
```bash
cd cms
npm run deploy
# Enter Y when prompted to login
```

### Deployment fails

- Check you're in the `cms` directory
- Ensure all dependencies are installed: `npm install`
- Check Strapi Cloud project is connected
- Verify you have deployment permissions

### Permissions not enabled after deploy

- Wait a few minutes for bootstrap to complete
- Check Strapi Admin → Settings → Roles → Public
- Manually enable permissions if needed (see STRAPI_UPDATE_GUIDE.md)
