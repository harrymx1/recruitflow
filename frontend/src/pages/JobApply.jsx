import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const JobApply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Application Data
  const [profile, setProfile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [source, setSource] = useState('Pencarian di RecruitFlow');
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [answers, setAnswers] = useState({});
  const [myDocuments, setMyDocuments] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/candidate/auth');
      return;
    }
    fetchData();
  }, [jobId, user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch Job Details including custom questions
      const jobRes = await axios.get(`http://localhost:5000/api/public/jobs/${jobId}`);
      setJob(jobRes.data.data);
      
      // Initialize answers object
      if (jobRes.data.data.custom_questions) {
        const initAns = {};
        jobRes.data.data.custom_questions.forEach(q => {
          initAns[q.id] = '';
        });
        setAnswers(initAns);
      }

      // Fetch Candidate Documents & Profile
      const profileRes = await axios.get('http://localhost:5000/api/candidate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileRes.data.data);
      
      const docs = profileRes.data.data.documents || [];
      setMyDocuments(docs);
      if (docs.length > 0) {
        setSelectedDocumentUrl(docs[0].file_url);
      }
      
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data pekerjaan.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep === 2 && !selectedDocumentUrl) {
      alert('Harap pilih dokumen CV Anda terlebih dahulu.');
      return;
    }
    
    if (currentStep === 3 && job?.custom_questions) {
      const unanswered = job.custom_questions.filter(q => q.is_required && !answers[q.id]);
      if (unanswered.length > 0) {
        alert('Harap jawab semua pertanyaan yang wajib (bertanda *)');
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDocumentUrl) return;
    
    setSubmitting(true);
    setError('');
    
    // Format answers to array
    const formattedAnswers = Object.keys(answers).map(qId => ({
      question_id: qId,
      answer_text: answers[qId]
    }));

    try {
      const payload = {
        documents: [{ label: 'CV', file_url: selectedDocumentUrl }],
        cover_letter: coverLetter,
        source: source,
        answers: formattedAnswers
      };
      await axios.post(`http://localhost:5000/api/candidate/applications/${jobId}/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Berhasil mengirim lamaran!');
      navigate('/candidate/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal mengirim lamaran.');
      setCurrentStep(1); // go back to show error
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="animate-pulse-node rounded-full h-12 w-12 bg-teal-500"></div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-700">
      <div className="text-center">
        <h2 className="text-heading-lg font-bold text-ink-900 mb-2">Pekerjaan tidak ditemukan</h2>
        <Link to="/cari-lowongan" className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold px-6 py-2.5 rounded-md transition-colors">Kembali ke Beranda</Link>
      </div>
    </div>
  );

  const getSelectedDocLabel = () => {
    const doc = myDocuments.find(d => d.file_url === selectedDocumentUrl);
    return doc ? doc.label : 'Belum dipilih';
  };

  const answeredQuestionsCount = Object.values(answers).filter(val => val.trim() !== '').length;

  return (
    <div className="bg-canvas text-ink-700 font-sans min-h-screen">
      <header className="bg-white border-b border-canvas-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={`/jobs/${job.id}`} className="flex items-center gap-2">
            <svg width="26" height="18" viewBox="0 0 28 20" fill="none">
              <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
              <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
              <circle cx="4" cy="16" r="3.5" fill="#1F6F78"/>
              <circle cx="14" cy="8" r="3.5" fill="#1F6F78"/>
              <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
            </svg>
            <span className="italic font-medium text-[19px] text-ink-700">RecruitFlow</span>
          </Link>
          <Link to={`/jobs/${job.id}`} className="text-body-sm text-ink-500 hover:text-coral-600">Batalkan</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-body-sm text-ink-300">Melamar untuk</p>
          <h1 className="text-heading-lg font-semibold text-ink-700">{job.title} <span className="text-ink-500 font-normal">di {job.company_name}</span></h1>
        </div>

        {error && (
          <div className="bg-coral-100 text-coral-700 p-4 rounded-md mb-6 border border-coral-300 font-medium text-body-sm">
            {error}
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center mb-10 overflow-x-auto pb-4 sm:pb-0">
          {[
            { id: 1, label: 'Profil' },
            { id: 2, label: 'Dokumen' },
            { id: 3, label: 'Pertanyaan' },
            { id: 4, label: 'Sumber Info' },
            { id: 5, label: 'Review' }
          ].map((step, index, arr) => (
            <div key={step.id} className={`flex items-center ${index < arr.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-semibold flex-shrink-0 border 
                ${step.id < currentStep ? 'bg-teal-500 text-white border-teal-500' : 
                  step.id === currentStep ? 'bg-amber-500 text-ink-700 border-amber-500' : 'bg-gray-100 text-ink-300 border-gray-300'}`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span className={`text-body-sm ml-2 hidden sm:inline ${
                step.id < currentStep ? 'text-teal-700 font-medium' :
                step.id === currentStep ? 'text-ink-700 font-medium' : 'text-ink-300'
              }`}>{step.label}</span>
              {index < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 min-w-[20px] ${step.id < currentStep ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-canvas-border rounded-lg p-6 sm:p-8 shadow-sm">

          {/* STEP 1 — Review Profil */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-heading-md font-semibold text-ink-700 mb-1">Review profil kamu</h2>
              <p className="text-body-sm text-ink-300 mb-6">Data ini diambil dari profil kamu. Lamaran akan memakai data terbaru — kamu bisa cepat mengedit di sini bila perlu.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between border border-canvas-border rounded-md p-4 bg-gray-50/50">
                  <div>
                    <p className="text-body-md font-medium text-ink-700">{profile?.name || user?.email}</p>
                    <p className="text-body-sm text-ink-500">{user?.email}</p>
                  </div>
                  <Link to="/candidate/profile" target="_blank" className="text-body-sm text-teal-700 hover:underline flex-shrink-0">Edit</Link>
                </div>
                
                <div className="flex items-center justify-between border border-canvas-border rounded-md p-4 bg-gray-50/50">
                  <div>
                    <p className="text-body-md font-medium text-ink-700">Pengalaman Kerja</p>
                    <p className="text-body-sm text-ink-500">
                      {profile?.experiences && profile.experiences.length > 0 
                        ? `${profile.experiences.length} pengalaman tersimpan` 
                        : 'Belum ada pengalaman'}
                    </p>
                  </div>
                  <Link to="/candidate/profile" target="_blank" className="text-body-sm text-teal-700 hover:underline flex-shrink-0">Edit</Link>
                </div>

                <div className="flex items-center justify-between border border-canvas-border rounded-md p-4 bg-gray-50/50">
                  <div>
                    <p className="text-body-md font-medium text-ink-700">Pendidikan</p>
                    <p className="text-body-sm text-ink-500">
                      {profile?.educations && profile.educations.length > 0 
                        ? `${profile.educations.length} data pendidikan` 
                        : 'Belum ada pendidikan'}
                    </p>
                  </div>
                  <Link to="/candidate/profile" target="_blank" className="text-body-sm text-teal-700 hover:underline flex-shrink-0">Edit</Link>
                </div>

                <div className="flex items-center justify-between border border-canvas-border rounded-md p-4 bg-gray-50/50">
                  <div>
                    <p className="text-body-md font-medium text-ink-700">Keahlian</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {profile?.skills && profile.skills.length > 0 ? (
                        profile.skills.slice(0, 5).map((sk, i) => (
                          <span key={i} className="text-body-sm px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">{sk.name || sk}</span>
                        ))
                      ) : (
                        <span className="text-body-sm text-ink-400">Belum ada keahlian</span>
                      )}
                      {profile?.skills && profile.skills.length > 5 && (
                        <span className="text-body-sm px-2 py-0.5 text-ink-500">+{profile.skills.length - 5} lainnya</span>
                      )}
                    </div>
                  </div>
                  <Link to="/candidate/profile" target="_blank" className="text-body-sm text-teal-700 hover:underline flex-shrink-0">Edit</Link>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Dokumen */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-heading-md font-semibold text-ink-700 mb-1">Pilih dokumen untuk lamaran ini</h2>
              <p className="text-body-sm text-ink-300 mb-6">Pilih dari koleksi CV kamu, atau unggah dokumen baru khusus untuk lowongan ini (tidak akan mengubah CV utama di profil).</p>

              {myDocuments.length === 0 ? (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-md border border-amber-200 mb-6 font-medium text-body-sm">
                  Anda belum mengunggah dokumen apapun. Silakan unggah CV terlebih dahulu di <Link to="/candidate/documents" target="_blank" className="font-bold hover:underline">Dokumen Saya</Link>.
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {myDocuments.map(doc => (
                    <label 
                      key={doc.id} 
                      className={`flex items-center gap-3 border rounded-md p-4 cursor-pointer transition-all ${
                        selectedDocumentUrl === doc.file_url ? 'border-teal-600 bg-teal-50/50' : 'border-canvas-border hover:border-teal-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="doc" 
                        checked={selectedDocumentUrl === doc.file_url} 
                        onChange={() => setSelectedDocumentUrl(doc.file_url)}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500" 
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selectedDocumentUrl === doc.file_url ? "#1F6F78" : "#8D97AC"} strokeWidth="1.75">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>
                      </svg>
                      <div className="flex-1">
                        <p className="text-body-md font-medium text-ink-700">{doc.label}</p>
                        <p className="text-body-sm text-ink-300 font-mono">Diunggah {new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <Link to="/candidate/documents" target="_blank" className="block border-2 border-dashed border-canvas-border rounded-lg p-6 text-center hover:border-teal-500 hover:bg-teal-50/30 transition-colors cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8D97AC" strokeWidth="1.75" className="mx-auto mb-2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="text-body-sm text-ink-500">Kelola dokumen kamu di halaman <span className="text-teal-700 font-medium">Dokumen Saya</span></p>
              </Link>
            </div>
          )}

          {/* STEP 3 — Cover Letter & Custom Questions */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-heading-md font-semibold text-ink-700 mb-1">Surat lamaran & pertanyaan seleksi</h2>
              <p className="text-body-sm text-ink-300 mb-6">Pertanyaan di bawah ditentukan langsung oleh {job.company_name} untuk posisi ini.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-body-sm font-medium text-ink-700 mb-2">Surat Lamaran <span className="text-ink-300 font-normal">(opsional)</span></label>
                  <textarea 
                    rows="4" 
                    className="w-full border border-canvas-border rounded-lg p-3 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" 
                    placeholder="Ceritakan singkat mengapa kamu tertarik dengan posisi ini..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  ></textarea>
                </div>

                {job.custom_questions && job.custom_questions.map((q, idx) => (
                  <div key={q.id}>
                    <label className="block text-body-sm font-medium text-ink-700 mb-2">
                      {q.question_text} {q.is_required && <span className="text-coral-500">*</span>}
                    </label>
                    
                    {q.question_type === 'multiple_choice' && q.options ? (
                      <div className="flex flex-wrap gap-3">
                        {q.options.map((opt, i) => (
                          <label key={i} className={`flex items-center gap-2 border rounded-md px-3 py-2 text-body-sm cursor-pointer transition-colors ${
                            answers[q.id] === opt ? 'border-teal-500 bg-teal-50' : 'border-canvas-border hover:border-teal-400'
                          }`}>
                            <input 
                              type="radio" 
                              name={`q_${q.id}`} 
                              className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                              value={opt}
                              checked={answers[q.id] === opt}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            /> 
                            {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea 
                        rows="3" 
                        className="w-full border border-canvas-border rounded-lg p-3 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" 
                        placeholder="Tulis jawaban Anda..."
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      ></textarea>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Sumber Info */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-heading-md font-semibold text-ink-700 mb-1">Dari mana kamu tahu lowongan ini?</h2>
              <p className="text-body-sm text-ink-300 mb-6">Opsional — membantu kami memahami kanal yang paling efektif.</p>

              <div className="space-y-2.5">
                {['Pencarian di RecruitFlow', 'LinkedIn', 'Referral Karyawan', 'Media Sosial', 'Website Perusahaan', 'Lainnya'].map(src => (
                  <label key={src} className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                    source === src ? 'border-teal-500 bg-teal-50' : 'border-canvas-border hover:border-teal-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="source" 
                      value={src}
                      checked={source === src}
                      onChange={(e) => setSource(e.target.value)}
                      className="text-teal-600 w-4 h-4 focus:ring-teal-500"
                    /> 
                    <span className="text-body-md text-ink-700">{src}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 — Review & Kirim */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-heading-md font-semibold text-ink-700 mb-1">Review sebelum mengirim</h2>
              <p className="text-body-sm text-ink-300 mb-6">Pastikan semua sudah benar. Kamu tidak bisa mengubah jawaban setelah lamaran dikirim.</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                  <span className="text-body-md text-ink-500">Profil</span>
                  <span className="text-body-md text-ink-700 font-medium">{profile?.name || user?.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                  <span className="text-body-md text-ink-500">Dokumen</span>
                  <span className="text-body-md text-ink-700 font-medium">{getSelectedDocLabel()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                  <span className="text-body-md text-ink-500">Pertanyaan seleksi</span>
                  <span className={`text-body-md font-medium ${answeredQuestionsCount > 0 ? 'text-moss-600' : 'text-ink-400'}`}>
                    {answeredQuestionsCount} terjawab
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                  <span className="text-body-md text-ink-500">Sumber info</span>
                  <span className="text-body-md text-ink-700 font-medium">{source}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigasi step */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-canvas-border">
            <button 
              onClick={prevStep} 
              className={`text-body-md px-4 py-2.5 transition-colors ${currentStep === 1 ? 'invisible' : 'text-ink-500 hover:text-ink-700'}`}
            >
              &larr; Sebelumnya
            </button>
            
            {currentStep < 5 ? (
              <button 
                onClick={nextStep} 
                className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-6 py-2.5 rounded-md transition-colors shadow-sm"
              >
                Lanjut &rarr;
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-body-md px-8 py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Kirim Lamaran
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobApply;
