// Example usage of the analytics components in your Next.js app

// pages/analytics/index.js
import { EsportsAnalyticsDashboard } from '@/components/analytics';

export default function AnalyticsPage() {
  return <EsportsAnalyticsDashboard />;
}

// Or use individual components:

// pages/traffic-analysis.js
import { TrafficSourceAnalyzer } from '@/components/analytics';

export default function TrafficAnalysisPage() {
  return (
    <div className="container mx-auto py-8">
      <TrafficSourceAnalyzer />
    </div>
  );
}

// pages/optimizations.js
import { NextJsOptimizer } from '@/components/analytics';

export default function OptimizationsPage() {
  return (
    <div className="container mx-auto py-8">
      <NextJsOptimizer />
    </div>
  );
}

// Add to your existing dashboard layout:
// components/layout/DashboardLayout.jsx
import { TrafficSourceAnalyzer, NextJsOptimizer } from '@/components/analytics';

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('traffic')}>Traffic Analysis</button>
        <button onClick={() => setActiveTab('optimizations')}>Optimizations</button>
      </div>
      
      {activeTab === 'traffic' && <TrafficSourceAnalyzer />}
      {activeTab === 'optimizations' && <NextJsOptimizer />}
    </div>
  );
}