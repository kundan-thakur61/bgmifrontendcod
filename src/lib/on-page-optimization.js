/**
 * On-Page Optimization Framework for Esports Gaming Platform
 * Implements title tag templates, meta description formulas, header structure guidelines,
 * and internal linking strategy for striking distance keyword optimization
 */

import { SITE } from './seo-config';

// Title tag templates for different page types
export const TITLE_TEMPLATES = {
  // Homepage template
  home: '{{primaryKeyword}} | {{secondaryBenefit}} | {{brandName}}',
  
  // Tournament/Mobile page templates
  tournament: '{{primaryKeyword}} — ₹{{prizeAmount}} Prize | {{gameType}} {{formatType}}',
  match: '{{matchTitle} — ₹{{prizePool}} Prize | {{gameType}} {{matchType}}',
  
  // Blog/Content page templates
  blog: '{{primaryKeyword}} | {{year}} Guide | {{brandName}}',
  guide: '{{primaryKeyword}} — {{secondaryKeyword}} | {{brandName}}',
  
  // Category/Listing templates
  category: '{{primaryKeyword}} | {{secondaryBenefit}} | Page {{pageNumber}} | {{brandName}}',
  
  // Location-based templates
  location: '{{primaryKeyword}} in {{locationName}} {{year}} — {{benefit}}',
  
  // FAQ/Utility templates
  faq: '{{questionFragment}} — {{brandName}} FAQ',
  howto: 'How to {{action}} — {{brandName}} Guide'
};

// Meta description formulas
export const META_DESCRIPTION_FORMULAS = {
  // High-converting formula (140-160 characters)
  highConverting: '{{primaryValueProposition}}. {{benefitStatement}}. {{cta}} →',
  
  // Informational formula (150-160 characters)
  informational: '{{topicOverview}}. {{keyBenefit}} {{additionalValue}}. {{authoritativeSource}}',
  
  // Commercial formula (140-160 characters)
  commercial: '{{primaryOffer}} — {{valueAdd}}. {{trustSignal}}. {{urgentCallToAction}}.',
  
  // Local formula (150-160 characters)
  local: '{{service}} in {{location}}. {{localValue}} {{uniqueSellingPoint}}. {{localProof}}',
  
  // Comparison formula (150-160 characters)
  comparison: '{{comparisonSubject}}: {{keyDifference}}. {{prosCons}} {{recommendation}}. {{source}}'
};

// Header structure guidelines
export const HEADER_STRUCTURE_GUIDELINES = {
  // Homepage structure
  home: {
    h1: ['{{primaryValueProposition}}', '{{brandNameTagline}}'],
    h2: ['{{primaryCategory}}', 'Why Choose {{brandName}}', 'How It Works', 'Popular {{primaryCategory}}', 'Success Stories'],
    h3: ['{{feature1}}', '{{feature2}}', '{{feature3}}', 'Step 1: {{action}}', 'Step 2: {{action}}', 'Step 3: {{action}}']
  },
  
  // Product/Tournament structure
  tournament: {
    h1: ['{{tournamentName}} — ₹{{prizePool}} Prize Pool'],
    h2: ['Tournament Details', 'Registration Info', 'Prize Distribution', 'Rules & Guidelines', 'How to Join'],
    h3: ['{{specificRule}}', '{{prizeTier}}', '{{scheduleDetail}}', 'Entry Requirements', 'Payment Methods']
  },
  
  // Blog structure
  blog: {
    h1: ['{{primaryKeyword}} — {{year}} Complete Guide'],
    h2: ['Introduction to {{topic}}', 'Key {{benefits}}', 'Step-by-Step {{process}}', 'Common {{challenges}}', 'Conclusion'],
    h3: ['{{subtopic1}}', '{{subtopic2}}', '{{subtopic3}}', 'Pro Tip: {{tip}}', 'Did You Know: {{fact}}']
  }
};

// Internal linking strategy
export const INTERNAL_LINKING_STRATEGY = {
  // Homepage internal links
  home: [
    { anchorText: 'BGMI Tournaments', url: '/tournaments', priority: 'high', context: 'primary_cta' },
    { anchorText: 'Join Matches', url: '/matches', priority: 'high', context: 'conversion_focus' },
    { anchorText: 'How It Works', url: '/how-it-works', priority: 'medium', context: 'educational' },
    { anchorText: 'Latest Blog Posts', url: '/blog', priority: 'medium', context: 'content_hub' }
  ],
  
  // Tournament page internal links
  tournament: [
    { anchorText: 'More {{gameType}} Tournaments', url: '/tournaments/{{gameType}}', priority: 'high', context: 'category_navigation' },
    { anchorText: 'Similar Prize Pools', url: '/tournaments?prize={{prizeRange}}', priority: 'medium', context: 'value_based' },
    { anchorText: 'Tournament Rules', url: '/rules', priority: 'medium', context: 'trust_building' },
    { anchorText: 'How to Prepare', url: '/blog/how-to-prepare', priority: 'low', context: 'educational' }
  ],
  
  // Blog page internal links
  blog: [
    { anchorText: 'More {{category}} Guides', url: '/blog/{{category}}', priority: 'high', context: 'content_navigation' },
    { anchorText: 'Related Tournaments', url: '/tournaments/{{relatedGame}}', priority: 'medium', context: 'conversion' },
    { anchorText: 'How to Get Started', url: '/how-it-works', priority: 'medium', context: 'conversion_path' },
    { anchorText: 'FAQ Section', url: '/faq', priority: 'low', context: 'support' }
  ]
};

// Content optimization formulas for striking distance keywords
export const STRIKING_DISTANCE_OPTIMIZATION = {
  // Content depth formulas
  contentDepth: {
    // For keywords in positions 11-15 (closer to page 1)
    closer: {
      minWords: 1200,
      h2Headers: 6,
      internalLinks: 8,
      multimediaElements: 3,
      faqSection: true,
      relatedTopics: 5
    },
    // For keywords in positions 16-20 (further from page 1)
    further: {
      minWords: 1500,
      h2Headers: 8,
      internalLinks: 12,
      multimediaElements: 5,
      faqSection: true,
      relatedTopics: 7,
      externalReferences: 3,
      statisticalData: true
    }
  },
  
  // Keyword density targets for striking distance
  keywordDensity: {
    primary: {
      target: 1.5, // 1.5% for primary keywords
      range: [1.0, 2.0], // Acceptable range
      placement: ['first-100', 'h1', 'h2', 'conclusion'] // Key placement locations
    },
    secondary: {
      target: 1.0, // 1.0% for secondary keywords
      range: [0.5, 1.5],
      placement: ['h2', 'body', 'faq']
    },
    lsi: {
      target: 0.8, // 0.8% for LSI keywords
      range: [0.5, 1.2],
      placement: ['body', 'h3', 'alt-text']
    }
  },
  
  // Semantic content structure for striking distance keywords
  semanticStructure: {
    // Introduction paragraph optimization
    introduction: {
      primaryKeywordPosition: 'within-2-sentences',
      valueProposition: true,
      credibilitySignal: true,
      benefitStatement: true
    },
    
    // Body content optimization
    body: {
      topicClusters: true, // Group related concepts together
      semanticVariations: true, // Use synonyms and related terms
      authoritySignals: true, // Include expert opinions, data, sources
      userIntentAlignment: true // Address user's actual intent
    },
    
    // Conclusion optimization
    conclusion: {
      primaryKeywordRecap: true,
      callToAction: true,
      keyBenefitsSummary: true,
      nextSteps: true
    }
  }
};

// Title tag generator function
export function generateTitleTag(template, data) {
  let title = template;
  
  // Replace placeholders with actual data
  Object.keys(data).forEach(key => {
    const placeholder = `{{${key}}}`;
    title = title.replace(new RegExp(placeholder, 'g'), data[key]);
  });
  
  // Apply title tag best practices
  const maxLength = 60;
  if (title.length > maxLength) {
    // Truncate and add ellipsis if needed
    title = title.substring(0, maxLength - 3) + '...';
  }
  
  return title;
}

// Meta description generator function
export function generateMetaDescription(formula, data) {
  let description = formula;
  
  // Replace placeholders with actual data
  Object.keys(data).forEach(key => {
    const placeholder = `{{${key}}}`;
    description = description.replace(new RegExp(placeholder, 'g'), data[key]);
  });
  
  // Apply meta description best practices
  const maxLength = 160;
  if (description.length > maxLength) {
    // Truncate and add ellipsis if needed
    description = description.substring(0, maxLength - 3) + '...';
  }
  
  return description;
}

// Header structure generator
export function generateHeaderStructure(pageType, data) {
  const structure = HEADER_STRUCTURE_GUIDELINES[pageType] || HEADER_STRUCTURE_GUIDELINES.home;
  const result = {};
  
  Object.keys(structure).forEach(headerLevel => {
    result[headerLevel] = structure[headerLevel].map(template => {
      let header = template;
      Object.keys(data).forEach(key => {
        const placeholder = `{{${key}}}`;
        header = header.replace(new RegExp(placeholder, 'g'), data[key]);
      });
      return header;
    });
  });
  
  return result;
}

// Internal link generator
export function generateInternalLinks(pageType, contextData) {
  const links = INTERNAL_LINKING_STRATEGY[pageType] || INTERNAL_LINKING_STRATEGY.home;
  
  return links.map(link => {
    let processedUrl = link.url;
    let processedAnchor = link.anchorText;
    
    // Replace any context data in URLs and anchor texts
    Object.keys(contextData).forEach(key => {
      const placeholder = `{{${key}}}`;
      processedUrl = processedUrl.replace(new RegExp(placeholder, 'g'), contextData[key]);
      processedAnchor = processedAnchor.replace(new RegExp(placeholder, 'g'), contextData[key]);
    });
    
    return {
      ...link,
      url: processedUrl,
      anchorText: processedAnchor
    };
  });
}

// Content optimization helper for striking distance keywords
export function optimizeForStrikingDistance(content, keywordData, positionRange) {
  const optimizationLevel = positionRange.includes('11-15') ? 
    STRIKING_DISTANCE_OPTIMIZATION.contentDepth.closer : 
    STRIKING_DISTANCE_OPTIMIZATION.contentDepth.further;
  
  // Calculate current content metrics
  const wordCount = content.split(/\s+/).length;
  const currentMetrics = {
    wordCount: wordCount,
    targetWordCount: optimizationLevel.minWords,
    needsExpansion: wordCount < optimizationLevel.minWords,
    currentDensity: calculateKeywordDensity(content, keywordData.primaryKeyword)
  };
  
  // Generate optimization recommendations
  const recommendations = [];
  
  if (currentMetrics.needsExpansion) {
    recommendations.push(
      `Expand content by ${optimizationLevel.minWords - wordCount} words to meet optimal length for striking distance keywords.`
    );
  }
  
  if (currentMetrics.currentDensity < STRIKING_DISTANCE_OPTIMIZATION.keywordDensity.primary.range[0]) {
    recommendations.push(
      `Increase primary keyword density to ${STRIKING_DISTANCE_OPTIMIZATION.keywordDensity.primary.target}% for better ranking potential.`
    );
  }
  
  if (optimizationLevel.faqSection && !content.includes('Frequently Asked Questions')) {
    recommendations.push('Add a comprehensive FAQ section to address user queries and improve content depth.');
  }
  
  return {
    currentMetrics,
    recommendations,
    optimizationLevel
  };
}

// Helper function to calculate keyword density
function calculateKeywordDensity(content, keyword) {
  if (!keyword) return 0;
  
  const cleanContent = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
  const keywordInstances = words.filter(word => word.includes(cleanKeyword)).length;
  
  return parseFloat(((keywordInstances / words.length) * 100).toFixed(2));
}

// Template data examples for different page types
export const TEMPLATE_EXAMPLES = {
  home: {
    primaryKeyword: 'Play BGMI Tournaments in India & Win Cash',
    secondaryBenefit: 'Real Money Gaming Platform',
    brandName: SITE.name,
    year: new Date().getFullYear()
  },
  
  tournament: {
    primaryKeyword: 'BGMI Daily Scrims & Paid Tournaments',
    gameType: 'BGMI',
    formatType: 'Squad',
    prizeAmount: '10,000',
    brandName: SITE.name
  },
  
  blog: {
    primaryKeyword: 'How to Earn Money Playing BGMI',
    year: new Date().getFullYear(),
    brandName: SITE.name
  },
  
  location: {
    primaryKeyword: 'BGMI Tournaments',
    locationName: 'Mumbai',
    benefit: 'Win Cash Prizes',
    year: new Date().getFullYear()
  }
};