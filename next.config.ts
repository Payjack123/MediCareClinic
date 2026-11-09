import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(',').concat(['192.17.13.12'])
    : ['192.17.13.12'],
  async redirects() {
    return [
      {
        source: '/landing/goi-kham/:path*',
        destination: '/landing/dat-lich',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
