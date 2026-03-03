/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure environment variables are properly exposed
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize builds
  swcMinify: true,
}

module.exports = nextConfig
