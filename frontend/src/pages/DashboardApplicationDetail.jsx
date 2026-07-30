import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';
import HRLayout from '../components/HRLayout';
import Modal from '../components/ui/Modal';

const statusColors = {
  active: 'bg-teal-100 text-teal-700',
  hired: 'bg-moss-100 text-moss-700',
  rejected: 'bg-coral-100 text-coral-700',
  withdrawn: 'bg-gray-200 text-gray-700',
};

const DashboardApplicationDetail = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    title: 'Interview Awal',
    scheduled_at: '',
    duration_minutes: 60,
    meeting_link: '',
    location: '',
    notes: ''
  });
  const [submittingInterview, setSubmittingInterview] = useState(false);

  // E12 Notes & Scores
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'notes'
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [scoreData, setScoreData] = useState({ scores: [], average_score: null });
  const [userScore, setUserScore] = useState(0); // 1-5

  // E10 Decision
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionForm, setDecisionForm] = useState({ status: 'hired', sendEmail: true, emailSubject: '', emailBody: '' });
  const [decisionLoading, setDecisionLoading] = useState(false);

  // E15 Activity Log
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    fetchDetail();
    fetchTags();
    fetchNotes();
    fetchScores();
    fetchActivityLogs();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/dashboard/candidates/${id}`);
      setApp(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await api.get('/dashboard/tags');
      setAllTags(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTag = async (tagId) => {
    try {
      await api.post(`/dashboard/tags/applications/${id}`, { tagId });
      fetchDetail();
      setShowTagMenu(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await api.delete(`/dashboard/tags/applications/${id}/${tagId}`);
      fetchDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setSubmittingInterview(true);
    try {
      await api.post(`/dashboard/interviews/applications/${id}`, interviewForm);
      fetchDetail();
      setShowInterviewForm(false);
      setInterviewForm({ title: 'Interview Awal', scheduled_at: '', duration_minutes: 60, meeting_link: '', location: '', notes: '' });
    } catch (err) {
      alert('Gagal menjadwalkan wawancara.');
      console.error(err);
    } finally {
      setSubmittingInterview(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/dashboard/candidates/${id}/notes`);
      setNotes(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchScores = async () => {
    try {
      const { data } = await api.get(`/dashboard/candidates/${id}/scores`);
      setScoreData(data.data || { scores: [], average_score: null });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data } = await api.get(`/dashboard/applications/${id}/activity-log`);
      setActivityLogs(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      await api.post(`/dashboard/candidates/${id}/notes`, { note_text: newNote });
      setNewNote('');
      fetchNotes();
    } catch (err) {
      alert('Gagal menambah catatan.');
      console.error(err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleUpsertScore = async (score) => {
    setUserScore(score);
    try {
      await api.post(`/dashboard/candidates/${id}/scores`, { score });
      fetchScores();
    } catch (err) {
      alert('Gagal menyimpan skor.');
      console.error(err);
    }
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    setDecisionLoading(true);
    try {
      await api.patch(`/dashboard/candidates/${id}/decision`, decisionForm);
      setShowDecisionModal(false);
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan keputusan.');
    } finally {
      setDecisionLoading(false);
    }
  };

  const fetchTemplateForDecision = async (type) => {
    try {
      const { data } = await api.get(`/dashboard/email-templates/${type}`);
      const t = data.data;
      if (t) {
        let subject = t.subject.replace(/{{candidate_name}}/g, `${app.first_name} ${app.last_name}`)
                               .replace(/{{job_title}}/g, app.job_title);
        let body = t.body.replace(/{{candidate_name}}/g, `${app.first_name} ${app.last_name}`)
                         .replace(/{{job_title}}/g, app.job_title);
        setDecisionForm(prev => ({ ...prev, emailSubject: subject, emailBody: body }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDecisionModal = (status) => {
    setDecisionForm(prev => ({ ...prev, status, sendEmail: true }));
    fetchTemplateForDecision(status === 'hired' ? 'offer' : 'reject');
    setShowDecisionModal(true);
  };

  if (loading) return <HRLayout><div className="text-center py-16 text-ink-300">Memuat...</div></HRLayout>;
  if (!app) return <HRLayout><div className="text-center py-16 text-ink-300">Aplikasi tidak ditemukan.</div></HRLayout>;

  const currentTags = app.tags || [];
  const availableTags = allTags.filter(t => !currentTags.some(ct => ct.id === t.id));

  return (
    <HRLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm text-ink-400 mb-4">
        <Link to="/dashboard/candidates" className="hover:text-teal-700">Kandidat</Link>
        <span>/</span>
        <span className="text-ink-600">{app.first_name} {app.last_name}</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-canvas-border mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-2xl flex-shrink-0">
              {app.first_name?.charAt(0) || '?'}
            </div>
            <div>
              <h1 className="text-heading-md font-bold text-ink-700 flex items-center gap-2">
                {app.first_name} {app.last_name}
                {app.subscription_tier === 'premium' && (
                  <span className="text-xs uppercase font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-sm">Premium</span>
                )}
              </h1>
              <p className="text-body-md text-ink-400">{app.email}</p>
              <p className="text-body-sm text-ink-500 mt-1">{app.headline || 'Kandidat'} {app.phone && `• ${app.phone}`}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2 mb-2">
              <button 
                onClick={() => handleOpenDecisionModal('hired')}
                disabled={app.status === 'withdrawn'}
                className="bg-moss-600 hover:bg-moss-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
              >
                ✓ Hired
              </button>
              <button 
                onClick={() => handleOpenDecisionModal('rejected')}
                disabled={app.status === 'withdrawn'}
                className="bg-coral-600 hover:bg-coral-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
              >
                ✗ Rejected
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-body-sm px-3 py-1 rounded-full font-semibold ${statusColors[app.status] || 'bg-gray-100'}`}>
                {app.status?.toUpperCase()}
              </span>
            </div>
            <p className="text-body-sm text-ink-400">Melamar: {new Date(app.applied_at).toLocaleDateString('id-ID')}</p>
            <p className="text-body-sm font-medium text-teal-700">📌 Tahap: {app.stage_name || '—'}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex items-center flex-wrap gap-2">
          {currentTags.map(tag => (
            <span
              key={tag.id}
              style={{ backgroundColor: tag.color + '22', color: tag.color, borderColor: tag.color + '44' }}
              className="text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1"
            >
              {tag.name}
              <button onClick={() => handleRemoveTag(tag.id)} className="ml-0.5 hover:opacity-60 font-bold">×</button>
            </span>
          ))}
          <div className="relative">
            <button
              onClick={() => setShowTagMenu(!showTagMenu)}
              className="text-xs px-2 py-0.5 rounded-full border border-dashed border-canvas-border text-ink-400 hover:border-teal-500 hover:text-teal-700 transition-colors"
            >
              + Tambah Tag
            </button>
            {showTagMenu && (
              <div className="absolute top-7 left-0 z-10 bg-white border border-canvas-border rounded-lg shadow-md p-2 min-w-[180px]">
                {availableTags.length === 0 ? (
                  <p className="text-xs text-ink-400 p-2">Tidak ada tag tersedia</p>
                ) : availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAssignTag(tag.id)}
                    className="block w-full text-left text-body-sm px-3 py-1.5 hover:bg-gray-50 rounded"
                  >
                    {tag.name}
                  </button>
                ))}
                <div className="border-t border-canvas-border mt-1 pt-1">
                  <Link to="/dashboard/tags" className="block text-center text-xs text-teal-600 hover:underline p-1">
                    Kelola Tag
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-canvas-border mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-body-md font-semibold transition-colors ${activeTab === 'details' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
        >
          Detail & Wawancara
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 text-body-md font-semibold transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
        >
          Catatan & Penilaian
          {notes.length > 0 && (
            <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full">{notes.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 text-body-md font-semibold transition-colors flex items-center gap-2 ${activeTab === 'activity' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
        >
          Log Aktivitas
          {activityLogs.length > 0 && (
            <span className="bg-canvas border border-canvas-border text-ink-500 text-[10px] px-2 py-0.5 rounded-full">{activityLogs.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Col */}
        <div className="lg:col-span-1 space-y-5">
          {/* Cover Letter */}
          <div className="bg-white p-5 rounded-lg border border-canvas-border">
            <h3 className="font-semibold text-ink-700 mb-3 pb-2 border-b border-canvas-border">Cover Letter</h3>
            {app.cover_letter ? (
              <p className="text-body-sm text-ink-600 whitespace-pre-wrap">{app.cover_letter}</p>
            ) : (
              <p className="text-body-sm text-ink-300 italic">Tidak ada cover letter.</p>
            )}
          </div>

          {/* Resume */}
          {app.resume_url && (
            <div className="bg-white p-5 rounded-lg border border-canvas-border">
              <h3 className="font-semibold text-ink-700 mb-3 pb-2 border-b border-canvas-border">Resume</h3>
              <a
                href={`http://localhost:5000${app.resume_url}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 border border-canvas-border rounded hover:bg-gray-50"
              >
                <span className="text-body-sm text-teal-700 font-medium">Lihat Resume (PDF)</span>
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Custom Answers */}
          {app.answers && app.answers.length > 0 && (
            <div className="bg-white p-5 rounded-lg border border-canvas-border">
              <h3 className="font-semibold text-ink-700 mb-3 pb-2 border-b border-canvas-border">Jawaban Kustom</h3>
              <div className="space-y-3">
                {app.answers.map((ans, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded border border-canvas-border">
                    <p className="text-body-sm font-medium text-ink-700 mb-1">Q: {ans.question_text}</p>
                    <p className="text-body-sm text-ink-500">A: {ans.answer_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Interviews */}
          <div className="bg-white p-5 rounded-lg border border-canvas-border">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-canvas-border">
              <h3 className="font-semibold text-ink-700">Wawancara</h3>
              <button
                onClick={() => setShowInterviewForm(!showInterviewForm)}
                className="text-body-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                + Jadwalkan
              </button>
            </div>

            {showInterviewForm && (
              <form onSubmit={handleScheduleInterview} className="bg-gray-50 p-4 rounded-lg border border-canvas-border mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-body-sm font-medium text-ink-600 block mb-1">Judul Wawancara *</label>
                    <input
                      type="text"
                      required
                      value={interviewForm.title}
                      onChange={e => setInterviewForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-body-sm font-medium text-ink-600 block mb-1">Waktu *</label>
                    <input
                      type="datetime-local"
                      required
                      value={interviewForm.scheduled_at}
                      onChange={e => setInterviewForm(f => ({ ...f, scheduled_at: e.target.value }))}
                      className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-body-sm font-medium text-ink-600 block mb-1">Durasi (menit)</label>
                    <input
                      type="number"
                      value={interviewForm.duration_minutes}
                      onChange={e => setInterviewForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-body-sm font-medium text-ink-600 block mb-1">Link Meeting</label>
                    <input
                      type="url"
                      value={interviewForm.meeting_link}
                      onChange={e => setInterviewForm(f => ({ ...f, meeting_link: e.target.value }))}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-body-sm font-medium text-ink-600 block mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={interviewForm.location}
                    onChange={e => setInterviewForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Kantor / Online"
                    className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-body-sm font-medium text-ink-600 block mb-1">Catatan</label>
                  <textarea
                    value={interviewForm.notes}
                    onChange={e => setInterviewForm(f => ({ ...f, notes: e.target.value }))}
                    rows="2"
                    className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowInterviewForm(false)} className="text-body-sm px-3 py-1.5 border border-canvas-border rounded text-ink-600 hover:bg-gray-100">Batal</button>
                  <button type="submit" disabled={submittingInterview} className="text-body-sm px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition-colors">
                    {submittingInterview ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}

            {(app.interviews || []).length === 0 ? (
              <p className="text-body-sm text-ink-300 text-center py-4">Belum ada wawancara yang dijadwalkan.</p>
            ) : (
              <div className="space-y-3">
                {app.interviews.map(iv => (
                  <div key={iv.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-canvas-border">
                    <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">{new Date(iv.scheduled_at).getDate()}</span>
                      <span className="text-[10px]">{new Date(iv.scheduled_at).toLocaleDateString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-body-md text-ink-700">{iv.title}</p>
                      <p className="text-body-sm text-ink-500">
                        {new Date(iv.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        {' '} • {iv.duration_minutes} menit
                        {iv.location && ` • ${iv.location}`}
                      </p>
                      {iv.meeting_link && (
                        <a href={iv.meeting_link} target="_blank" rel="noreferrer" className="text-xs text-teal-600 hover:underline">
                          🔗 {iv.meeting_link}
                        </a>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${iv.status === 'scheduled' ? 'bg-teal-100 text-teal-700' : iv.status === 'completed' ? 'bg-moss-100 text-moss-700' : 'bg-gray-100 text-ink-500'}`}>
                      {iv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Candidate Profile Summary */}
          {app.experiences && app.experiences.length > 0 && (
            <div className="bg-white p-5 rounded-lg border border-canvas-border">
              <h3 className="font-semibold text-ink-700 mb-3 pb-2 border-b border-canvas-border">Pengalaman Kerja</h3>
              <div className="space-y-3">
                {app.experiences.map((exp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold text-ink-500">
                      {exp.company_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-medium text-body-md text-ink-700">{exp.title}</p>
                      <p className="text-body-sm text-ink-500">{exp.company_name}</p>
                      <p className="text-xs text-ink-400">
                        {exp.start_date ? new Date(exp.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '?'} —{' '}
                        {exp.is_current ? 'Sekarang' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '?'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {app.skills && app.skills.length > 0 && (
            <div className="bg-white p-5 rounded-lg border border-canvas-border">
              <h3 className="font-semibold text-ink-700 mb-3 pb-2 border-b border-canvas-border">Keahlian</h3>
              <div className="flex flex-wrap gap-2">
                {app.skills.map((s, i) => (
                  <span key={i} className="text-body-sm px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                    {s.skill_name} {s.proficiency_level && <span className="text-xs opacity-70">• {s.proficiency_level}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      ) : (
        /* TAB NOTES & SCORES */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white p-5 rounded-lg border border-canvas-border">
              <h3 className="font-semibold text-ink-700 mb-4 pb-2 border-b border-canvas-border">Catatan HR</h3>
              
              <form onSubmit={handleAddNote} className="mb-6">
                <textarea
                  required
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Tambahkan catatan tentang kandidat ini..."
                  rows="3"
                  className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2"
                />
                <div className="flex justify-end">
                  <button type="submit" disabled={submittingNote} className="bg-teal-600 hover:bg-teal-700 text-white text-body-sm px-4 py-1.5 rounded font-medium">
                    {submittingNote ? 'Menyimpan...' : 'Tambah Catatan'}
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-body-sm text-ink-300 text-center py-4">Belum ada catatan.</p>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded border border-canvas-border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-body-sm font-bold text-ink-700">{note.first_name} {note.last_name}</p>
                          <p className="text-xs text-ink-400">{note.role}</p>
                        </div>
                        <span className="text-xs text-ink-400">
                          {new Date(note.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-body-sm text-ink-600 whitespace-pre-wrap">{note.note_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white p-5 rounded-lg border border-canvas-border">
              <h3 className="font-semibold text-ink-700 mb-4 pb-2 border-b border-canvas-border">Penilaian (Skor)</h3>
              
              <div className="text-center mb-6">
                <p className="text-body-sm text-ink-500 mb-1">Rata-rata Skor</p>
                <div className="text-4xl font-bold text-teal-700">
                  {scoreData.average_score || '-'} <span className="text-lg text-ink-400">/ 5</span>
                </div>
                <p className="text-xs text-ink-400 mt-1">{scoreData.scores.length} penilaian</p>
              </div>

              <div className="mb-4">
                <p className="text-body-sm font-medium text-ink-700 mb-2">Skor Anda:</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(num => (
                    <button
                      key={num}
                      type="button"
                      disabled={savingScore}
                      onClick={() => handleUpsertScore(num)}
                      className={`text-2xl transition-colors ${userScore >= num ? 'text-amber-500' : 'text-ink-300 hover:text-amber-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {scoreData.scores.length > 0 && (
                <div className="mt-6 pt-4 border-t border-canvas-border">
                  <p className="text-xs font-semibold text-ink-500 mb-3">Rincian Penilaian:</p>
                  <div className="space-y-2">
                    {scoreData.scores.map(s => (
                      <div key={s.id} className="flex justify-between items-center">
                        <span className="text-xs text-ink-600">{s.first_name} {s.last_name}</span>
                        <span className="text-xs font-bold text-amber-500">
                          {'★'.repeat(s.score)}{'☆'.repeat(5-s.score)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-canvas-border shadow-xs p-6 mb-8">
          <h2 className="text-heading-sm font-semibold text-ink-700 mb-6">Riwayat Aktivitas</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-canvas-border before:to-transparent">
            {activityLogs.length === 0 ? (
              <p className="text-body-sm text-ink-400 italic text-center py-4">Belum ada riwayat aktivitas dicatat.</p>
            ) : (
              activityLogs.map((log, index) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-canvas text-ink-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-canvas-border bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-body-sm text-ink-700">{log.action_type}</span>
                      <time className="text-[11px] font-medium text-ink-400 bg-canvas px-2 py-0.5 rounded-full">{new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                    </div>
                    <div className="text-body-sm text-ink-500 mb-2">{log.description}</div>
                    <div className="text-[11px] text-ink-400 font-medium border-t border-canvas-border pt-2">
                      Oleh: <span className="text-ink-600">{log.actor_name}</span> ({log.actor_type})
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Decision Modal */}
      <Modal 
        isOpen={showDecisionModal} 
        onClose={() => setShowDecisionModal(false)}
        title={`Konfirmasi: ${decisionForm.status === 'hired' ? 'Hired' : 'Rejected'}`}
        maxWidth="max-w-xl"
      >
        <p className="text-body-sm text-ink-500 mb-6">
          Anda akan mengubah status <span className="font-bold">{app.first_name} {app.last_name}</span> menjadi <span className="font-bold capitalize">{decisionForm.status}</span>.
        </p>

        <form onSubmit={handleDecision}>
          <div className="mb-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="sendEmail" 
              checked={decisionForm.sendEmail}
              onChange={e => setDecisionForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
            />
            <label htmlFor="sendEmail" className="text-body-sm font-medium text-ink-700">Kirim Email Otomatis</label>
          </div>

          {decisionForm.sendEmail && (
            <div className="bg-gray-50 p-4 rounded border border-canvas-border mb-6">
              <div className="mb-3">
                <label className="text-xs font-semibold text-ink-500 block mb-1">Subject</label>
                <input 
                  type="text"
                  required
                  value={decisionForm.emailSubject}
                  onChange={e => setDecisionForm(prev => ({ ...prev, emailSubject: e.target.value }))}
                  className="w-full px-3 py-1.5 text-body-sm border border-canvas-border rounded"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-500 block mb-1">Body</label>
                <textarea 
                  required
                  value={decisionForm.emailBody}
                  onChange={e => setDecisionForm(prev => ({ ...prev, emailBody: e.target.value }))}
                  rows="6"
                  className="w-full px-3 py-1.5 text-body-sm border border-canvas-border rounded"
                />
              </div>
              <p className="text-[10px] text-ink-400 mt-2">Variabel yang tersedia: {'{{candidate_name}}'}, {'{{job_title}}'}, {'{{company_name}}'}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-canvas-border">
            <button type="button" onClick={() => setShowDecisionModal(false)} className="px-4 py-2 text-body-sm text-ink-600 hover:bg-gray-100 rounded">
              Batal
            </button>
            <button type="submit" disabled={decisionLoading} className={`px-4 py-2 text-body-sm text-white rounded font-medium ${decisionForm.status === 'hired' ? 'bg-moss-600 hover:bg-moss-700' : 'bg-coral-600 hover:bg-coral-700'}`}>
              {decisionLoading ? 'Memproses...' : 'Konfirmasi & Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </HRLayout>
  );
};

export default DashboardApplicationDetail;
