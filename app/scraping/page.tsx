'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Instagram,
  Building,
  Play,
  RefreshCw,
  CheckCircle,
  Clock,
  Users,
  Hotel,
  Home,
  Briefcase,
} from 'lucide-react';

interface ScraperStatus {
  totalAvailableLeads: number;
  supabaseConnected: boolean;
  categories: string[];
}

export default function ScrapingPage() {
  const [status, setStatus] = useState<ScraperStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Search },
    { id: 'interior', name: 'Interior Design', icon: Home },
    { id: 'hotel', name: 'Hotels & Hospitality', icon: Hotel },
    { id: 'real estate', name: 'Real Estate', icon: Building },
    { id: 'architecture', name: 'Architecture', icon: Briefcase },
    { id: 'furniture', name: 'Furniture & Decor', icon: Home },
    { id: 'restaurant', name: 'Restaurant & Cafe', icon: Building },
    { id: 'construction', name: 'Construction', icon: Building },
  ];

  // Fetch scraper status on load
  useEffect(() => {
    fetch('/api/scrape')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(console.error);
  }, []);

  const handleRunScraper = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: selectedCategory === 'all' ? null : 'google_maps',
          query: selectedCategory === 'all' ? null : selectedCategory,
          saveToDatabase: true,
        }),
      });

      const data = await response.json();
      setResults(data);

      if (data.success) {
        alert(`Scraping complete!\n\nFound: ${data.totalFound} leads\nSaved to database: ${data.savedToDatabase}\nAlready existed: ${data.skipped}`);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      alert('Error running scraper');
    }

    setIsRunning(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auto Lead Scraping</h1>
          <p className="text-gray-600 mt-1">Find Dubai businesses - Interior, Hotels, Real Estate & more</p>
        </div>
        <button
          onClick={handleRunScraper}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-medium rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isRunning ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          {isRunning ? 'Scraping...' : 'Run Scraper'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-secondary" />
            <span className="text-sm text-gray-500">Available Leads</span>
          </div>
          <p className="text-3xl font-bold">{status?.totalAvailableLeads || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-gray-500">Google Maps</span>
          </div>
          <p className="text-3xl font-bold">{(status?.totalAvailableLeads || 10) - 10}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Instagram className="w-6 h-6 text-pink-500" />
            <span className="text-sm text-gray-500">Instagram</span>
          </div>
          <p className="text-3xl font-bold">10</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            {status?.supabaseConnected ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Clock className="w-6 h-6 text-yellow-500" />
            )}
            <span className="text-sm text-gray-500">Database</span>
          </div>
          <p className="text-lg font-bold">{status?.supabaseConnected ? 'Connected' : 'Demo Mode'}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                selectedCategory === cat.id
                  ? 'border-secondary bg-secondary/10 text-primary'
                  : 'border-gray-200 hover:border-secondary hover:bg-gray-50'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scraping Results</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{results.totalFound}</p>
              <p className="text-sm text-blue-600">Total Found</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">{results.savedToDatabase}</p>
              <p className="text-sm text-green-600">Saved to Database</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-700">{results.skipped}</p>
              <p className="text-sm text-yellow-600">Already Existed</p>
            </div>
          </div>

          {results.leads && results.leads.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Preview (first 20):</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Company</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.leads.map((lead: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-medium">{lead.company || lead.name}</td>
                        <td className="px-4 py-2 text-gray-600">{lead.email || '-'}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">{lead.category}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Business Types Included */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Types Included</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Interior Design', 'Fit Out Companies', 'Hotels', 'Luxury Hotels',
            'Real Estate Developers', 'Property Agents', 'Architecture Firms', 'Furniture Stores',
            'Home Decor', 'Restaurant Design', 'Spa & Wellness', 'Construction',
            'Office Interior', 'Villa Developers', 'Boutique Hotels', 'Mall Management'
          ].map((type) => (
            <div key={type} className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Info */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Automatic Schedule
            </h3>
            <p className="text-gray-300">After deploying to Vercel, scrapers run automatically every week.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Schedule:</p>
            <p className="text-lg font-semibold">Every Monday, 6:00 AM GST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
