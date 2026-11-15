import type { NextConfig } from "next";

/** Set STATIC_EXPORT=1 when building the GitHub Pages bundle under /demos/tawarkan. */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export" as const,
        basePath: "/demos/tawarkan",
        assetPrefix: "/demos/tawarkan",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
