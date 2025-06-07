import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'resumeably.ai'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  eslint: {
    // During production builds, do not run ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
