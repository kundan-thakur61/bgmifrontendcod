/**
 * ============================================================
 * BattleZone SEO Configuration — Single Source of Truth
 * ============================================================
 * Unified SEO config replacing the previous dual-system
 * (seo.js + metadata.js). All pages import from here.
 *
 * Covers: On-Page SEO, Technical SEO meta, AEO, Entity SEO,
 *         Open Graph, Twitter Cards, Robots, and AI Search.
 * ============================================================
 */

// ─── Base URL Resolution ────────────────────────────────────
const resolveBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'https://battlezone.com';
};

// ─── Site-Wide Constants ────────────────────────────────────
export const SITE = {
  name: 'BattleZone',
  tagline: "India's #1 BGMI Esports Tournament Platform",
  baseUrl: resolveBaseUrl(),
  defaultTitle: 'BattleZone — Play BGMI Tournaments, Win Real Money | India\'s #1 Esports Platform',
  defaultDescription:
    'Join 50,000+ BGMI players on BattleZone. Play Solo, Duo & Squad tournaments starting ₹10. Win real cash prizes with instant UPI withdrawals. Anti-cheat verified. Fair play guaranteed.',
  defaultKeywords: [
    'BGMI tournament',
    'BGMI tournament app',
    'BGMI esports',
    'BGMI tournament India',
    'play BGMI for money',
    'BGMI cash tournament',
    'BGMI custom room',
    'BGMI match',
    'PUBG Mobile tournament India',
    'Free Fire tournament',
    'esports platform India',
    'mobile esports',
    'real money gaming India',
    'competitive gaming India',
    'BattleZone',
    'online tournament app',
    'esports app India',
  ],
  author: 'BattleZone',
  twitterHandle: '@BattleZone',
  ogImage: '/images/og-default.jpg',
  locale: 'en_IN',
  language: 'en-IN',
  themeColor: '#0f172a',
  contact: {
    email: 'support@battlezone.com',
    phone: '+91-XXXXXXXXXX',
  },
  location: {
    city: 'Dhanbad',
    state: 'Jharkhand',
    country: 'India',
    postalCode: '826001',
    lat: 23.7957,
    lng: 86.4304,
  },
  social: {
    twitter: 'https://twitter.com/BattleZone',
    facebook: 'https://facebook.com/BattleZone',
    instagram: 'https://instagram.com/BattleZone',
    youtube: 'https://youtube.com/@BattleZone',
    discord: 'https://discord.gg/BattleZone',
  },
};

// ─── Backend API URL ────────────────────────────────────────
export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    let url = process.env.NEXT_PUBLIC_API_URL;
    if (process.env.NODE_ENV === 'production' && url.includes('localhost')) {
      return 'https://bgmibackend-5gu6.onrender.com/api';
    }
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.endsWith('/api')) url += '/api';
    return url;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://bgmibackend-5gu6.onrender.com/api'
    : 'http://localhost:5000/api';
};

// ─── Metadata Generator (Next.js App Router) ───────────────
/**
 * Generates complete Next.js Metadata object.
 * @param {Object} opts
 * @param {string}  [opts.title]        — Page title (will be appended with site name)
 * @param {string}  [opts.description]  — Page meta description (max 160 chars recommended)
 * @param {string[]}[opts.keywords]     — Extra keywords merged with defaults
 * @param {string}  [opts.url]          — Canonical path e.g. '/matches'
 * @param {string}  [opts.image]        — OG image path or full URL
 * @param {string}  [opts.type]         — OG type: 'website' | 'article' | 'profile'
 * @param {boolean} [opts.noIndex]      — Set true for private pages
 * @param {Object}  [opts.article]      — Article-specific OG tags
 */
export function generateSeoMetadata({
  title,
  description,
  keywords = [],
  url,
  image,
  type = 'website',
  noIndex = false,
  article,
} = {}) {
  const metaTitle = title
    ? `${title} | ${SITE.name}`
    : SITE.defaultTitle;
  const metaDescription = description || SITE.defaultDescription;
  const metaUrl = url ? `${SITE.baseUrl}${url}` : SITE.baseUrl;
  const metaImage = image
    ? image.startsWith('http') ? image : `${SITE.baseUrl}${image}`
    : `${SITE.baseUrl}${SITE.ogImage}`;
  const mergedKeywords = [...new Set([...SITE.defaultKeywords, ...keywords])];

  const metadata = {
    metadataBase: new URL(SITE.baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: mergedKeywords,
    authors: [{ name: SITE.author, url: SITE.baseUrl }],
    creator: SITE.author,
    publisher: SITE.author,
    formatDetection: { telephone: false, email: false, address: false },
    category: 'gaming',

    // ── Canonical & Alternates ──
    alternates: {
      canonical: metaUrl,
      languages: { 'en-IN': metaUrl },
    },

    // ── Open Graph ──
    openGraph: {
      type,
      locale: SITE.locale,
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: SITE.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
          type: 'image/jpeg',
        },
      ],
      ...(article && {
        article: {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: [article.author || SITE.name],
          section: article.section || 'Gaming',
          tags: article.tags || [],
        },
      }),
    },

    // ── Twitter / X ──
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaImage,
          alt: metaTitle,
        },
      ],
    },

    // ── Robots ──
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },

    // ── App Meta ──
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/images/icon-192.png', sizes: '192x192' }],
    },
    manifest: '/site.webmanifest',

    // ── Verification ──
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
      },
    },
  };

  return metadata;
}

// ─── Page-Specific Metadata Presets ─────────────────────────
export const PAGE_SEO = {
  home: generateSeoMetadata({}),

  matches: generateSeoMetadata({
    title: 'Live BGMI & Free Fire Matches — Join & Win Cash Prizes',
    description:
      'Browse 500+ daily BGMI matches. Entry from ₹10. Solo, Duo & Squad formats. Anti-cheat verified results. Fair play guaranteed. Instant UPI withdrawals.',
    keywords: [
      'BGMI matches today',
      'BGMI custom room match',
      'BGMI live matches',
      'PUBG Mobile match join',
      'Free Fire match online',
      'esports matches India',
      'BGMI cash match',
    ],
    url: '/matches',
  }),

  tournaments: generateSeoMetadata({
    title: 'BGMI Tournaments India — ₹50,000+ Daily Prizes | Register Free',
    description:
      'Join daily & weekly BGMI tournaments with massive prize pools. Solo, Duo & Squad formats. Free registration. Compete against India\'s best players.',
    keywords: [
      'BGMI tournament registration',
      'BGMI tournament 2026',
      'BGMI esports tournament',
      'PUBG Mobile tournament India',
      'Free Fire tournament',
      'online gaming tournament',
      'BGMI squad tournament',
    ],
    url: '/tournaments',
  }),

  leaderboard: generateSeoMetadata({
    title: 'BGMI Leaderboard — Top Players & Rankings',
    description:
      'See who ranks #1 on BattleZone. Live BGMI leaderboard with player stats, win rates, and tournament earnings. Climb the ranks and earn rewards.',
    keywords: ['BGMI leaderboard', 'BGMI player rankings', 'top BGMI players India', 'esports leaderboard'],
    url: '/leaderboard',
  }),

  blog: generateSeoMetadata({
    title: 'BGMI Tips, Strategies & Esports News — Gaming Blog',
    description:
      'Expert BGMI tips, tournament strategies, sensitivity settings, weapon guides, and Indian esports news. Level up your BGMI gameplay.',
    keywords: [
      'BGMI tips and tricks',
      'BGMI sensitivity settings',
      'BGMI weapon guide',
      'BGMI strategy',
      'esports news India',
      'BGMI pro player tips',
    ],
    url: '/blog',
    type: 'website',
  }),

  howItWorks: generateSeoMetadata({
    title: 'How to Join BGMI Tournaments & Win Real Money — Step by Step',
    description:
      'Learn how BattleZone works in 4 simple steps: Sign up → Add money → Join match → Win prizes. Complete guide with screenshots.',
    keywords: [
      'how to play BGMI tournament',
      'how to join BGMI custom room',
      'how to earn money playing BGMI',
      'BGMI tournament guide',
    ],
    url: '/how-it-works',
  }),

  wallet: generateSeoMetadata({
    title: 'Wallet — Add Money & Withdraw Winnings Instantly',
    description:
      'Secure wallet for BGMI tournament payments. Add via UPI, Paytm, or bank transfer. Withdraw winnings in 5–10 minutes via UPI.',
    keywords: ['gaming wallet', 'esports wallet', 'withdraw gaming winnings', 'UPI gaming'],
    url: '/wallet',
    noIndex: true,
  }),

  fairPlay: generateSeoMetadata({
    title: 'Fair Play Policy — Anti-Cheat & Fraud Prevention',
    description:
      'BattleZone\'s advanced anti-cheat: screenshot verification, EXIF analysis, device fingerprinting. Zero tolerance for hackers.',
    keywords: ['BGMI anti-cheat', 'fair play esports', 'BGMI hack detection', 'esports integrity'],
    url: '/fair-play',
  }),

  rules: generateSeoMetadata({
    title: 'Tournament Rules & Match Guidelines',
    description:
      'Official BattleZone tournament rules: match formats, scoring, prize distribution, player conduct. Read before joining.',
    keywords: ['BGMI tournament rules', 'esports rules India', 'gaming competition rules'],
    url: '/rules',
  }),

  faq: generateSeoMetadata({
    title: 'FAQ — Frequently Asked Questions About BGMI Tournaments',
    description:
      'Answers to common questions about BattleZone: registration, payments, withdrawals, fair play, KYC, and more.',
    keywords: ['BGMI tournament FAQ', 'BattleZone help', 'esports FAQ'],
    url: '/faq',
  }),

  contact: generateSeoMetadata({
    title: 'Contact Us — Get Help & Support',
    description:
      'Need help? Contact BattleZone support via email, Discord, or in-app chat. We respond within 2 hours.',
    keywords: ['BattleZone support', 'esports help', 'contact gaming platform'],
    url: '/contact',
  }),

  about: generateSeoMetadata({
    title: 'About BattleZone — India\'s Leading BGMI Esports Platform',
    description:
      'BattleZone is India\'s fastest-growing BGMI esports platform. Founded in 2024, we host 1000+ daily matches for 50,000+ players.',
    keywords: ['about BattleZone', 'BGMI esports company', 'Indian esports startup'],
    url: '/about',
  }),

  locations: generateSeoMetadata({
    title: 'BGMI Tournaments Near You — City-Wise Esports Events',
    description:
      'Find BGMI tournaments in your city: Mumbai, Delhi, Bangalore, Hyderabad, Kolkata & more. Join local esports communities.',
    keywords: [
      'BGMI tournament Mumbai',
      'BGMI tournament Delhi',
      'BGMI tournament Bangalore',
      'esports events India',
      'local gaming tournaments',
    ],
    url: '/locations',
  }),

  leaderboard: generateSeoMetadata({
    title: 'BGMI Leaderboard — Top Players & Rankings',
    description:
      'See who ranks #1 on BattleZone. Live BGMI leaderboard with player stats, win rates, and tournament earnings. Climb the ranks and earn rewards.',
    keywords: ['BGMI leaderboard', 'BGMI player rankings', 'top BGMI players India', 'esports leaderboard', 'BGMI stats'],
    url: '/leaderboard',
  }),

  achievements: generateSeoMetadata({
    title: 'Achievements & Badges — Unlock Gaming Rewards',
    description:
      'Earn achievements and badges on BattleZone. Track your gaming milestones — kills, matches won, earnings, and special challenges.',
    keywords: ['gaming achievements', 'esports badges', 'BGMI achievements', 'gaming rewards', 'player milestones'],
    url: '/achievements',
  }),

  search: generateSeoMetadata({
    title: 'Search — Find BGMI Tournaments, Matches & Gaming Guides',
    description:
      'Search BattleZone for BGMI tournaments, Free Fire matches, gaming guides, and esports content. Find exactly what you need.',
    keywords: ['search gaming', 'find tournaments', 'BGMI search', 'Free Fire search', 'gaming guides search'],
    url: '/search',
  }),

  privacyPolicy: generateSeoMetadata({
    title: 'Privacy Policy — How We Protect Your Data',
    description:
      'Read BattleZone\'s Privacy Policy. Learn how we collect, use, and protect your personal information on our esports gaming platform.',
    keywords: ['privacy policy', 'data protection', 'user privacy', 'gaming privacy'],
    url: '/privacy-policy',
  }),

  termsConditions: generateSeoMetadata({
    title: 'Terms & Conditions — Platform Rules & User Agreement',
    description:
      'Read BattleZone\'s Terms and Conditions. Understand our rules, policies, and user agreements for the esports gaming platform.',
    keywords: ['terms and conditions', 'user agreement', 'platform rules', 'esports terms'],
    url: '/terms-conditions',
  }),

  refundPolicy: generateSeoMetadata({
    title: 'Refund Policy — Match & Tournament Refund Guidelines',
    description:
      'BattleZone refund policy for cancelled matches, disputed results, and wallet transactions. Know your rights as a player.',
    keywords: ['refund policy', 'gaming refund', 'match refund', 'tournament refund', 'esports refund'],
    url: '/refund-policy',
  }),
};

// ─── Dynamic Match Metadata ─────────────────────────────────
export function generateMatchMetadata(match) {
  if (!match) {
    return generateSeoMetadata({
      title: 'Match Details',
      description: 'View match details and join competitive BGMI matches on BattleZone.',
      url: '/matches',
    });
  }

  const matchId = match._id || match.id;
  const gameLabel = (match.gameType || 'BGMI').replace('_', ' ');
  const mode = match.mode || 'Squad';
  const slotsLeft = match.maxSlots - (match.filledSlots || match.joinedUsers?.length || 0);

  return generateSeoMetadata({
    title: `${match.title} — ₹${match.prizePool} Prize | ${gameLabel} ${mode}`,
    description: `Join "${match.title}" on BattleZone. Entry: ₹${match.entryFee} | Prize Pool: ₹${match.prizePool} | ${mode} ${match.matchType || 'match'} | ${slotsLeft} slots left. Register now & compete!`,
    keywords: [
      match.title,
      `${gameLabel} match`,
      `${gameLabel} ${mode}`,
      `BGMI ${match.matchType || 'custom room'}`,
      'BGMI cash match',
      'join BGMI match',
    ],
    url: `/matches/${matchId}`,
    image: match.banner?.url || '/images/og-matches.jpg',
  });
}

// ─── Dynamic Tournament Metadata ────────────────────────────
export function generateTournamentMetadata(tournament) {
  if (!tournament) {
    return generateSeoMetadata({
      title: 'Tournament Details',
      description: 'View tournament details and register for competitive BGMI tournaments on BattleZone.',
      url: '/tournaments',
    });
  }

  const tournamentId = tournament._id || tournament.id;
  const name = tournament.title || tournament.name;

  return generateSeoMetadata({
    title: `${name} — ₹${tournament.prizePool} Prize Pool | BGMI Tournament`,
    description: `Register for "${name}" on BattleZone. Prize: ₹${tournament.prizePool} | Entry: ₹${tournament.entryFee || 'Free'} | ${tournament.format || 'Squad'} format. India's top BGMI tournament.`,
    keywords: [
      name,
      'BGMI tournament',
      'BGMI esports tournament',
      'BGMI tournament registration',
      `${tournament.format || 'Squad'} tournament`,
    ],
    url: `/tournaments/${tournamentId}`,
    image: tournament.banner?.url || '/images/og-tournaments.jpg',
  });
}

// ─── Dynamic Location Metadata ──────────────────────────────
export function generateLocationMetadata(city, state) {
  return generateSeoMetadata({
    title: `BGMI & Free Fire Tournaments in ${city} 2026 — Win Cash Prizes`,
    description: `Join BGMI and Free Fire tournaments in ${city}, ${state}. Play online gaming tournaments, win real cash prizes. Daily matches for ${city} gamers on BattleZone.`,
    keywords: [
      `BGMI tournaments ${city}`,
      `Free Fire tournaments ${city}`,
      `gaming tournaments ${city}`,
      `esports ${city}`,
      `online gaming ${city}`,
      `BGMI ${city}`,
    ],
    url: `/locations/${city.toLowerCase()}-tournaments`,
  });
}

// ─── Dynamic Blog Article Metadata ──────────────────────────
export function generateArticleMetadata(article) {
  return generateSeoMetadata({
    title: article.title,
    description: article.excerpt || article.description,
    keywords: article.tags || [],
    url: `/blog/${article.slug}`,
    image: article.image,
    type: 'article',
    article: {
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified || article.datePublished,
      author: article.author || SITE.name,
      section: article.category || 'BGMI',
      tags: article.tags || [],
    },
  });
}
