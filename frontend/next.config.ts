import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kihanindiabuild1-production.up.railway.app",
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
