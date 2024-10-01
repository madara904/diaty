/** @type {import('next').NextConfig} */
const nextConfig = {  
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
