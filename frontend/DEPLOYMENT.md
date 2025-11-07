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
| `RESEND_API_KEY` | `re_9XLWRyjd_4bro1ivbtMb8K9GwDSiJL225` | Resend API key for contact form emails |
| `RESEND_FROM_EMAIL` | `hello@geldgeregeld.nl` | Email address to send from (must be verified in Resend) |
| `CONTACT_EMAIL` | `info@geldgeregeld.nl` | Email address to receive contact form submissions |

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

## Contact Form Setup

The contact form uses Resend for sending emails. Make sure to configure these environment variables in Vercel:

1. **RESEND_API_KEY** - Your Resend API key
   - Value: `re_9XLWRyjd_4bro1ivbtMb8K9GwDSiJL225`
   - Required for the contact form to work

2. **RESEND_FROM_EMAIL** - Email address to send from
   - Value: `hello@geldgeregeld.nl`
   - Must be verified in your Resend account
   - Defaults to `hello@geldgeregeld.nl` if not set

3. **CONTACT_EMAIL** - Email address to receive submissions
   - Value: `info@geldgeregeld.nl` (or your preferred email)
   - Defaults to `info@geldgeregeld.nl` if not set

### Setting Up Resend in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `RESEND_API_KEY` = `re_9XLWRyjd_4bro1ivbtMb8K9GwDSiJL225`
   - `RESEND_FROM_EMAIL` = `hello@geldgeregeld.nl`
   - `CONTACT_EMAIL` = `info@geldgeregeld.nl` (optional)
4. Make sure to set them for **Production**, **Preview**, and **Development** environments as needed
5. Redeploy your application for changes to take effect

### Verifying Your Domain in Resend

Before the contact form can send emails, you need to verify `geldgeregeld.nl` in your Resend account:

1. Log in to [Resend](https://resend.com)
2. Go to **Domains**
3. Add and verify `geldgeregeld.nl`
4. Add the required DNS records to your domain
5. Once verified, emails from `hello@geldgeregeld.nl` will work

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

