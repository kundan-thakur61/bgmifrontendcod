/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: __dirname },

  // ── Technical SEO: Core ──
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false, // Enforce no trailing slash (canonical consistency)
  httpAgentOptions: { keepAlive: true },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib'],
  },

  // ── Image Optimization ──
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.battlexzone.com' },
      { protocol: 'https', hostname: 'cdn.battlexzone.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'api.battlexzone.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // ── Security + Performance Headers ──
  async headers() {
    return [
      // Static assets: aggressive caching
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, must-revalidate' },
        ],
      },
      // SEO: Allow search engines to access sitemap/robots
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Content-Type', value: 'application/xml' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // Global security headers
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com https://www.googletagmanager.com; connect-src 'self' https://api.battlexzone.com https://lux.razorpay.com wss://api.battlexzone.com https://www.google-analytics.com; frame-src https://api.razorpay.com https://checkout.razorpay.com; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },

  // ── SEO Redirects (preserve link equity) ──
  async redirects() {
    return [
      { source: '/old-matches', destination: '/matches', permanent: true },
      { source: '/old-tournaments', destination: '/tournaments', permanent: true },
      // Trailing slash removal (canonical enforcement)
      { source: '/matches/', destination: '/matches', permanent: true },
      { source: '/tournaments/', destination: '/tournaments', permanent: true },
      { source: '/blog/', destination: '/blog', permanent: true },
      { source: '/leaderboard/', destination: '/leaderboard', permanent: true },
      // Common BGMI misspellings / alternate URLs
      { source: '/bgmi-tournaments', destination: '/tournaments', permanent: true },
      { source: '/bgmi-matches', destination: '/matches', permanent: true },
      { source: '/pubg-tournaments', destination: '/tournaments', permanent: true },
      { source: '/bgmi-daily-scrims', destination: '/tournaments', permanent: true },
      { source: '/bgmi-custom-rooms', destination: '/matches', permanent: true },
      { source: '/signup', destination: '/register', permanent: true },
      { source: '/join', destination: '/register', permanent: true },
      { source: '/bgmi-tips', destination: '/blog', permanent: true },
    ];
  },

  // ── URL Rewrites for SEO-friendly paths ──
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        // Allow clean SEO URLs
        { source: '/play', destination: '/matches' },
        { source: '/compete', destination: '/tournaments' },
        { source: '/rankings', destination: '/leaderboard' },
      ],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
