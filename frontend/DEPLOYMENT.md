# Vercel Deployment Guide

## Password Protection Setup

This site includes a custom password protection system for work-in-progress deployments.

### Quick Setup

1. **Enable Password Protection** - Set environment variable in Vercel:
   ```
   NEXT_PUBLIC_PASSWORD_PROTECTION=true
   ```

2. **Set Your Password** - Set environment variable in Vercel:
   ```
   SITE_PASSWORD=your_secure_password
   ```

3. **Deploy!**

### How It Works

- When `NEXT_PUBLIC_PASSWORD_PROTECTION` is `true`, all pages require password authentication
- Users enter the password once, and a secure cookie is set for 7 days
- The password page matches your site's theme (emerald green gradient)
- Static assets, API routes, and Next.js internals are not password-protected

### Vercel Deployment Steps

#### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to frontend directory
cd /Users/danieldevos/Documents/ALT\ F\ AWESOME/lijfrente-react/frontend

# Deploy
vercel

# For production
vercel --prod
```

#### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Set the root directory to `frontend`
5. Add environment variables:
   - `NEXT_PUBLIC_PASSWORD_PROTECTION=true`
   - `SITE_PASSWORD=your_password`
   - `NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app`
6. Click "Deploy"

### Environment Variables

Set these in Vercel Dashboard (Settings → Environment Variables):

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_PASSWORD_PROTECTION` | `true` or `false` | Enable/disable password protection |
| `SITE_PASSWORD` | Your password | The password users must enter |
| `NEXT_PUBLIC_BASE_URL` | Your domain | Your site's URL |

### Disable Password Protection

When your site is ready for public access, simply set:
```
NEXT_PUBLIC_PASSWORD_PROTECTION=false
```

Or remove the environment variable entirely.

### Security Notes

- Password is validated server-side
- Cookie is HTTP-only and secure in production
- Cookie expires after 7 days
- Password is stored as plain text in env vars (fine for basic WIP protection)
- For production sites, consider more robust authentication

### Troubleshooting

**Redirect loop?**
- Clear your browser cookies
- Check that `NEXT_PUBLIC_PASSWORD_PROTECTION` is set correctly

**Can't access after entering password?**
- Ensure cookies are enabled in your browser
- Check browser console for errors

**Password not working?**
- Verify `SITE_PASSWORD` environment variable is set correctly
- Check for extra spaces in the environment variable value

## Additional Vercel Configuration

The project includes:
- `vercel.json` for custom headers
- Automatic deployments on git push (when connected to Git)
- Preview deployments for pull requests
- Environment variables per environment (Development, Preview, Production)

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Password protection enabled for WIP
- [ ] Test the deployed site
- [ ] Verify password access works
- [ ] Check all pages load correctly
- [ ] Test on mobile devices
- [ ] Disable password protection when ready for launch

