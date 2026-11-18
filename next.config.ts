import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";
const ghPagesBase = "/demos/tawarkan";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export" as const,
        basePath: ghPagesBase,
        assetPrefix: ghPagesBase,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;