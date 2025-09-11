/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'easygoing-spontaneity-production.up.railway.app',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
