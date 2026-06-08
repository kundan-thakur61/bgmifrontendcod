export { OrganizationSchema, FAQSchema, BreadcrumbSchema, MatchSchema, TournamentSchema, HowToSchema, ReviewSchema, TeamSchema, PersonSchema } from './Schema';
export { GoogleAnalytics, GoogleSearchConsole, trackSEOEvent, SEO_EVENTS } from './Analytics';
export { Hreflang, generateHreflangAlternates } from './Hreflang';
export { default as RelatedContent } from './RelatedContent';
export { WebSiteSchema } from './EnhancedSchema'; // WebSite for AI/Entity (avoid duplicate ReviewSchema)
export { 
  WebApplicationSchema, 
  ArticleSchema, 
  LocalBusinessSchema, 
  SoftwareApplicationSchema,
  VideoObjectSchema
  // HowToSchema and ReviewSchema intentionally imported only from ./Schema.js to avoid duplicates
} from './EnhancedSchema';
export { JsonLd } from './JsonLd';
export { StrikingDistanceSchema, StrikingDistanceFAQ } from './StrikingDistanceSchema';
export { OnPageOptimizer, OptimizedHeaders, StrategicInternalLinks, ContentOptimizationInsights } from './OnPageOptimizer';
