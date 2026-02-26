'use client';

import { useState, useEffect } from 'react';
import { 
  generateTitleTag, 
  generateMetaDescription, 
  generateHeaderStructure, 
  generateInternalLinks,
  optimizeForStrikingDistance,
  TEMPLATE_EXAMPLES,
  STRIKING_DISTANCE_OPTIMIZATION
} from '@/lib/on-page-optimization';

/**
 * Component to implement on-page optimization based on striking distance keyword strategy
 */
export function OnPageOptimizer({ 
  pageType = 'home', 
  targetKeywords = [], 
  currentContent = '',
  positionRange = '11-15',
  contextData = {}
}) {
  const [optimizedData, setOptimizedData] = useState({
    title: '',
    description: '',
    headers: {},
    internalLinks: [],
    optimizationReport: {}
  });

  useEffect(() => {
    // Generate optimized elements based on inputs
    const templateData = {
      ...TEMPLATE_EXAMPLES[pageType],
      ...contextData,
      primaryKeyword: targetKeywords[0] || TEMPLATE_EXAMPLES[pageType]?.primaryKeyword,
      secondaryKeyword: targetKeywords[1] || '',
      relatedGame: contextData.gameType || 'BGMI'
    };

    const title = generateTitleTag(
      STRIKING_DISTANCE_OPTIMIZATION.contentDepth[positionRange === '11-15' ? 'closer' : 'further'] 
        ? '{{primaryKeyword}} | {{secondaryKeyword}} | {{brandName}}' 
        : '{{primaryKeyword}} — {{secondaryKeyword}} | {{brandName}}',
      templateData
    );

    const description = generateMetaDescription(
      positionRange === '11-15' 
        ? '{{primaryValueProposition}}. {{benefitStatement}}. {{cta}} →' 
        : '{{topicOverview}}. {{keyBenefit}} {{additionalValue}}. {{authoritativeSource}}',
      {
        primaryValueProposition: targetKeywords[0] || 'Play BGMI tournaments online',
        benefitStatement: 'Join 50,000+ players. Win real cash prizes.',
        cta: 'Play Now',
        topicOverview: targetKeywords[0] || 'Complete guide to BGMI tournaments',
        keyBenefit: 'Earn money playing competitive matches',
        additionalValue: '₹10 entry fees. Instant UPI withdrawal',
        authoritativeSource: 'BattleXZone - India\'s #1 platform'
      }
    );

    const headers = generateHeaderStructure(pageType, templateData);
    const internalLinks = generateInternalLinks(pageType, templateData);

    const optimizationReport = optimizeForStrikingDistance(
      currentContent,
      { primaryKeyword: targetKeywords[0] },
      positionRange
    );

    setOptimizedData({
      title,
      description,
      headers,
      internalLinks,
      optimizationReport
    });
  }, [pageType, targetKeywords, currentContent, positionRange, contextData]);

  return (
    <div className="on-page-optimizer hidden"> {/* Hidden from view but accessible to search engines */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: optimizedData.title,
          description: optimizedData.description,
          url: typeof window !== 'undefined' ? window.location.href : ''
        })}
      </script>
    </div>
  );
}

/**
 * Component for optimized header structure
 */
export function OptimizedHeaders({ pageType = 'home', contextData = {} }) {
  const headers = generateHeaderStructure(pageType, {
    ...TEMPLATE_EXAMPLES[pageType],
    ...contextData
  });

  return (
    <div className="optimized-headers-structure">
      {headers.h1 && headers.h1.map((h1, idx) => (
        <h1 key={idx} className="text-3xl font-bold mb-6 text-white">
          {h1}
        </h1>
      ))}
      
      {headers.h2 && headers.h2.map((h2, idx) => (
        <h2 key={idx} className="text-2xl font-semibold mb-4 mt-8 text-cyan-400">
          {h2}
        </h2>
      ))}
      
      {headers.h3 && headers.h3.map((h3, idx) => (
        <h3 key={idx} className="text-xl font-medium mb-3 mt-6 text-white">
          {h3}
        </h3>
      ))}
    </div>
  );
}

/**
 * Component for strategic internal linking
 */
export function StrategicInternalLinks({ pageType = 'home', contextData = {}, maxLinks = 5 }) {
  const links = generateInternalLinks(pageType, {
    ...TEMPLATE_EXAMPLES[pageType],
    ...contextData
  }).slice(0, maxLinks);

  return (
    <div className="strategic-internal-links mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-300">Explore More</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            className="text-blue-400 hover:text-blue-300 text-sm underline decoration-blue-400/30 hover:decoration-blue-300 transition-all"
          >
            {link.anchorText}
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Component for content optimization insights
 */
export function ContentOptimizationInsights({ 
  content = '', 
  targetKeywords = [], 
  positionRange = '11-15' 
}) {
  const optimizationData = optimizeForStrikingDistance(
    content,
    { primaryKeyword: targetKeywords[0] || '' },
    positionRange
  );

  const { currentMetrics, recommendations } = optimizationData;

  return (
    <div className="content-optimization-insights bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-purple-400">Content Optimization Insights</h3>
      
      <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="metric-item bg-black/30 rounded-lg p-3">
          <h4 className="font-semibold text-purple-300 text-sm">Current Word Count</h4>
          <p className="text-2xl font-bold text-white">{currentMetrics.wordCount}</p>
          <p className="text-xs text-gray-400">Target: {currentMetrics.targetWordCount}</p>
        </div>
        
        <div className="metric-item bg-black/30 rounded-lg p-3">
          <h4 className="font-semibold text-purple-300 text-sm">Primary Keyword Density</h4>
          <p className="text-2xl font-bold text-white">
            {currentMetrics.currentDensity}%
          </p>
          <p className="text-xs text-gray-400">
            Target: {STRIKING_DISTANCE_OPTIMIZATION.keywordDensity.primary.target}%
          </p>
        </div>
      </div>
      
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h4 className="font-semibold text-yellow-400 mb-2">Optimization Recommendations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-300">
                <span className="text-yellow-400 mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for on-page optimization insights
 */
export function useOnPageOptimization(pageType, targetKeywords, positionRange) {
  const [optimizationData, setOptimizationData] = useState(null);

  useEffect(() => {
    // Simulate optimization data based on inputs
    const simulatedData = {
      titleTemplate: STRIKING_DISTANCE_OPTIMIZATION.contentDepth[positionRange === '11-15' ? 'closer' : 'further'] 
        ? '{{primaryKeyword}} | {{brandName}}' 
        : '{{primaryKeyword}} — {{secondaryBenefit}} | {{brandName}}',
      metaDescriptionFormula: positionRange === '11-15' 
        ? 'highConverting' 
        : 'informational',
      contentDepth: positionRange === '11-15' ? 1200 : 1500,
      internalLinkTargets: 8,
      headerStructure: ['H1', 'H2x6', 'H3x12'],
      keywordDensityTarget: positionRange === '11-15' ? 1.5 : 1.8
    };

    setOptimizationData(simulatedData);
  }, [pageType, targetKeywords, positionRange]);

  return optimizationData;
}