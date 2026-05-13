import type { NextConfig } from "next";

/** Hosts allowed for `next/image` optimization (CMS may use subdomains or CDNs). */
const IMAGE_REMOTE_PATTERNS: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
  { protocol: "https", hostname: "karyaninfratech.co.in", pathname: "/**" },
  { protocol: "http", hostname: "karyaninfratech.co.in", pathname: "/**" },
  { protocol: "https", hostname: "www.karyaninfratech.co.in", pathname: "/**" },
  { protocol: "http", hostname: "www.karyaninfratech.co.in", pathname: "/**" },
  { protocol: "https", hostname: "**.karyaninfratech.co.in", pathname: "/**" },
  { protocol: "http", hostname: "**.karyaninfratech.co.in", pathname: "/**" },
  { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
  { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["jodit-react", "jodit"],
  images: {
    /**
     * Bypass the /_next/image optimizer entirely.
     * Images from Firebase Storage / WP CDN are already optimised at source.
     * This removes the server-side proxy that was silently failing in production
     * (server can't always reach the external CDN; local dev can).
     */
    unoptimized: true,
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
