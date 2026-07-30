import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CandidateDashboard = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/candidate/applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [token]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active': return { label: 'Dalam Peninjauan', colorClass: 'bg-teal-100 text-teal-700', bgClass: 'bg-teal-100', textClass: 'text-teal-700' };
      case 'hired': return { label: 'Diterima', colorClass: 'bg-moss-100 text-moss-700', bgClass: 'bg-moss-100', textClass: 'text-moss-700' };
      case 'rejected': return { label: 'Tidak Lolos', colorClass: 'bg-coral-100 text-coral-700', bgClass: 'bg-gray-100', textClass: 'text-ink-500' };
      case 'withdrawn': return { label: 'Ditarik', colorClass: 'bg-gray-100 text-ink-500', bgClass: 'bg-gray-100', textClass: 'text-ink-500' };
      default: return { label: 'Status Tidak Diketahui', colorClass: 'bg-gray-100 text-ink-500', bgClass: 'bg-gray-100', textClass: 'text-ink-500' };
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getFilterCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  const filters = [
    { id: 'all', label: `Semua (${getFilterCount('all')})` },
    { id: 'active', label: 'Dalam Peninjauan' },
    { id: 'hired', label: 'Diterima' },
    { id: 'rejected', label: 'Tidak Lolos' },
    { id: 'withdrawn', label: 'Ditarik' },
  ];

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-ink-700 mb-1">Dashboard Saya</h1>
      <p className="text-body-md text-ink-500 mb-6">Pantau status seluruh lamaranmu, ke perusahaan manapun di RecruitFlow.</p>

      {/* Filter status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <span 
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            className={`text-body-sm px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              filterStatus === filter.id 
                ? 'border border-teal-500 bg-teal-100 text-teal-700 font-medium' 
                : 'border border-canvas-border text-ink-500 hover:border-teal-300'
            }`}
          >
            {filter.label}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse-node rounded-full h-8 w-8 bg-teal-500"></div>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-canvas-border border-dashed">
          <p className="text-body-md text-ink-500 mb-4">Tidak ada lamaran yang sesuai dengan filter ini.</p>
          <Link to="/cari-lowongan" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold text-body-md px-4 py-2 rounded-md transition-colors">Cari Lowongan Baru</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map(app => {
            const statusInfo = getStatusInfo(app.status);
            const isDimmed = app.status === 'rejected' || app.status === 'withdrawn';
            
            return (
              <Link key={app.id} to={`/candidate/applications/${app.id}`} className={`block bg-white border border-canvas-border rounded-lg p-5 hover:-translate-y-0.5 hover:shadow-sm transition-all ${isDimmed ? 'opacity-80' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className={`w-11 h-11 rounded-md ${statusInfo.bgClass} flex items-center justify-center ${statusInfo.textClass} font-semibold flex-shrink-0`}>
                      {app.company_logo ? (
                        <img src={app.company_logo} alt={app.company_name} className="w-full h-full object-cover rounded-md" />
                      ) : getInitials(app.company_name)}
                    </div>
                    <div>
                      <p className="text-body-md font-semibold text-ink-700">{app.job_title}</p>
                      <p className="text-body-sm text-ink-500">{app.company_name}</p>
                    </div>
                  </div>
                  <span className={`text-body-sm px-3 py-1 rounded-full ${statusInfo.colorClass} font-medium whitespace-nowrap`}>
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-body-sm text-ink-300 font-mono mt-3">Dilamar {new Date(app.applied_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
