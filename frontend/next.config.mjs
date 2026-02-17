/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bright-smile-1f47bc9d67.strapiapp.com',
        pathname: '/uploads/**',
      },
      // Strapi Cloud serves transformed images from a separate media CDN host.
      {
        protocol: 'https',
        hostname: 'bright-smile-1f47bc9d67.media.strapiapp.com',
        pathname: '/**',
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


