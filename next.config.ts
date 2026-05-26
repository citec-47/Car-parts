import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin workspace root so Turbopack doesn't pick up C:\Users\ADMIN\package-lock.json
    root: path.resolve(process.cwd()),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Product image uploads can exceed the default 1 MB. 20 MB covers a few
      // full-resolution phone photos in a single publish.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
