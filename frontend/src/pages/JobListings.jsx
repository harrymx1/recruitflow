import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

const JobListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/dashboard/jobs');
      setJobs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'published') return job.status === 'published' || job.is_published;
    if (filter === 'draft') return job.status === 'draft' && !job.is_published;
    if (filter === 'closed') return job.status === 'closed';
    return true;
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-60 bg-ink-700 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <svg width="24" height="17" viewBox="0 0 28 20" fill="none"><line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/><line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/><circle cx="4" cy="16" r="3.5" fill="#7EC1C7"/><circle cx="14" cy="8" r="3.5" fill="#7EC1C7"/><circle cx="24" cy="4" r="4" fill="#E8A23D"/></svg>
            <span className="italic font-medium text-[18px] text-white">RecruitFlow</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md border-l-[3px] border-transparent text-gray-300 hover:text-white">
            Profil Perusahaan
          </Link>
          <Link to="/dashboard/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md border-l-[3px] text-white bg-[rgba(31,111,120,0.2)] border-amber-500">
            Lowongan
          </Link>
          <Link to="/dashboard/team" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md border-l-[3px] border-transparent text-gray-300 hover:text-white">
            Tim <span className="text-body-sm text-ink-300 font-mono ml-auto">Admin</span>
          </Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-canvas-border flex items-center justify-between px-8 flex-shrink-0">
          <div><p className="text-body-sm text-ink-300">Workspace</p><p className="text-body-md font-semibold text-ink-700">{user?.companyName || 'Perusahaan Anda'}</p></div>
          <button className="w-9 h-9 rounded-full bg-ink-700 text-white flex items-center justify-center font-semibold text-body-sm">
            {getInitials(user?.name)}
          </button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-heading-lg font-semibold text-ink-700">Lowongan</h1>
            <Link to="/dashboard/jobs/new" className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-4 py-2.5 rounded-md transition-colors">+ Buat Lowongan Baru</Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setFilter('all')} className={`text-body-sm px-3 py-1.5 rounded-full border transition-all ${filter === 'all' ? 'border-teal-500 bg-teal-100 text-teal-700' : 'border-canvas-border text-ink-500 hover:bg-gray-50'}`}>Semua ({jobs.length})</button>
            <button onClick={() => setFilter('published')} className={`text-body-sm px-3 py-1.5 rounded-full border transition-all ${filter === 'published' ? 'border-teal-500 bg-teal-100 text-teal-700' : 'border-canvas-border text-ink-500 hover:bg-gray-50'}`}>Published ({jobs.filter(j => j.status === 'published' || j.is_published).length})</button>
            <button onClick={() => setFilter('draft')} className={`text-body-sm px-3 py-1.5 rounded-full border transition-all ${filter === 'draft' ? 'border-teal-500 bg-teal-100 text-teal-700' : 'border-canvas-border text-ink-500 hover:bg-gray-50'}`}>Draft ({jobs.filter(j => j.status === 'draft' && !j.is_published).length})</button>
            <button onClick={() => setFilter('closed')} className={`text-body-sm px-3 py-1.5 rounded-full border transition-all ${filter === 'closed' ? 'border-teal-500 bg-teal-100 text-teal-700' : 'border-canvas-border text-ink-500 hover:bg-gray-50'}`}>Closed ({jobs.filter(j => j.status === 'closed').length})</button>
          </div>

          <div className="bg-white border border-canvas-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-canvas-border">
                <tr className="text-body-sm font-semibold text-ink-500">
                  <th className="px-5 py-3">Judul Lowongan</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Kuota</th>
                  <th className="px-5 py-3">Pelamar</th>
                  <th className="px-5 py-3">Deadline</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-ink-300">Memuat data...</td></tr>
                ) : filteredJobs.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-ink-300">Belum ada data lowongan</td></tr>
                ) : filteredJobs.map(job => (
                  <tr key={job.id} className={`border-b border-canvas-border hover:bg-gray-50 ${job.status === 'closed' ? 'opacity-70' : ''}`}>
                    <td className="px-5 py-4"><Link to={`/dashboard/jobs/${job.id}`} className="font-medium text-ink-700 hover:text-teal-700">{job.title}</Link></td>
                    <td className="px-5 py-4">
                      {job.status === 'closed' ? (
                        <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-200 text-ink-500 font-medium">Closed</span>
                      ) : job.is_published ? (
                        <span className="text-body-sm px-2.5 py-1 rounded-full bg-moss-100 text-moss-700 font-medium">Published</span>
                      ) : (
                        <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500 font-medium">Draft</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-ink-500">{job.filled_count || 0}/-</td>
                    <td className="px-5 py-4 font-mono text-ink-500">{job.applicants_count || 0}</td>
                    <td className="px-5 py-4 font-mono text-ink-500">{job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4 text-right">
                      {(job.is_published && job.status !== 'closed') ? (
                        <Link to={`/dashboard/pipeline/${job.id}`} className="text-body-sm text-teal-700 hover:underline font-medium">Lihat Pipeline →</Link>
                      ) : (
                        <Link to={`/dashboard/jobs/${job.id}`} className="text-body-sm text-teal-700 hover:underline font-medium">Lanjutkan Edit →</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobListings;
