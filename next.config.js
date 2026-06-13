/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
const isProd = !isDev;

// Dynamic CSP connect-src driven by environment for flexibility across deployments.
// In production, prefer setting NEXT_PUBLIC_API_URL and FRONTEND_URL.
// This reduces risk of stale hardcoded backend domains.
const backendOrigin = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
  : (isDev ? 'http://localhost:5000' : 'https://api.battlexzone.com');

const cspConnectSrc = isDev
  ? `connect-src 'self' ${backendOrigin} ws://localhost:5000 wss://${backendOrigin.replace('http://','').replace('https://','')} https://api.battlexzone.com https://lux.razorpay.com wss://api.battlexzone.com https://www.google-analytics.com https://www.googletagmanager.com https://fonts.gstatic.com https://fonts.googleapis.com https://res.cloudinary.com https://checkout.razorpay.com`
  : `connect-src 'self' ${backendOrigin} https://api.battlexzone.com https://lux.razorpay.com wss://api.battlexzone.com https://www.google-analytics.com https://www.googletagmanager.com https://fonts.gstatic.com https://fonts.googleapis.com https://res.cloudinary.com https://checkout.razorpay.com`;

const nextConfig = {
  turbopack: { root: __dirname },

  // ── Technical SEO: Core ──
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false, // Enforce no trailing slash (canonical consistency)
  httpAgentOptions: { keepAlive: true },

  // ── Compiler: Modern JS targets + Production optimizations ──
  compiler: {
    ...(isProd && {
      removeConsole: { exclude: ['error', 'warn'] },
    }),
  },

  // ── Tree-Shaking: Modular imports for heavy libraries ──
  modularizeImports: {
    'recharts': {
      transform: 'recharts/es6/{{member}}',
      skipDefaultConversion: true,
    },
    'react-icons/?(((\\w*)?/?)*)': {
      transform: 'react-icons/{{ matches.[1] }}/{{member}}',
    },
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@/components',
      '@/lib',
      'recharts',
      'chart.js',
      'react-chartjs-2',
    ],
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
      // Common CDNs and user content hosts for gaming platform
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // ── Security + Performance Headers ──
  async headers() {
    return [
      // Service Worker: never cache, allow full scope
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
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
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com https://www.googletagmanager.com; ${cspConnectSrc}; frame-src https://api.razorpay.com https://checkout.razorpay.com; worker-src 'self'; object-src 'none'; base-uri 'self';`,
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
      // PILLAR 3: Additional SEO redirects for keyword targeting
      { source: '/bgmi-tournament', destination: '/tournaments/bgmi', permanent: true },
      { source: '/free-fire-tournament', destination: '/tournaments/free-fire', permanent: true },
      { source: '/pubg-tournament', destination: '/tournaments/pubg-mobile', permanent: true },
      { source: '/earn-money-bgmi', destination: '/blog/how-to-earn-money-playing-bgmi', permanent: true },
      { source: '/bgmi-earn-money', destination: '/blog/how-to-earn-money-playing-bgmi', permanent: true },
      // New 2026 high-intent redirects
      { source: '/success-stories', destination: '/winners', permanent: true },
      { source: '/bgmi-winners', destination: '/winners', permanent: true },
      { source: '/best-bgmi-app', destination: '/compare', permanent: true },
      { source: '/bgmi-comparison', destination: '/compare', permanent: true },
      { source: '/bgmi-tournament-today', destination: '/blog/bgmi-tournament-today-how-to-join-and-win-daily-2026', permanent: true },
      { source: '/withdraw-bgmi-winnings', destination: '/blog/how-to-withdraw-winnings-from-bgmi-tournaments-2026', permanent: true },
      { source: '/bgmi-guide-2026', destination: '/blog/complete-bgmi-tournament-guide-india-2026', permanent: true },
    ];
  },

  // ── URL Rewrites for SEO-friendly paths + API proxy to backend ──
  async rewrites() {
    // Proxy certain /api/* namespaces to the Express backend so that
    // any remaining relative calls or future code don't 404 at the Next.js layer.
    // Most of the app uses the centralized axios client in @/lib/api which talks
    // directly to the backend (via NEXT_PUBLIC_API_URL or localhost:5000).
    let apiTarget = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
      : 'http://localhost:5000';

    // Strip a trailing /api (or /api/) so we don't double it in the proxy destination.
    apiTarget = apiTarget.replace(/\/api$/, '');

    return {
      beforeFiles: [
        // Backend-owned API prefixes (proxy in both dev and prod if needed)
        { source: '/api/gamification/:path*', destination: `${apiTarget}/api/gamification/:path*` },
        { source: '/api/social/:path*', destination: `${apiTarget}/api/social/:path*` },
        { source: '/api/security/:path*', destination: `${apiTarget}/api/security/:path*` },
        { source: '/api/analytics/:path*', destination: `${apiTarget}/api/analytics/:path*` },
      ],
      afterFiles: [
        // Allow clean SEO URLs
        { source: '/play', destination: '/matches' },
        { source: '/compete', destination: '/tournaments' },
        { source: '/rankings', destination: '/leaderboard' },
        // PILLAR 3: Keyword-targeted rewrites
        { source: '/win-cash', destination: '/tournaments' },
        { source: '/bgmi-win-match', destination: '/matches' },
        { source: '/free-fire-earn', destination: '/tournaments/free-fire' },
        { source: '/real-money-gaming', destination: '/tournaments' },
        { source: '/best-esports-app', destination: '/compare' },
      ],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
