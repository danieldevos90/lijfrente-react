/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.geldgeregeld.nl',
        pathname: '/uploads/**',
      },
      // Strapi Cloud media CDN (uploads may still be served from here)
      {
        protocol: 'https',
        hostname: 'bright-smile-1f47bc9d67.media.strapiapp.com',
        pathname: '/**',
      },
      // Legacy: keep old domain during transition
      {
        protocol: 'https',
        hostname: 'bright-smile-1f47bc9d67.strapiapp.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Disable image optimization for Strapi images to avoid 401 errors
    // Strapi images will be served directly without optimization
    unoptimized: false,
  },
};

export default nextConfig;


