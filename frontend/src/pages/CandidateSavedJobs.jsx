import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CandidateSavedJobs = () => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidate/jobs/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/candidate/jobs/${jobId}/save`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(savedJobs.filter(sj => sj.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  // Function to generate a deterministic pastel color class based on company name
  const getCompanyColor = (name) => {
    const colors = [
      { bg: 'bg-teal-100', text: 'text-teal-700' },
      { bg: 'bg-amber-100', text: 'text-amber-700' },
      { bg: 'bg-moss-100', text: 'text-moss-700' },
      { bg: 'bg-coral-100', text: 'text-coral-700' },
    ];
    if (!name) return colors[0];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-ink-700 mb-1">Lowongan Tersimpan</h1>
      <p className="text-body-md text-ink-500 mb-6">
        {loading ? 'Memuat...' : `${savedJobs.length} lowongan yang kamu simpan untuk dilamar nanti.`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse-node rounded-full h-8 w-8 bg-teal-500"></div>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-canvas-border border-dashed text-center">
          <h3 className="text-heading-md font-medium text-ink-700">Belum ada lowongan tersimpan</h3>
          <p className="mt-2 text-body-md text-ink-500 mb-6">Simpan lowongan yang menarik perhatian Anda untuk dilamar nanti.</p>
          <Link to="/cari-lowongan" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold text-body-md px-4 py-2 rounded-md transition-colors">Cari Lowongan</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map(job => {
            const isClosed = job.job_status === 'closed';
            const color = getCompanyColor(job.company_name);
            
            return (
              <Link 
                key={job.id} 
                to={`/jobs/${job.id}`} 
                className={`block bg-white border border-canvas-border rounded-lg p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm relative ${isClosed ? 'opacity-60' : ''}`}
              >
                {isClosed && (
                  <span className="absolute top-3 right-3 text-body-sm px-2 py-0.5 rounded-full bg-gray-200 text-ink-500 font-medium">Sudah Ditutup</span>
                )}
                
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-md ${color.bg} flex items-center justify-center ${color.text} font-semibold flex-shrink-0`}>
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover rounded-md" />
                    ) : getInitials(job.company_name)}
                  </div>
                  
                  <button 
                    onClick={(e) => removeSavedJob(e, job.id)}
                    className="p-1 text-ink-300 hover:text-coral-600 transition-colors" 
                    title="Hapus dari simpanan"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                    </svg>
                  </button>
                </div>
                
                <h3 className="text-body-md font-semibold text-ink-700 mt-3 line-clamp-1">{job.title}</h3>
                <p className="text-body-sm text-ink-500 line-clamp-1">{job.company_name}</p>
                
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-body-sm px-2 py-0.5 rounded-full bg-gray-100 text-ink-500">{job.location}</span>
                  <span className="text-body-sm px-2 py-0.5 rounded-full bg-gray-100 text-ink-500">{job.employment_type}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateSavedJobs;
