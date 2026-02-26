/**
 * BattleXZone Influencer Outreach System
 * PILLAR 4: Off-Page Authority Building
 * 
 * Gaming influencer database, outreach templates, and tracking system
 * for BGMI/Free Fire tournament promotions in India
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INFLUENCER TIER CLASSIFICATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const INFLUENCER_TIERS = {
  NANO: {
    name: 'Nano',
    range: '1K - 10K',
    minFollowers: 1000,
    maxFollowers: 10000,
    avgEngagement: '5-8%',
    costEstimate: '₹500 - ₹2,000',
    bestFor: 'High engagement, niche audience, authentic reviews',
    outreachPriority: 'medium',
  },
  MICRO: {
    name: 'Micro',
    range: '10K - 50K',
    minFollowers: 10000,
    maxFollowers: 50000,
    avgEngagement: '3-5%',
    costEstimate: '₹2,000 - ₹10,000',
    bestFor: 'Targeted reach, community trust, cost-effective',
    outreachPriority: 'high',
  },
  MID: {
    name: 'Mid',
    range: '50K - 500K',
    minFollowers: 50000,
    maxFollowers: 500000,
    avgEngagement: '2-4%',
    costEstimate: '₹10,000 - ₹50,000',
    bestFor: 'Brand awareness, tournament promotions',
    outreachPriority: 'high',
  },
  MACRO: {
    name: 'Macro',
    range: '500K+',
    minFollowers: 500000,
    maxFollowers: Infinity,
    avgEngagement: '1-3%',
    costEstimate: '₹50,000 - ₹5,00,000+',
    bestFor: 'Mass reach, major tournament launches',
    outreachPriority: 'low', // High cost, lower ROI for niche
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLATFORM CONFIGURATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const PLATFORMS = {
  YOUTUBE: {
    name: 'YouTube',
    icon: '📺',
    contentType: ['Videos', 'Shorts', 'Live Streams'],
    avgCPM: '₹50-150',
    bestForContent: [
      'Tournament gameplay',
      'Tutorial videos',
      'Live streaming tournaments',
      'Review content',
    ],
    outreachMethods: ['Email', 'Twitter DM', 'Business inquiries'],
    linkValue: 'High (do-follow in description)',
  },
  INSTAGRAM: {
    name: 'Instagram',
    icon: '📸',
    contentType: ['Reels', 'Stories', 'Posts', 'Live'],
    avgCPM: '₹30-100',
    bestForContent: [
      'Quick highlights',
      'Tournament announcements',
      'Story polls/engagement',
      'Reel clips',
    ],
    outreachMethods: ['DM', 'Email', 'Collab feature'],
    linkValue: 'Medium (link in bio only)',
  },
  DISCORD: {
    name: 'Discord',
    icon: '🎮',
    contentType: ['Server Events', 'Announcements', 'Voice Chats'],
    avgCPM: 'Variable',
    bestForContent: [
      'Community tournaments',
      'Server announcements',
      'Exclusive tournaments',
      'Community building',
    ],
    outreachMethods: ['Direct message', 'Server partnership'],
    linkValue: 'Medium (community engagement)',
  },
  TWITCH: {
    name: 'Twitch',
    icon: '🎬',
    contentType: ['Live Streams', 'Clips', 'VODs'],
    avgCPM: '₹40-120',
    bestForContent: [
      'Live tournament streaming',
      'Watch parties',
      'Interactive sessions',
    ],
    outreachMethods: ['Whisper', 'Email', 'Twitter'],
    linkValue: 'Medium (panel links)',
  },
  TWITTER: {
    name: 'Twitter/X',
    icon: '🐦',
    contentType: ['Tweets', 'Threads', 'Spaces'],
    avgCPM: '₹20-80',
    bestForContent: [
      'Tournament announcements',
      'Quick updates',
      'Engagement threads',
      'Giveaway promotions',
    ],
    outreachMethods: ['DM', 'Reply', 'Email'],
    linkValue: 'Low-Medium (no-follow links)',
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INFLUENCER DATABASE SCHEMA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const InfluencerSchema = {
  // Basic Information
  id: 'string (UUID)',
  name: 'string',
  primaryPlatform: 'enum (YOUTUBE, INSTAGRAM, DISCORD, TWITCH, TWITTER)',
  platforms: [{
    platform: 'enum',
    handle: 'string',
    url: 'string',
    followers: 'number',
    avgViews: 'number',
    engagementRate: 'number',
    verified: 'boolean',
  }],
  
  // Classification
  tier: 'enum (NANO, MICRO, MID, MACRO)',
  niche: ['BGMI', 'Free Fire', 'PUBG Mobile', 'General Gaming'],
  primaryGame: 'string',
  language: ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali'],
  region: ['National', 'North', 'South', 'East', 'West', 'Metro'],
  
  // Contact Information
  email: 'string',
  phone: 'string (optional)',
  socialLinks: {
    youtube: 'string',
    instagram: 'string',
    discord: 'string',
    twitter: 'string',
    twitch: 'string',
  },
  
  // Performance Metrics
  metrics: {
    avgViews: 'number',
    avgLikes: 'number',
    avgComments: 'number',
    avgShares: 'number',
    engagementRate: 'number',
    growthRate: 'number (monthly %)',
  },
  
  // Collaboration History
  collaborations: [{
    campaignId: 'string',
    date: 'Date',
    type: 'enum (SPONSORED, AFFILIATE, TOURNAMENT, REVIEW)',
    deliverables: 'string',
    cost: 'number',
    performance: {
      reach: 'number',
      engagement: 'number',
      clicks: 'number',
      conversions: 'number',
      roi: 'number',
    },
  }],
  
  // Outreach Status
  outreachStatus: 'enum (NOT_CONTACTED, PENDING, RESPONDED, NEGOTIATING, ACTIVE, DECLINED, INACTIVE)',
  lastContactDate: 'Date',
  nextFollowUpDate: 'Date',
  notes: 'string',
  
  // Preferences
  preferences: {
    minPayment: 'number',
    preferredCollabTypes: ['string'],
    availability: 'string',
    exclusivity: 'boolean',
  },
  
  // Tags & Labels
  tags: ['string'],
  rating: 'number (1-5)',
  recommended: 'boolean',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SAMPLE INFLUENCER DATABASE (Indian BGMI/Gaming Creators)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SAMPLE_INFLUENCERS = [
  {
    id: 'inf_001',
    name: 'Scout (Tanmay Singh)',
    primaryPlatform: 'YOUTUBE',
    tier: 'MACRO',
    niche: ['BGMI', 'PUBG Mobile'],
    primaryGame: 'BGMI',
    language: ['Hindi', 'English'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'Scout', followers: 4500000, avgViews: 500000, verified: true },
      { platform: 'INSTAGRAM', handle: 'scout_op', followers: 1200000, verified: true },
      { platform: 'TWITTER', handle: 'Scout_op', followers: 800000, verified: true },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 5,
    tags: ['pro-player', 'entertainer', 'tournament-host'],
  },
  {
    id: 'inf_002',
    name: 'MortaL (Naman Mathur)',
    primaryPlatform: 'YOUTUBE',
    tier: 'MACRO',
    niche: ['BGMI', 'PUBG Mobile'],
    primaryGame: 'BGMI',
    language: ['Hindi', 'English'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'MortaL', followers: 7000000, avgViews: 800000, verified: true },
      { platform: 'INSTAGRAM', handle: 'ig_mortal', followers: 2500000, verified: true },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 5,
    tags: ['pro-player', 'streamer', 'influencer'],
  },
  {
    id: 'inf_003',
    name: 'Jonathan Gaming',
    primaryPlatform: 'YOUTUBE',
    tier: 'MACRO',
    niche: ['BGMI'],
    primaryGame: 'BGMI',
    language: ['Hindi', 'English'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'JonathanGaming', followers: 3500000, avgViews: 400000, verified: true },
      { platform: 'INSTAGRAM', handle: 'jonathangaming', followers: 900000, verified: true },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 5,
    tags: ['pro-player', 'competitive', 'tips'],
  },
  {
    id: 'inf_004',
    name: 'Gyan Gaming',
    primaryPlatform: 'YOUTUBE',
    tier: 'MACRO',
    niche: ['Free Fire'],
    primaryGame: 'Free Fire',
    language: ['Hindi'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'GyanGaming', followers: 14000000, avgViews: 2000000, verified: true },
      { platform: 'INSTAGRAM', handle: 'gyangaming', followers: 1500000, verified: true },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 4,
    tags: ['free-fire', 'entertainer', 'mass-reach'],
  },
  {
    id: 'inf_005',
    name: 'Total Gaming (Ajju)',
    primaryPlatform: 'YOUTUBE',
    tier: 'MACRO',
    niche: ['Free Fire', 'BGMI'],
    primaryGame: 'Free Fire',
    language: ['Hindi'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'TotalGaming', followers: 40000000, avgViews: 5000000, verified: true },
      { platform: 'INSTAGRAM', handle: 'totalgaming_official', followers: 3000000, verified: true },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 5,
    tags: ['free-fire', 'mass-reach', 'entertainer'],
  },
  // Micro influencers for targeted campaigns
  {
    id: 'inf_006',
    name: 'BGMI Pro Tips',
    primaryPlatform: 'YOUTUBE',
    tier: 'MICRO',
    niche: ['BGMI'],
    primaryGame: 'BGMI',
    language: ['Hindi', 'English'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'BGMIProTips', followers: 25000, avgViews: 8000, verified: false },
      { platform: 'INSTAGRAM', handle: 'bgmprotips', followers: 15000, verified: false },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 4,
    tags: ['tips', 'tutorials', 'high-engagement'],
  },
  {
    id: 'inf_007',
    name: 'Free Fire India Live',
    primaryPlatform: 'YOUTUBE',
    tier: 'MICRO',
    niche: ['Free Fire'],
    primaryGame: 'Free Fire',
    language: ['Hindi'],
    platforms: [
      { platform: 'YOUTUBE', handle: 'FreeFireIndiaLive', followers: 35000, avgViews: 12000, verified: false },
    ],
    outreachStatus: 'NOT_CONTACTED',
    rating: 3,
    tags: ['live-streamer', 'free-fire', 'community'],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OUTREACH EMAIL TEMPLATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EMAIL_TEMPLATES = {
  // Initial Collaboration Outreach
  COLLABORATION_REQUEST: {
    subject: '🤝 Partnership Opportunity with BattleXZone - {influencerName}',
    template: `Hi {influencerName},

I hope this message finds you well! I've been following your {primaryGame} content on {platform} and I'm genuinely impressed by your engagement with the gaming community.

I'm reaching out from BattleXZone - India's fastest-growing BGMI and Free Fire tournament platform where players compete for real cash prizes. We've already hosted 500+ tournaments with ₹10,00,000+ in prizes distributed.

**Why Partner With Us?**
🎮 Exclusive tournament hosting opportunities
💰 Competitive compensation + performance bonuses
🏆 Access to our 50,000+ active player community
📈 Cross-promotion to grow your channel

**Partnership Options:**
1. **Tournament Host** - Host exclusive tournaments under your brand
2. **Brand Ambassador** - Long-term collaboration with monthly deliverables
3. **Content Creator** - Create sponsored content for our platform

I'd love to discuss how we can create value together. Are you available for a quick call this week?

Looking forward to hearing from you!

Best regards,
{senderName}
{senderTitle}
BattleXZone
{senderEmail}
{senderPhone}

P.S. We're currently running a ₹50,000 BGMI tournament series that would be perfect for your audience!`,
    variables: ['influencerName', 'primaryGame', 'platform', 'senderName', 'senderTitle', 'senderEmail', 'senderPhone'],
  },

  // Tournament Promotion Request
  TOURNAMENT_PROMOTION: {
    subject: '🏆 Promote Our ₹{prizePool} {game} Tournament - Paid Collaboration',
    template: `Hi {influencerName},

I noticed your amazing {game} content and thought you'd be perfect for an exciting opportunity!

**Tournament Details:**
🎮 Game: {game}
💰 Prize Pool: ₹{prizePool}
📅 Date: {tournamentDate}
👥 Expected Participants: {expectedPlayers}
🎯 Entry Fee: ₹{entryFee}

**What We're Looking For:**
- {deliverableCount} {contentType} promoting the tournament
- Target audience: {targetAudience}

**Compensation:**
- Fixed payment: ₹{payment}
- Bonus: ₹{bonusAmount} for every 100 registrations through your link

**Your Unique Tracking Link:**
{trackingLink}

This tournament is perfect for your audience who loves competitive {game} gameplay. Let me know if you're interested and I'll share more details!

Reply by {deadline} to confirm your participation.

Best,
{senderName}
BattleXZone Tournaments`,
    variables: ['influencerName', 'game', 'prizePool', 'tournamentDate', 'expectedPlayers', 'entryFee', 'deliverableCount', 'contentType', 'targetAudience', 'payment', 'bonusAmount', 'trackingLink', 'deadline', 'senderName'],
  },

  // Sponsorship Proposal
  SPONSORSHIP_PROPOSAL: {
    subject: '💰 Monthly Sponsorship Opportunity - BattleXZone x {influencerName}',
    template: `Dear {influencerName},

I'm excited to present a monthly sponsorship opportunity with BattleXZone!

**About BattleXZone:**
- India's premier BGMI/Free Fire tournament platform
- 50,000+ registered players
- ₹10,00,000+ in prizes distributed
- Featured in Sportskeeda, IGN India

**Sponsorship Package:**

📌 **Monthly Deliverables:**
- {monthlyVideos} YouTube video(s) featuring our tournaments
- {monthlyShorts} Shorts/Reels
- {monthlyPosts} Social media posts
- {monthlyStreams} Live stream session(s)

📌 **Compensation:**
- Monthly retainer: ₹{monthlyRetainer}
- Performance bonus: Up to ₹{maxBonus}
- Free tournament entries for your community

📌 **Additional Benefits:**
- Exclusive "BattleXZone Partner" badge
- Early access to new features
- Dedicated account manager
- Co-branded tournament opportunities

**Our Expectations:**
- Authentic content that resonates with your audience
- Timely delivery of agreed deliverables
- Brand guideline adherence
- Monthly performance review

I'd love to schedule a call to discuss this further. What time works best for you this week?

Looking forward to a successful partnership!

Best regards,
{senderName}
Partnership Manager, BattleXZone
{contactInfo}`,
    variables: ['influencerName', 'monthlyVideos', 'monthlyShorts', 'monthlyPosts', 'monthlyStreams', 'monthlyRetainer', 'maxBonus', 'senderName', 'contactInfo'],
  },

  // Follow-up Email
  FOLLOW_UP: {
    subject: 'Re: Partnership Opportunity with BattleXZone',
    template: `Hi {influencerName},

I wanted to follow up on my previous email about a potential partnership with BattleXZone.

I understand you're busy, but I didn't want you to miss out on this opportunity. We've recently:

✅ Launched our biggest tournament series yet - ₹1,00,000 prize pool
✅ Partnered with {partnerCount} gaming creators
✅ Reached {playerCount} registered players

**Quick Question:**
Would you be interested in a one-time collaboration to test the waters before committing to anything long-term?

We have a {game} tournament coming up on {date} with a ₹{prizePool} prize pool. It could be a great way to see how your audience responds.

Let me know your thoughts!

Best,
{senderName}`,
    variables: ['influencerName', 'partnerCount', 'playerCount', 'game', 'date', 'prizePool', 'senderName'],
  },

  // Second Follow-up
  SECOND_FOLLOW_UP: {
    subject: 'Final Check-in: BattleXZone Partnership',
    template: `Hi {influencerName},

This is my final follow-up regarding our partnership opportunity.

If the timing isn't right, I completely understand. If you'd prefer to reconnect in the future, just let me know and I'll add you to our quarterly newsletter for gaming creators.

In the meantime, feel free to check out our platform at battlexzone.com. We're always looking for feedback from creators like yourself.

Wishing you continued success with your content!

Best regards,
{senderName}
BattleXZone

P.S. If you know any other {game} creators who might be interested, I'd appreciate a referral!`,
    variables: ['influencerName', 'game', 'senderName'],
  },

  // Negotiation Response
  NEGOTIATION_RESPONSE: {
    subject: 'Re: Partnership Terms - BattleXZone',
    template: `Hi {influencerName},

Thank you for your response and for sharing your thoughts on the partnership terms.

I've discussed your requirements with our team, and here's our revised offer:

**Updated Terms:**
💰 Compensation: ₹{revisedPayment} per month
📅 Contract Duration: {contractDuration} months
🎯 Deliverables: {revisedDeliverables}
🎁 Additional: {additionalBenefits}

**Performance Incentives:**
- ₹{bonusPerRegistration} per tournament registration
- ₹{bonusPerView} per 1000 views on sponsored content
- Quarterly bonus of ₹{quarterlyBonus} for exceeding targets

We believe this offer reflects your value and the quality of content you create.

Would you like to schedule a call to finalize the details? I'm available {availableSlots}.

Looking forward to your response!

Best,
{senderName}`,
    variables: ['influencerName', 'revisedPayment', 'contractDuration', 'revisedDeliverables', 'additionalBenefits', 'bonusPerRegistration', 'bonusPerView', 'quarterlyBonus', 'availableSlots', 'senderName'],
  },

  // Welcome Email (After Agreement)
  WELCOME_PARTNER: {
    subject: '🎉 Welcome to BattleXZone Creator Program!',
    template: `Dear {influencerName},

Welcome to the BattleXZone Creator Family! 🎮

We're thrilled to have you on board as our official partner.

**Your Partnership Details:**
📋 Contract ID: {contractId}
📅 Start Date: {startDate}
💰 Monthly Compensation: ₹{monthlyPayment}
🎯 Deliverables: {deliverablesSummary}

**Your Dedicated Contact:**
👤 Account Manager: {accountManager}
📧 Email: {managerEmail}
📱 Phone: {managerPhone}

**Getting Started:**
1. Join our Creator Discord: {discordLink}
2. Access your dashboard: {dashboardLink}
3. Download brand assets: {assetsLink}
4. Review creator guidelines: {guidelinesLink}

**Your First Campaign:**
We have a {game} tournament on {firstCampaignDate} that would be perfect for your first promotional content. Details will be shared in our Discord.

If you have any questions, don't hesitate to reach out!

Let's create something amazing together! 🚀

Best regards,
{senderName}
BattleXZone Team`,
    variables: ['influencerName', 'contractId', 'startDate', 'monthlyPayment', 'deliverablesSummary', 'accountManager', 'managerEmail', 'managerPhone', 'discordLink', 'dashboardLink', 'assetsLink', 'guidelinesLink', 'game', 'firstCampaignDate', 'senderName'],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FOLLOW-UP SEQUENCE AUTOMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const FOLLOW_UP_SEQUENCE = {
  // Initial outreach sequence
  INITIAL_OUTREACH: {
    name: 'Initial Outreach Sequence',
    steps: [
      {
        day: 0,
        action: 'SEND_EMAIL',
        template: 'COLLABORATION_REQUEST',
        description: 'Send initial collaboration email',
      },
      {
        day: 3,
        action: 'CHECK_STATUS',
        description: 'Check if email was opened (if tracking enabled)',
      },
      {
        day: 5,
        action: 'SEND_EMAIL',
        template: 'FOLLOW_UP',
        description: 'Send first follow-up if no response',
        condition: 'NO_RESPONSE',
      },
      {
        day: 10,
        action: 'SEND_EMAIL',
        template: 'SECOND_FOLLOW_UP',
        description: 'Send final follow-up',
        condition: 'NO_RESPONSE',
      },
      {
        day: 15,
        action: 'UPDATE_STATUS',
        newStatus: 'INACTIVE',
        description: 'Mark as inactive if still no response',
        condition: 'NO_RESPONSE',
      },
    ],
  },

  // Post-response sequence
  POST_RESPONSE: {
    name: 'Post-Response Sequence',
    steps: [
      {
        day: 0,
        action: 'SEND_EMAIL',
        template: 'NEGOTIATION_RESPONSE',
        description: 'Respond to influencer inquiry',
      },
      {
        day: 2,
        action: 'FOLLOW_UP',
        description: 'Follow up on negotiation',
        condition: 'NO_RESPONSE',
      },
      {
        day: 5,
        action: 'SCHEDULE_CALL',
        description: 'Propose call to discuss terms',
        condition: 'NO_RESPONSE',
      },
    ],
  },

  // Active partner sequence
  ACTIVE_PARTNER: {
    name: 'Active Partner Sequence',
    steps: [
      {
        day: 0,
        action: 'SEND_EMAIL',
        template: 'WELCOME_PARTNER',
        description: 'Send welcome email with onboarding info',
      },
      {
        day: 1,
        action: 'DISCORD_INVITE',
        description: 'Add to creator Discord server',
      },
      {
        day: 3,
        action: 'DASHBOARD_ACCESS',
        description: 'Grant access to creator dashboard',
      },
      {
        day: 7,
        action: 'CHECK_IN',
        description: 'First week check-in call',
      },
      {
        recurring: 'MONTHLY',
        action: 'PERFORMANCE_REVIEW',
        description: 'Monthly performance review and payment',
      },
    ],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROI TRACKING METRICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ROI_METRICS = {
  // Primary KPIs
  PRIMARY: {
    REGISTRATIONS: {
      name: 'Tournament Registrations',
      description: 'Number of players registered through influencer link',
      targetPerCampaign: 100,
      weight: 0.3,
    },
    CONVERSION_RATE: {
      name: 'Conversion Rate',
      description: 'Percentage of link clicks that result in registration',
      targetPercentage: 15,
      weight: 0.2,
    },
    COST_PER_ACQUISITION: {
      name: 'Cost Per Acquisition (CPA)',
      description: 'Total cost / Number of new paying users',
      targetMax: 50, // ₹50 max CPA
      weight: 0.25,
    },
    REVENUE_GENERATED: {
      name: 'Revenue Generated',
      description: 'Entry fees from referred players',
      targetMultiplier: 3, // 3x of influencer cost
      weight: 0.25,
    },
  },

  // Secondary KPIs
  SECONDARY: {
    REACH: {
      name: 'Total Reach',
      description: 'Total impressions across all content',
    },
    ENGAGEMENT: {
      name: 'Engagement Rate',
      description: 'Likes, comments, shares on sponsored content',
    },
    BRAND_MENTIONS: {
      name: 'Brand Mentions',
      description: 'Organic mentions generated from campaign',
    },
    FOLLOWER_GROWTH: {
      name: 'Follower Growth',
      description: 'New followers on BattleXZone social accounts',
    },
  },

  // Attribution Model
  ATTRIBUTION: {
    MODEL: 'LAST_CLICK', // Options: FIRST_CLICK, LAST_CLICK, LINEAR, TIME_DECAY
    WINDOW_DAYS: 30, // Attribution window
    TRACKING_METHODS: [
      'UTM_PARAMETERS',
      'UNIQUE_REFERRAL_CODES',
      'CUSTOM_LANDING_PAGES',
      'PROMO_CODES',
    ],
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADVANCED SEO BACKLINK TARGETS & FRAMEWORKS (PILLAR 4)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BACKLINK_TARGETS = {
  TIER1: [
    {
      name: 'Sportskeeda Esports',
      domainAuthority: 75,
      type: 'News',
      focus: ['BGMI', 'Esports'],
      opportunities: ['Guest post', 'Tournament coverage', 'Data drop'],
      contact: 'press@sportskeeda.com',
      preferredAnchors: ['branded', 'naked'],
      notes: 'Needs exclusive stats or pro-player quotes',
    },
    {
      name: 'IGN India',
      domainAuthority: 72,
      type: 'News',
      focus: ['Gaming', 'New launches'],
      opportunities: ['Press release', 'Expert commentary'],
      contact: 'india@ign.com',
      preferredAnchors: ['branded', 'partial'],
      notes: 'Pitch monthly prize pools and anti-cheat tech',
    },
    {
      name: 'NDTV Gadgets',
      domainAuthority: 70,
      type: 'Tech News',
      focus: ['Mobile gaming', 'Apps'],
      opportunities: ['Product review', 'How-to feature'],
      contact: 'gadgets360@ndtv.com',
      preferredAnchors: ['branded'],
      notes: 'Needs strong E-E-A-T signals and data led narrative',
    },
    {
      name: 'Times of India Tech',
      domainAuthority: 68,
      type: 'News',
      focus: ['Esports', 'Mobile'],
      opportunities: ['Expert quotes', 'Trend stories'],
      contact: 'gaming@timesgroup.com',
      preferredAnchors: ['branded'],
      notes: 'Short lead time; provide media kit + founder access',
    },
  ],
  TIER2: [
    {
      name: 'TechWorm',
      domainAuthority: 48,
      type: 'Tech Blog',
      focus: ['Guides', 'Gaming apps'],
      opportunities: ['Guest post', 'Listicle inclusion'],
      contact: 'editor@techworm.net',
      preferredAnchors: ['partial', 'branded'],
      notes: 'Accepts long form tutorials with stats and screenshots',
    },
    {
      name: 'CashOverflow',
      domainAuthority: 38,
      type: 'Finance Blog',
      focus: ['Online earning', 'Fintech'],
      opportunities: ['Guest post', 'Case study'],
      contact: 'support@cashoverflow.in',
      preferredAnchors: ['partial', 'exact'],
      notes: 'Highlight earning potential + withdrawal proof',
    },
    {
      name: 'ShoutMeLoud',
      domainAuthority: 40,
      type: 'Blogging',
      focus: ['Make money online'],
      opportunities: ['Guest post', 'Interview'],
      contact: 'hello@shoutmeloud.com',
      preferredAnchors: ['branded', 'partial'],
      notes: 'Needs unique strategy angle and screenshots',
    },
  ],
  TIER3: [
    {
      name: 'Reddit r/IndianGaming',
      domainAuthority: 91,
      type: 'Community',
      focus: ['Gaming news', 'Discussions'],
      opportunities: ['Value-first thread', 'AMA'],
      contact: 'modmail',
      preferredAnchors: ['naked', 'branded'],
      notes: 'Avoid promotional tone; share learnings/data',
    },
    {
      name: 'Digit Forum',
      domainAuthority: 30,
      type: 'Forum',
      focus: ['Tech', 'Gaming'],
      opportunities: ['How-to posts', 'Resource lists'],
      contact: 'community@digit.in',
      preferredAnchors: ['naked'],
      notes: 'Link from signature after delivering value',
    },
    {
      name: 'Telegram Gaming Channels',
      domainAuthority: null,
      type: 'Community',
      focus: ['BGMI', 'Free Fire'],
      opportunities: ['Community partnership', 'Giveaways'],
      contact: 'channel admins',
      preferredAnchors: ['generic', 'branded'],
      notes: 'Use tracked short links + coupon codes',
    },
  ],
};

export const ANCHOR_TEXT_FRAMEWORK = {
  distribution: {
    branded: 40,
    naked: 25,
    partial: 15,
    generic: 10,
    exact: 10,
  },
  guidelines: {
    tier1: 'Prioritize branded and naked anchors; avoid exact match on newsroom placements.',
    tier2: 'Blend branded, naked, and partial anchors. Limit exact match to 1 per article.',
    tier3: 'Use naked URLs or branded mentions inside value-first posts. Keep anchors natural.',
  },
  examples: {
    branded: ['BattleXZone', 'BattleXZone tournaments'],
    naked: ['https://www.battlexzone.com', 'www.battlexzone.com/tournaments'],
    partial: ['BGMI tournament platform', 'online gaming tournaments in India'],
    generic: ['learn more', 'join now'],
    exact: ['BGMI tournament India', 'Free Fire tournament app'],
  },
};

export const LINK_VELOCITY_PLAN = {
  monthly: [
    { month: 1, phase: 'Foundation', targetRefDomains: 20, focus: ['directories', 'social profiles'], risk: 'very-low' },
    { month: 2, phase: 'Initial Outreach', targetRefDomains: 30, focus: ['guest posts DA30+', 'resource pages'], risk: 'low' },
    { month: 3, phase: 'Authority Building', targetRefDomains: 40, focus: ['Tier1 outreach', 'digital PR'], risk: 'low-medium' },
    { month: 4, phase: 'Scale Up', targetRefDomains: 50, focus: ['PR', 'influencer collabs'], risk: 'medium' },
    { month: 5, phase: 'Diversify', targetRefDomains: 60, focus: ['forums', 'community links'], risk: 'medium' },
    { month: 6, phase: 'Consolidate', targetRefDomains: 75, focus: ['high DA partnerships'], risk: 'low-medium' },
  ],
  weeklyTargets: [
    { phase: 'Weeks 1-4', newRefDomains: 5, guestPosts: 1, resourceLinks: 2, communityLinks: 5, prMentions: 0 },
    { phase: 'Weeks 5-8', newRefDomains: 7, guestPosts: 2, resourceLinks: 3, communityLinks: 5, prMentions: 1 },
    { phase: 'Weeks 9-12', newRefDomains: 10, guestPosts: 3, resourceLinks: 4, communityLinks: 8, prMentions: 2 },
    { phase: 'Weeks 13-16', newRefDomains: 12, guestPosts: 3, resourceLinks: 5, communityLinks: 10, prMentions: 3 },
    { phase: 'Weeks 17-20', newRefDomains: 15, guestPosts: 4, resourceLinks: 5, communityLinks: 12, prMentions: 4 },
    { phase: 'Weeks 21-24', newRefDomains: 18, guestPosts: 4, resourceLinks: 6, communityLinks: 15, prMentions: 5 },
  ],
};

export const DIGITAL_PR_ANGLES = [
  {
    angle: 'Prize Pool Transparency',
    hook: '₹10,00,000+ distributed with instant UPI payouts',
    assets: ['Infographic', 'Player earnings leaderboard'],
    bestFor: ['Sportskeeda', 'IGN India', 'Financial blogs'],
  },
  {
    angle: 'Anti-Cheat Technology',
    hook: 'Federated review system blocking 3,200 cheaters in 2025',
    assets: ['Security whitepaper', 'Founder interview'],
    bestFor: ['TechWorm', 'NDTV Gadgets'],
  },
  {
    angle: 'Creator Economy',
    hook: 'Influencer tournaments driving 30% new registrations',
    assets: ['Influencer case studies', 'Community survey'],
    bestFor: ['ShoutMeLoud', 'CashOverflow'],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ESPORTS KEYWORD UNIVERSE (10K+ VARIATIONS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const KEYWORD_COMPONENTS = {
  games: [
    'bgmi',
    'bgmi mobile',
    'battlegrounds mobile india',
    'pubg mobile',
    'pubg new state',
    'free fire',
    'free fire max',
    'call of duty mobile',
    'valorant mobile',
    'apex legends mobile',
    'mobile esports',
  ],
  intents: [
    'tournament',
    'tournaments',
    'scrims',
    'custom room',
    'league',
    'championship',
    'practice lobby',
    'qualifier',
    'ladder',
    'event calendar',
  ],
  actionVerbs: [
    'join',
    'register for',
    'play',
    'host',
    'watch',
    'stream',
    'win',
    'earn from',
    'qualify in',
    'practice for',
  ],
  payouts: [
    'cash prize',
    'cash prizes',
    'win money',
    'earn money',
    'cash rewards',
    'prize pool',
    'diamonds reward',
    'paytm cash',
    'upi withdrawal',
  ],
  modifiers: [
    'online',
    'india',
    'pan india',
    'daily',
    'weekly',
    'monthly',
    'instant payout',
    'entry fee 10 rs',
    'low entry fee',
    'no entry fee',
    'competitive',
    'verified',
    'official',
    '2026',
  ],
  geoTargets: [
    'delhi',
    'mumbai',
    'bengaluru',
    'hyderabad',
    'kolkata',
    'chennai',
    'pune',
    'ahmedabad',
    'lucknow',
    'jaipur',
    'patna',
    'bhubaneswar',
    'kochi',
    'coimbatore',
    'vizag',
    'guwahati',
    'nagpur',
    'indore',
    'surat',
    'india',
  ],
  audienceSegments: [
    'students',
    'college players',
    'school players',
    'new teams',
    'pro squads',
    'streamers',
    'content creators',
    'clan members',
    'solo players',
    'amateur players',
  ],
  tournamentFormats: [
    'solo',
    'duo',
    'squad',
    'tpp',
    'fpp',
    'ladder',
    'knockout',
    'league',
    'custom room',
  ],
  timeframes: ['today', 'tonight', 'this week', 'weekend', 'season 3', 'season 4'],
  hookPhrases: [
    'fixtures',
    'calendar',
    'scrim codes',
    'practice rooms',
    'discord',
    'bracket',
    'results',
    'leaderboard',
    'point table',
  ],
  monetizationHooks: [
    'creator program',
    'sponsorship',
    'brand deal',
    'affiliate offer',
    'coaching request',
  ],
  communitySignals: [
    'verified',
    'trusted',
    'official',
    'whitelisted',
    'esport ready',
  ],
  hindiIntents: [
    'tournament kaise join kare',
    'cash cup kaise jeete',
    'esports se paise kaise kamaye',
    'custom room registration',
    'bgmi tournament hindi',
    'free fire tournament hindi',
  ],
  hindiConnectors: ['guide', 'hindi me', 'step by step', 'kaise kare', 'tips'],
  yearTokens: ['2024', '2025', '2026'],
};

export const KEYWORD_BLUEPRINTS = [
  { keys: ['actionVerbs', 'games', 'intents', 'geoTargets'], weight: 0.3 },
  { keys: ['games', 'intents', 'payouts', 'modifiers'], weight: 0.2 },
  { keys: ['games', 'intents', 'audienceSegments', 'geoTargets'], weight: 0.15 },
  { keys: ['games', 'tournamentFormats', 'timeframes', 'payouts'], weight: 0.1 },
  { keys: ['actionVerbs', 'games', 'hookPhrases', 'modifiers'], weight: 0.1 },
  { keys: ['games', 'communitySignals', 'monetizationHooks', 'modifiers'], weight: 0.075 },
  { keys: ['games', 'intents', 'yearTokens'], weight: 0.05 },
  { keys: ['hindiIntents', 'games', 'hindiConnectors', 'geoTargets'], weight: 0.025 },
];

const DEFAULT_KEYWORD_LIMIT = 15000;

const filterComponentList = (list, allowed) => {
  if (!Array.isArray(list) || list.length === 0) return [];
  if (!allowed || allowed.length === 0) return list;
  const normalized = allowed
    .map(item => (typeof item === 'string' ? item.trim().toLowerCase() : ''))
    .filter(Boolean);
  if (normalized.length === 0) return list;
  return list.filter(item => normalized.includes(item.toLowerCase()));
};

const buildKeywordFromParts = parts => parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

function buildKeywordsForBlueprint({ keys, keywordSet, components, targetSize }) {
  if (keywordSet.size >= targetSize) return;
  const lists = keys.map(key => components[key] || []);
  if (lists.some(list => list.length === 0)) return;

  const walk = (depth, bucket) => {
    if (keywordSet.size >= targetSize) return true;
    if (depth === lists.length) {
      const keyword = buildKeywordFromParts(bucket);
      if (keyword) keywordSet.add(keyword);
      return keywordSet.size >= targetSize;
    }
    for (const token of lists[depth]) {
      bucket.push(token);
      const shouldStop = walk(depth + 1, bucket);
      bucket.pop();
      if (shouldStop) return true;
    }
    return false;
  };

  walk(0, []);
}

export function generateKeywordUniverse({
  limit = DEFAULT_KEYWORD_LIMIT,
  games,
  intents,
  geos,
  geoTargets,
  modifiers,
  includeHindi = true,
  includeYears = true,
} = {}) {
  const normalizedLimit = Math.max(1, limit);
  const components = {
    ...KEYWORD_COMPONENTS,
    games: filterComponentList(KEYWORD_COMPONENTS.games, games),
    intents: filterComponentList(KEYWORD_COMPONENTS.intents, intents),
    geoTargets: filterComponentList(KEYWORD_COMPONENTS.geoTargets, geos || geoTargets),
    modifiers: filterComponentList(KEYWORD_COMPONENTS.modifiers, modifiers),
  };

  if (!includeHindi) {
    components.hindiIntents = [];
    components.hindiConnectors = [];
  }
  if (!includeYears) {
    components.yearTokens = [];
  }

  const keywordSet = new Set();
  const totalWeight = KEYWORD_BLUEPRINTS.reduce((sum, blueprint) => sum + (blueprint.weight || 0), 0) || KEYWORD_BLUEPRINTS.length;

  KEYWORD_BLUEPRINTS.forEach(blueprint => {
    if (keywordSet.size >= normalizedLimit) return;
    const share = blueprint.weight || 0;
    const desired = Math.max(1, Math.floor((share / totalWeight) * normalizedLimit) || Math.floor(normalizedLimit / KEYWORD_BLUEPRINTS.length));
    const targetSize = Math.min(normalizedLimit, keywordSet.size + desired);
    buildKeywordsForBlueprint({
      keys: blueprint.keys,
      keywordSet,
      components,
      targetSize,
    });
  });

  if (keywordSet.size < normalizedLimit) {
    KEYWORD_BLUEPRINTS.forEach(blueprint => {
      if (keywordSet.size >= normalizedLimit) return;
      buildKeywordsForBlueprint({
        keys: blueprint.keys,
        keywordSet,
        components,
        targetSize: normalizedLimit,
      });
    });
  }

  return Array.from(keywordSet).slice(0, normalizedLimit);
}

let cachedKeywordUniverse = null;

export function getKeywordUniverse(options = {}) {
  const isDefaultCall = Object.keys(options || {}).length === 0;
  if (isDefaultCall) {
    if (!cachedKeywordUniverse) {
      cachedKeywordUniverse = generateKeywordUniverse({ limit: DEFAULT_KEYWORD_LIMIT });
    }
    return cachedKeywordUniverse;
  }
  return generateKeywordUniverse(options);
}

export const KEYWORD_LIBRARY = {
  components: KEYWORD_COMPONENTS,
  blueprints: KEYWORD_BLUEPRINTS,
  defaultLimit: DEFAULT_KEYWORD_LIMIT,
  getAll: () => getKeywordUniverse(),
  sample: (size = 100) => generateKeywordUniverse({ limit: Math.max(1, size) }),
  byGame: (game, size = 2000) => generateKeywordUniverse({
    limit: Math.max(1, size),
    games: Array.isArray(game) ? game : [game],
  }),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Determine influencer tier based on follower count
 */
export function getInfluencerTier(followers) {
  if (followers >= 500000) return INFLUENCER_TIERS.MACRO;
  if (followers >= 50000) return INFLUENCER_TIERS.MID;
  if (followers >= 10000) return INFLUENCER_TIERS.MICRO;
  return INFLUENCER_TIERS.NANO;
}

/**
 * Calculate estimated cost for influencer collaboration
 */
export function estimateCollaborationCost(tier, deliverables) {
  const baseCosts = {
    NANO: { video: 1500, short: 500, post: 300, stream: 1000 },
    MICRO: { video: 5000, short: 1500, post: 800, stream: 3000 },
    MID: { video: 25000, short: 8000, post: 4000, stream: 15000 },
    MACRO: { video: 150000, short: 50000, post: 25000, stream: 75000 },
  };

  const tierCosts = baseCosts[tier] || baseCosts.MICRO;
  let totalCost = 0;

  deliverables.forEach(d => {
    totalCost += (tierCosts[d.type] || 0) * d.quantity;
  });

  return totalCost;
}

/**
 * Generate UTM parameters for tracking
 */
export function generateTrackingUTM(influencerId, campaignId, platform) {
  return {
    utm_source: platform.toLowerCase(),
    utm_medium: 'influencer',
    utm_campaign: campaignId,
    utm_content: influencerId,
    utm_term: `inf_${influencerId}_${Date.now()}`,
  };
}

/**
 * Generate unique referral code for influencer
 */
export function generateReferralCode(influencerName, campaignId) {
  const cleanName = influencerName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 6);
  const campaignCode = campaignId.substring(0, 4).toUpperCase();
  return `${cleanName}_${campaignCode}`;
}

/**
 * Calculate ROI for influencer campaign
 */
export function calculateROI(cost, metrics) {
  const {
    registrations = 0,
    payingUsers = 0,
    revenue = 0,
    entryFees = 0,
  } = metrics;

  return {
    costPerRegistration: registrations > 0 ? cost / registrations : 0,
    costPerPayingUser: payingUsers > 0 ? cost / payingUsers : 0,
    roi: cost > 0 ? ((revenue - cost) / cost) * 100 : 0,
    revenueMultiplier: cost > 0 ? revenue / cost : 0,
    totalValue: revenue - cost,
  };
}

/**
 * Score influencer for campaign fit
 */
export function scoreInfluencerFit(influencer, campaign) {
  let score = 0;
  const weights = {
    gameMatch: 30,
    audienceMatch: 25,
    engagementRate: 20,
    costEfficiency: 15,
    pastPerformance: 10,
  };

  // Game match
  if (influencer.primaryGame === campaign.game) {
    score += weights.gameMatch;
  } else if (influencer.niche.includes(campaign.game)) {
    score += weights.gameMatch * 0.7;
  }

  // Audience match (language, region)
  const languageMatch = campaign.targetLanguages.some(l => influencer.language.includes(l));
  const regionMatch = campaign.targetRegions.some(r => influencer.region.includes(r));
  if (languageMatch && regionMatch) {
    score += weights.audienceMatch;
  } else if (languageMatch || regionMatch) {
    score += weights.audienceMatch * 0.5;
  }

  // Engagement rate
  const avgEngagement = influencer.platforms.reduce((sum, p) => sum + (p.engagementRate || 0), 0) / influencer.platforms.length;
  if (avgEngagement >= 5) score += weights.engagementRate;
  else if (avgEngagement >= 3) score += weights.engagementRate * 0.7;
  else if (avgEngagement >= 1) score += weights.engagementRate * 0.4;

  // Cost efficiency (based on tier)
  const tier = INFLUENCER_TIERS[influencer.tier];
  if (tier === INFLUENCER_TIERS.MICRO) score += weights.costEfficiency;
  else if (tier === INFLUENCER_TIERS.NANO) score += weights.costEfficiency * 0.8;
  else if (tier === INFLUENCER_TIERS.MID) score += weights.costEfficiency * 0.5;

  // Past performance
  if (influencer.collaborations && influencer.collaborations.length > 0) {
    const avgROI = influencer.collaborations.reduce((sum, c) => sum + (c.performance?.roi || 0), 0) / influencer.collaborations.length;
    if (avgROI > 200) score += weights.pastPerformance;
    else if (avgROI > 100) score += weights.pastPerformance * 0.7;
    else if (avgROI > 0) score += weights.pastPerformance * 0.4;
  }

  return {
    score: Math.min(100, score),
    breakdown: {
      gameMatch: influencer.primaryGame === campaign.game ? 'Full' : 'Partial',
      audienceMatch: languageMatch && regionMatch ? 'Full' : 'Partial',
      engagementRate: avgEngagement.toFixed(2) + '%',
      tier: influencer.tier,
    },
  };
}

/**
 * Format email template with variables
 */
export function formatEmailTemplate(template, variables) {
  let formatted = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    formatted = formatted.replace(regex, variables[key] || '');
  });
  return formatted;
}

/**
 * Get recommended influencers for a campaign
 */
export function getRecommendedInfluencers(influencers, campaign, limit = 10) {
  return influencers
    .map(inf => ({
      ...inf,
      fitScore: scoreInfluencerFit(inf, campaign),
    }))
    .sort((a, b) => b.fitScore.score - a.fitScore.score)
    .slice(0, limit);
}

const BRAND_KEYWORDS = ['battlexzone', 'battle x zone', 'battlezone'];
const GENERIC_ANCHORS = ['click here', 'learn more', 'visit website', 'read more', 'check it out'];
const EXACT_MATCH_KEYWORDS = ['bgmi tournament india', 'free fire tournament', 'bgmi win match online'];
const LINK_TYPE_WEIGHTS = {
  news: 1,
  pr: 0.85,
  blog: 0.8,
  resource: 0.75,
  community: 0.6,
  forum: 0.55,
};

/**
 * Categorize anchor text to monitor distribution automatically
 */
export function classifyAnchorText(anchor = '') {
  const normalized = anchor.trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (normalized.startsWith('http')) return 'naked';
  if (GENERIC_ANCHORS.includes(normalized)) return 'generic';
  if (BRAND_KEYWORDS.some(keyword => normalized.includes(keyword))) return 'branded';
  if (EXACT_MATCH_KEYWORDS.includes(normalized)) return 'exact';
  return 'partial';
}

/**
 * Calculate how many anchors of each type are needed for a campaign
 */
export function calculateAnchorMix(totalLinks, distribution = ANCHOR_TEXT_FRAMEWORK.distribution) {
  if (!totalLinks || totalLinks <= 0) return {};
  const entries = Object.entries(distribution);
  if (entries.length === 0) return {};

  const mix = {};
  let allocated = 0;

  entries.forEach(([type, percent], index) => {
    if (index === entries.length - 1) {
      mix[type] = Math.max(0, totalLinks - allocated);
    } else {
      const count = Math.round((totalLinks * percent) / 100);
      mix[type] = Math.max(0, count);
      allocated += count;
    }
  });

  const diff = totalLinks - Object.values(mix).reduce((sum, val) => sum + val, 0);
  if (diff !== 0) {
    const primaryAnchor = entries[0]?.[0];
    if (primaryAnchor) {
      mix[primaryAnchor] = (mix[primaryAnchor] || 0) + diff;
    }
  }

  return mix;
}

/**
 * Score backlink prospects based on DA, relevance, traffic, and risk
 */
export function scoreBacklinkOpportunity(prospect = {}) {
  const {
    domainAuthority = 0,
    relevanceScore = 0, // 0-10 scale
    monthlyTraffic = 0,
    spamScore = 0,
    linkType = 'blog',
    requiresPayment = false,
    existingRelationship = false,
  } = prospect;

  const daScore = Math.min(domainAuthority / 100, 1) * 30;
  const relevance = Math.min(relevanceScore / 10, 1) * 30;
  const traffic = Math.min(monthlyTraffic / 500000, 1) * 15;
  const placementWeight = (LINK_TYPE_WEIGHTS[linkType] || 0.7) * 20;
  const relationshipBoost = existingRelationship ? 5 : 0;
  const spamPenalty = Math.min(spamScore / 100, 1) * 20;

  let score = daScore + relevance + traffic + placementWeight + relationshipBoost - spamPenalty;
  if (requiresPayment) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Recommend outreach approach + anchor policy for a prospect
 */
export function recommendOutreachStrategy(prospect = {}) {
  const score = scoreBacklinkOpportunity(prospect);
  const da = prospect.domainAuthority || 0;
  const tier = da >= 60 ? 'TIER1' : da >= 40 ? 'TIER2' : 'TIER3';
  const anchorGuideline =
    tier === 'TIER1'
      ? ['branded', 'naked']
      : tier === 'TIER2'
        ? ['branded', 'partial', 'naked']
        : ['naked', 'generic', 'branded'];

  const urgency = score >= 80 ? 'immediate' : score >= 60 ? 'this week' : 'backlog';
  const messaging = prospect.notes
    || (tier === 'TIER1'
      ? 'Lead with exclusive dataset + founder quote'
      : tier === 'TIER2'
        ? 'Pitch long-form tutorial backed by earnings proof'
        : 'Deliver value-first answers before dropping a link');

  return {
    tier,
    score,
    urgency,
    recommendedAnchors: prospect.preferredAnchors || anchorGuideline,
    messaging,
  };
}

/**
 * Forecast remaining link velocity targets based on current month
 */
export function projectLinkVelocity(currentMonth = 1, plan = LINK_VELOCITY_PLAN.monthly) {
  if (!Array.isArray(plan) || plan.length === 0) {
    return { remainingMonths: [], totalTarget: 0 };
  }

  const remainingMonths = plan.filter(item => item.month >= currentMonth);
  const totalTarget = remainingMonths.reduce((sum, item) => sum + (item.targetRefDomains || 0), 0);
  const currentPhase = remainingMonths.find(item => item.month === currentMonth);

  return {
    currentPhase,
    remainingMonths,
    totalTarget,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT DEFAULT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default {
  INFLUENCER_TIERS,
  PLATFORMS,
  InfluencerSchema,
  SAMPLE_INFLUENCERS,
  EMAIL_TEMPLATES,
  FOLLOW_UP_SEQUENCE,
  ROI_METRICS,
  BACKLINK_TARGETS,
  ANCHOR_TEXT_FRAMEWORK,
  LINK_VELOCITY_PLAN,
  DIGITAL_PR_ANGLES,
  KEYWORD_COMPONENTS,
  KEYWORD_BLUEPRINTS,
  KEYWORD_LIBRARY,
  getInfluencerTier,
  estimateCollaborationCost,
  generateTrackingUTM,
  generateReferralCode,
  calculateROI,
  scoreInfluencerFit,
  formatEmailTemplate,
  getRecommendedInfluencers,
  generateKeywordUniverse,
  getKeywordUniverse,
  classifyAnchorText,
  calculateAnchorMix,
  scoreBacklinkOpportunity,
  recommendOutreachStrategy,
  projectLinkVelocity,
};
