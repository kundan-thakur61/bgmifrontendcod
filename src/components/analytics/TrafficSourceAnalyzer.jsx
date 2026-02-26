'use client';

import { useState, useEffect } from 'react';
import { PieChart, BarChart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Esports Gaming Traffic Source Performance Analyzer
 * Identifies underperforming traffic sources and provides optimization recommendations
 */
export default function TrafficSourceAnalyzer() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate GA4 data for esports gaming platform
      const mockData = generateEsportsAnalyticsData();
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEsportsAnalyticsData = () => {
    // Simulated GA4 data for BGMI/PUBG/Free Fire platform
    const trafficSources = [
      {
        source: 'google / organic',
        sessions: 12500,
        users: 11200,
        engagementTime: 156, // seconds
        bounceRate: 42.3,
        conversionRate: 3.2,
        revenue: 18500,
        newUsers: 8900
      },
      {
        source: 'facebook / social',
        sessions: 8900,
        users: 7800,
        engagementTime: 89,
        bounceRate: 67.8,
        conversionRate: 1.1,
        revenue: 4200,
        newUsers: 6500
      },
      {
        source: 'direct / (none)',
        sessions: 15600,
        users: 13400,
        engagementTime: 234,
        bounceRate: 31.2,
        conversionRate: 8.7,
        revenue: 32100,
        newUsers: 10200
      },
      {
        source: 'youtube / social',
        sessions: 6700,
        users: 5800,
        engagementTime: 67,
        bounceRate: 78.4,
        conversionRate: 0.8,
        revenue: 1800,
        newUsers: 4500
      },
      {
        source: '(not set) / referral',
        sessions: 4200,
        users: 3800,
        engagementTime: 123,
        bounceRate: 55.6,
        conversionRate: 2.1,
        revenue: 3800,
        newUsers: 2900
      },
      {
        source: 'instagram / social',
        sessions: 3800,
        users: 3200,
        engagementTime: 78,
        bounceRate: 72.1,
        conversionRate: 1.4,
        revenue: 2100,
        newUsers: 2400
      },
      {
        source: 'discord / social',
        sessions: 5400,
        users: 4800,
        engagementTime: 189,
        bounceRate: 48.9,
        conversionRate: 4.5,
        revenue: 8900,
        newUsers: 3800
      }
    ];

    // Calculate metrics
    const totalSessions = trafficSources.reduce((sum, src) => sum + src.sessions, 0);
    const avgBounceRate = trafficSources.reduce((sum, src) => sum + src.bounceRate, 0) / trafficSources.length;
    const avgEngagementTime = trafficSources.reduce((sum, src) => sum + src.engagementTime, 0) / trafficSources.length;
    
    // Identify underperforming sources
    const underperforming = trafficSources
      .filter(src => 
        src.bounceRate > 60 || // High bounce rate
        src.engagementTime < 120 || // Low engagement
        src.conversionRate < 2.0 // Low conversion
      )
      .sort((a, b) => {
        // Prioritize by impact: bounce rate + low engagement time
        const aScore = (a.bounceRate * 0.4) + ((120 - Math.min(a.engagementTime, 120)) * 0.3) + ((2.0 - Math.min(a.conversionRate, 2.0)) * 10);
        const bScore = (b.bounceRate * 0.4) + ((120 - Math.min(b.engagementTime, 120)) * 0.3) + ((2.0 - Math.min(b.conversionRate, 2.0)) * 10);
        return bScore - aScore;
      })
      .slice(0, 3);

    return {
      trafficSources,
      summary: {
        totalSessions,
        avgBounceRate: parseFloat(avgBounceRate.toFixed(1)),
        avgEngagementTime: parseFloat(avgEngagementTime.toFixed(1)),
        totalRevenue: trafficSources.reduce((sum, src) => sum + src.revenue, 0),
        totalNewUsers: trafficSources.reduce((sum, src) => sum + src.newUsers, 0)
      },
      underperforming,
      recommendations: generateRecommendations(underperforming, trafficSources)
    };
  };

  const generateRecommendations = (underperforming, allSources) => {
    const recommendations = [];

    // High bounce rate recommendations
    const highBounceSources = underperforming.filter(src => src.bounceRate > 60);
    if (highBounceSources.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'bounce_rate',
        title: 'High Bounce Rate Optimization',
        description: `Sources with bounce rates above 60%: ${highBounceSources.map(s => s.source.split('/')[0].trim()).join(', ')}`,
        sources: highBounceSources.map(s => s.source),
        actions: [
          'Improve landing page relevance to match traffic source intent',
          'Optimize page load speed (target <2 seconds)',
          'Add engaging visual elements and gameplay previews',
          'Improve mobile responsiveness and touch interactions',
          'Add clear value propositions above the fold'
        ]
      });
    }

    // Low engagement time recommendations
    const lowEngagementSources = underperforming.filter(src => src.engagementTime < 120);
    if (lowEngagementSources.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'engagement_time',
        title: 'User Engagement Enhancement',
        description: `Sources with low engagement time (<2 minutes): ${lowEngagementSources.map(s => s.source.split('/')[0].trim()).join(', ')}`,
        sources: lowEngagementSources.map(s => s.source),
        actions: [
          'Add interactive tournament previews and match replays',
          'Implement progressive content loading as users scroll',
          'Add related content recommendations and "next match" suggestions',
          'Include live chat or community features',
          'Optimize video content autoplay and loading'
        ]
      });
    }

    // Conversion optimization recommendations
    const lowConversionSources = allSources.filter(src => src.conversionRate < 2.0 && src.sessions > 3000);
    if (lowConversionSources.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'conversion_optimization',
        title: 'Conversion Rate Improvement',
        description: `High-traffic sources with low conversion rates: ${lowConversionSources.map(s => s.source.split('/')[0].trim()).join(', ')}`,
        sources: lowConversionSources.map(s => s.source),
        actions: [
          'Add prominent tournament registration CTAs above the fold',
          'Implement exit-intent popups for tournament signups',
          'Optimize registration form (reduce fields, add social login)',
          'Add trust signals (user reviews, tournament winners)',
          'Create urgency with limited tournament spots'
        ]
      });
    }

    // Technical optimization recommendations
    recommendations.push({
      priority: 'medium',
      category: 'technical_optimization',
      title: 'Next.js Performance Optimizations',
      description: 'Technical improvements to boost engagement and reduce bounce rates',
      actions: [
        'Implement Next.js Image Optimization for gameplay screenshots',
        'Add automatic preloading for tournament detail pages',
        'Optimize bundle size with code splitting for heavy components',
        'Implement ISR (Incremental Static Regeneration) for tournament data',
        'Add service worker for offline tournament browsing'
      ]
    });

    return recommendations;
  };

  const getBounceRateColor = (rate) => {
    if (rate < 40) return 'text-green-400';
    if (rate < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEngagementTimeColor = (time) => {
    if (time > 180) return 'text-green-400';
    if (time > 120) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  const { trafficSources, summary, underperforming, recommendations } = analyticsData;

  // Chart data
  const bounceRateData = {
    labels: trafficSources.map(src => src.source.split('/')[0].trim()),
    datasets: [{
      label: 'Bounce Rate (%)',
      data: trafficSources.map(src => src.bounceRate),
      backgroundColor: trafficSources.map((_, i) => 
        underperforming.find(u => u.source === _.source) 
          ? 'rgba(239, 68, 68, 0.7)' 
          : 'rgba(59, 130, 246, 0.7)'
      ),
      borderColor: trafficSources.map((_, i) => 
        underperforming.find(u => u.source === _.source) 
          ? 'rgb(239, 68, 68)' 
          : 'rgb(59, 130, 246)'
      ),
      borderWidth: 2
    }]
  };

  const engagementData = {
    labels: trafficSources.map(src => src.source.split('/')[0].trim()),
    datasets: [{
      label: 'Avg Engagement Time (seconds)',
      data: trafficSources.map(src => src.engagementTime),
      backgroundColor: trafficSources.map((_, i) => 
        underperforming.find(u => u.source === _.source) 
          ? 'rgba(245, 158, 11, 0.7)' 
          : 'rgba(16, 185, 129, 0.7)'
      ),
      borderColor: trafficSources.map((_, i) => 
        underperforming.find(u => u.source === _.source) 
          ? 'rgb(245, 158, 11)' 
          : 'rgb(16, 185, 129)'
      ),
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9CA3AF'
        }
      },
      title: {
        display: true,
        color: '#FFFFFF'
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: '#374151'
        }
      },
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: '#374151'
        }
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Traffic Source Performance Analyzer</h2>
        <p className="text-gray-400">Identifying underperforming traffic sources and optimization opportunities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Sessions</h3>
          <p className="text-2xl font-bold text-white">{summary.totalSessions.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Avg Bounce Rate</h3>
          <p className={`text-2xl font-bold ${getBounceRateColor(summary.avgBounceRate)}`}>
            {summary.avgBounceRate}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Avg Engagement</h3>
          <p className={`text-2xl font-bold ${getEngagementTimeColor(summary.avgEngagementTime)}`}>
            {Math.floor(summary.avgEngagementTime / 60)}m {summary.avgEngagementTime % 60}s
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">₹{summary.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Underperforming Sources */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Top 3 Underperforming Traffic Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {underperforming.map((source, index) => (
            <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-red-400">{source.source.split('/')[0].trim()}</h4>
                <span className="text-xs bg-red-600 px-2 py-1 rounded">#{index + 1}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bounce Rate:</span>
                  <span className={`font-medium ${getBounceRateColor(source.bounceRate)}`}>
                    {source.bounceRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement:</span>
                  <span className={`font-medium ${getEngagementTimeColor(source.engagementTime)}`}>
                    {Math.floor(source.engagementTime / 60)}m {source.engagementTime % 60}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Conversion:</span>
                  <span className="text-white font-medium">{source.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions:</span>
                  <span className="text-white font-medium">{source.sessions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Bounce Rate by Source</h3>
          <BarChart data={bounceRateData} options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                ...chartOptions.plugins.title,
                text: 'Higher bounce rates indicate underperforming sources'
              }
            }
          }} />
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Time by Source</h3>
          <BarChart data={engagementData} options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                ...chartOptions.plugins.title,
                text: 'Lower engagement times need optimization'
              }
            }
          }} />
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Actionable Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                rec.priority === 'high' ? 'bg-red-900/20 border-red-500/30' :
                rec.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-500/30' :
                'bg-blue-900/20 border-blue-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-semibold ${
                  rec.priority === 'high' ? 'text-red-400' :
                  rec.priority === 'medium' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {rec.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  rec.priority === 'high' ? 'bg-red-600' :
                  rec.priority === 'medium' ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
              
              {rec.sources && rec.sources.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Affected sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.sources.map((src, idx) => (
                      <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {src.split('/')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-xs text-gray-400 mb-1">Recommended actions:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  {rec.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}