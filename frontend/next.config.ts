import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kihanindiabuild1-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "pub-5115749a54c14e0c8a6653af2bdb93c3.r2.dev",
      },
      {
        // future custom domain
        protocol: "https",
        hostname: "api.kihanindia.com",
      },
    ],
  },
};

export default nextConfig;
