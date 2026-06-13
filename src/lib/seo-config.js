/**
 * ============================================================
 * BattleXZone SEO Configuration — Single Source of Truth
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
  defaultTitle: 'Play BGMI Tournaments in India & Win Cash | BattleXZone',
  // Optimized description with CTA (under 160 chars)
  defaultDescription:
    'Join daily BGMI tournaments and custom rooms on BattleXZone. Compete with top players in India, showcase your skills, and win real cash prizes today!',
  // Comprehensive keywords from SEO Master Strategy - PILLAR 1
  // UPDATED: Merged with full 1,857+ keyword research deliverable (battlezone_10k_keywords.csv)
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
    // New from full research: Time-sensitive & high-intent
    'bgmi tournament today',
    'join bgmi tournament today',
    'bgmi tournament tonight',
    'bgmi tournament daily',
    'bgmi tournament this weekend',
    'bgmi tournament live now',
    'bgmi tournament 8pm',
    'bgmi tournament tomorrow',
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
    // Long-Tail Keywords (High Intent) - expanded from research
    'BGMI tournament with entry fee 10 rupees',
    'Free Fire tournament free entry real money',
    'how to join BGMI tournament and win money',
    'BGMI tournament app with instant withdrawal',
    'best BGMI tournament app for beginners',
    'PUBG tournament earn Paytm cash instant',
    'BGMI tournament without investment India',
    // New high-value from 10k research (Registration, Scrims, Teams, Prize, Local, Hinglish)
    'bgmi tournament today Delhi',
    'bgmi tournament tonight Delhi',
    'bgmi tournament daily Delhi',
    'bgmi scrims today',
    'bgmi custom room scrims',
    'bgmi team recruitment',
    'looking for bgmi squad',
    'competitive bgmi team',
    'bgmi tournament win cash',
    'earn money from bgmi',
    'bgmi tournament kaise join kare',
    'bgmi mein paise kaise kamaye',
    'bgmi t3 scrims discord',
    'best bgmi tournament app 2026',
    'bgmi tournament with 10 rupees entry',
    'how to join bgmi tournament',
    'bgmi cash tournament registration',
    'free entry bgmi tournament',
    // Location & Language Keywords
    'game khelke paise kaise kamaye',
    'esports platform India',
    'mobile esports tournament India',
    'BattleXZone',
    'online tournament app',
    'esports app India',
    // Multi-game expansions (from full list)
    'free fire tournament india',
    'valorant tournament prize pool',
    'cod mobile tournament india cash',
    'pokemon unite tournament prize pool',
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
// Centralized and hardened. Uses the same logic as @/lib/api for consistency.
// Prefer setting NEXT_PUBLIC_API_URL in all environments.
export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    let url = process.env.NEXT_PUBLIC_API_URL;
    // Safety: never use localhost in production unless explicitly allowed
    if (process.env.NODE_ENV === 'production' && url.includes('localhost') && !process.env.ALLOW_LOCAL_API) {
      // Fall back to a safe production default (update via env var)
      console.warn('[SEO] NEXT_PUBLIC_API_URL points to localhost in production — using fallback');
    }
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url.endsWith('/api')) url += '/api';
    return url;
  }

  if (process.env.NODE_ENV === 'production') {
    // Prefer the site URL if available, otherwise a documented production default
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/api`;
    }
    return 'https://api.battlexzone.com/api';
  }

  return 'http://localhost:5000/api';
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
      languages: {
        'en-IN': metaUrl,
        'en-AE': metaUrl.replace('www.battlexzone.com', 'www.battlexzone.com/en-ae'),
        'en-GB': metaUrl.replace('www.battlexzone.com', 'www.battlexzone.com/en-gb'),
        'en-CA': metaUrl.replace('www.battlexzone.com', 'www.battlexzone.com/en-ca'),
        'en-US': metaUrl.replace('www.battlexzone.com', 'www.battlexzone.com/en-us'),
        'en-AU': metaUrl.replace('www.battlexzone.com', 'www.battlexzone.com/en-au'),
        'x-default': metaUrl,
      },
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

// ─── Article / Blog Metadata Generator ──────────────────────
/**
 * Generates complete Next.js Metadata for blog/article pages.
 * Wraps generateSeoMetadata with article-specific OG fields.
 * Automatically sets alternates.canonical via the slug.
 *
 * @param {Object} opts
 * @param {string}   opts.title          — Article title (will append site name)
 * @param {string}   opts.excerpt        — Article excerpt / meta description
 * @param {string}   opts.slug           — URL slug e.g. 'bgmi-tournament-guide-2026'
 * @param {string}   [opts.image]        — OG image path or full URL
 * @param {string}   [opts.datePublished]— ISO 8601 publish date
 * @param {string}   [opts.dateModified] — ISO 8601 modified date
 * @param {string}   [opts.author]       — Author name
 * @param {string}   [opts.category]     — Article category / section
 * @param {string[]} [opts.tags]         — Article keyword tags
 */
export function generateArticleMetadata({
  title,
  excerpt,
  slug,
  image,
  datePublished,
  dateModified,
  author,
  category = 'Gaming',
  tags = [],
} = {}) {
  return generateSeoMetadata({
    title,
    description: excerpt,
    keywords: tags,
    url: `/blog/${slug}`,
    image,
    type: 'article',
    article: {
      publishedTime: datePublished,
      modifiedTime: dateModified || datePublished,
      author: author || SITE.author,
      section: category,
      tags,
    },
  });
}

// ─── Page-Specific Metadata Presets ─────────────────────────
export const PAGE_SEO = {
  home: generateSeoMetadata({}),

  matches: generateSeoMetadata({
    // Optimized title: Keyword + benefit + CTA (under 60 chars) - updated with research keywords
    title: 'BGMI Win Match Online Today | Live Custom Rooms & Scrims',
    // Optimized description with numbers and CTA (under 160 chars)
    description:
      'Join BGMI win match online today or tonight. Entry from ₹10. 500+ daily matches & scrims. Solo, Duo, Squad. Real cash prizes + instant UPI withdrawal. Play Now →',
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
      // Long-tail keywords from full research
      'BGMI tournament with entry fee 10 rupees',
      'BGMI match win cash',
      'play BGMI and earn money',
      'bgmi scrims today',
      'bgmi custom room today',
    ],
    url: '/matches',
  }),

  tournaments: generateSeoMetadata({
    // Optimized title: Primary keyword + benefit (under 60 chars)
    title: 'BGMI Tournament Today | Join Daily Scrims & Win Cash | BattleXZone',
    // Optimized description with CTA (under 160 chars)
    description:
      'Join BGMI tournament today, tonight or this weekend. Free entry & paid custom rooms from ₹10. Daily scrims, real cash prizes, instant UPI withdrawal. Register now!',
    keywords: [
      // Primary keyword targeting
      'BGMI tournament online India',
      'BGMI tournament registration',
      'BGMI tournament 2026',
      'BGMI esports tournament',
      // High-priority from full keyword research
      'bgmi tournament today',
      'join bgmi tournament today',
      'bgmi tournament tonight',
      'bgmi tournament daily',
      'bgmi tournament this weekend',
      'bgmi tournament live now',
      'bgmi tournament 8pm',
      'bgmi tournament tomorrow',
      'bgmi tournament today Delhi',
      'bgmi tournament today Mumbai',
      'bgmi tournament today Bangalore',
      'bgmi tournament today Hyderabad',
      'bgmi tournament today Chennai',
      'bgmi tournament today Kolkata',
      // LSI keywords
      'BGMI tournament prize pool',
      'BGMI solo tournament entry',
      'BGMI squad tournament join',
      'PUBG Mobile tournament India',
      'Free Fire tournament',
      'online gaming tournament',
      // Long-tail keywords from research
      'how to join BGMI tournament and win money',
      'BGMI tournament without investment India',
      'best BGMI tournament app for beginners',
      'Free Fire tournament free entry real money',
      'bgmi cash tournament registration',
      'free entry bgmi tournament',
    ],
    url: '/tournaments',
  }),


  blog: generateSeoMetadata({
    title: 'BGMI Tips & Tricks | Esports News & Tournament Guides',
    description:
      'Expert BGMI tips, tricks, and strategies. Learn how to win BGMI tournaments, latest esports news India, pro player guides, and earning guides.',
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
      'BattleXZone\'s advanced anti-cheat: screenshot verification, EXIF analysis, device fingerprinting. Zero tolerance for hackers.',
    keywords: ['BGMI anti-cheat', 'fair play esports', 'BGMI hack detection', 'esports integrity'],
    url: '/fair-play',
  }),

  rules: generateSeoMetadata({
    title: 'Tournament Rules & Match Guidelines',
    description:
      'Official BattleXZone tournament rules: match formats, scoring, prize distribution, player conduct. Read before joining.',
    keywords: ['BGMI tournament rules', 'esports rules India', 'gaming competition rules'],
    url: '/rules',
  }),

  faq: generateSeoMetadata({
    title: 'FAQ — Frequently Asked Questions About BGMI Tournaments',
    description:
      'Answers to common questions about BattleXZone: registration, payments, withdrawals, fair play, KYC, and more.',
    keywords: ['BGMI tournament FAQ', 'BattleXZone help', 'esports FAQ'],
    url: '/faq',
  }),

  contact: generateSeoMetadata({
    title: 'Contact Us — Get Help & Support',
    description:
      'Need help? Contact BattleXZone support via email, Discord, or in-app chat. We respond within 2 hours.',
    keywords: ['BattleXZone support', 'esports help', 'contact gaming platform'],
    url: '/contact',
  }),

  about: generateSeoMetadata({
    title: 'About BattleXZone — India\'s Leading BGMI Esports Platform',
    description:
      'BattleXZone is India\'s fastest-growing BGMI esports platform. Founded in 2024, we host 1000+ daily matches for 50,000+ players.',
    keywords: ['about BattleXZone', 'BGMI esports company', 'Indian esports startup'],
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
      'See who ranks #1 on BattleXZone. Live BGMI leaderboard with player stats, win rates, and tournament earnings. Climb the ranks and earn rewards.',
    keywords: ['BGMI leaderboard', 'BGMI player rankings', 'top BGMI players India', 'esports leaderboard', 'BGMI stats'],
    url: '/leaderboard',
  }),

  achievements: generateSeoMetadata({
    title: 'Achievements & Badges — Unlock Gaming Rewards',
    description:
      'Earn achievements and badges on BattleXZone. Track your gaming milestones — kills, matches won, earnings, and special challenges.',
    keywords: ['gaming achievements', 'esports badges', 'BGMI achievements', 'gaming rewards', 'player milestones'],
    url: '/achievements',
  }),

  teams: generateSeoMetadata({
    title: 'Esports Teams — Create Squads & Compete in BGMI Tournaments',
    description:
      'Create or join professional BGMI and Free Fire teams on BattleXZone. Manage squads, track stats, earn together, and dominate tournaments.',
    keywords: [
      'BGMI team',
      'esports team India',
      'BGMI squad',
      'Free Fire team',
      'gaming team',
      'create BGMI team',
      'join esports squad',
    ],
    url: '/teams',
  }),

  search: generateSeoMetadata({
    title: 'Search — Find BGMI Tournaments, Matches & Gaming Guides',
    description:
      'Search BattleXZone for BGMI tournaments, Free Fire matches, gaming guides, and esports content. Find exactly what you need.',
    keywords: ['search gaming', 'find tournaments', 'BGMI search', 'Free Fire search', 'gaming guides search'],
    url: '/search',
  }),

  privacyPolicy: generateSeoMetadata({
    title: 'Privacy Policy — How We Protect Your Data',
    description:
      'Read BattleXZone\'s Privacy Policy. Learn how we collect, use, and protect your personal information on our esports gaming platform.',
    keywords: ['privacy policy', 'data protection', 'user privacy', 'gaming privacy'],
    url: '/privacy-policy',
  }),

  termsConditions: generateSeoMetadata({
    title: 'Terms & Conditions — Platform Rules & User Agreement',
    description:
      'Read BattleXZone\'s Terms and Conditions. Understand our rules, policies, and user agreements for the esports gaming platform.',
    keywords: ['terms and conditions', 'user agreement', 'platform rules', 'esports terms'],
    url: '/terms-conditions',
  }),

  refundPolicy: generateSeoMetadata({
    title: 'Refund Policy — Match & Tournament Refund Guidelines',
    description:
      'BattleXZone refund policy for cancelled matches, disputed results, and wallet transactions. Know your rights as a player.',
    keywords: ['refund policy', 'gaming refund', 'match refund', 'tournament refund', 'esports refund'],
    url: '/refund-policy',
  }),
};

// ─── Dynamic Match Metadata ─────────────────────────────────
export function generateMatchMetadata(match) {
  if (!match) {
    return generateSeoMetadata({
      title: 'Match Details',
      description: 'View match details and join competitive BGMI matches on BattleXZone.',
      url: '/matches',
    });
  }

  const matchId = match._id || match.id;
  const gameLabel = (match.gameType || 'BGMI').replace('_', ' ');
  const mode = match.mode || 'Squad';
  const slotsLeft = match.maxSlots - (match.filledSlots || match.joinedUsers?.length || 0);

  return generateSeoMetadata({
    title: `${match.title} — ₹${match.prizePool} Prize | ${gameLabel} ${mode}`,
    description: `Join "${match.title}" on BattleXZone. Entry: ₹${match.entryFee} | Prize Pool: ₹${match.prizePool} | ${mode} ${match.matchType || 'match'} | ${slotsLeft} slots left. Register now & compete!`,
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
      description: 'View tournament details and register for competitive BGMI tournaments on BattleXZone.',
      url: '/tournaments',
    });
  }

  const tournamentId = tournament._id || tournament.id;
  const name = tournament.title || tournament.name;

  return generateSeoMetadata({
    title: `${name} — ₹${tournament.prizePool} Prize Pool | BGMI Tournament`,
    description: `Register for "${name}" on BattleXZone. Prize: ₹${tournament.prizePool} | Entry: ₹${tournament.entryFee || 'Free'} | ${tournament.format || 'Squad'} format. India's top BGMI tournament.`,
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
    description: `Join BGMI and Free Fire tournaments in ${city}, ${state}. Play online gaming tournaments, win real cash prizes. Daily matches for ${city} gamers on BattleXZone.`,
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

// ─── Dynamic Team Metadata (SportsTeam + Squad SEO) ───────────────────────────
export function generateTeamMetadata(team) {
  if (!team) {
    return generateSeoMetadata({
      title: 'Team Profile',
      description: 'View esports team profile, members, stats and tournament history on BattleXZone.',
      url: '/teams',
    });
  }

  const teamId = team._id || team.id;
  const teamName = team.name || 'Esports Team';
  const tag = team.tag ? ` [${team.tag}]` : '';
  const game = (team.gameType || 'BGMI').replace('_', ' ');

  return generateSeoMetadata({
    title: `${teamName}${tag} — ${game} Esports Squad`,
    description: `${teamName} (${team.tag || ''}) — ${team.members?.length || 0} members. ${team.stats?.matchesWon || 0} wins, ₹${team.stats?.totalEarnings || 0} earned. Join or challenge this squad in BGMI tournaments.`,
    keywords: [
      teamName,
      `${game} team`,
      'esports squad',
      'BGMI team',
      team.tag || '',
      'gaming clan',
    ],
    url: `/teams/${teamId}`,
    image: team.logo?.url || '/images/og-default.jpg',
  });
}

// ─── Dynamic Player / Person Metadata ───────────────────────────
export function generatePlayerMetadata(player) {
  if (!player) {
    return generateSeoMetadata({ title: 'Player Profile', url: '/leaderboard' });
  }
  const name = player.name || player.username || 'Player';
  return generateSeoMetadata({
    title: `${name} — BGMI Player Profile & Stats`,
    description: `View ${name}'s BGMI stats, tournament wins, earnings, and achievements on BattleXZone. Level ${player.level || 'N/A'}.`,
    keywords: [name, 'BGMI player', 'esports player India', 'BGMI stats'],
    url: `/profile/${player._id || player.id || ''}`.replace(/\/$/, ''),
    noIndex: true, // Profiles often private or low value until public player pages
  });
}


