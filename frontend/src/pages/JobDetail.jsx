import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const JobDetail = () => {
  const { jobId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    if (user?.role === 'candidate') {
      checkIfSaved();
    }
  }, [jobId]);

  const fetchJobDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/public/jobs/${jobId}`);
      setJob(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat lowongan');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidate/jobs/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const saved = res.data.data.some(sj => sj.id === jobId);
      setIsSaved(saved);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSaveJob = async () => {
    if (!user || user.role !== 'candidate') {
      alert("Silakan login sebagai kandidat untuk menyimpan lowongan.");
      navigate('/candidate/auth');
      return;
    }
    
    try {
      if (isSaved) {
        await axios.delete(`http://localhost:5000/api/candidate/jobs/${jobId}/save`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSaved(false);
      } else {
        await axios.post(`http://localhost:5000/api/candidate/jobs/${jobId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="animate-pulse-node rounded-full h-12 w-12 bg-teal-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-700">
      <div className="text-center">
        <h2 className="text-heading-lg font-bold text-ink-900 mb-2">Oops!</h2>
        <p className="text-body-lg text-ink-500">{error}</p>
        <Link to="/cari-lowongan" className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold px-6 py-2.5 rounded-md transition-colors">Kembali ke Beranda</Link>
      </div>
    </div>
  );

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-700 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container mx-auto px-6 py-8 w-full">
        {/* Breadcrumb */}
        <Link to="/cari-lowongan" className="inline-flex items-center gap-1.5 text-body-sm text-ink-500 hover:text-teal-700 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          Kembali ke Job Board
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* ===== KONTEN UTAMA ===== */}
          <div>
            {/* Header job */}
            <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-md bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-heading-lg flex-shrink-0">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover rounded-md" />
                  ) : getInitials(job.company_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-heading-lg font-semibold text-ink-700">{job.title}</h1>
                  <Link to={`/companies/${job.company_slug}`} className="text-body-md text-teal-700 hover:underline">{job.company_name}</Link>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500">📍 {job.location} · {job.work_arrangement}</span>
                    <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500">{job.employment_type}</span>
                    <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500">{job.experience_level}</span>
                  </div>
                  <p className="text-body-md font-medium text-moss-700 mt-3">
                    {job.salary_min && job.salary_max ? `${job.salary_currency || 'IDR'} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}` : 'Gaji Dirahasiakan'}
                    {job.salary_min && job.salary_max && <span className="text-ink-300 font-normal"> / bulan</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-5 border-t border-canvas-border">
                <div>
                  <p className="text-body-sm text-ink-300 font-mono">
                    Batas lamar {job.deadline ? new Date(job.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : 'Tidak ditentukan'}
                  </p>
                  <p className="text-body-sm text-ink-500 mt-1">Dibutuhkan: {job.positions_available} posisi</p>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6 space-y-8 shadow-sm">
              <section>
                <h2 className="text-heading-md font-semibold text-ink-700 mb-3">Deskripsi Pekerjaan</h2>
                <div className="text-body-md text-ink-500 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
              </section>

              {job.requirements && (
                <section>
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-3">Kualifikasi</h2>
                  <div className="text-body-md text-ink-500 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                </section>
              )}

              {job.responsibilities && (
                <section>
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-3">Tanggung Jawab</h2>
                  <div className="text-body-md text-ink-500 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
                </section>
              )}

              {job.benefits && (
                <section>
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-3">Benefit & Keuntungan</h2>
                  <div className="text-body-md text-ink-500 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                </section>
              )}
            </div>
          </div>

          {/* ===== SIDEBAR KANAN ===== */}
          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-canvas-border rounded-lg p-5 space-y-3 shadow-sm">
              {job.status === 'closed' ? (
                <button disabled className="block w-full text-center bg-gray-200 text-ink-400 font-semibold text-body-md py-3 rounded-md cursor-not-allowed">
                  Lowongan Ditutup
                </button>
              ) : (
                <Link to={`/jobs/${job.id}/apply`} className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md py-3 rounded-md transition-colors">
                  Lamar Sekarang
                </Link>
              )}
              <button 
                onClick={toggleSaveJob}
                className={`w-full flex items-center justify-center gap-2 border font-medium text-body-md py-2.5 rounded-md transition-colors ${
                  isSaved 
                    ? 'border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                    : 'border-teal-500 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"/>
                </svg>
                {isSaved ? 'Tersimpan' : 'Simpan Lowongan'}
              </button>
            </div>

            <div className="bg-white border border-canvas-border rounded-lg p-5 shadow-sm">
              <h3 className="text-body-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">Tentang Perusahaan</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md bg-teal-100 flex items-center justify-center text-teal-700 font-semibold shrink-0">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover rounded-md" />
                  ) : getInitials(job.company_name)}
                </div>
                <div>
                  <p className="text-body-md font-medium text-ink-700 line-clamp-1">{job.company_name}</p>
                  <p className="text-body-sm text-ink-300 line-clamp-1">{job.company_industry || 'Perusahaan'}</p>
                </div>
              </div>
              <Link to={`/companies/${job.company_slug}`} className="text-body-sm text-teal-700 hover:underline font-medium block mt-4">Lihat profil & lowongan lain &rarr;</Link>
            </div>
          </aside>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-ink-700 mt-auto">
        <div className="max-w-container mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="26" height="18" viewBox="0 0 28 20" fill="none">
                <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
                <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
                <circle cx="4" cy="16" r="3.5" fill="#7EC1C7"/>
                <circle cx="14" cy="8" r="3.5" fill="#7EC1C7"/>
                <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
              </svg>
              <span className="italic font-medium text-[19px] text-white">RecruitFlow</span>
            </div>
            <p className="text-body-sm text-ink-300">Satu platform untuk menemukan dan mengelola setiap tahap rekrutmen.</p>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Untuk Pencari Kerja</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/cari-lowongan" className="hover:text-amber-500 transition-colors">Cari Lowongan</Link></li>
              <li><Link to="/candidate/auth" className="hover:text-amber-500 transition-colors">Buat Profil</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Untuk Perusahaan</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/company/login" className="hover:text-amber-500 transition-colors">Pasang Lowongan</Link></li>
              <li><Link to="/harga" className="hover:text-amber-500 transition-colors">Harga</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Perusahaan</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-container mx-auto px-6 py-5 text-body-sm text-ink-300">
            © 2026 RecruitFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetail;
