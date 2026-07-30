import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import HRLayout from '../components/HRLayout';

// Komponen HRDashboard meniru hr-dashboard.html
export default function HRDashboard() {
  const [summary, setSummary] = useState({
    total_jobs: 0,
    total_applicants: 0,
    total_hired: 0,
    active_applications: 0
  });
  const [funnel, setFunnel] = useState({
    pipeline_stages: [],
    status_distribution: {}
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: sumData }, { data: funData }] = await Promise.all([
        api.get('/dashboard/analytics/summary'),
        api.get('/dashboard/analytics/funnel')
      ]);
      setSummary(sumData.data);
      setFunnel(funData.data);
    } catch (error) {
      console.error('Error fetching analytics', error);
    }
  };

  const calculateFunnelWidth = (count, maxCount) => {
    if (maxCount === 0) return '0%';
    return `${Math.max(15, (count / maxCount) * 100)}%`;
  };

  const totalApplicants = summary.total_applicants;

  return (
    <HRLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-heading-lg font-semibold text-ink-700">Dashboard Ringkasan</h1>
        <span className="text-body-sm text-ink-400">Pembaruan terakhir hari ini</span>
      </div>

      <div className="max-w-6xl w-full mx-auto space-y-6">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-canvas-border shadow-xs">
              <p className="text-body-sm text-ink-500 font-medium mb-1">Total Lowongan</p>
              <h2 className="text-3xl font-bold">{summary.total_jobs}</h2>
              <p className="text-xs text-ink-300 mt-2">Aktif di publik</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-canvas-border shadow-xs">
              <p className="text-body-sm text-ink-500 font-medium mb-1">Total Kandidat</p>
              <h2 className="text-3xl font-bold">{summary.total_applicants}</h2>
              <p className="text-xs text-teal-600 font-medium mt-2">Lamaran masuk</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-canvas-border shadow-xs">
              <p className="text-body-sm text-ink-500 font-medium mb-1">Sedang Diproses</p>
              <h2 className="text-3xl font-bold text-amber-600">{summary.active_applications}</h2>
              <p className="text-xs text-ink-300 mt-2">Status Active</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-canvas-border shadow-xs">
              <p className="text-body-sm text-ink-500 font-medium mb-1">Hired</p>
              <h2 className="text-3xl font-bold text-moss-600">{summary.total_hired}</h2>
              <p className="text-xs text-moss-600 font-medium mt-2">Telah direkrut</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            
            {/* Recruitment Funnel Chart (Main Area) */}
            <div className="col-span-2 bg-white rounded-lg border border-canvas-border shadow-xs flex flex-col">
              <div className="px-5 py-4 border-b border-canvas-border flex justify-between items-center">
                <h3 className="font-semibold text-body-md">Recruitment Funnel</h3>
                <span className="text-xs bg-canvas px-2 py-1 rounded text-ink-500">Semua Lowongan</span>
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
                {/* Funnel Items */}
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-body-sm text-ink-500 font-medium">Applied</div>
                  <div className="flex-1 h-10 bg-canvas rounded overflow-hidden flex items-center relative">
                    <div className="h-full bg-teal-500" style={{ width: '100%' }}></div>
                    <span className="absolute left-3 text-white text-body-sm font-medium">{summary.total_applicants}</span>
                  </div>
                </div>

                {funnel.pipeline_stages.map(stage => (
                  <div key={stage.stage_id} className="flex items-center gap-4">
                    <div className="w-24 text-right text-body-sm text-ink-500 font-medium">{stage.stage_name}</div>
                    <div className="flex-1 h-10 bg-canvas rounded overflow-hidden flex items-center relative">
                      <div className="h-full bg-teal-400" style={{ width: calculateFunnelWidth(stage.applicant_count, totalApplicants) }}></div>
                      <span className={`absolute left-3 text-body-sm font-medium ${stage.applicant_count > 0 ? 'text-white' : 'text-ink-500'}`}>{stage.applicant_count}</span>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center gap-4 pt-2 mt-2 border-t border-canvas-border border-dashed">
                  <div className="w-24 text-right text-body-sm text-moss-600 font-semibold">Hired</div>
                  <div className="flex-1 h-10 bg-canvas rounded overflow-hidden flex items-center relative">
                    <div className="h-full bg-moss-500" style={{ width: calculateFunnelWidth(funnel.status_distribution?.hired || 0, totalApplicants) }}></div>
                    <span className={`absolute left-3 text-body-sm font-medium ${(funnel.status_distribution?.hired || 0) > 0 ? 'text-white' : 'text-ink-500'}`}>
                      {funnel.status_distribution?.hired || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-body-sm text-coral-600 font-medium">Rejected</div>
                  <div className="flex-1 h-6 bg-canvas rounded overflow-hidden flex items-center relative">
                    <div className="h-full bg-coral-400" style={{ width: calculateFunnelWidth(funnel.status_distribution?.rejected || 0, totalApplicants) }}></div>
                    <span className={`absolute left-3 text-xs font-medium ${(funnel.status_distribution?.rejected || 0) > 0 ? 'text-white' : 'text-ink-500'}`}>
                      {funnel.status_distribution?.rejected || 0}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions / Recent activity summary */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-lg border border-canvas-border shadow-xs">
                <div className="px-5 py-4 border-b border-canvas-border">
                  <h3 className="font-semibold text-body-md">Aksi Cepat</h3>
                </div>
                <div className="p-3 space-y-2">
                  <Link to="/dashboard/jobs/new" className="block px-4 py-3 bg-canvas hover:bg-ink-50 rounded-md transition-colors text-body-sm font-medium text-ink-700 flex items-center justify-between group">
                    Buat Lowongan Baru
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-300 group-hover:text-teal-600 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                  <Link to="/dashboard/candidates" className="block px-4 py-3 bg-canvas hover:bg-ink-50 rounded-md transition-colors text-body-sm font-medium text-ink-700 flex items-center justify-between group">
                    Review Kandidat
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-300 group-hover:text-teal-600 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>

              <div className="bg-ink-700 rounded-lg shadow-sm text-white p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-semibold text-body-lg mb-2">Upgrade RecruitFlow</h3>
                  <p className="text-body-sm text-ink-100 opacity-90 mb-4 leading-relaxed">
                    Dapatkan akses ke fitur AI screening dan custom workflow pipeline.
                  </p>
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded text-body-sm transition-colors">
                    Lihat Paket
                  </button>
                </div>
                <svg className="absolute right-0 bottom-0 opacity-10" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              </div>

            </div>

          </div>

      </div>
    </HRLayout>
  );
}
