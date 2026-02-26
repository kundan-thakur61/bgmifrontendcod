'use client';

import { useState, useEffect } from 'react';
import { searchConsoleTracker, conversionTracker, ctrImprovementTracker } from '@/lib/analytics-tracker';

/**
 * Component to track and optimize striking distance keywords (positions 11-20)
 */
export function StrikingDistanceTracker({ 
  pageKeywords = [],
  onPageLoad = true,
  trackInterval = 86400000, // 24 hours in milliseconds
  autoOptimize = true 
}) {
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastTracked, setLastTracked] = useState(null);

  useEffect(() => {
    if (onPageLoad) {
      startTracking();
    }
  }, []);

  const startTracking = async () => {
    if (isTracking) return;
    
    setIsTracking(true);
    try {
      const keywordsToTrack = pageKeywords.filter(kw => {
        // Focus on striking distance keywords (positions 11-20)
        return true; // For now, track all provided keywords
      });

      if (keywordsToTrack.length === 0) {
        return;
      }

      // Get current tracking data
      const positionData = await searchConsoleTracker.trackKeywordPositions(
        keywordsToTrack,
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
        new Date().toISOString().split('T')[0]
      );

      const conversionData = await conversionTracker.trackConversions(
        keywordsToTrack,
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      const ctrData = await ctrImprovementTracker.analyzeCTRImprovement(
        keywordsToTrack,
        {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        }
      );

      const combinedData = {
        positionData,
        conversionData,
        ctrData,
        timestamp: new Date().toISOString()
      };

      setTrackingData(combinedData);
      setLastTracked(new Date());

      // Save to local storage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('striking-distance-tracking', JSON.stringify(combinedData));
      }

      // Auto-optimize if enabled and if keywords are in striking distance
      if (autoOptimize) {
        const strikingDistanceKws = positionData.data.filter(kw => 
          kw.currentPosition >= 11 && kw.currentPosition <= 20
        );
        
        if (strikingDistanceKws.length > 0) {
          triggerOptimization(strikingDistanceKws);
        }
      }
    } catch (error) {
      console.error('Error in striking distance tracking:', error);
    } finally {
      setIsTracking(false);
    }
  };

  const triggerOptimization = (keywords) => {
    // In a real implementation, this would trigger content optimization
    // For now, we'll just log the optimization triggers
    console.log('Triggering optimization for striking distance keywords:', keywords);
    
    // This could include:
    // - Adjusting content depth
    // - Modifying internal linking
    // - Updating meta tags
    // - Adding schema markup
  };

  const refreshTracking = () => {
    startTracking();
  };

  const getStrikingDistanceKeywords = () => {
    if (!trackingData) return [];
    
    return trackingData.positionData.data.filter(kw => 
      kw.currentPosition >= 11 && kw.currentPosition <= 20
    );
  };

  const getTopPriorityKeywords = () => {
    const strikingDistanceKws = getStrikingDistanceKeywords();
    return strikingDistanceKws
      .sort((a, b) => a.currentPosition - b.currentPosition) // Sort by position (closest to 10 first)
      .slice(0, 5); // Return top 5 priority keywords
  };

  const isTimeToTrack = () => {
    if (!lastTracked) return true;
    return Date.now() - lastTracked.getTime() >= trackInterval;
  };

  const strikingDistanceKeywords = getStrikingDistanceKeywords();
  const topPriorityKeywords = getTopPriorityKeywords();

  return (
    <div className="striking-distance-tracker hidden" aria-hidden="true">
      {/* Tracking data for internal use */}
      {trackingData && (
        <>
          <div className="tracking-summary">
            <span className="keyword-count">{strikingDistanceKeywords.length}</span>
            <span className="priority-count">{topPriorityKeywords.length}</span>
            <span className="last-updated">{lastTracked?.toISOString()}</span>
          </div>
          
          {topPriorityKeywords.map((kw, index) => (
            <div key={index} className="priority-keyword-data" style={{ display: 'none' }}>
              <span className="keyword">{kw.keyword}</span>
              <span className="position">{kw.currentPosition}</span>
              <span className="impressions">{kw.impressions}</span>
              <span className="clicks">{kw.clicks}</span>
              <span className="ctr">{kw.ctr}</span>
            </div>
          ))}
        </>
      )}
      
      {/* Control buttons for manual tracking (could be exposed in admin panel) */}
      <div className="tracking-controls hidden">
        <button 
          onClick={refreshTracking} 
          disabled={isTracking}
          className="track-btn"
        >
          {isTracking ? 'Tracking...' : 'Refresh Tracking'}
        </button>
        <span className="next-track-time">
          {isTimeToTrack() ? 'Ready to track' : `Next track: ${(trackInterval - (Date.now() - lastTracked?.getTime())) / 1000 / 60} mins`}
        </span>
      </div>
    </div>
  );
}

/**
 * Component for content optimization based on striking distance data
 */
export function ContentOptimizer({ 
  content, 
  targetKeywords, 
  positionData,
  onOptimization = () => {} 
}) {
  const [optimizedContent, setOptimizedContent] = useState(content);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);

  useEffect(() => {
    if (positionData && targetKeywords.length > 0) {
      generateOptimizationSuggestions();
    }
  }, [positionData, targetKeywords]);

  const generateOptimizationSuggestions = () => {
    const suggestions = [];
    
    // Analyze current content against position data
    const strikingDistanceKws = positionData?.data?.filter?.(kw => 
      kw.currentPosition >= 11 && kw.currentPosition <= 20
    ) || [];

    if (strikingDistanceKws.length > 0) {
      // Suggest content improvements for striking distance keywords
      strikingDistanceKws.forEach(kw => {
        if (kw.currentPosition >= 17) { // Very far from page 1
          suggestions.push({
            keyword: kw.keyword,
            priority: 'high',
            suggestion: `Add more comprehensive content about "${kw.keyword}" with at least 1500 words`,
            type: 'content_depth'
          });
        } else if (kw.currentPosition >= 14) { // Middle of striking distance
          suggestions.push({
            keyword: kw.keyword,
            priority: 'medium',
            suggestion: `Improve content structure for "${kw.keyword}" with better headers and internal links`,
            type: 'structure'
          });
        } else { // Close to page 1
          suggestions.push({
            keyword: kw.keyword,
            priority: 'low',
            suggestion: `Fine-tune content for "${kw.keyword}" to push to page 1`,
            type: 'fine_tune'
          });
        }
      });
    }

    setOptimizationSuggestions(suggestions);
    
    // Trigger optimization callback
    if (suggestions.length > 0) {
      onOptimization(suggestions);
    }
  };

  const applyOptimizations = () => {
    // In a real implementation, this would apply content optimizations
    // For now, we'll just update the optimized content state
    let newContent = content;
    
    optimizationSuggestions.forEach(suggestion => {
      if (suggestion.type === 'content_depth') {
        // Add more content for depth
        newContent += `\n\n<div style="display:none;">Learn more about ${suggestion.keyword} and how to optimize your content for better search rankings. This additional content helps improve your page's relevance and depth for this keyword.</div>`;
      }
    });
    
    setOptimizedContent(newContent);
  };

  useEffect(() => {
    if (optimizationSuggestions.length > 0) {
      applyOptimizations();
    }
  }, [optimizationSuggestions]);

  return (
    <div className="content-optimizer hidden" aria-hidden="true">
      {optimizationSuggestions.map((suggestion, index) => (
        <div key={index} className="optimization-suggestion">
          <span className="keyword">{suggestion.keyword}</span>
          <span className="priority">{suggestion.priority}</span>
          <span className="suggestion">{suggestion.suggestion}</span>
          <span className="type">{suggestion.type}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Component for A/B testing of meta tags for striking distance keywords
 */
export function MetaTagTester({ 
  currentTitle, 
  currentDescription, 
  strikingDistanceKeywords = [],
  onImprovement = () => {} 
}) {
  const [testGroups, setTestGroups] = useState([]);
  const [activeTests, setActiveTests] = useState([]);

  useEffect(() => {
    if (strikingDistanceKeywords.length > 0) {
      generateTestVariations();
    }
  }, [strikingDistanceKeywords]);

  const generateTestVariations = () => {
    const newTestGroups = strikingDistanceKeywords.map(keyword => {
      // Generate different title/description variations for testing
      const titleVariations = [
        currentTitle,
        `${keyword} - ${currentTitle.split('|')[1] || currentTitle}`,
        `${currentTitle.split('-')[0]} - ${keyword}`,
        `${keyword} | ${currentTitle}`
      ];

      const descVariations = [
        currentDescription,
        `Learn about ${keyword}. ${currentDescription}`,
        `${currentDescription} - Featuring ${keyword}`,
        `${keyword}: ${currentDescription}`
      ];

      return {
        keyword,
        titleVariations,
        descVariations,
        currentWinner: 0,
        testId: `meta-test-${Date.now()}-${Math.random()}`
      };
    });

    setTestGroups(newTestGroups);
  };

  const startABTest = (testGroup) => {
    // Simulate starting an A/B test for the meta tags
    const newActiveTest = {
      ...testGroup,
      startTime: new Date().toISOString(),
      variantViews: testGroup.titleVariations.map(() => 0),
      variantClicks: testGroup.titleVariations.map(() => 0),
      isActive: true
    };
    
    setActiveTests(prev => [...prev, newActiveTest]);
  };

  const recordClick = (testId, variantIndex) => {
    // Record click for the variant (in a real implementation, this would go to analytics)
    setActiveTests(prev => prev.map(test => {
      if (test.testId === testId) {
        const newVariantClicks = [...test.variantClicks];
        newVariantClicks[variantIndex]++;
        return { ...test, variantClicks: newVariantClicks };
      }
      return test;
    }));
  };

  const getBestPerformingVariants = () => {
    return activeTests
      .filter(test => test.isActive)
      .map(test => {
        const bestVariantIndex = test.variantClicks
          .map((clicks, index) => ({ clicks, index }))
          .reduce((best, current) => current.clicks > best.clicks ? current : best).index;
        
        return {
          keyword: test.keyword,
          bestTitle: test.titleVariations[bestVariantIndex],
          bestDescription: test.descVariations[bestVariantIndex],
          variantIndex: bestVariantIndex
        };
      });
  };

  // Start tests for striking distance keywords
  useEffect(() => {
    testGroups.forEach(group => {
      if (!activeTests.some(test => test.testId === group.testId)) {
        startABTest(group);
      }
    });
  }, [testGroups]);

  const bestVariants = getBestPerformingVariants();

  useEffect(() => {
    if (bestVariants.length > 0) {
      onImprovement(bestVariants);
    }
  }, [bestVariants]);

  return (
    <div className="meta-tag-tester hidden" aria-hidden="true">
      {activeTests.map((test, index) => (
        <div key={index} className="test-group">
          <span className="keyword">{test.keyword}</span>
          <span className="test-id">{test.testId}</span>
          <span className="variants-count">{test.titleVariations.length}</span>
        </div>
      ))}
      
      {bestVariants.map((variant, index) => (
        <div key={index} className="best-variant">
          <span className="keyword">{variant.keyword}</span>
          <span className="best-title">{variant.bestTitle}</span>
          <span className="best-description">{variant.bestDescription}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Hook for striking distance keyword tracking
 */
export function useStrikingDistanceTracking(initialKeywords = []) {
  const [trackedKeywords, setTrackedKeywords] = useState(initialKeywords);
  const [trackingResults, setTrackingResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addKeyword = (keyword) => {
    if (!trackedKeywords.includes(keyword)) {
      setTrackedKeywords(prev => [...prev, keyword]);
    }
  };

  const removeKeyword = (keyword) => {
    setTrackedKeywords(prev => prev.filter(kw => kw !== keyword));
  };

  const runTracking = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const positionData = await searchConsoleTracker.trackKeywordPositions(
        trackedKeywords,
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      const strikingDistance = positionData.data.filter(kw => 
        kw.currentPosition >= 11 && kw.currentPosition <= 20
      );

      setTrackingResults({
        ...positionData,
        strikingDistanceKeywords: strikingDistance,
        totalCount: trackedKeywords.length,
        strikingDistanceCount: strikingDistance.length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (trackedKeywords.length > 0) {
      runTracking();
    }
  }, [trackedKeywords]);

  return {
    trackedKeywords,
    trackingResults,
    isLoading,
    error,
    addKeyword,
    removeKeyword,
    runTracking,
    strikingDistanceKeywords: trackingResults?.strikingDistanceKeywords || [],
    strikingDistanceCount: trackingResults?.strikingDistanceCount || 0
  };
}