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
  return 'https://www.battlexzone.com';
};

// ─── Site-Wide Constants ────────────────────────────────────
export const SITE = {
  name: 'BattleXZone',
  tagline: "India's #1 BGMI Esports Tournament Platform - Win Real Cash",
  baseUrl: resolveBaseUrl(),
  // Optimized title for CTR: Primary keyword + benefit + brand (under 60 chars)
  defaultTitle: 'BGMI Tournament Online India | Win ₹10,000 Cash | Entry ₹10',
  // Optimized description with CTA (under 160 chars)
  defaultDescription:
    'Join BGMI & Free Fire tournaments online. Win real cash prizes starting ₹10 entry. 50,000+ players. Instant UPI withdrawal. Register Free Now!',
  // Comprehensive keywords from SEO Master Strategy - PILLAR 1
  defaultKeywords: [
    // Primary Keywords (High Priority)
    'BGMI win match online',
    'BGMI tournament online India',
    'PUBG tournament earn money India',
    'Free Fire online earning tournament',
    'online gaming earn money India',
    // BGMI Tournament Cluster (LSI Keywords)
    'BGMI tournament',
    'BGMI tournament registration India',
    'BGMI cash tournament app',
    'BGMI prize money match',
    'BGMI esports competition India',
    'BGMI solo tournament entry',
    'BGMI squad tournament join',
    'BGMI tournament prize pool',
    'BGMI tournament app',
    'BGMI custom room',
    // Free Fire Earning Cluster (LSI Keywords)
    'Free Fire tournament',
    'Free Fire tournament app India',
    'Free Fire diamond tournament',
    'Free Fire cash prize game',
    'Free Fire esports India',
    'Free Fire tournament registration free',
    // PUBG/Online Earning Cluster (LSI Keywords)
    'PUBG Mobile tournament India',
    'earn money playing PUBG',
    'PUBG cash match app',
    'online gaming income India',
    'mobile game earn paytm cash',
    'gaming tournament app India',
    'esports earning platform',
    'real money gaming India',
    // Long-Tail Keywords (High Intent)
    'BGMI tournament with entry fee 10 rupees',
    'Free Fire tournament free entry real money',
    'how to join BGMI tournament and win money',
    'BGMI tournament app with instant withdrawal',
    'best BGMI tournament app for beginners',
    'PUBG tournament earn Paytm cash instant',
    'BGMI tournament without investment India',
    // Location & Language Keywords
    'game khelke paise kaise kamaye',
    'esports platform India',
    'mobile esports tournament India',
    'BattleXZone',
    'online tournament app',
    'esports app India',
  ],
  author: 'BattleXZone',
  twitterHandle: '@BattleXZone',
  ogImage: '/images/og-default.jpg',
  locale: 'en_IN',
  language: 'en-IN',
  themeColor: '#0f172a',
  contact: {
    email: 'support@battlexzone.com',
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
    twitter: 'https://twitter.com/BattleXZone',
    facebook: 'https://facebook.com/BattleXZone',
    instagram: 'https://instagram.com/BattleXZone',
    youtube: 'https://youtube.com/@BattleXZone',
    discord: 'https://discord.gg/BattleXZone',
  },
};

// ─── Backend API URL ────────────────────────────────────────
export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    let url = process.env.NEXT_PUBLIC_API_URL;
    if (process.env.NODE_ENV === 'production' && url.includes('localhost')) {
      return 'https://api.battlexzone.com/api';
    }
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.endsWith('/api')) url += '/api';
    return url;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://api.battlexzone.com/api'
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
    // Optimized title: Keyword + benefit + CTA (under 60 chars)
    title: 'BGMI Win Match Online | Join Live Tournament & Win Cash ₹10,000',
    // Optimized description with numbers and CTA (under 160 chars)
    description:
      'Join BGMI match online & win real cash. Entry ₹10. 500+ daily matches. Solo, Duo, Squad. Instant UPI withdrawal. Play Now →',
    keywords: [
      // Primary keyword targeting
      'BGMI win match online',
      'BGMI matches today',
      'BGMI custom room match',
      'BGMI live matches',
      // LSI keywords
      'BGMI cash match',
      'BGMI prize money match',
      'join BGMI match',
      'BGMI match registration',
      'PUBG Mobile match join',
      'Free Fire match online',
      'esports matches India',
      // Long-tail keywords
      'BGMI tournament with entry fee 10 rupees',
      'BGMI match win cash',
      'play BGMI and earn money',
    ],
    url: '/matches',
  }),

  tournaments: generateSeoMetadata({
    // Optimized title: Primary keyword + benefit (under 60 chars)
    title: 'BGMI Tournament Online India | Win ₹50,000+ | Entry ₹10',
    // Optimized description with CTA (under 160 chars)
    description:
      'Join BGMI tournament online India. Solo, Duo & Squad matches. Entry fee ₹10. Win up to ₹50,000 cash. Instant UPI withdrawal. Register Free!',
    keywords: [
      // Primary keyword targeting
      'BGMI tournament online India',
      'BGMI tournament registration',
      'BGMI tournament 2026',
      'BGMI esports tournament',
      // LSI keywords
      'BGMI tournament prize pool',
      'BGMI solo tournament entry',
      'BGMI squad tournament join',
      'PUBG Mobile tournament India',
      'Free Fire tournament',
      'online gaming tournament',
      // Long-tail keywords
      'how to join BGMI tournament and win money',
      'BGMI tournament without investment India',
      'best BGMI tournament app for beginners',
      'Free Fire tournament free entry real money',
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
    // Optimized for gaming content discovery
    title: 'BGMI Tips, Tournament Strategies & Online Earning Guides',
    description:
      'Expert BGMI tips, tournament strategies, how to earn money playing BGMI in India. Pro player guides, sensitivity settings, weapon tips. Level up!',
    keywords: [
      // Primary content keywords
      'BGMI tips and tricks',
      'BGMI sensitivity settings',
      'BGMI weapon guide',
      'BGMI strategy',
      'esports news India',
      'BGMI pro player tips',
      // Earning-focused keywords (PILLAR 1)
      'how to earn money playing BGMI',
      'online gaming earn money India',
      'BGMI earning guide',
      'earn money playing PUBG',
      'mobile game earn paytm cash',
      // Tournament strategy keywords
      'BGMI tournament tips',
      'how to win BGMI tournament',
      'BGMI tournament strategy',
      'Free Fire tournament tips',
    ],
    url: '/blog',
    type: 'website',
  }),

  howItWorks: generateSeoMetadata({
    // Optimized for "how to" search intent
    title: 'How to Join BGMI Tournament & Earn Money Online - Step by Step',
    description:
      'Learn how to earn money playing BGMI in 4 steps: Sign up → Add ₹10 → Join match → Win cash. Complete guide with screenshots. Start earning today!',
    keywords: [
      // Primary "how to" keywords
      'how to play BGMI tournament',
      'how to join BGMI custom room',
      'how to earn money playing BGMI',
      'BGMI tournament guide',
      // Step-by-step intent keywords
      'how to join BGMI tournament and win money',
      'BGMI tournament registration process',
      'how to start BGMI tournament',
      'BGMI earning tutorial',
      // Related earning keywords
      'online gaming earn money India',
      'PUBG tournament earn money India',
      'Free Fire online earning tournament',
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
