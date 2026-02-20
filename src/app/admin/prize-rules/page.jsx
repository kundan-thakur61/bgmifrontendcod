'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDateTime, formatCurrency } from '@/lib/utils';

// ─── Reusable Components ───────────────────────────────────────

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`bg-dark-800 rounded-xl border border-dark-600 w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors text-xl">×</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function Badge({ status, type = 'status' }) {
  const colors = {
    // Status colors
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    // Match type colors
    match_win: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tournament: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    tdm: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    wow: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    special: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    all: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    // Game type colors
    pubg_mobile: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    free_fire: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    // Distribution type colors
    position_based: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    kill_based: 'bg-red-500/20 text-red-400 border-red-500/30',
    hybrid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    percentage: 'bg-green-500/20 text-green-400 border-green-500/30',
    custom: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    // Default
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const displayText = status?.replace(/_/g, ' ') || 'unknown';
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${colors[status] || colors.default}`}>
      {displayText}
    </span>
  );
}

function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-dark-400 text-sm">{total} total results</p>
      <div className="flex gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 rounded bg-dark-700 text-sm disabled:opacity-30 hover:bg-dark-600 transition-colors">←</button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = page <= 3 ? i + 1 : page + i - 2;
          if (p < 1 || p > pages) return null;
          return <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded text-sm transition-colors ${p === page ? 'bg-primary-600 text-white' : 'bg-dark-700 hover:bg-dark-600'}`}>{p}</button>;
        })}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= pages} className="px-3 py-1 rounded bg-dark-700 text-sm disabled:opacity-30 hover:bg-dark-600 transition-colors">→</button>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">🔍</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="input pl-9 bg-dark-800 border-dark-600 h-9 text-sm" />
    </div>
  );
}

function StatCard({ label, value, icon, color = 'text-white' }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}

// ─── Position Config Editor ───────────────────────────────────────

function PositionConfigEditor({ config, onChange }) {
  const handleAddPosition = () => {
    const newPositions = [...(config.positions || []), { position: (config.positions?.length || 0) + 1, prize: 0, label: '' }];
    onChange({ ...config, positions: newPositions });
  };

  const handleRemovePosition = (index) => {
    const newPositions = config.positions.filter((_, i) => i !== index);
    onChange({ ...config, positions: newPositions });
  };

  const handlePositionChange = (index, field, value) => {
    const newPositions = [...config.positions];
    newPositions[index] = { ...newPositions[index], [field]: value };
    onChange({ ...config, positions: newPositions });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-dark-300">Position-based Distribution</label>
        <span className="text-xs text-dark-400">Pool %: 
          <input
            type="number"
            value={config.poolPercentage || 100}
            onChange={(e) => onChange({ ...config, poolPercentage: parseInt(e.target.value) || 100 })}
            className="input w-16 ml-2 h-7 text-xs bg-dark-700 border-dark-600"
            min="0"
            max="100"
          />
        </span>
      </div>
      
      <div className="space-y-2">
        {(config.positions || []).map((pos, index) => (
          <div key={index} className="flex items-center gap-2 bg-dark-700 p-2 rounded-lg">
            <div className="flex items-center gap-1">
              <span className="text-xs text-dark-400">#</span>
              <input
                type="number"
                value={pos.position}
                onChange={(e) => handlePositionChange(index, 'position', parseInt(e.target.value))}
                className="input w-14 h-8 text-sm bg-dark-600 border-dark-500"
                min="1"
              />
            </div>
            <input
              type="text"
              value={pos.label || ''}
              onChange={(e) => handlePositionChange(index, 'label', e.target.value)}
              placeholder="Label (e.g., 1st Place)"
              className="input flex-1 h-8 text-sm bg-dark-600 border-dark-500"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-dark-400">₹</span>
              <input
                type="number"
                value={pos.prize}
                onChange={(e) => handlePositionChange(index, 'prize', parseFloat(e.target.value) || 0)}
                className="input w-24 h-8 text-sm bg-dark-600 border-dark-500"
                min="0"
              />
            </div>
            <button
              onClick={() => handleRemovePosition(index)}
              className="text-red-400 hover:text-red-300 p-1"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleAddPosition}
        className="btn-secondary text-sm py-1.5 w-full"
      >
        + Add Position
      </button>
    </div>
  );
}

// ─── Kill Config Editor ───────────────────────────────────────

function KillConfigEditor({ config, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-dark-300">Kill-based Distribution</label>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-dark-400 block mb-1">Per Kill Prize (₹)</label>
          <input
            type="number"
            value={config.perKillPrize || 0}
            onChange={(e) => onChange({ ...config, perKillPrize: parseFloat(e.target.value) || 0 })}
            className="input w-full h-9 text-sm bg-dark-700 border-dark-600"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-dark-400 block mb-1">Max Kill Prize (₹)</label>
          <input
            type="number"
            value={config.maxKillPrize || ''}
            onChange={(e) => onChange({ ...config, maxKillPrize: e.target.value ? parseFloat(e.target.value) : null })}
            className="input w-full h-9 text-sm bg-dark-700 border-dark-600"
            placeholder="No limit"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-dark-400 block mb-1">Pool %</label>
          <input
            type="number"
            value={config.poolPercentage || 0}
            onChange={(e) => onChange({ ...config, poolPercentage: parseInt(e.target.value) || 0 })}
            className="input w-full h-9 text-sm bg-dark-700 border-dark-600"
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Rules Editor ───────────────────────────────────────

function RulesEditor({ rules, onChange }) {
  const handleAddRule = () => {
    onChange([...(rules || []), { title: '', description: '', order: (rules?.length || 0) + 1 }]);
  };

  const handleRemoveRule = (index) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index, field, value) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    onChange(newRules);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-dark-300">Rules & Regulations</label>
        <button onClick={handleAddRule} className="text-xs text-primary-400 hover:text-primary-300">+ Add Rule</button>
      </div>
      
      <div className="space-y-2">
        {(rules || []).map((rule, index) => (
          <div key={index} className="bg-dark-700 p-3 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <input
                type="number"
                value={rule.order}
                onChange={(e) => handleRuleChange(index, 'order', parseInt(e.target.value))}
                className="input w-14 h-8 text-sm bg-dark-600 border-dark-500"
                placeholder="#"
              />
              <input
                type="text"
                value={rule.title}
                onChange={(e) => handleRuleChange(index, 'title', e.target.value)}
                placeholder="Rule Title"
                className="input flex-1 h-8 text-sm bg-dark-600 border-dark-500"
              />
              <button onClick={() => handleRemoveRule(index)} className="text-red-400 hover:text-red-300 p-1">🗑️</button>
            </div>
            <textarea
              value={rule.description}
              onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
              placeholder="Rule description..."
              className="input w-full h-16 text-sm bg-dark-600 border-dark-500 resize-none"
            />
          </div>
        ))}
      </div>
      
      {(rules || []).length === 0 && (
        <button onClick={handleAddRule} className="btn-secondary text-sm py-1.5 w-full">+ Add First Rule</button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────

export default function PrizeRulesAdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // State
  const [rules, setRules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    matchType: '',
    gameType: '',
    isActive: ''
  });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    matchType: 'all',
    gameType: 'all',
    distributionType: 'position_based',
    positionConfig: { positions: [], poolPercentage: 100 },
    killConfig: { perKillPrize: 0, maxKillPrize: null, poolPercentage: 0 },
    percentageConfig: { distributions: [] },
    minParticipants: 2,
    maxParticipants: 100,
    entryFeeRange: { min: 0, max: null },
    prizePoolRange: { min: 0, max: null },
    rules: [],
    termsAndConditions: [],
    specialConditions: [],
    priority: 0,
    isActive: true,
    isDefault: false,
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveUntil: null
  });

  // Check auth
  useEffect(() => {
    if (!authLoading && (!user || !['super_admin', 'admin', 'match_manager'].includes(user.role))) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch rules
  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(filters.matchType && { matchType: filters.matchType }),
        ...(filters.gameType && { gameType: filters.gameType }),
        ...(filters.isActive && { isActive: filters.isActive })
      });
      
      const response = await api.get(`/admin/prize-rules?${params}`);
      setRules(response.rules || []);
      setPages(response.pagination?.pages || 1);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/prize-rules/stats');
      setStats(response.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchRules();
    fetchStats();
  }, [fetchRules, fetchStats]);

  // Create rule
  const handleCreate = async () => {
    try {
      await api.post('/admin/prize-rules', formData);
      setShowCreateModal(false);
      resetForm();
      fetchRules();
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to create rule');
    }
  };

  // Update rule
  const handleUpdate = async () => {
    try {
      await api.put(`/admin/prize-rules/${selectedRule._id}`, formData);
      setShowEditModal(false);
      resetForm();
      fetchRules();
    } catch (err) {
      setError(err.message || 'Failed to update rule');
    }
  };

  // Delete rule
  const handleDelete = async (ruleId) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    
    try {
      await api.delete(`/admin/prize-rules/${ruleId}`);
      fetchRules();
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to delete rule');
    }
  };

  // Toggle status
  const handleToggleStatus = async (ruleId) => {
    try {
      await api.patch(`/admin/prize-rules/${ruleId}/toggle`);
      fetchRules();
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  // Set as default
  const handleSetDefault = async (ruleId) => {
    try {
      await api.patch(`/admin/prize-rules/${ruleId}/default`);
      fetchRules();
    } catch (err) {
      setError(err.message || 'Failed to set as default');
    }
  };

  // Duplicate rule
  const handleDuplicate = async (ruleId) => {
    try {
      await api.post(`/admin/prize-rules/${ruleId}/duplicate`);
      fetchRules();
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to duplicate rule');
    }
  };

  // View history
  const handleViewHistory = async (ruleId) => {
    try {
      const response = await api.get(`/admin/prize-rules/${ruleId}/history`);
      setHistory(response.history || []);
      setShowHistoryModal(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      matchType: 'all',
      gameType: 'all',
      distributionType: 'position_based',
      positionConfig: { positions: [], poolPercentage: 100 },
      killConfig: { perKillPrize: 0, maxKillPrize: null, poolPercentage: 0 },
      percentageConfig: { distributions: [] },
      minParticipants: 2,
      maxParticipants: 100,
      entryFeeRange: { min: 0, max: null },
      prizePoolRange: { min: 0, max: null },
      rules: [],
      termsAndConditions: [],
      specialConditions: [],
      priority: 0,
      isActive: true,
      isDefault: false,
      effectiveFrom: new Date().toISOString().split('T')[0],
      effectiveUntil: null
    });
    setSelectedRule(null);
  };

  // Open edit modal
  const openEditModal = (rule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      matchType: rule.matchType,
      gameType: rule.gameType,
      distributionType: rule.distributionType,
      positionConfig: rule.positionConfig || { positions: [], poolPercentage: 100 },
      killConfig: rule.killConfig || { perKillPrize: 0, maxKillPrize: null, poolPercentage: 0 },
      percentageConfig: rule.percentageConfig || { distributions: [] },
      minParticipants: rule.minParticipants || 2,
      maxParticipants: rule.maxParticipants || 100,
      entryFeeRange: rule.entryFeeRange || { min: 0, max: null },
      prizePoolRange: rule.prizePoolRange || { min: 0, max: null },
      rules: rule.rules || [],
      termsAndConditions: rule.termsAndConditions || [],
      specialConditions: rule.specialConditions || [],
      priority: rule.priority || 0,
      isActive: rule.isActive,
      isDefault: rule.isDefault,
      effectiveFrom: rule.effectiveFrom ? new Date(rule.effectiveFrom).toISOString().split('T')[0] : '',
      effectiveUntil: rule.effectiveUntil ? new Date(rule.effectiveUntil).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (rule) => {
    setSelectedRule(rule);
    setShowViewModal(true);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-dark-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-dark-400 text-sm mb-2">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span>/</span>
          <span className="text-white">Prize Distribution Rules</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Prize Distribution Rules & Regulations</h1>
          <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="btn-primary flex items-center gap-2">
            <span>+</span> Create Rule
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Rules" value={stats.total} icon="📋" />
          <StatCard label="Active Rules" value={stats.active} icon="✅" color="text-green-400" />
          <StatCard label="Inactive Rules" value={stats.inactive} icon="⏸️" color="text-yellow-400" />
          <StatCard label="Default Rules" value={stats.defaults} icon="⭐" color="text-primary-400" />
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search rules..." />
          <select
            value={filters.matchType}
            onChange={(e) => setFilters({ ...filters, matchType: e.target.value })}
            className="input bg-dark-700 border-dark-600 h-9 text-sm"
          >
            <option value="">All Match Types</option>
            <option value="match_win">Match Win</option>
            <option value="tournament">Tournament</option>
            <option value="tdm">TDM</option>
            <option value="wow">WOW</option>
            <option value="special">Special</option>
            <option value="all">All Types</option>
          </select>
          <select
            value={filters.gameType}
            onChange={(e) => setFilters({ ...filters, gameType: e.target.value })}
            className="input bg-dark-700 border-dark-600 h-9 text-sm"
          >
            <option value="">All Game Types</option>
            <option value="pubg_mobile">PUBG Mobile</option>
            <option value="free_fire">Free Fire</option>
            <option value="all">All Games</option>
          </select>
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            className="input bg-dark-700 border-dark-600 h-9 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
          {error}
          <button onClick={() => setError(null)} className="float-right text-red-300 hover:text-red-200">×</button>
        </div>
      )}

      {/* Rules Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-dark-400">Loading rules...</div>
        ) : rules.length === 0 ? (
          <div className="p-8 text-center text-dark-400">
            No prize distribution rules found. Create your first rule to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Rule Name</th>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Match Type</th>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Game Type</th>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Distribution</th>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Priority</th>
                  <th className="text-left p-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {rules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{rule.name}</span>
                        {rule.isDefault && <span className="text-xs text-primary-400">⭐ Default</span>}
                      </div>
                      <p className="text-xs text-dark-400 mt-0.5 truncate max-w-xs">{rule.description}</p>
                    </td>
                    <td className="p-3"><Badge status={rule.matchType} /></td>
                    <td className="p-3"><Badge status={rule.gameType} /></td>
                    <td className="p-3"><Badge status={rule.distributionType} /></td>
                    <td className="p-3">
                      <Badge status={rule.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="p-3 text-dark-300">{rule.priority}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openViewModal(rule)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded" title="View">👁️</button>
                        <button onClick={() => openEditModal(rule)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded" title="Edit">✏️</button>
                        <button onClick={() => handleToggleStatus(rule._id)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded" title={rule.isActive ? 'Deactivate' : 'Activate'}>
                          {rule.isActive ? '⏸️' : '▶️'}
                        </button>
                        <button onClick={() => handleSetDefault(rule._id)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded" title="Set as Default">⭐</button>
                        <button onClick={() => handleDuplicate(rule._id)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded" title="Duplicate">📋</button>
                        <button onClick={() => handleViewHistory(rule._id)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded" title="History">📜</button>
                        <button onClick={() => handleDelete(rule._id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-dark-600 rounded" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Prize Distribution Rule" size="lg">
        <RuleForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          submitLabel="Create Rule"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Prize Distribution Rule" size="lg">
        <RuleForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          submitLabel="Update Rule"
        />
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Rule Details" size="lg">
        {selectedRule && <RuleDetails rule={selectedRule} />}
      </Modal>

      {/* History Modal */}
      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Version History" size="md">
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-dark-400 text-center py-4">No version history available</p>
          ) : (
            history.map((version, index) => (
              <div key={index} className="bg-dark-700 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">Version {version.version}</span>
                  <span className="text-xs text-dark-400">{formatDateTime(version.changedAt)}</span>
                </div>
                <p className="text-sm text-dark-300">{version.changeReason || 'No reason provided'}</p>
                {version.changedBy && (
                  <p className="text-xs text-dark-400 mt-1">Changed by: {version.changedBy.name || 'Unknown'}</p>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

// ─── Rule Form Component ───────────────────────────────────────

function RuleForm({ formData, setFormData, onSubmit, onCancel, submitLabel }) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'criteria', label: 'Criteria' },
    { id: 'rules', label: 'Rules & Terms' }
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-dark-600 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-t transition-colors ${
              activeTab === tab.id ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-dark-300 block mb-1">Rule Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full bg-dark-700 border-dark-600"
              placeholder="e.g., Standard Solo Match Distribution"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-dark-300 block mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full bg-dark-700 border-dark-600 h-20 resize-none"
              placeholder="Describe this prize distribution rule..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Match Type</label>
              <select
                value={formData.matchType}
                onChange={(e) => setFormData({ ...formData, matchType: e.target.value })}
                className="input w-full bg-dark-700 border-dark-600"
              >
                <option value="all">All Match Types</option>
                <option value="match_win">Match Win</option>
                <option value="tournament">Tournament</option>
                <option value="tdm">TDM</option>
                <option value="wow">WOW</option>
                <option value="special">Special</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Game Type</label>
              <select
                value={formData.gameType}
                onChange={(e) => setFormData({ ...formData, gameType: e.target.value })}
                className="input w-full bg-dark-700 border-dark-600"
              >
                <option value="all">All Games</option>
                <option value="pubg_mobile">PUBG Mobile</option>
                <option value="free_fire">Free Fire</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Distribution Type *</label>
              <select
                value={formData.distributionType}
                onChange={(e) => setFormData({ ...formData, distributionType: e.target.value })}
                className="input w-full bg-dark-700 border-dark-600"
              >
                <option value="position_based">Position Based</option>
                <option value="kill_based">Kill Based</option>
                <option value="hybrid">Hybrid (Position + Kill)</option>
                <option value="percentage">Percentage Based</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Priority</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                className="input w-full bg-dark-700 border-dark-600"
                placeholder="0"
              />
              <p className="text-xs text-dark-400 mt-1">Higher priority rules are applied first</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-dark-500 bg-dark-700"
              />
              <span className="text-sm text-dark-300">Active</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 rounded border-dark-500 bg-dark-700"
              />
              <span className="text-sm text-dark-300">Set as Default</span>
            </label>
          </div>
        </div>
      )}

      {/* Distribution Tab */}
      {activeTab === 'distribution' && (
        <div className="space-y-4">
          {(formData.distributionType === 'position_based' || formData.distributionType === 'hybrid') && (
            <PositionConfigEditor
              config={formData.positionConfig}
              onChange={(config) => setFormData({ ...formData, positionConfig: config })}
            />
          )}
          
          {(formData.distributionType === 'kill_based' || formData.distributionType === 'hybrid') && (
            <KillConfigEditor
              config={formData.killConfig}
              onChange={(config) => setFormData({ ...formData, killConfig: config })}
            />
          )}
          
          {formData.distributionType === 'percentage' && (
            <div className="text-dark-400 text-center py-8">
              Percentage-based distribution configuration coming soon...
            </div>
          )}
          
          {formData.distributionType === 'custom' && (
            <div className="text-dark-400 text-center py-8">
              Custom distribution rules can be configured via API
            </div>
          )}
        </div>
      )}

      {/* Criteria Tab */}
      {activeTab === 'criteria' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Min Participants</label>
              <input
                type="number"
                value={formData.minParticipants}
                onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) || 2 })}
                className="input w-full bg-dark-700 border-dark-600"
                min="2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Max Participants</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 100 })}
                className="input w-full bg-dark-700 border-dark-600"
                min="2"
                max="100"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Entry Fee Range (Min ₹)</label>
              <input
                type="number"
                value={formData.entryFeeRange.min}
                onChange={(e) => setFormData({ ...formData, entryFeeRange: { ...formData.entryFeeRange, min: parseFloat(e.target.value) || 0 } })}
                className="input w-full bg-dark-700 border-dark-600"
                min="0"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Entry Fee Range (Max ₹)</label>
              <input
                type="number"
                value={formData.entryFeeRange.max || ''}
                onChange={(e) => setFormData({ ...formData, entryFeeRange: { ...formData.entryFeeRange, max: e.target.value ? parseFloat(e.target.value) : null } })}
                className="input w-full bg-dark-700 border-dark-600"
                placeholder="No limit"
                min="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Prize Pool Range (Min ₹)</label>
              <input
                type="number"
                value={formData.prizePoolRange.min}
                onChange={(e) => setFormData({ ...formData, prizePoolRange: { ...formData.prizePoolRange, min: parseFloat(e.target.value) || 0 } })}
                className="input w-full bg-dark-700 border-dark-600"
                min="0"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Prize Pool Range (Max ₹)</label>
              <input
                type="number"
                value={formData.prizePoolRange.max || ''}
                onChange={(e) => setFormData({ ...formData, prizePoolRange: { ...formData.prizePoolRange, max: e.target.value ? parseFloat(e.target.value) : null } })}
                className="input w-full bg-dark-700 border-dark-600"
                placeholder="No limit"
                min="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Effective From</label>
              <input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                className="input w-full bg-dark-700 border-dark-600"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-dark-300 block mb-1">Effective Until</label>
              <input
                type="date"
                value={formData.effectiveUntil || ''}
                onChange={(e) => setFormData({ ...formData, effectiveUntil: e.target.value || null })}
                className="input w-full bg-dark-700 border-dark-600"
                placeholder="No end date"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rules & Terms Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <RulesEditor
            rules={formData.rules}
            onChange={(rules) => setFormData({ ...formData, rules })}
          />
          
          <div>
            <label className="text-sm font-medium text-dark-300 block mb-1">Terms & Conditions</label>
            <textarea
              value={(formData.termsAndConditions || []).join('\n')}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value.split('\n').filter(t => t.trim()) })}
              className="input w-full bg-dark-700 border-dark-600 h-32 resize-none"
              placeholder="Enter each term on a new line..."
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-dark-600">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button onClick={onSubmit} className="btn-primary">{submitLabel}</button>
      </div>
    </div>
  );
}

// ─── Rule Details Component ───────────────────────────────────────

function RuleDetails({ rule }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Rule Name</label>
          <p className="text-white font-medium mt-1">{rule.name}</p>
        </div>
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Status</label>
          <p className="mt-1"><Badge status={rule.isActive ? 'active' : 'inactive'} /></p>
        </div>
      </div>
      
      {rule.description && (
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Description</label>
          <p className="text-dark-300 mt-1">{rule.description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Match Type</label>
          <p className="mt-1"><Badge status={rule.matchType} /></p>
        </div>
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Game Type</label>
          <p className="mt-1"><Badge status={rule.gameType} /></p>
        </div>
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Distribution Type</label>
          <p className="mt-1"><Badge status={rule.distributionType} /></p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Participants Range</label>
          <p className="text-dark-300 mt-1">{rule.minParticipants} - {rule.maxParticipants}</p>
        </div>
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Priority</label>
          <p className="text-dark-300 mt-1">{rule.priority}</p>
        </div>
      </div>
      
      {rule.positionConfig?.positions?.length > 0 && (
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Position Distribution</label>
          <div className="mt-2 space-y-1">
            {rule.positionConfig.positions.map((pos, i) => (
              <div key={i} className="flex items-center justify-between bg-dark-700 px-3 py-2 rounded">
                <span className="text-dark-300">#{pos.position} {pos.label && `- ${pos.label}`}</span>
                <span className="text-green-400 font-medium">₹{pos.prize}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {rule.killConfig?.perKillPrize > 0 && (
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Kill Distribution</label>
          <div className="mt-2 bg-dark-700 px-3 py-2 rounded">
            <span className="text-dark-300">Per Kill: </span>
            <span className="text-green-400 font-medium">₹{rule.killConfig.perKillPrize}</span>
            {rule.killConfig.maxKillPrize && (
              <span className="text-dark-400 ml-2">(Max: ₹{rule.killConfig.maxKillPrize})</span>
            )}
          </div>
        </div>
      )}
      
      {rule.rules?.length > 0 && (
        <div>
          <label className="text-xs text-dark-400 uppercase tracking-wider">Rules & Regulations</label>
          <div className="mt-2 space-y-2">
            {rule.rules.map((r, i) => (
              <div key={i} className="bg-dark-700 px-3 py-2 rounded">
                <p className="text-white font-medium">{r.order}. {r.title}</p>
                <p className="text-dark-300 text-sm mt-1">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-xs text-dark-400">
        <div>
          <span>Created: </span>
          <span className="text-dark-300">{formatDateTime(rule.createdAt)}</span>
        </div>
        <div>
          <span>Updated: </span>
          <span className="text-dark-300">{formatDateTime(rule.updatedAt)}</span>
        </div>
      </div>
      
      {rule.createdBy && (
        <div className="text-xs text-dark-400">
          <span>Created by: </span>
          <span className="text-dark-300">{rule.createdBy.name || rule.createdBy.email}</span>
        </div>
      )}
    </div>
  );
}
