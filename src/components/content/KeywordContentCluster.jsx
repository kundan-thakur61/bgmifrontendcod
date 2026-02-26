import { CONTENT_CLUSTER_MAP, CONTENT_GAP_ANALYSIS } from '@/lib/content-keywords';

/**
 * Component to generate content based on keyword clusters for SEO optimization
 */
export function KeywordContentCluster({ 
  clusterId, 
  contentType = 'auto',
  showRelated = true,
  showGaps = false 
}) {
  const cluster = CONTENT_CLUSTER_MAP[clusterId] || CONTENT_CLUSTER_MAP['bgmi-tournaments'];
  
  // Generate content sections based on keyword cluster
  const generateContentSections = () => {
    const sections = [];
    
    // Main content section with primary topic
    sections.push({
      id: 'primary-topic',
      title: cluster.primaryTopic,
      keywords: cluster.targetKeywords.slice(0, 3),
      content: generatePrimaryContent(cluster.primaryTopic, cluster.targetKeywords.slice(0, 3))
    });
    
    // Supporting content sections
    if (showRelated) {
      cluster.relatedTopics.forEach((topic, index) => {
        sections.push({
          id: `related-${index}`,
          title: topic,
          keywords: cluster.supportingKeywords.slice(index * 2, (index + 1) * 2),
          content: generateRelatedContent(topic, cluster.supportingKeywords.slice(index * 2, (index + 1) * 2))
        });
      });
    }
    
    // Content gap section if requested
    if (showGaps) {
      sections.push({
        id: 'content-gaps',
        title: 'Opportunity Areas',
        keywords: [],
        content: generateContentGapSection()
      });
    }
    
    return sections;
  };
  
  const generatePrimaryContent = (topic, keywords) => {
    const intro = `Discover everything you need to know about ${topic.toLowerCase()}. `;
    const keywordIntegration = keywords.map(kw => `Learn how to master ${kw.replace('BGMI', 'BGMI').replace('PUBG', 'PUBG Mobile').replace('Free Fire', 'Free Fire')} with our comprehensive guide. `).join('');
    const conclusion = 'Our expert team has compiled the most effective strategies and tips to help you succeed.';
    
    return intro + keywordIntegration + conclusion;
  };
  
  const generateRelatedContent = (topic, keywords) => {
    return `Explore related topics in ${topic}. ${keywords.length > 0 ? `Covering key aspects like ${keywords.join(' and ')}.` : 'Comprehensive coverage of all related concepts.'}`;
  };
  
  const generateContentGapSection = () => {
    const highOpportunity = CONTENT_GAP_ANALYSIS.highOpportunity.slice(0, 2);
    return `Take advantage of high-opportunity keywords like ${highOpportunity.map(item => `"${item.keyword}"`).join(' and ')}. These have medium to high search volume with relatively low competition, making them perfect for ranking improvements.`;
  };
  
  const contentSections = generateContentSections();
  
  return (
    <div className="keyword-content-cluster">
      {contentSections.map((section) => (
        <section key={section.id} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">{section.title}</h2>
          {section.keywords.length > 0 && (
            <div className="mb-3">
              {section.keywords.map((keyword, idx) => (
                <span 
                  key={idx} 
                  className="inline-block bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded mr-2 mb-2"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-300 leading-relaxed">{section.content}</p>
        </section>
      ))}
      
      {/* Hidden content for search engines with additional keyword density */}
      <div style={{ display: 'none' }} className="hidden-content">
        {cluster.targetKeywords.concat(cluster.supportingKeywords).slice(0, 10).map((keyword, idx) => (
          <p key={idx} className="keyword-density-text">
            Learn more about {keyword} on BattleXZone, India's premier platform for competitive gaming.
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Component for content gap analysis display
 */
export function ContentGapAnalysis({ type = 'highOpportunity' }) {
  const gaps = CONTENT_GAP_ANALYSIS[type] || CONTENT_GAP_ANALYSIS.highOpportunity;
  
  return (
    <div className="content-gap-analysis bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-orange-400">Content Opportunity Analysis</h3>
      <div className="space-y-4">
        {gaps.slice(0, 3).map((gap, index) => (
          <div key={index} className="gap-item bg-black/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white">{gap.keyword}</h4>
              <span className="text-xs bg-orange-600 px-2 py-1 rounded">
                {gap.searchVolume}/{gap.competition}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">{gap.contentIdea}</p>
            <div className="flex items-center text-xs text-gray-400">
              <span className="mr-3">Intent: {gap.intent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component for content optimization checklist
 */
export function ContentOptimizationChecklist({ category = 'all' }) {
  const { OPTIMIZATION_CHECKLIST } = require('@/lib/content-keywords');
  
  const categoriesToShow = category === 'all' 
    ? OPTIMIZATION_CHECKLIST 
    : OPTIMIZATION_CHECKLIST.filter(cat => cat.category.toLowerCase().includes(category.toLowerCase()));
  
  return (
    <div className="optimization-checklist bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-green-400">Content Optimization Checklist</h3>
      <div className="space-y-4">
        {categoriesToShow.map((cat, catIdx) => (
          <div key={catIdx}>
            <h4 className="font-semibold text-green-300 mb-2">{cat.category}</h4>
            <ul className="space-y-2">
              {cat.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-sm text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook for content strategy insights
 */
export function useContentStrategyInsights(clusterId) {
  const cluster = CONTENT_CLUSTER_MAP[clusterId] || CONTENT_CLUSTER_MAP['bgmi-tournaments'];
  
  const insights = {
    keywordDensity: {
      primary: cluster.targetKeywords.length,
      supporting: cluster.supportingKeywords.length,
      total: cluster.targetKeywords.length + cluster.supportingKeywords.length
    },
    contentDepth: {
      primaryTopic: cluster.primaryTopic,
      relatedTopics: cluster.relatedTopics.length,
      format: cluster.contentFormat
    },
    targetAudience: cluster.targetAudience,
    difficulty: cluster.difficultyLevel
  };
  
  return insights;
}