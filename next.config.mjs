/** @type {import('next').NextConfig} */
const nextConfig = {  
    experimental: {
      missingSuspenseWithCSRBailout: false,
      serverActions: true
    },
    images: {
      domains: ['images.openfoodfacts.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },};


export default nextConfig;
