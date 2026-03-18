import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Next dev cross-origin warnings between localhost/127.0.0.1
  // when loading /_next assets.
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
