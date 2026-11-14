import type { NextConfig } from "next";

// The site is deployed to GitHub Pages as a static export, so there is no
// server to optimise images at request time.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
