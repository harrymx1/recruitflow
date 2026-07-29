import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

const JobForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    employment_type: 'Full-time',
    work_arrangement: 'on-site',
    experience_level: 'Entry-level',
    description: '',
    requirements: '',
    responsibilities: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'IDR',
    deadline: '',
    work_arrangement: 'on-site',
    is_paid: true,
    duration_min: '',
    duration_max: '',
    duration_unit: 'Bulan',
    status: 'draft'
  });

  const [customQuestions, setCustomQuestions] = useState([]);
  const [pipelineStages, setPipelineStages] = useState([
    { name: 'applied', type: 'anchor' },
    { name: 'screening', type: 'custom' },
    { name: 'interview', type: 'custom' },
    { name: 'offer', type: 'custom' },
    { name: 'hired', type: 'anchor' },
    { name: 'rejected', type: 'anchor' }
  ]);

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  useEffect(() => {
    if (isEdit) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/dashboard/jobs/${id}`);
      const job = res.data.data;
      setFormData({
        title: job.title || '',
        department: job.department || '',
        employment_type: job.employment_type || 'Full-time',
        work_arrangement: job.work_arrangement || (job.is_remote ? 'remote' : 'on-site'),
        experience_level: job.experience_level || 'Entry-level',
        description: job.description || '',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        salary_currency: job.salary_currency || 'IDR',
        deadline: job.deadline ? job.deadline.split('T')[0] : '',
        work_arrangement: job.work_arrangement || 'on-site',
        is_paid: job.is_paid !== undefined ? job.is_paid : true,
        duration_min: job.duration_min || '',
        duration_max: job.duration_max || '',
        duration_unit: job.duration_unit || 'Bulan',
        status: job.status || 'draft'
      });

      if (job.custom_questions && job.custom_questions.length > 0) {
        setCustomQuestions(job.custom_questions);
      }
      if (job.pipeline_stages && job.pipeline_stages.length > 0) {
        setPipelineStages(job.pipeline_stages);
      }
    } catch (err) {
      setError('Gagal memuat data lowongan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (isPublished = false) => {
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        is_published: isPublished,
        status: isPublished ? 'published' : 'draft'
      };

      if (!payload.salary_min) delete payload.salary_min;
      if (!payload.salary_max) delete payload.salary_max;
      if (!payload.deadline) delete payload.deadline;

      if (isEdit) {
        await api.put(`/dashboard/jobs/${id}`, payload);
        await api.put(`/dashboard/jobs/${id}/questions`, { questions: customQuestions });
        await api.put(`/dashboard/jobs/${id}/stages`, { stages: pipelineStages });
      } else {
        const res = await api.post('/dashboard/jobs', payload);
        const newJobId = res.data.data.id;
        await api.put(`/dashboard/jobs/${newJobId}/questions`, { questions: customQuestions });
        await api.put(`/dashboard/jobs/${newJobId}/stages`, { stages: pipelineStages });
      }

      navigate('/dashboard/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan lowongan');
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-300">Memuat...</div>;
  }

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
          <Link to="/dashboard/jobs" className="inline-flex items-center gap-1.5 text-body-sm text-ink-500 hover:text-teal-700 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg> Kembali ke Daftar Lowongan
          </Link>
          <h1 className="text-heading-lg font-semibold text-ink-700 mb-6">{isEdit ? 'Edit Lowongan' : 'Buat Lowongan Baru'}</h1>

          <div className="max-w-3xl">
            {error && <div className="mb-4 bg-coral-100 text-coral-700 p-3 rounded-md text-body-sm font-medium">{error}</div>}
            
            {/* Info Dasar */}
            <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
              <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Info Dasar</h2>
              <div className="space-y-4">
                <div>
                  <label className="field-label">Judul Posisi</label>
                  <input required className="input-field" name="title" value={formData.title} onChange={handleChange} placeholder="mis. Senior Frontend Engineer"/>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Departemen</label>
                    <input className="input-field" name="department" value={formData.department} onChange={handleChange} placeholder="mis. Engineering"/>
                  </div>
                  <div>
                    <label className="field-label">Jenis Pekerjaan</label>
                    <select className="input-field" name="employment_type" value={formData.employment_type} onChange={handleChange}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Kontrak</option>
                      <option value="Internship">Magang</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Pengaturan Kerja</label>
                    <select className="input-field" name="work_arrangement" value={formData.work_arrangement || 'on-site'} onChange={handleChange}>
                      <option value="on-site">On-site (Di Kantor)</option>
                      <option value="hybrid">Hybrid (Sebagian Remote)</option>
                      <option value="remote">Full Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Level Pengalaman</label>
                    <select className="input-field" name="experience_level" value={formData.experience_level} onChange={handleChange}>
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Manager">Manajerial</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Batas Akhir Lamar (opsional)</label>
                    <input type="date" className="input-field" name="deadline" value={formData.deadline} onChange={handleChange}/>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="field-label">Kompensasi</label>
                  <select className="input-field" name="is_paid" value={formData.is_paid} onChange={(e) => setFormData({...formData, is_paid: e.target.value === 'true'})}>
                    <option value="true">Paid (Berbayar)</option>
                    <option value="false">Unpaid (Tidak Berbayar)</option>
                  </select>
                </div>

                {formData.is_paid && (
                  <div className="border border-canvas-border rounded-md p-4 mb-4">
                    <h3 className="text-body-md font-medium text-ink-700 mb-3">Rentang Gaji (opsional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="field-label">Gaji Minimum</label><input type="number" className="input-field font-mono" name="salary_min" value={formData.salary_min} onChange={handleChange} placeholder="Tanpa titik (mis. 5000000)"/></div>
                      <div><label className="field-label">Gaji Maksimum</label><input type="number" className="input-field font-mono" name="salary_max" value={formData.salary_max} onChange={handleChange} placeholder="Tanpa titik (mis. 10000000)"/></div>
                    </div>
                  </div>
                )}

                {['Contract', 'Internship', 'Freelance'].includes(formData.employment_type) && (
                  <div className="border border-canvas-border rounded-md p-4">
                    <h3 className="text-body-md font-medium text-ink-700 mb-3">Durasi / Periode Pekerjaan</h3>
                    <div className="flex items-end gap-4">
                      <div className="flex-1"><label className="field-label">Minimal</label><input type="number" className="input-field" name="duration_min" value={formData.duration_min} onChange={handleChange} placeholder="mis. 3"/></div>
                      <div className="flex-1"><label className="field-label">Maksimal (opsional)</label><input type="number" className="input-field" name="duration_max" value={formData.duration_max} onChange={handleChange} placeholder="mis. 6"/></div>
                      <div className="flex-1">
                        <label className="field-label">Satuan</label>
                        <select className="input-field" name="duration_unit" value={formData.duration_unit} onChange={handleChange}>
                          <option value="Minggu">Minggu</option>
                          <option value="Bulan">Bulan</option>
                          <option value="Tahun">Tahun</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
              <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Deskripsi Pekerjaan</h2>
              <div className="mb-5">
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={formData.description} 
                  onChange={(val) => setFormData({...formData, description: val})} 
                  placeholder="Jelaskan peran ini secara umum..." 
                  className="bg-white"
                />
              </div>

              <div className="mb-5">
                <label className="field-label">Persyaratan</label>
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={formData.requirements} 
                  onChange={(val) => setFormData({...formData, requirements: val})} 
                  placeholder="Persyaratan utama untuk posisi ini..." 
                  className="bg-white"
                />
              </div>

              <div className="mb-5">
                <label className="field-label">Tanggung Jawab</label>
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={formData.responsibilities} 
                  onChange={(val) => setFormData({...formData, responsibilities: val})} 
                  placeholder="Tanggung jawab sehari-hari..." 
                  className="bg-white"
                />
              </div>
            </div>

            {/* Custom Questions Builder */}
            <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-md font-semibold text-ink-700">Pertanyaan Seleksi Tambahan</h2>
                <button type="button" onClick={() => setCustomQuestions([...customQuestions, { question_text: '', question_type: 'text', is_required: true, options: [] }])} className="text-body-sm text-teal-700 hover:underline font-medium">+ Tambah Pertanyaan</button>
              </div>
              <p className="text-body-sm text-ink-300 mb-4">Kandidat akan menjawab ini saat melamar lowongan ini.</p>

              {customQuestions.map((q, i) => (
                <div key={i} className="border border-canvas-border rounded-md p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <select className="input-field w-auto text-body-sm py-1.5" value={q.question_type} onChange={(e) => {
                      const newQ = [...customQuestions];
                      newQ[i].question_type = e.target.value;
                      setCustomQuestions(newQ);
                    }}>
                      <option value="text">Isian Singkat</option>
                      <option value="textarea">Esai</option>
                      <option value="multiple_choice">Pilihan Ganda</option>
                    </select>
                    <button type="button" onClick={() => setCustomQuestions(customQuestions.filter((_, idx) => idx !== i))} className="text-body-sm text-ink-300 hover:text-coral-600">Hapus</button>
                  </div>
                  <input className="input-field mb-2" value={q.question_text} onChange={(e) => {
                    const newQ = [...customQuestions];
                    newQ[i].question_text = e.target.value;
                    setCustomQuestions(newQ);
                  }} placeholder="Ketik pertanyaan Anda..."/>
                  
                  {q.question_type === 'multiple_choice' && (
                    <div className="mt-3">
                      <label className="text-body-sm font-medium text-ink-500 mb-2 block">Pilihan Jawaban</label>
                      <div className="space-y-2 mb-2">
                        {(q.options || []).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              className="input-field py-1.5 flex-1"
                              value={opt}
                              onChange={(e) => {
                                const newQ = [...customQuestions];
                                newQ[i].options[optIdx] = e.target.value;
                                setCustomQuestions(newQ);
                              }}
                              placeholder={`Opsi ${optIdx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newQ = [...customQuestions];
                                newQ[i].options.splice(optIdx, 1);
                                setCustomQuestions(newQ);
                              }}
                              className="w-8 h-8 flex items-center justify-center text-ink-300 hover:text-coral-600 bg-gray-50 rounded-md border border-canvas-border flex-shrink-0"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newQ = [...customQuestions];
                          if (!newQ[i].options) newQ[i].options = [];
                          newQ[i].options.push('');
                          setCustomQuestions(newQ);
                        }}
                        className="text-body-sm text-teal-700 hover:underline font-medium flex items-center gap-1"
                      >
                        + Tambah Opsi
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {customQuestions.length === 0 && <p className="text-body-sm text-ink-300 italic">Belum ada pertanyaan tambahan.</p>}
            </div>

            {/* Pipeline Builder */}
            <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
              <h2 className="text-heading-md font-semibold text-ink-700 mb-1">Konfigurasi Pipeline</h2>
              <p className="text-body-sm text-ink-300 mb-5">Sesuaikan tahap seleksi tengah untuk lowongan ini. Tahap dengan ikon gembok bersifat tetap.</p>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {pipelineStages.filter(s => s.name !== 'rejected').map((stage, i) => (
                  <React.Fragment key={i}>
                    {stage.type === 'anchor' ? (
                      <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8D97AC" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                        <span className="text-body-sm text-ink-500 capitalize">{stage.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-teal-100 border border-teal-500 rounded-md px-3 py-2 flex-shrink-0">
                        <input className="bg-transparent border-none outline-none text-body-sm text-teal-700 font-medium w-20" value={stage.name} onChange={(e) => {
                          const newS = [...pipelineStages];
                          newS[i].name = e.target.value;
                          setPipelineStages(newS);
                        }}/>
                        <button type="button" onClick={() => setPipelineStages(pipelineStages.filter((_, idx) => idx !== i))} className="text-teal-700 hover:text-coral-600">✕</button>
                      </div>
                    )}
                    
                    {i < pipelineStages.filter(s => s.name !== 'rejected').length - 1 && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8D97AC" strokeWidth="2" className="flex-shrink-0"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    )}
                  </React.Fragment>
                ))}
                
                <button type="button" onClick={() => {
                  const newS = [...pipelineStages];
                  // Insert before hired
                  const hiredIdx = newS.findIndex(s => s.name === 'hired');
                  newS.splice(hiredIdx, 0, { name: 'New Stage', type: 'custom' });
                  setPipelineStages(newS);
                }} className="flex items-center gap-1 text-body-sm text-teal-700 hover:underline font-medium ml-2 flex-shrink-0">+ Tahap</button>
              </div>
              <p className="text-body-sm text-ink-300 mt-4">Tahap <strong>Rejected</strong> & <strong>Withdrawn</strong> selalu tersedia otomatis di setiap lowongan.</p>
            </div>

            {/* Aksi */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <button onClick={() => handleSave(false)} disabled={saving} className="text-ink-700 border border-canvas-border hover:bg-gray-50 font-medium text-body-md px-5 py-2.5 rounded-md disabled:opacity-50">
                Simpan sebagai Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-6 py-2.5 rounded-md transition-colors disabled:opacity-50">
                Publish Lowongan
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default JobForm;
