import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/** CSP allowances for GA4 / gtag per https://developers.google.com/tag-platform/security/guides/csp */
const cspDirectives = [
  "default-src 'self'",
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://*.googletagmanager.com",
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  [
    "img-src",
    "'self'",
    "data:",
    "blob:",
    "https://*.google-analytics.com",
    "https://*.googletagmanager.com",
  ].join(" "),
  "font-src 'self' https://fonts.gstatic.com",
  [
    "connect-src",
    "'self'",
    "https://api.openai.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
  ].join(" "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] as const : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    const securityHeaders: { key: string; value: string }[] = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
      {
        key: "Content-Security-Policy",
        value: cspDirectives.join("; "),
      },
      {
        key: "Link",
        value: "<https://www.googletagmanager.com>; rel=preconnect; crossorigin",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
