'use client';

import { useState } from 'react';
import { TrafficSourceAnalyzer } from './TrafficSourceAnalyzer';
import { NextJsOptimizer } from './NextJsOptimizer';

/**
 * Comprehensive Esports Analytics Dashboard
 * Combines traffic source analysis with optimization recommendations
 */
export default function EsportsAnalyticsDashboard() {
  const [activeView, setActiveView] = useState('traffic-analysis');

  const views = [
    { id: 'traffic-analysis', label: 'Traffic Source Analysis', component: TrafficSourceAnalyzer },
    { id: 'optimizations', label: 'Performance Optimizations', component: NextJsOptimizer }
  ];

  const ActiveComponent = views.find(view => view.id === activeView)?.component || TrafficSourceAnalyzer;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                <h1 className="text-xl font-bold text-white">Esports Analytics Dashboard</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-400 text-sm">BGMI • PUBG • Free Fire Performance Insights</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-6">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === view.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Active View */}
        <div className="transition-all duration-300">
          <ActiveComponent />
        </div>

        {/* Action Footer */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Implement Changes?</h3>
            <p className="text-gray-300 mb-4">
              Start with the high-impact optimizations to see immediate improvements in engagement time and bounce rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Export Implementation Plan
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Schedule Performance Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}