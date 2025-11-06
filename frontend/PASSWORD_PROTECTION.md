# Password Protection Setup for Vercel

This site includes a simple password protection system for WIP (work in progress) deployments.

## How It Works

1. **Middleware Protection**: The `middleware.ts` file intercepts all requests and checks for authentication
2. **Password Page**: Users are redirected to `/password` to enter the password
3. **Cookie-Based Auth**: Once authenticated, a cookie is set for 24 hours
4. **Styled to Match Theme**: The password page uses the GeldGeregeld brand colors and design system

## Setup on Vercel

### 1. Set Environment Variable

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key**: `SITE_PASSWORD`
   - **Value**: Your desired password (e.g., `demo2024`)
   - **Environments**: Select Production, Preview, and Development as needed

### 2. Redeploy

After setting the environment variable, trigger a new deployment for the changes to take effect.

### 3. Disable Protection

To disable password protection, simply remove the `SITE_PASSWORD` environment variable or leave it empty.

## Security Notes

- This is a **simple protection system** intended for work-in-progress sites
- It is **NOT suitable for production security** requirements
- The password is stored in plain text as an environment variable
- Authentication is cookie-based with a 24-hour expiration
- For production sites, use proper authentication systems

## Local Development

To test password protection locally:

```bash
# In the frontend directory
echo "SITE_PASSWORD=testpassword" > .env.local
npm run dev
```

## Design

The password page features:
- Clean, modern design matching the GeldGeregeld theme
- Emerald green gradient header
- Smooth animations and transitions
- Mobile-responsive layout
- Clear error messages
- Loading states during verification

## Files

- `middleware.ts` - Request interceptor for authentication
- `app/password/page.tsx` - Password entry page component
- `app/password/password.module.css` - Styled password page
- `app/api/auth/route.ts` - API endpoint for password verification

