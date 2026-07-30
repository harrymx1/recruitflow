import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import HRLayout from '../components/HRLayout';

const statusColors = {
  active: 'bg-teal-100 text-teal-700',
  hired: 'bg-moss-100 text-moss-700',
  rejected: 'bg-coral-100 text-coral-700',
  withdrawn: 'bg-gray-100 text-ink-500',
};

const statusLabels = {
  active: 'Active',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const DashboardCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCandidates();
  }, [search, statusFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const { data } = await api.get(`/dashboard/candidates?${params.toString()}`);
      setCandidates(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HRLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-lg font-semibold text-ink-700">Kandidat</h1>
        <span className="text-body-sm text-ink-400">{candidates.length} total pelamar</span>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-canvas-border flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau judul lowongan..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-canvas-border rounded-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-canvas-border rounded-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Semua Status</option>
          <option value="active">Active</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-canvas-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-canvas-border">
            <tr className="text-body-sm font-semibold text-ink-500">
              <th className="px-5 py-3">Kandidat</th>
              <th className="px-5 py-3">Lowongan</th>
              <th className="px-5 py-3">Tag</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tanggal Lamar</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="text-body-md divide-y divide-canvas-border">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-ink-300">Memuat data...</td></tr>
            ) : candidates.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-ink-300">Belum ada kandidat yang ditemukan.</td></tr>
            ) : candidates.map(c => (
              <tr key={c.application_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-body-sm flex-shrink-0">
                      {c.first_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-ink-700 flex items-center gap-2">
                        {c.first_name} {c.last_name}
                        {c.subscription_tier === 'premium' && (
                          <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm">Premium</span>
                        )}
                      </div>
                      <div className="text-body-sm text-ink-400">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-600">{c.job_title}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags || []).map(tag => (
                      <span
                        key={tag.id}
                        style={{ backgroundColor: tag.color + '22', color: tag.color, borderColor: tag.color + '44' }}
                        className="text-xs px-2 py-0.5 rounded-full border font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-body-sm px-2.5 py-1 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100 text-ink-500'}`}>
                    {statusLabels[c.status] || c.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink-400 text-body-sm">
                  {new Date(c.applied_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/dashboard/applications/${c.application_id}`}
                    className="text-body-sm text-teal-700 hover:underline font-medium"
                  >
                    Lihat Detail →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HRLayout>
  );
};

export default DashboardCandidates;
