import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 600,
};

export default nextConfig;
