/**
 * Performance Metrics Tracking for Striking Distance Keywords
 * Tracks keyword positions, CTR improvement, and conversion tracking
 */

// Google Search Console API helper functions
export const searchConsoleTracker = {
  /**
   * Track keyword positions in Google Search Results
   */
  async trackKeywordPositions(keywords, startDate, endDate) {
    // In a real implementation, this would connect to Google Search Console API
    // For now, we simulate the tracking with mock data
    const positionData = keywords.map(keyword => ({
      keyword,
      currentPosition: this.simulatePosition(keyword),
      previousPosition: this.simulatePreviousPosition(keyword),
      impressions: this.simulateImpressions(keyword),
      clicks: this.simulateClicks(keyword),
      ctr: this.simulateCTR(keyword),
      date: new Date().toISOString().split('T')[0]
    }));

    return {
      data: positionData,
      summary: {
        totalKeywords: keywords.length,
        avgPositionChange: this.calculateAvgPositionChange(positionData),
        totalImpressions: positionData.reduce((sum, kw) => sum + kw.impressions, 0),
        totalClicks: positionData.reduce((sum, kw) => sum + kw.clicks, 0),
        overallCTR: this.calculateOverallCTR(positionData)
      }
    };
  },

  simulatePosition(keyword) {
    // Simulate position between 5-25 based on keyword competitiveness
    const basePosition = keyword.toLowerCase().includes('bgmi') ? 12 : 
                        keyword.toLowerCase().includes('pubg') ? 15 : 18;
    return Math.floor(basePosition + (Math.random() * 6) - 3); // Add some variation
  },

  simulatePreviousPosition(keyword) {
    // Previous position would be slightly worse (higher number) for growing keywords
    const currentPos = this.simulatePosition(keyword);
    const improvement = Math.random() > 0.6 ? Math.floor(Math.random() * 3) : 0; // Some keywords improve
    return currentPos + improvement;
  },

  simulateImpressions(keyword) {
    // Higher impressions for more popular keywords
    const base = keyword.toLowerCase().includes('bgmi') ? 15000 : 
                 keyword.toLowerCase().includes('pubg') ? 12000 : 8000;
    return Math.floor(base + (Math.random() * 5000));
  },

  simulateClicks(keyword) {
    // Clicks based on position and impressions
    const impressions = this.simulateImpressions(keyword);
    const position = this.simulatePosition(keyword);
    
    // Higher CTR for better positions
    let ctr = 0;
    if (position <= 3) ctr = 0.08;
    else if (position <= 5) ctr = 0.05;
    else if (position <= 10) ctr = 0.03;
    else if (position <= 15) ctr = 0.02;
    else ctr = 0.01;
    
    // Add some variation
    ctr = ctr + (Math.random() * 0.01) - 0.005;
    return Math.floor(impressions * Math.max(ctr, 0.005)); // Minimum 0.5% CTR
  },

  simulateCTR(keyword) {
    const impressions = this.simulateImpressions(keyword);
    const clicks = this.simulateClicks(keyword);
    return impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;
  },

  calculateAvgPositionChange(positionData) {
    const changes = positionData.map(kw => kw.previousPosition - kw.currentPosition);
    const sum = changes.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / changes.length).toFixed(2));
  },

  calculateOverallCTR(positionData) {
    const totalImpressions = positionData.reduce((sum, kw) => sum + kw.impressions, 0);
    const totalClicks = positionData.reduce((sum, kw) => sum + kw.clicks, 0);
    return totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
  }
};

// Conversion tracking functions
export const conversionTracker = {
  /**
   * Track conversions from search traffic
   */
  async trackConversions(searchKeywords, startDate, endDate) {
    const conversionData = searchKeywords.map(keyword => ({
      keyword,
      sessionsFromKeyword: this.simulateSessions(keyword),
      registrations: this.simulateRegistrations(keyword),
      tournamentJoins: this.simulateTournamentJoins(keyword),
      deposits: this.simulateDeposits(keyword),
      revenueGenerated: this.simulateRevenue(keyword),
      conversionRate: this.simulateConversionRate(keyword),
      date: new Date().toISOString().split('T')[0]
    }));

    return {
      data: conversionData,
      summary: {
        totalSessions: conversionData.reduce((sum, kw) => sum + kw.sessionsFromKeyword, 0),
        totalRegistrations: conversionData.reduce((sum, kw) => sum + kw.registrations, 0),
        totalTournamentJoins: conversionData.reduce((sum, kw) => sum + kw.tournamentJoins, 0),
        totalRevenue: conversionData.reduce((sum, kw) => sum + kw.revenueGenerated, 0),
        avgConversionRate: this.calculateAvgConversionRate(conversionData)
      }
    };
  },

  simulateSessions(keyword) {
    // Sessions based on clicks from search console data
    return Math.floor(this.simulateClicksForConversion(keyword) * 0.85); // 85% of clicks become sessions
  },

  simulateClicksForConversion(keyword) {
    // Simulate clicks (similar to search console simulation)
    const impressions = this.simulateImpressionsForConversion(keyword);
    const position = Math.floor(Math.random() * 20) + 5; // Position 5-25
    
    let ctr = 0;
    if (position <= 3) ctr = 0.08;
    else if (position <= 5) ctr = 0.05;
    else if (position <= 10) ctr = 0.03;
    else if (position <= 15) ctr = 0.02;
    else ctr = 0.01;
    
    ctr = ctr + (Math.random() * 0.01) - 0.005;
    return Math.floor(impressions * Math.max(ctr, 0.005));
  },

  simulateImpressionsForConversion(keyword) {
    const base = keyword.toLowerCase().includes('bgmi') ? 15000 : 
                 keyword.toLowerCase().includes('pubg') ? 12000 : 8000;
    return Math.floor(base + (Math.random() * 5000));
  },

  simulateRegistrations(keyword) {
    const sessions = this.simulateSessions(keyword);
    const registrationRate = keyword.toLowerCase().includes('free') ? 0.08 : 0.12; // Different rates for different games
    return Math.floor(sessions * registrationRate * (0.8 + Math.random() * 0.4)); // 8-12% range
  },

  simulateTournamentJoins(keyword) {
    const registrations = this.simulateRegistrations(keyword);
    const joinRate = 0.65 + (Math.random() * 0.2); // 65-85% of registrants join tournaments
    return Math.floor(registrations * joinRate);
  },

  simulateDeposits(keyword) {
    const tournamentJoins = this.simulateTournamentJoins(keyword);
    const depositRate = 0.4 + (Math.random() * 0.3); // 40-70% make deposits
    return Math.floor(tournamentJoins * depositRate);
  },

  simulateRevenue(keyword) {
    const deposits = this.simulateDeposits(keyword);
    const avgDeposit = 150 + (Math.random() * 200); // Rs. 150-350 average
    return parseFloat((deposits * avgDeposit).toFixed(2));
  },

  simulateConversionRate(keyword) {
    const sessions = this.simulateSessions(keyword);
    const registrations = this.simulateRegistrations(keyword);
    return sessions > 0 ? parseFloat(((registrations / sessions) * 100).toFixed(2)) : 0;
  },

  calculateAvgConversionRate(conversionData) {
    const totalSessions = conversionData.reduce((sum, kw) => sum + kw.sessionsFromKeyword, 0);
    const totalRegistrations = conversionData.reduce((sum, kw) => sum + kw.registrations, 0);
    return totalSessions > 0 ? parseFloat(((totalRegistrations / totalSessions) * 100).toFixed(2)) : 0;
  }
};

// CTR improvement tracking
export const ctrImprovementTracker = {
  /**
   * Track CTR improvement over time for striking distance keywords
   */
  async analyzeCTRImprovement(keywords, dateRange) {
    const improvementData = [];

    for (const keyword of keywords) {
      // Get data for multiple dates to show trend
      const dates = this.generateDateRange(dateRange.startDate, dateRange.endDate);
      const keywordData = [];

      for (const date of dates) {
        keywordData.push({
          date,
          keyword,
          impressions: this.simulateDailyImpressions(keyword),
          clicks: this.simulateDailyClicks(keyword, date),
          ctr: this.simulateDailyCTR(keyword, date),
          position: this.simulateDailyPosition(keyword, date)
        });
      }

      improvementData.push({
        keyword,
        trend: keywordData,
        overallImprovement: this.calculateTrendImprovement(keywordData),
        avgPosition: this.calculateAveragePosition(keywordData),
        avgCTR: this.calculateAverageCTR(keywordData)
      });
    }

    return {
      data: improvementData,
      summary: {
        totalKeywords: keywords.length,
        avgCTRImprovement: this.calculateOverallCTRImprovement(improvementData),
        avgPositionMovement: this.calculateOverallPositionMovement(improvementData),
        totalImpressions: improvementData.reduce((sum, kw) => 
          sum + kw.trend.reduce((tSum, t) => tSum + t.impressions, 0), 0),
        totalClicks: improvementData.reduce((sum, kw) => 
          sum + kw.trend.reduce((tSum, t) => tSum + t.clicks, 0), 0)
      }
    };
  },

  generateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return dates;
  },

  simulateDailyImpressions(keyword) {
    const base = keyword.toLowerCase().includes('bgmi') ? 500 : 
                 keyword.toLowerCase().includes('pubg') ? 400 : 300;
    return Math.floor(base + (Math.random() * 100));
  },

  simulateDailyClicks(keyword, date) {
    const impressions = this.simulateDailyImpressions(keyword);
    const position = this.simulateDailyPosition(keyword, date);
    
    // CTR improves over time for tracked keywords
    const daysSinceStart = Math.floor((new Date(date) - new Date('2024-01-01')) / (1000 * 60 * 60 * 24));
    const improvementFactor = 1 + (daysSinceStart * 0.001); // Small daily improvement
    
    let ctr = 0;
    if (position <= 3) ctr = 0.08;
    else if (position <= 5) ctr = 0.05;
    else if (position <= 10) ctr = 0.03;
    else if (position <= 15) ctr = 0.02 * improvementFactor; // More improvement potential for striking distance
    else ctr = 0.01 * improvementFactor;
    
    ctr = Math.min(ctr, 0.12); // Cap at 12% CTR
    return Math.floor(impressions * Math.max(ctr, 0.005));
  },

  simulateDailyPosition(keyword, date) {
    // Positions improve over time for tracked keywords
    const daysSinceStart = Math.floor((new Date(date) - new Date('2024-01-01')) / (1000 * 60 * 60 * 24));
    const improvement = Math.floor(daysSinceStart * 0.02); // Small daily improvement
    
    const basePosition = keyword.toLowerCase().includes('bgmi') ? 12 : 
                        keyword.toLowerCase().includes('pubg') ? 15 : 18;
    const newPosition = Math.max(1, basePosition - improvement + Math.floor((Math.random() - 0.5) * 4));
    return Math.min(newPosition, 30); // Don't go above position 30
  },

  simulateDailyCTR(keyword, date) {
    const impressions = this.simulateDailyImpressions(keyword);
    const clicks = this.simulateDailyClicks(keyword, date);
    return impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;
  },

  calculateTrendImprovement(keywordData) {
    if (keywordData.length < 2) return 0;
    
    const firstCTR = keywordData[0].ctr;
    const lastCTR = keywordData[keywordData.length - 1].ctr;
    return parseFloat(((lastCTR - firstCTR) / firstCTR * 100).toFixed(2));
  },

  calculateAveragePosition(keywordData) {
    const sum = keywordData.reduce((acc, data) => acc + data.position, 0);
    return parseFloat((sum / keywordData.length).toFixed(2));
  },

  calculateAverageCTR(keywordData) {
    const sum = keywordData.reduce((acc, data) => acc + data.ctr, 0);
    return parseFloat((sum / keywordData.length).toFixed(2));
  },

  calculateOverallCTRImprovement(improvementData) {
    const improvements = improvementData.map(kw => kw.overallImprovement);
    const sum = improvements.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / improvements.length).toFixed(2));
  },

  calculateOverallPositionMovement(improvementData) {
    // Calculate how positions have moved overall
    let totalMovement = 0;
    improvementData.forEach(kw => {
      if (kw.trend.length >= 2) {
        const firstPosition = kw.trend[0].position;
        const lastPosition = kw.trend[kw.trend.length - 1].position;
        totalMovement += (firstPosition - lastPosition); // Positive means improvement (lower position number)
      }
    });
    
    return parseFloat((totalMovement / improvementData.length).toFixed(2));
  }
};

// Comprehensive dashboard data aggregator
export const analyticsDashboard = {
  async getComprehensiveReport(keywords, dateRange) {
    try {
      // Get all tracking data in parallel
      const [positionData, conversionData, ctrData] = await Promise.all([
        searchConsoleTracker.trackKeywordPositions(keywords, dateRange.startDate, dateRange.endDate),
        conversionTracker.trackConversions(keywords, dateRange.startDate, dateRange.endDate),
        ctrImprovementTracker.analyzeCTRImprovement(keywords, dateRange)
      ]);

      // Combine all data into a comprehensive report
      const report = {
        summary: {
          totalKeywords: keywords.length,
          avgPosition: this.calculateCombinedAvgPosition(positionData.data),
          positionImprovement: positionData.summary.avgPositionChange,
          overallCTR: positionData.summary.overallCTR,
          ctrImprovement: ctrData.summary.avgCTRImprovement,
          totalConversions: conversionData.summary.totalRegistrations,
          conversionRate: conversionData.summary.avgConversionRate,
          totalRevenue: conversionData.summary.totalRevenue
        },
        keywordPerformance: this.combineKeywordData(positionData.data, conversionData.data, ctrData.data),
        trends: {
          positionTrends: this.extractPositionTrends(ctrData.data),
          ctrTrends: this.extractCTRTrends(ctrData.data),
          conversionTrends: this.extractConversionTrends(conversionData.data)
        },
        recommendations: this.generateRecommendations(positionData, conversionData, ctrData)
      };

      return report;
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      throw error;
    }
  },

  calculateCombinedAvgPosition(positionData) {
    const sum = positionData.reduce((acc, kw) => acc + kw.currentPosition, 0);
    return parseFloat((sum / positionData.length).toFixed(2));
  },

  combineKeywordData(positionData, conversionData, ctrData) {
    // Combine data from all sources for each keyword
    return positionData.map(posKw => {
      const convKw = conversionData.find(c => c.keyword === posKw.keyword) || {};
      const ctrKw = ctrData.find(c => c.keyword === posKw.keyword) || {};
      
      return {
        keyword: posKw.keyword,
        position: posKw.currentPosition,
        positionChange: posKw.previousPosition - posKw.currentPosition,
        impressions: posKw.impressions,
        clicks: posKw.clicks,
        ctr: posKw.ctr,
        ctrChange: ctrKw.overallImprovement || 0,
        sessions: convKw.sessionsFromKeyword || 0,
        registrations: convKw.registrations || 0,
        revenue: convKw.revenueGenerated || 0,
        conversionRate: convKw.conversionRate || 0
      };
    });
  },

  extractPositionTrends(ctrData) {
    return ctrData.map(kw => ({
      keyword: kw.keyword,
      avgPosition: kw.avgPosition,
      positionMovement: kw.trend.length > 1 ? 
        kw.trend[0].position - kw.trend[kw.trend.length - 1].position : 0
    }));
  },

  extractCTRTrends(ctrData) {
    return ctrData.map(kw => ({
      keyword: kw.keyword,
      avgCTR: kw.avgCTR,
      improvement: kw.overallImprovement
    }));
  },

  extractConversionTrends(conversionData) {
    return conversionData.map(kw => ({
      keyword: kw.keyword,
      conversionRate: kw.conversionRate,
      registrations: kw.registrations
    }));
  },

  generateRecommendations(positionData, conversionData, ctrData) {
    const recommendations = [];

    // Position-based recommendations
    const strikingDistanceKeywords = positionData.data
      .filter(kw => kw.currentPosition >= 11 && kw.currentPosition <= 20)
      .sort((a, b) => a.currentPosition - b.currentPosition);

    if (strikingDistanceKeywords.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'position_improvement',
        title: 'Striking Distance Keywords Optimization',
        description: `You have ${strikingDistanceKeywords.length} keywords in positions 11-20 that are close to page 1. Focus optimization efforts on these keywords to push them to position 10 or better.`,
        keywords: strikingDistanceKeywords.slice(0, 5).map(kw => kw.keyword),
        actions: [
          'Improve content depth and quality',
          'Optimize title tags and meta descriptions',
          'Add more internal links',
          'Enhance page loading speed'
        ]
      });
    }

    // CTR improvement recommendations
    const lowCTRKewords = ctrData.data
      .filter(kw => kw.avgCTR < 2.0) // Below 2% CTR
      .sort((a, b) => a.avgCTR - b.avgCTR);

    if (lowCTRKewords.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'ctr_improvement',
        title: 'CTR Improvement Opportunities',
        description: `You have ${lowCTRKewords.length} keywords with low CTR (<2%). Improve your snippets to increase click-through rates.`,
        keywords: lowCTRKewords.slice(0, 5).map(kw => kw.keyword),
        actions: [
          'Write compelling meta descriptions',
          'Include numbers/statistics in titles',
          'Add schema markup',
          'Test different title formats'
        ]
      });
    }

    // Conversion optimization recommendations
    const keywordsWithTraffic = conversionData.data
      .filter(kw => kw.sessionsFromKeyword > 100) // Significant traffic
      .filter(kw => kw.conversionRate < 2.0) // Low conversion rate
      .sort((a, b) => a.conversionRate - b.conversionRate);

    if (keywordsWithTraffic.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'conversion_optimization',
        title: 'Conversion Rate Optimization',
        description: `You have ${keywordsWithTraffic.length} keywords bringing significant traffic but with low conversion rates (<2%). Optimize landing pages for these keywords.`,
        keywords: keywordsWithTraffic.slice(0, 5).map(kw => kw.keyword),
        actions: [
          'Improve landing page relevance',
          'Optimize call-to-action buttons',
          'Reduce page load time',
          'Improve form usability'
        ]
      });
    }

    return recommendations;
  }
};

// Utility function to save tracking data locally (for demo purposes)
export function saveTrackingDataToLocal(key, data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`seo_tracking_${key}`, JSON.stringify(data));
  }
}

// Utility function to retrieve tracking data locally (for demo purposes)
export function getTrackingDataFromLocal(key) {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`seo_tracking_${key}`);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}