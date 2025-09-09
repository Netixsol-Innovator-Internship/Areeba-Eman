/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.18.96',
        port: '4000',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
