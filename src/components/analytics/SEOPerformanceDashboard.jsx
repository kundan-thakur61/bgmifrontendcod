'use client';

import { useState, useEffect } from 'react';
import { analyticsDashboard } from '@/lib/analytics-tracker';

/**
 * SEO Performance Dashboard for tracking striking distance keywords
 */
export function SEOPerformanceDashboard({ 
  keywords = [],
  dateRange = { startDate: '2024-01-01', endDate: new Date().toISOString().split('T')[0] },
  showRecommendations = true 
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await analyticsDashboard.getComprehensiveReport(keywords, dateRange);
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (keywords.length > 0) {
      fetchData();
    }
  }, [keywords, dateRange]);

  if (loading) {
    return (
      <div className="seo-dashboard bg-gray-900 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

  if (error) {
    return (
      <div className="seo-dashboard bg-red-900/20 border border-red-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Data</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="seo-dashboard bg-gray-900 rounded-xl p-6">
        <p className="text-gray-400">No data available. Please provide keywords to track.</p>
      </div>
    );
  }

  const { summary, keywordPerformance, recommendations } = dashboardData;

  return (
    <div className="seo-dashboard bg-gray-900 rounded-xl p-6 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">SEO Performance Dashboard</h2>
        <p className="text-gray-400">Track your striking distance keywords performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-blue-400 text-sm font-medium mb-1">Avg Position</h3>
          <p className="text-2xl font-bold text-white">{summary.avgPosition}</p>
          <p className={`text-xs ${summary.positionImprovement > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.positionImprovement > 0 ? '↑' : '↓'} {Math.abs(summary.positionImprovement)} from prev
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4">
          <h3 className="text-green-400 text-sm font-medium mb-1">Overall CTR</h3>
          <p className="text-2xl font-bold text-white">{summary.overallCTR}%</p>
          <p className={`text-xs ${summary.ctrImprovement > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.ctrImprovement > 0 ? '↑' : '↓'} {Math.abs(summary.ctrImprovement)}% improvement
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4">
          <h3 className="text-purple-400 text-sm font-medium mb-1">Conv. Rate</h3>
          <p className="text-2xl font-bold text-white">{summary.conversionRate}%</p>
          <p className="text-xs text-gray-400">{summary.totalConversions} registrations</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-yellow-400 text-sm font-medium mb-1">Revenue</h3>
          <p className="text-2xl font-bold text-white">₹{summary.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400">From tracked keywords</p>
        </div>
      </div>

      {/* Keyword Performance Table */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Keyword Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-3 text-gray-300">Keyword</th>
                <th className="text-center p-3 text-gray-300">Position</th>
                <th className="text-center p-3 text-gray-300">Change</th>
                <th className="text-center p-3 text-gray-300">CTR</th>
                <th className="text-center p-3 text-gray-300">Clicks</th>
                <th className="text-center p-3 text-gray-300">Conv. Rate</th>
                <th className="text-center p-3 text-gray-300">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {keywordPerformance.map((kw, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                  <td className="p-3 text-white font-medium">{kw.keyword}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      kw.position <= 10 ? 'bg-green-900/30 text-green-400' :
                      kw.position <= 20 ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {kw.position}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`${
                      kw.positionChange > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {kw.positionChange > 0 ? '+' : ''}{kw.positionChange}
                    </span>
                  </td>
                  <td className="p-3 text-center text-white">{kw.ctr}%</td>
                  <td className="p-3 text-center text-white">{kw.clicks.toLocaleString()}</td>
                  <td className="p-3 text-center text-white">{kw.conversionRate}%</td>
                  <td className="p-3 text-center text-white">₹{kw.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Optimization Recommendations</h3>
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
                
                {rec.keywords && rec.keywords.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Affected keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.keywords.map((kw, idx) => (
                        <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {kw}
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
      )}

      {/* Striking Distance Focus */}
      <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-orange-400 mb-2">Striking Distance Keywords (Pos 11-20)</h3>
        <p className="text-gray-300 text-sm mb-3">
          These keywords are closest to page 1 and have the highest potential for improvement.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {keywordPerformance
            .filter(kw => kw.position >= 11 && kw.position <= 20)
            .sort((a, b) => a.position - b.position)
            .slice(0, 8)
            .map((kw, index) => (
              <div key={index} className="bg-black/30 rounded p-2 text-center">
                <div className="text-xs text-orange-400">{kw.position}</div>
                <div className="text-xs text-white truncate">{kw.keyword}</div>
                <div className="text-xs text-gray-400">CTR: {kw.ctr}%</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Widget for quick SEO metrics
 */
export function SEOMetricsWidget({ keywords = [] }) {
  const [metrics, setMetrics] = useState({
    strikingDistance: 0,
    avgCTR: 0,
    avgPosition: 0,
    improvement: 0
  });

  useEffect(() => {
    if (keywords.length > 0) {
      // Simulate getting metrics for the widget
      const strikingDistance = keywords.filter(kw => {
        const pos = Math.floor(Math.random() * 25) + 5; // Simulate position 5-30
        return pos >= 11 && pos <= 20;
      }).length;
      
      setMetrics({
        strikingDistance,
        avgCTR: parseFloat((Math.random() * 3 + 1).toFixed(2)),
        avgPosition: parseFloat((Math.random() * 15 + 10).toFixed(2)),
        improvement: parseFloat((Math.random() * 5 - 2).toFixed(2)) // -2% to +3% improvement
      });
    }
  }, [keywords]);

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-3">SEO Health</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Striking Distance</span>
            <span className="text-white">{metrics.strikingDistance}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${(metrics.strikingDistance / keywords.length) * 100 || 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded p-2">
            <div className="text-xs text-gray-400">Avg CTR</div>
            <div className="text-lg font-bold text-white">{metrics.avgCTR}%</div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-xs text-gray-400">Avg Pos</div>
            <div className="text-lg font-bold text-white">{metrics.avgPosition}</div>
          </div>
        </div>
        
        <div className={`text-xs ${
          metrics.improvement >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {metrics.improvement >= 0 ? '↑' : '↓'} {Math.abs(metrics.improvement)}% trend
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for SEO performance tracking
 */
export function useSEOPerformanceTracking(keywords, dateRange) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackPerformance = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await analyticsDashboard.getComprehensiveReport(keywords, dateRange);
      setTrackingData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { trackingData, loading, error, trackPerformance };
}