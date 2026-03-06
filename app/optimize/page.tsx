'use client';

import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface DataStats {
  counts: {
    leads: number;
    email_logs: number;
    campaigns: number;
    cold_leads: number;
    duplicate_leads: number;
  };
  estimated_storage_mb: string;
  free_limit_mb: number;
  usage_percent: string;
}

interface OptimizeResult {
  success: boolean;
  message: string;
  results: Record<string, number>;
}

export default function OptimizePage() {
  const [stats, setStats] = useState<DataStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/optimize');
      const data = await res.json();
      if (!data.error) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const runOptimization = async (action: string) => {
    setOptimizing(true);
    setResult(null);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setResult(data);
      fetchStats();
    } catch (error) {
      console.error('Optimization failed:', error);
    }
    setOptimizing(false);
  };

  const optimizationOptions = [
    {
      id: 'duplicates',
      title: 'Remove Duplicate Leads',
      description: 'Delete leads with same email (keeps newest)',
      icon: Trash2,
    },
    {
      id: 'email_logs',
      title: 'Clean Old Email Logs',
      description: 'Delete email logs older than 90 days',
      icon: Database,
    },
    {
      id: 'cold_leads',
      title: 'Remove Old Cold Leads',
      description: 'Delete cold leads older than 6 months',
      icon: AlertTriangle,
    },
    {
      id: 'failed_emails',
      title: 'Clean Failed Emails',
      description: 'Delete failed/bounced logs older than 30 days',
      icon: Trash2,
    },
    {
      id: 'old_campaigns',
      title: 'Remove Old Campaigns',
      description: 'Delete completed campaigns older than 1 year',
      icon: Database,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Optimization</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage storage and clean up unused data</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Storage Overview */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 lg:mb-8 shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Storage Overview</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : stats ? (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Used: {stats.estimated_storage_mb} MB</span>
                <span>Free Limit: {stats.free_limit_mb} MB</span>
              </div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: stats.usage_percent }}
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Usage: {stats.usage_percent}
              </p>
            </div>

            {/* Data Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.counts.leads}</p>
                <p className="text-xs sm:text-sm text-gray-500">Total Leads</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.counts.email_logs}</p>
                <p className="text-xs sm:text-sm text-gray-500">Email Logs</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.counts.campaigns}</p>
                <p className="text-xs sm:text-sm text-gray-500">Campaigns</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-orange-500">{stats.counts.cold_leads}</p>
                <p className="text-xs sm:text-sm text-gray-500">Cold Leads</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.counts.duplicate_leads}</p>
                <p className="text-xs sm:text-sm text-gray-500">Duplicates</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-yellow-500 text-sm sm:text-base">Failed to load stats. Is Supabase configured?</p>
        )}
      </div>

      {/* Optimization Result */}
      {result && (
        <div className={`mb-6 lg:mb-8 p-3 sm:p-4 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">{result.message}</span>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-gray-400">
            {Object.entries(result.results).map(([key, value]) => (
              <p key={key}>{key.replace(/_/g, ' ')}: {value}</p>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Options */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Optimization Actions</h2>

        {/* Run All Button */}
        <button
          onClick={() => runOptimization('all')}
          disabled={optimizing}
          className="w-full p-3 sm:p-4 bg-secondary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {optimizing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Trash2 className="w-5 h-5" />
              Run All Optimizations
            </>
          )}
        </button>

        {/* Individual Options */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {optimizationOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                  <option.icon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{option.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => runOptimization(option.id)}
                  disabled={optimizing}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs sm:text-sm font-medium disabled:opacity-50 flex-shrink-0"
                >
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
