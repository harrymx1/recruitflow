import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Navbar from '../components/Navbar';

const SortableItem = ({ id, label, onRemove, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-2 bg-white border border-canvas-border rounded-md px-3 py-2 mb-2">
      <div {...attributes} {...listeners} className="cursor-grab">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8D97AC"><circle cx="8" cy="6" r="1.5"/><circle cx="16" cy="6" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>
      </div>
      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-semibold">{index + 1}</span>
      <span className="text-body-sm text-ink-700 flex-1">{label}</span>
      <button onClick={() => onRemove(id)} className="text-ink-300 hover:text-coral-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </li>
  );
};

const JobBoard = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    employment_type: [],
    work_arrangement: [],
    experience_level: []
  });
  const [sortPriority, setSortPriority] = useState(['terbaru']);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const availableSorts = [
    { id: 'terbaru', label: 'Terbaru' },
    { id: 'kuota', label: 'Kuota Terbanyak' },
    { id: 'pelamar_terbanyak', label: 'Pelamar Terbanyak' },
    { id: 'pelamar_tersedikit', label: 'Pelamar Tersedikit' },
    { id: 'deadline_terdekat', label: 'Batas Waktu Terdekat' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'candidate') {
      fetchSavedJobs();
    }
    document.title = "RecruitFlow — Cari Lowongan";
  }, [filters, sortPriority, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (filters.employment_type.length) params.append('employment_type', filters.employment_type.join(','));
      if (filters.work_arrangement.length) params.append('work_arrangement', filters.work_arrangement.join(','));
      if (filters.experience_level.length) params.append('experience_level', filters.experience_level.join(','));
      if (sortPriority.length) params.append('sort_priority', sortPriority.join(','));
      params.append('page', pagination.page);

      const res = await axios.get(`http://localhost:5000/api/public/jobs?${params.toString()}`);
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidate/jobs/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(res.data.data.map(sj => sj.id));
    } catch (err) {
      console.error('Failed to fetch saved jobs', err);
    }
  };

  const toggleSaveJob = async (e, jobId) => {
    e.preventDefault();
    if (!user || user.role !== 'candidate') {
      alert("Silakan login sebagai kandidat untuk menyimpan lowongan.");
      return;
    }
    
    try {
      const isSaved = savedJobs.includes(jobId);
      if (isSaved) {
        await axios.delete(`http://localhost:5000/api/candidate/jobs/${jobId}/save`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        await axios.post(`http://localhost:5000/api/candidate/jobs/${jobId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchJobs();
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [category]: updated };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSortPriority((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addSort = (e) => {
    const val = e.target.value;
    if (val && !sortPriority.includes(val)) {
      setSortPriority([...sortPriority, val]);
    }
    e.target.value = "";
  };

  const removeSort = (id) => {
    setSortPriority(sortPriority.filter(s => s !== id));
  };

  const FilterChip = ({ category, value, label }) => {
    const isActive = filters[category].includes(value);
    const baseClasses = "transition-all duration-150 ease-out cursor-pointer text-body-sm px-3 py-1.5 rounded-full border";
    const activeClasses = "border-teal-500 bg-teal-100 text-teal-700";
    const inactiveClasses = "border-canvas-border text-ink-500";
    
    return (
      <span 
        onClick={() => toggleFilter(category, value)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="bg-canvas text-ink-700 antialiased font-sans min-h-screen flex flex-col">
      <Navbar />

      <section className="hero-spotlight relative overflow-hidden border-b border-canvas-border">
        <div className="max-w-container mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-body-sm font-semibold tracking-wide text-teal-700 uppercase mb-3">Job board lintas perusahaan</p>
            <h1 className="font-sans font-bold text-display-lg lg:text-display-xl text-ink-700 mb-5">
              Temukan tahap<br className="hidden lg:block"/> berikutnya dalam kariermu.
            </h1>
            <p className="text-body-lg text-ink-500 max-w-md mb-8">
              Ratusan lowongan dari berbagai perusahaan, satu tempat pencarian. Lamar dengan satu profil, pantau statusnya secara real-time.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border border-canvas-border p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8D97AC" strokeWidth="1.75"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Cari posisi, skill, atau perusahaan..." 
                  className="w-full py-2.5 text-body-md text-ink-700 placeholder:text-ink-300 outline-none bg-transparent"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-6 py-2.5 rounded-md transition-colors">Cari Lowongan</button>
            </form>
            <p className="text-body-sm text-ink-300 mt-3">Populer: <span className="text-teal-700">Software Engineer</span>, <span className="text-teal-700">Digital Marketing</span>, <span className="text-teal-700">Magang</span></p>
          </div>

          <div className="hidden lg:flex justify-center">
            <svg width="380" height="220" viewBox="0 0 380 220" fill="none">
              <line x1="30" y1="180" x2="120" y2="130" stroke="#DDE1EA" strokeWidth="3"/>
              <line x1="120" y1="130" x2="210" y2="150" stroke="#DDE1EA" strokeWidth="3"/>
              <line x1="210" y1="150" x2="300" y2="70" stroke="#DDE1EA" strokeWidth="3"/>
              <line x1="300" y1="70" x2="360" y2="40" stroke="#DDE1EA" strokeWidth="3"/>

              <circle cx="30" cy="180" r="9" fill="#1F6F78"/>
              <circle cx="120" cy="130" r="9" fill="#1F6F78"/>
              <circle cx="210" cy="150" r="10" fill="#E8A23D" className="origin-center animate-pulse-node"/>
              <circle cx="300" cy="70" r="9" fill="white" stroke="#8D97AC" strokeWidth="2"/>
              <circle cx="360" cy="40" r="9" fill="white" stroke="#8D97AC" strokeWidth="2"/>

              <text x="18" y="200" className="font-sans" fontSize="11" fill="#8D97AC">Applied</text>
              <text x="90" y="150" className="font-sans" fontSize="11" fill="#8D97AC">Screening</text>
              <text x="178" y="170" className="font-sans" fontSize="11" fill="#A66A1E" fontWeight="600">Interview</text>
              <text x="280" y="90" className="font-sans" fontSize="11" fill="#8D97AC">Offer</text>
              <text x="338" y="60" className="font-sans" fontSize="11" fill="#8D97AC">Hired</text>
            </svg>
          </div>
        </div>
      </section>

      <main className="max-w-container mx-auto px-6 py-10 grid lg:grid-cols-[260px_1fr] gap-8 flex-1 w-full relative">
        <div className="flex items-center justify-between lg:hidden mb-4 col-span-1">
          <button onClick={() => setShowFilter(true)} className="flex items-center gap-2 text-ink-700 bg-white border border-canvas-border px-4 py-2 rounded-md shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter Lowongan
          </button>
        </div>
        
        {/* Backdrop for mobile */}
        {showFilter && (
          <div className="fixed inset-0 bg-ink-900/50 z-40 lg:hidden" onClick={() => setShowFilter(false)}></div>
        )}

        <aside className={`space-y-6 fixed inset-x-0 bottom-0 z-50 bg-white p-6 rounded-t-2xl shadow-xl transition-transform duration-300 lg:static lg:p-0 lg:bg-transparent lg:shadow-none lg:z-auto lg:rounded-none lg:translate-y-0 max-h-[85vh] overflow-y-auto ${showFilter ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between lg:hidden mb-4 pb-4 border-b border-canvas-border">
            <h2 className="text-heading-md font-semibold text-ink-700">Filter</h2>
            <button onClick={() => setShowFilter(false)} className="p-2 text-ink-500 hover:text-ink-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div>
            <h3 className="text-body-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">Jenis Pekerjaan</h3>
            <div className="flex flex-wrap gap-2">
              <FilterChip category="employment_type" value="Full-time" label="Full-time" />
              <FilterChip category="employment_type" value="Part-time" label="Part-time" />
              <FilterChip category="employment_type" value="Contract" label="Kontrak" />
              <FilterChip category="employment_type" value="Internship" label="Magang" />
              <FilterChip category="employment_type" value="Freelance" label="Freelance" />
            </div>
          </div>
          <div>
            <h3 className="text-body-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">Pengaturan Kerja</h3>
            <div className="flex flex-wrap gap-2">
              <FilterChip category="work_arrangement" value="On-site" label="On-site" />
              <FilterChip category="work_arrangement" value="Remote" label="Remote" />
              <FilterChip category="work_arrangement" value="Hybrid" label="Hybrid" />
            </div>
          </div>
          <div>
            <h3 className="text-body-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">Level Pengalaman</h3>
            <div className="flex flex-wrap gap-2">
              <FilterChip category="experience_level" value="Entry Level" label="Entry" />
              <FilterChip category="experience_level" value="Mid Level" label="Mid" />
              <FilterChip category="experience_level" value="Senior Level" label="Senior" />
              <FilterChip category="experience_level" value="Managerial" label="Managerial" />
            </div>
          </div>

          <div className="pt-2 border-t border-canvas-border">
            <h3 className="text-body-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">Urutkan (berdasarkan prioritas)</h3>
            <ul className="space-y-0">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortPriority} strategy={verticalListSortingStrategy}>
                  {sortPriority.map((id, index) => (
                    <SortableItem key={id} id={id} index={index} label={availableSorts.find(s => s.id === id)?.label} onRemove={removeSort} />
                  ))}
                </SortableContext>
              </DndContext>
              
              {sortPriority.length < availableSorts.length && (
                <li className="flex items-center gap-2 bg-white border border-dashed border-canvas-border rounded-md px-3 py-2 text-ink-300 mt-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DDE1EA" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <select onChange={addSort} className="text-body-sm bg-transparent outline-none cursor-pointer text-ink-500 w-full" defaultValue="">
                    <option value="" disabled>Tambah kriteria...</option>
                    {availableSorts.filter(s => !sortPriority.includes(s.id)).map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </li>
              )}
            </ul>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-body-md text-ink-500"><span className="font-semibold text-ink-700">{pagination.total} lowongan</span> ditemukan</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => {
                const isSaved = savedJobs.includes(job.id);
                const initial = job.company_name ? job.company_name.charAt(0).toUpperCase() : 'C';
                
                return (
                  <Link to={`/jobs/${job.id}`} key={job.id} className="transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md block bg-white border border-canvas-border rounded-lg p-5 shadow-xs">
                    <div className="flex gap-4">
                      {job.company_logo ? (
                        <img src={job.company_logo} alt={job.company_name} className="w-12 h-12 rounded-md object-cover border border-canvas-border flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-teal-100 flex items-center justify-center text-teal-700 font-sans font-semibold text-heading-md flex-shrink-0">
                          {initial}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-heading-md font-semibold text-ink-700">{job.title}</h3>
                            <p className="text-body-md text-ink-500">{job.company_name}</p>
                          </div>
                          <button 
                            onClick={(e) => toggleSaveJob(e, job.id)}
                            className={`flex-shrink-0 p-1.5 rounded-md hover:bg-canvas transition-colors`}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "#E8A23D" : "none"} stroke={isSaved ? "#A66A1E" : "#8D97AC"} strokeWidth="1.5">
                              <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"/>
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500">{job.location} · {job.work_arrangement}</span>
                          <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500">{job.employment_type}</span>
                          {job.experience_level && <span className="text-body-sm px-2.5 py-1 rounded-full bg-gray-100 text-ink-500">{job.experience_level}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-body-sm text-ink-300 font-mono">Diposting {new Date(job.created_at).toLocaleDateString('id-ID')} · {job.hired_count || 0} dari {job.quota} posisi terisi</p>
                          <p className="text-body-sm text-ink-500">{job.applicant_count || 0} pelamar</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              {jobs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-canvas-border">
                  <h3 className="text-body-lg font-medium text-ink-700">Tidak ada lowongan</h3>
                  <p className="mt-1 text-ink-500 text-body-sm">Coba ubah kata kunci atau hapus beberapa filter.</p>
                </div>
              )}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-canvas-border text-ink-500 hover:bg-white disabled:opacity-50"
              >
                ‹
              </button>
              
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const p = idx + 1;
                return (
                  <button 
                    key={p}
                    onClick={() => setPagination({...pagination, page: p})}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-body-sm ${pagination.page === p ? 'bg-amber-500 text-ink-700 font-semibold rounded-full' : 'text-ink-500 hover:bg-white'}`}
                  >
                    {p}
                  </button>
                );
              })}

              <button 
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-canvas-border text-ink-500 hover:bg-white disabled:opacity-50"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-ink-700 mt-8">
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
              <span className="font-sans italic text-[19px] font-medium text-white">RecruitFlow</span>
            </div>
            <p className="text-body-sm text-ink-300">Satu platform untuk menemukan dan mengelola setiap tahap rekrutmen.</p>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Untuk Pencari Kerja</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/cari-lowongan" className="hover:text-amber-500 transition-colors">Cari Lowongan</Link></li>
              <li><Link to="/candidate/auth" className="hover:text-amber-500 transition-colors">Buat Profil</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-amber-500 transition-colors">Lacak Lamaran</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Untuk Perusahaan</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/company/dashboard" className="hover:text-amber-500 transition-colors">Pasang Lowongan</Link></li>
              <li><Link to="/company/dashboard" className="hover:text-amber-500 transition-colors">Kelola Kandidat</Link></li>
              <li><Link to="/harga" className="hover:text-amber-500 transition-colors">Harga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Perusahaan</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="#" className="hover:text-amber-500 transition-colors">Tentang Kami</Link></li>
              <li><Link to="#" className="hover:text-amber-500 transition-colors">Bantuan</Link></li>
              <li><Link to="#" className="hover:text-amber-500 transition-colors">Kontak</Link></li>
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

export default JobBoard;
