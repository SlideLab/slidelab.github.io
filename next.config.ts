import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // keep production builds from replacing chunks used by a running dev server
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
