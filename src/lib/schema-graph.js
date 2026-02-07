/**
 * ============================================================
 * BattleZone Entity SEO + AI Search Schema System
 * ============================================================
 * Implements:
 * - @graph-based Knowledge Graph for Google Entity SEO
 * - SportsEvent schema for BGMI matches/tournaments
 * - FAQPage schema for AEO (Answer Engine Optimization)
 * - Speakable schema for voice search / Google Assistant
 * - ItemList schema for match/tournament listing pages
 * - BreadcrumbList for navigation signals
 * - HowTo schema for step-by-step guides
 * - VideoGame entity for BGMI ecosystem mapping
 * ============================================================
 */

import { SITE } from './seo-config';

// ─── Organization Entity ────────────────────────────────────
export const organizationEntity = {
  '@type': 'Organization',
  '@id': `${SITE.baseUrl}/#organization`,
  name: SITE.name,
  url: SITE.baseUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE.baseUrl}/#logo`,
    url: `${SITE.baseUrl}/images/logo.png`,
    contentUrl: `${SITE.baseUrl}/images/logo.png`,
    width: 512,
    height: 512,
    caption: 'BattleZone Logo',
  },
  image: { '@id': `${SITE.baseUrl}/#logo` },
  description: SITE.defaultDescription,
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Place',
    name: `${SITE.location.city}, ${SITE.location.state}, ${SITE.location.country}`,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.state,
    postalCode: SITE.location.postalCode,
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE.contact.email,
      url: `${SITE.baseUrl}/contact`,
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
  ],
  sameAs: Object.values(SITE.social),
  knowsAbout: [
    'BGMI Tournaments',
    'Battlegrounds Mobile India',
    'PUBG Mobile India',
    'Free Fire Esports',
    'Mobile Esports',
    'Competitive Gaming India',
    'Esports Tournament Organization',
  ],
};

// ─── WebSite Entity (Search Action for Sitelinks Searchbox) ─
export const websiteEntity = {
  '@type': 'WebSite',
  '@id': `${SITE.baseUrl}/#website`,
  url: SITE.baseUrl,
  name: SITE.name,
  description: SITE.defaultDescription,
  publisher: { '@id': `${SITE.baseUrl}/#organization` },
  inLanguage: SITE.language,
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
};

// ─── WebApplication Entity ──────────────────────────────────
export const webApplicationEntity = {
  '@type': 'WebApplication',
  '@id': `${SITE.baseUrl}/#webapp`,
  name: SITE.name,
  url: SITE.baseUrl,
  applicationCategory: 'GameApplication',
  applicationSubCategory: 'Esports Tournament Platform',
  operatingSystem: 'Web, Android, iOS',
  browserRequirements: 'Requires JavaScript. Modern browser recommended.',
  description: "India's premier BGMI esports tournament platform. Play competitive matches, win real cash prizes.",
  author: { '@id': `${SITE.baseUrl}/#organization` },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Free to join. Match entry fees start from ₹10.',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.6',
    ratingCount: '15000',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'BGMI Custom Room Tournaments',
    'Solo, Duo & Squad Matches',
    'Real Money Cash Prizes',
    'Instant UPI Withdrawals',
    'Advanced Anti-Cheat System',
    'KYC Verified Players',
    'Live Leaderboards',
    '24/7 Support via Discord',
  ],
};

// ─── VideoGame Entity (BGMI Ecosystem) ──────────────────────
export const bgmiGameEntity = {
  '@type': 'VideoGame',
  '@id': `${SITE.baseUrl}/#bgmi`,
  name: 'Battlegrounds Mobile India (BGMI)',
  alternateName: ['BGMI', 'PUBG Mobile India', 'Battlegrounds Mobile India'],
  gamePlatform: ['Android', 'iOS'],
  genre: ['Battle Royale', 'Esports', 'Competitive Shooter'],
  description: 'Battlegrounds Mobile India (BGMI) is the Indian version of PUBG Mobile, a battle royale game developed by Krafton.',
  publisher: {
    '@type': 'Organization',
    name: 'Krafton',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.2',
    ratingCount: '50000000',
  },
};

// ─── Full Knowledge Graph (@graph) for Root Layout ──────────
export function getKnowledgeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationEntity,
      websiteEntity,
      webApplicationEntity,
      bgmiGameEntity,
    ],
  };
}

// ─── SportsEvent Schema for Individual Matches ──────────────
export function getMatchSchema(match) {
  if (!match) return null;

  const matchId = match._id || match.id;
  const slotsLeft = match.maxSlots - (match.filledSlots || match.joinedUsers?.length || 0);
  const startTime = match.scheduledAt || match.startTime;
  const gameLabel = (match.gameType || 'BGMI').replace('_', ' ');

  const statusMap = {
    upcoming: 'https://schema.org/EventScheduled',
    registration_open: 'https://schema.org/EventScheduled',
    live: 'https://schema.org/EventScheduled',
    in_progress: 'https://schema.org/EventScheduled',
    completed: 'https://schema.org/EventPostponed',
    cancelled: 'https://schema.org/EventCancelled',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${SITE.baseUrl}/matches/${matchId}`,
    name: match.title || `${gameLabel} ${match.matchType} Match`,
    description: `Competitive ${gameLabel} ${match.mode || 'Squad'} match. Entry: ₹${match.entryFee}. Prize pool: ₹${match.prizePool}. ${slotsLeft} slots remaining.`,
    startDate: startTime ? new Date(startTime).toISOString() : undefined,
    endDate: match.endTime ? new Date(match.endTime).toISOString() : undefined,
    eventStatus: statusMap[match.status] || 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE.baseUrl}/matches/${matchId}`,
    },
    image: match.banner?.url || `${SITE.baseUrl}/images/og-matches.jpg`,
    organizer: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.baseUrl,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE.baseUrl}/matches/${matchId}`,
      price: match.entryFee || 0,
      priceCurrency: 'INR',
      availability: slotsLeft > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      validFrom: match.createdAt ? new Date(match.createdAt).toISOString() : undefined,
    },
    maximumAttendeeCapacity: match.maxSlots,
    remainingAttendeeCapacity: slotsLeft,
    sport: gameLabel,
    competitor: match.joinedUsers?.slice(0, 5).map(u => ({
      '@type': 'Person',
      name: u.user?.name || 'Player',
    })),
  };
}

// ─── SportsEvent Schema for Tournaments ─────────────────────
export function getTournamentSchema(tournament) {
  if (!tournament) return null;

  const tournamentId = tournament._id || tournament.id;
  const name = tournament.title || tournament.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${SITE.baseUrl}/tournaments/${tournamentId}`,
    name,
    description: tournament.description || `${name} — BGMI esports tournament with ₹${tournament.prizePool} prize pool on BattleZone.`,
    startDate: tournament.startAt ? new Date(tournament.startAt).toISOString() : undefined,
    endDate: tournament.endAt ? new Date(tournament.endAt).toISOString() : undefined,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE.baseUrl}/tournaments/${tournamentId}`,
    },
    organizer: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.baseUrl,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE.baseUrl}/tournaments/${tournamentId}`,
      price: tournament.entryFee || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    maximumAttendeeCapacity: tournament.maxTeams,
    sport: 'Battlegrounds Mobile India',
    image: tournament.banner?.url || `${SITE.baseUrl}/images/og-tournaments.jpg`,
  };
}

// ─── ItemList Schema (Match/Tournament Listings) ────────────
export function getItemListSchema(items, type = 'match') {
  const listItems = (items || []).slice(0, 10).map((item, index) => {
    const itemId = item._id || item.id;
    const path = type === 'match' ? 'matches' : 'tournaments';
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.title || item.name,
      url: `${SITE.baseUrl}/${path}/${itemId}`,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: type === 'match' ? 'Live BGMI Matches on BattleZone' : 'Upcoming BGMI Tournaments on BattleZone',
    description: type === 'match'
      ? 'Browse and join competitive BGMI matches with real cash prizes'
      : 'Register for upcoming BGMI tournaments with massive prize pools',
    numberOfItems: items?.length || 0,
    itemListElement: listItems,
  };
}

// ─── FAQPage Schema (AEO — Answer Engine Optimization) ──────
export function getFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ─── Comprehensive BGMI FAQs for AEO ───────────────────────
export const bgmiPlatformFaqs = [
  {
    question: 'How do I join BGMI tournaments on BattleZone?',
    answer: 'To join BGMI tournaments on BattleZone: 1) Create a free account, 2) Complete KYC verification with Aadhaar/PAN, 3) Add money to your wallet via UPI or Paytm, 4) Browse available BGMI matches, 5) Pay entry fee and join. You\'ll receive room ID and password 15 minutes before the match starts.',
  },
  {
    question: 'Is BattleZone safe and legal in India?',
    answer: 'Yes, BattleZone is 100% legal in India. We operate as a skill-based gaming platform under Indian gaming regulations. All transactions are processed through Razorpay (RBI-licensed). KYC verification is mandatory for withdrawals. We are NOT a gambling platform — all games are skill-based competitive matches.',
  },
  {
    question: 'What is the minimum entry fee for BGMI matches?',
    answer: 'Entry fees on BattleZone start from just ₹10 for practice matches. Competitive matches range from ₹20 to ₹500. Premium tournaments can have entry fees up to ₹1000 with prize pools exceeding ₹50,000.',
  },
  {
    question: 'How fast are withdrawals on BattleZone?',
    answer: 'BattleZone offers instant withdrawals via UPI. Most players receive their winnings within 5–10 minutes. Bank transfers take 24–48 hours. Minimum withdrawal amount is ₹50. KYC verification must be completed before first withdrawal.',
  },
  {
    question: 'What games are available on BattleZone?',
    answer: 'BattleZone currently supports BGMI (Battlegrounds Mobile India), PUBG Mobile, and Free Fire. We offer Solo, Duo, and Squad format matches. New games are added regularly based on player demand.',
  },
  {
    question: 'How does BattleZone prevent cheating in BGMI matches?',
    answer: 'BattleZone uses a multi-layer anti-cheat system: 1) Mandatory screenshot submission after every match, 2) EXIF metadata analysis to verify screenshots, 3) Duplicate image detection, 4) Manual admin review for disputed results, 5) Device fingerprinting. Cheaters are permanently banned and forfeit all winnings.',
  },
  {
    question: 'Can I play BGMI tournaments on BattleZone from any state in India?',
    answer: 'BattleZone is available in most Indian states. However, due to state-specific gaming regulations, real-money gaming may be restricted in Andhra Pradesh, Telangana, Assam, Odisha, Nagaland, and Sikkim. Players from these states can still participate in free tournaments.',
  },
  {
    question: 'What is BGMI custom room and how to get room ID?',
    answer: 'A BGMI custom room is a private match room created by tournament organizers where registered players join using a room ID and password. On BattleZone, after you join a match and the registration closes, the room ID and password are automatically shared with all registered players 15 minutes before match start time.',
  },
];

// ─── BreadcrumbList Schema ──────────────────────────────────
export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.baseUrl}${item.url}`,
    })),
  };
}

// ─── HowTo Schema ───────────────────────────────────────────
export function getHowToSchema({ name, description, steps, totalTime = 'PT5M', cost = '10' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: cost,
    },
    supply: [
      { '@type': 'HowToSupply', name: 'Smartphone with BGMI installed' },
      { '@type': 'HowToSupply', name: 'Stable internet connection' },
      { '@type': 'HowToSupply', name: 'Valid Aadhaar or PAN card for KYC' },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'BattleZone account (free)' },
      { '@type': 'HowToTool', name: 'UPI payment app (Google Pay, PhonePe, Paytm)' },
    ],
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      url: step.url ? `${SITE.baseUrl}${step.url}` : undefined,
      image: step.image,
    })),
  };
}

// ─── Speakable Schema (Voice Search / Google Assistant) ─────
export function getSpeakableSchema(url, cssSelectors = ['h1', '.aeo-answer', '.faq-answer']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url.startsWith('http') ? url : `${SITE.baseUrl}${url}`,
    name: SITE.name,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
    url: url.startsWith('http') ? url : `${SITE.baseUrl}${url}`,
  };
}

// ─── Article Schema ─────────────────────────────────────────
export function getArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.description,
    image: article.image || `${SITE.baseUrl}/images/og-default.jpg`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author || SITE.name,
      url: SITE.baseUrl,
    },
    publisher: { '@id': `${SITE.baseUrl}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url ? `${SITE.baseUrl}${article.url}` : SITE.baseUrl,
    },
    articleSection: article.category || 'BGMI',
    keywords: article.keywords?.join(', ') || 'BGMI, esports, tournaments',
    inLanguage: SITE.language,
    wordCount: article.wordCount,
  };
}
