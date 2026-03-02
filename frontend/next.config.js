/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better Vercel compatibility
  output: 'standalone',
  
  // Configure asset handling
  assetPrefix: '',
  
  // Ensure proper trailing slash handling
  trailingSlash: false,
  
  // Configure rewrites if needed
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/favicon.ico.png',
        destination: '/favicon.ico',
        permanent: true,
      },
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  
  // Optimize build
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;