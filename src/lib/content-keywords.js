/**
 * Content Strategy for Gaming Keywords - PILLAR 2
 * Creates content clusters for Tier 1, 2, and 3 keywords for BGMI, PUBG, and Free Fire
 */

export const GAMING_KEYWORD_CLUSTERS = {
  bgmi: {
    tier1: [
      'BGMI tournament online India',
      'BGMI win match online',
      'BGMI tournament India',
      'BGMI custom room',
      'BGMI cash tournament'
    ],
    tier2: [
      'BGMI tournament registration',
      'BGMI cash match',
      'BGMI prize money match',
      'BGMI solo tournament',
      'BGMI squad tournament',
      'BGMI esports competition'
    ],
    tier3: [
      'how to join BGMI tournament and win money',
      'BGMI tournament with entry fee 10 rupees',
      'BGMI tournament app with instant withdrawal',
      'best BGMI tournament app for beginners',
      'BGMI tournament without investment India',
      'BGMI custom room tournament registration',
      'BGMI win cash prize tournament',
      'BGMI earning money tournament app'
    ]
  },
  pubg: {
    tier1: [
      'PUBG Mobile tournament India',
      'PUBG tournament earn money India',
      'PUBG Mobile cash tournament',
      'PUBG Mobile custom room',
      'PUBG Mobile online tournament'
    ],
    tier2: [
      'PUBG Mobile tournament registration',
      'PUBG Mobile cash match',
      'PUBG Mobile prize money match',
      'PUBG Mobile solo tournament',
      'PUBG Mobile squad tournament',
      'PUBG Mobile esports competition'
    ],
    tier3: [
      'how to join PUBG Mobile tournament and win money',
      'PUBG Mobile tournament with entry fee 10 rupees',
      'PUBG Mobile tournament app with instant withdrawal',
      'best PUBG Mobile tournament app for beginners',
      'PUBG Mobile tournament without investment India',
      'PUBG Mobile custom room tournament registration',
      'PUBG Mobile win cash prize tournament',
      'PUBG Mobile earning money tournament app'
    ]
  },
  freefire: {
    tier1: [
      'Free Fire online earning tournament',
      'Free Fire tournament India',
      'Free Fire cash tournament',
      'Free Fire custom room',
      'Free Fire online tournament'
    ],
    tier1: [
      'Free Fire online earning tournament',
      'Free Fire tournament India',
      'Free Fire cash tournament',
      'Free Fire custom room',
      'Free Fire online tournament'
    ],
    tier2: [
      'Free Fire tournament registration',
      'Free Fire cash match',
      'Free Fire prize money match',
      'Free Fire solo tournament',
      'Free Fire squad tournament',
      'Free Fire esports competition'
    ],
    tier3: [
      'how to join Free Fire tournament and win money',
      'Free Fire tournament with entry fee 10 rupees',
      'Free Fire tournament app with instant withdrawal',
      'best Free Fire tournament app for beginners',
      'Free Fire tournament without investment India',
      'Free Fire custom room tournament registration',
      'Free Fire win cash prize tournament',
      'Free Fire earning money tournament app'
    ]
  }
};

/**
 * Content cluster mapping for dynamic content generation
 */
export const CONTENT_CLUSTER_MAP = {
  'bgmi-tournaments': {
    primaryTopic: 'BGMI Tournaments',
    relatedTopics: ['BGMI Tips', 'BGMI Strategies', 'BGMI Custom Rooms'],
    targetKeywords: GAMING_KEYWORD_CLUSTERS.bgmi.tier1,
    supportingKeywords: [...GAMING_KEYWORD_CLUSTERS.bgmi.tier2, ...GAMING_KEYWORD_CLUSTERS.bgmi.tier3],
    contentFormat: 'tournaments',
    difficultyLevel: 'beginner_to_advanced',
    targetAudience: 'competitive_players'
  },
  
  'pubg-tournaments': {
    primaryTopic: 'PUBG Mobile Tournaments',
    relatedTopics: ['PUBG Mobile Tips', 'PUBG Mobile Strategies', 'PUBG Mobile Custom Rooms'],
    targetKeywords: GAMING_KEYWORD_CLUSTERS.pubg.tier1,
    supportingKeywords: [...GAMING_KEYWORD_CLUSTERS.pubg.tier2, ...GAMING_KEYWORD_CLUSTERS.pubg.tier3],
    contentFormat: 'tournaments',
    difficultyLevel: 'beginner_to_advanced',
    targetAudience: 'competitive_players'
  },
  
  'freefire-tournaments': {
    primaryTopic: 'Free Fire Tournaments',
    relatedTopics: ['Free Fire Tips', 'Free Fire Strategies', 'Free Fire Custom Rooms'],
    targetKeywords: GAMING_KEYWORD_CLUSTERS.freefire.tier1,
    supportingKeywords: [...GAMING_KEYWORD_CLUSTERS.freefire.tier2, ...GAMING_KEYWORD_CLUSTERS.freefire.tier3],
    contentFormat: 'tournaments',
    difficultyLevel: 'beginner_to_advanced',
    targetAudience: 'competitive_players'
  },
  
  'bgmi-guides': {
    primaryTopic: 'BGMI Strategy Guides',
    relatedTopics: ['BGMI Weapon Guide', 'BGMI Map Guide', 'BGMI Tips'],
    targetKeywords: ['BGMI tips and tricks', 'BGMI strategy guide', 'BGMI weapon guide', 'BGMI map strategies'],
    supportingKeywords: ['BGMI sensitivity settings', 'BGMI loadout guide', 'BGMI gameplay tips'],
    contentFormat: 'guides',
    difficultyLevel: 'beginner_intermediate',
    targetAudience: 'learning_players'
  },
  
  'earning-guides': {
    primaryTopic: 'Gaming Earnings Guide',
    relatedTopics: ['BGMI earning', 'PUBG earning', 'Free Fire earning'],
    targetKeywords: [
      'how to earn money playing BGMI',
      'online gaming earn money India',
      'earn money playing PUBG',
      'Free Fire online earning tournament'
    ],
    supportingKeywords: [
      'mobile game earn paytm cash',
      'gaming tournament app India',
      'esports earning platform',
      'real money gaming India'
    ],
    contentFormat: 'guides',
    difficultyLevel: 'beginner',
    targetAudience: 'new_users'
  }
};

/**
 * Content gap analysis for striking distance keywords
 */
export const CONTENT_GAP_ANALYSIS = {
  highOpportunity: [
    {
      keyword: 'BGMI tournament with entry fee 10 rupees',
      searchVolume: 'Medium',
      competition: 'Low',
      intent: 'Commercial',
      contentIdea: 'Blog post comparing different platforms offering ₹10 entry tournaments with pros/cons'
    },
    {
      keyword: 'how to join BGMI tournament and win money',
      searchVolume: 'High',
      competition: 'Medium',
      intent: 'Informational',
      contentIdea: 'Step-by-step guide with screenshots showing the registration and winning process'
    },
    {
      keyword: 'BGMI tournament app with instant withdrawal',
      searchVolume: 'Medium',
      competition: 'Low',
      intent: 'Commercial',
      contentIdea: 'Review of different gaming apps highlighting withdrawal speed and reliability'
    }
  ],
  mediumOpportunity: [
    {
      keyword: 'best BGMI tournament app for beginners',
      searchVolume: 'Medium',
      competition: 'Medium',
      intent: 'Informational',
      contentIdea: 'Comparison article featuring features suitable for new players'
    },
    {
      keyword: 'BGMI tournament without investment India',
      searchVolume: 'Low',
      competition: 'Low',
      intent: 'Commercial',
      contentIdea: 'Guide to free tournaments and how to get started without spending money'
    }
  ],
  longTailOpportunities: [
    {
      keyword: 'BGMI custom room tournament registration process',
      searchVolume: 'Low',
      competition: 'Low',
      intent: 'Informational',
      contentIdea: 'Detailed walkthrough of the registration process with visuals'
    },
    {
      keyword: 'how to withdraw winnings from BGMI tournaments in India',
      searchVolume: 'Medium',
      competition: 'Medium',
      intent: 'Informational',
      contentIdea: 'Complete guide to withdrawal process including required documents and timelines'
    }
  ]
};

/**
 * Content calendar suggestions for keyword targeting
 */
export const CONTENT_CALENDAR = {
  weeklyThemes: [
    {
      week: 1,
      theme: 'BGMI Tournament Week',
      targetKeywords: GAMING_KEYWORD_CLUSTERS.bgmi.tier1,
      contentTypes: ['tournaments', 'news', 'strategies'],
      focus: 'BGMI tournaments and competitive gaming'
    },
    {
      week: 2,
      theme: 'Earning Week',
      targetKeywords: ['how to earn money playing BGMI', 'online gaming earn money India'],
      contentTypes: ['guides', 'reviews', 'tutorials'],
      focus: 'Making money through gaming'
    },
    {
      week: 3,
      theme: 'Strategy Week',
      targetKeywords: ['BGMI tips and tricks', 'BGMI strategy guide'],
      contentTypes: ['guides', 'videos', 'infographics'],
      focus: 'Improving gameplay skills'
    },
    {
      week: 4,
      theme: 'Multi-Game Week',
      targetKeywords: ['PUBG Mobile tournament India', 'Free Fire online earning tournament'],
      contentTypes: ['comparisons', 'reviews', 'tournaments'],
      focus: 'Different gaming platforms and options'
    }
  ],
  monthlyFocus: [
    {
      month: 'January',
      focus: 'New Year Gaming Resolutions',
      targetKeywords: ['BGMI tournament 2026', 'PUBG Mobile goals', 'Free Fire achievements'],
      contentAngle: 'Setting gaming goals for the year'
    },
    {
      month: 'February',
      focus: 'Valentine\'s Day Gaming',
      targetKeywords: ['duo tournaments', 'team building', 'gaming partnerships'],
      contentAngle: 'Playing games with partners/friends'
    },
    {
      month: 'March',
      focus: 'Spring Gaming Updates',
      targetKeywords: ['new features', 'game updates', 'tournament formats'],
      contentAngle: 'Latest updates and changes in gaming'
    }
  ]
};

/**
 * Content optimization checklist for striking distance keywords
 */
export const OPTIMIZATION_CHECKLIST = [
  {
    category: 'Content Depth',
    items: [
      'Ensure content is comprehensive (1000+ words for main topics)',
      'Include multiple sections covering different aspects of the keyword',
      'Add examples, case studies, or real-world applications',
      'Include visual elements (images, infographics, videos)'
    ]
  },
  {
    category: 'Keyword Integration',
    items: [
      'Use primary keyword in H1 (ideally in first 100 words)',
      'Include related keywords naturally throughout content',
      'Use keyword variations and synonyms',
      'Place keywords in meta tags, URLs, and image alt text'
    ]
  },
  {
    category: 'User Experience',
    items: [
      'Include table of contents for easy navigation',
      'Add FAQ section addressing common questions',
      'Include call-to-action buttons for relevant actions',
      'Ensure mobile-friendly content layout'
    ]
  },
  {
    category: 'Authority Signals',
    items: [
      'Include data and statistics from credible sources',
      'Reference official game websites and developer information',
      'Include expert quotes or community feedback',
      'Add internal links to related content'
    ]
  }
];