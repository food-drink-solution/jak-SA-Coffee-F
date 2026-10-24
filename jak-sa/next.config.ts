import type { NextConfig } from "next";

// Baseline security headers applied to every route.
// A strict CSP is intentionally deferred until the app is stable (issue #6):
// enabling one without nonces for Next's inline bootstrap scripts would break hydration.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Prefer modern formats; next/image negotiates via the Accept header (AVIF first).
    formats: ["image/avif", "image/webp"],
    // Tight allowlist (Next 16 makes this required); covers default `<Image>` usages (75).
    qualities: [50, 60, 75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    // Local uploads are immutable in practice — cache optimized variants for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
