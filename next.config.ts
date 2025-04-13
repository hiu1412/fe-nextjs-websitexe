import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Tắt StrictMode trong môi trường production
  reactStrictMode: process.env.NODE_ENV !== 'production',
};

export default nextConfig;
