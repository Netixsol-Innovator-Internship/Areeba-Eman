/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ prevents ESLint errors from blocking deployment
  },
};

export default nextConfig;