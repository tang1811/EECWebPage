import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone server: build a self-contained Node server (.next/standalone)
  // run by systemd on teletubbies (166.166.5.239:4003), fronted by an IIS
  // reverse proxy on 166.166.1.25:7488 — same Pattern B as assetstock/koomjo.
  output: "standalone",
  // Keep clean trailing-slash URLs (matches the previous static-export routing).
  trailingSlash: true,
  // Serve images as-is — avoids a runtime sharp dependency on the server.
  images: { unoptimized: true },
};

export default nextConfig;
