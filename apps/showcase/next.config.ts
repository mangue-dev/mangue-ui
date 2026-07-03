import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this monorepo (a stray lockfile elsewhere on the
  // machine would otherwise make Next infer the wrong root).
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  // Compile the workspace library from source (it ships TS/TSX, not a build).
  transpilePackages: ["mangue-ui"],
};

export default nextConfig;
