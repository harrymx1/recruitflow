import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import HRLayout from '../components/HRLayout';

const DashboardInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [markingDoneId, setMarkingDoneId] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/dashboard/interviews');
      setInterviews(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (interviewId) => {
    if (!window.confirm('Batalkan jadwal wawancara ini?')) return;
    setCancellingId(interviewId);
    try {
      await api.delete(`/dashboard/interviews/${interviewId}`);
      fetchInterviews();
    } catch (err) {
      alert('Gagal membatalkan wawancara.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleMarkDone = async (interviewId) => {
    setMarkingDoneId(interviewId);
    try {
      await api.put(`/dashboard/interviews/${interviewId}`, { status: 'completed' });
      fetchInterviews();
    } catch (err) {
      alert('Gagal memperbarui status.');
    } finally {
      setMarkingDoneId(null);
    }
  };

  const now = new Date();
  const upcoming = interviews.filter(iv => new Date(iv.scheduled_at) >= now && iv.status === 'scheduled');
  const past = interviews.filter(iv => new Date(iv.scheduled_at) < now || iv.status !== 'scheduled');
  const displayed = view === 'upcoming' ? upcoming : past;

  const getStatusBadge = (status) => {
    if (status === 'scheduled') return 'bg-amber-100 text-amber-700';
    if (status === 'completed') return 'bg-moss-100 text-moss-700';
    return 'bg-gray-100 text-ink-500';
  };

  const getStatusLabel = (status) => {
    if (status === 'scheduled') return 'Dijadwalkan';
    if (status === 'completed') return 'Selesai';
    if (status === 'cancelled') return 'Dibatalkan';
    return status;
  };

  return (
    <HRLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-lg font-semibold text-ink-700">Jadwal Wawancara</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('upcoming')}
            className={`text-body-sm px-4 py-2 rounded-md font-medium transition-colors ${view === 'upcoming' ? 'bg-teal-500 text-white' : 'border border-canvas-border text-ink-600 hover:bg-gray-50'}`}
          >
            Akan Datang ({upcoming.length})
          </button>
          <button
            onClick={() => setView('past')}
            className={`text-body-sm px-4 py-2 rounded-md font-medium transition-colors ${view === 'past' ? 'bg-teal-500 text-white' : 'border border-canvas-border text-ink-600 hover:bg-gray-50'}`}
          >
            Selesai/Lalu ({past.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-300 text-body-md">Memuat jadwal...</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-canvas-border border-dashed">
          <svg className="w-12 h-12 mx-auto text-ink-100 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p className="text-body-md font-medium text-ink-500">
            {view === 'upcoming' ? 'Tidak ada wawancara yang akan datang.' : 'Tidak ada riwayat wawancara.'}
          </p>
          <p className="text-body-sm text-ink-300 mt-1">Buka Detail Kandidat untuk menjadwalkan wawancara.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(iv => {
            const dt = new Date(iv.scheduled_at);
            const isPast = dt < now;
            return (
              <div
                key={iv.id}
                className={`bg-white rounded-lg border ${isPast ? 'border-canvas-border opacity-80' : 'border-teal-200'} p-5 flex gap-5 items-start hover:shadow-sm transition-all`}
              >
                {/* Date Block */}
                <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${isPast ? 'bg-gray-100 text-ink-300' : 'bg-teal-50 text-teal-700'}`}>
                  <span className="text-[22px] font-bold leading-none font-mono">{dt.getDate()}</span>
                  <span className="text-[11px] font-medium uppercase mt-0.5">{dt.toLocaleDateString('id-ID', { month: 'short' })}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-body-md font-semibold text-ink-700">{iv.first_name} {iv.last_name}</h3>
                      <p className="text-body-sm text-ink-500 mt-0.5">
                        <Link to={`/dashboard/applications/${iv.application_id}`} className="text-teal-700 hover:underline">{iv.job_title}</Link>
                      </p>
                    </div>
                    <span className={`text-body-sm px-2.5 py-1 rounded-full flex-shrink-0 font-medium ${getStatusBadge(iv.status)}`}>
                      {getStatusLabel(iv.status)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-body-sm text-ink-500">
                    <span className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ({iv.duration_minutes} menit)
                    </span>
                    {iv.location && (
                      <span className="flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {iv.location}
                      </span>
                    )}
                    {iv.meeting_link && (
                      <a
                        href={iv.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:underline font-medium font-mono text-body-sm"
                      >
                        {iv.meeting_link.replace('https://', '')}
                      </a>
                    )}
                  </div>

                  {iv.notes && (
                    <p className="mt-2 text-body-sm text-ink-500 bg-gray-50 px-3 py-2 rounded border border-canvas-border">
                      {iv.notes}
                    </p>
                  )}

                  {/* Action buttons for scheduled interviews */}
                  {iv.status === 'scheduled' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleMarkDone(iv.id)}
                        disabled={markingDoneId === iv.id}
                        className="text-body-sm px-3 py-1.5 bg-moss-100 hover:bg-moss-100/70 text-moss-700 rounded-md font-medium transition-colors"
                      >
                        {markingDoneId === iv.id ? '...' : '✓ Tandai Selesai'}
                      </button>
                      <button
                        onClick={() => handleCancel(iv.id)}
                        disabled={cancellingId === iv.id}
                        className="text-body-sm px-3 py-1.5 bg-coral-100 hover:bg-coral-100/70 text-coral-700 rounded-md font-medium transition-colors"
                      >
                        {cancellingId === iv.id ? '...' : '✕ Batalkan'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </HRLayout>
  );
};

export default DashboardInterviews;
