import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';

const CandidateApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id, token]);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/candidate/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApp(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      await axios.post(`http://localhost:5000/api/candidate/applications/${id}/withdraw`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowWithdrawModal(false);
      fetchDetail(); // Refresh data
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menarik lamaran');
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active': return { label: 'Dalam Peninjauan', colorClass: 'bg-teal-100 text-teal-700', bgClass: 'bg-teal-100', textClass: 'text-teal-700', step: 2 };
      case 'hired': return { label: 'Diterima', colorClass: 'bg-moss-100 text-moss-700', bgClass: 'bg-moss-100', textClass: 'text-moss-700', step: 5 };
      case 'rejected': return { label: 'Tidak Lolos', colorClass: 'bg-coral-100 text-coral-700', bgClass: 'bg-gray-100', textClass: 'text-ink-500', step: -1 };
      case 'withdrawn': return { label: 'Ditarik', colorClass: 'bg-gray-100 text-ink-500', bgClass: 'bg-gray-100', textClass: 'text-ink-500', step: -1 };
      default: return { label: 'Status Tidak Diketahui', colorClass: 'bg-gray-100 text-ink-500', bgClass: 'bg-gray-100', textClass: 'text-ink-500', step: 1 };
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-pulse-node rounded-full h-8 w-8 bg-teal-500"></div>
    </div>
  );

  if (!app) return (
    <div className="text-center py-12 bg-white rounded-lg border border-canvas-border border-dashed">
      <p className="text-body-md text-ink-500 mb-4">Lamaran tidak ditemukan.</p>
      <Link to="/candidate/dashboard" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold text-body-md px-4 py-2 rounded-md transition-colors">Kembali ke Dashboard</Link>
    </div>
  );

  const statusInfo = getStatusInfo(app.status);

  // Helper for rendering Stage Rail
  const renderStageRail = () => {
    if (app.status === 'rejected' || app.status === 'withdrawn') {
      return (
        <div className="mt-6 pt-6 border-t border-canvas-border text-center">
          <p className="text-body-md text-ink-500">
            Lamaran ini {app.status === 'rejected' ? 'tidak dilanjutkan ke tahap berikutnya' : 'telah ditarik'}.
          </p>
        </div>
      );
    }

    const currentStep = statusInfo.step;
    
    // Note: This matches the SVG from application-detail.html exactly, but made dynamic
    // Step 1: Applied (x=20)
    // Step 2: Screening (x=120)
    // Step 3: Interview (x=220)
    // Step 4: Offer (x=320)
    // Step 5: Hired (x=420)
    const getStroke = (lineIdx) => lineIdx < currentStep ? "#1F6F78" : "#DDE1EA";
    
    return (
      <div className="mt-6 pt-6 border-t border-canvas-border overflow-x-auto">
        <svg width="440" height="50" viewBox="0 0 440 50" fill="none" className="min-w-[440px]">
          <line x1="20" y1="25" x2="120" y2="25" stroke={getStroke(1)} strokeWidth="3"/>
          <line x1="120" y1="25" x2="220" y2="25" stroke={getStroke(2)} strokeWidth="3"/>
          <line x1="220" y1="25" x2="320" y2="25" stroke={getStroke(3)} strokeWidth="3"/>
          <line x1="320" y1="25" x2="420" y2="25" stroke={getStroke(4)} strokeWidth="3"/>
          
          {/* Node 1: Applied */}
          <circle cx="20" cy="25" r={currentStep === 1 ? "9" : "8"} fill={currentStep >= 1 ? "#1F6F78" : "none"} stroke={currentStep < 1 ? "#8D97AC" : "none"} strokeWidth="2" className={currentStep === 1 ? "origin-center animate-pulse-node" : ""}/>
          
          {/* Node 2: Screening */}
          <circle cx="120" cy="25" r={currentStep === 2 ? "9" : "8"} fill={currentStep >= 2 ? (currentStep === 2 ? "#E8A23D" : "#1F6F78") : "none"} stroke={currentStep < 2 ? "#8D97AC" : "none"} strokeWidth="2" className={currentStep === 2 ? "origin-center animate-pulse-node" : ""}/>
          
          {/* Node 3: Interview */}
          <circle cx="220" cy="25" r={currentStep === 3 ? "9" : "8"} fill={currentStep >= 3 ? (currentStep === 3 ? "#E8A23D" : "#1F6F78") : "none"} stroke={currentStep < 3 ? "#8D97AC" : "none"} strokeWidth="2" className={currentStep === 3 ? "origin-center animate-pulse-node" : ""}/>
          
          {/* Node 4: Offer */}
          <circle cx="320" cy="25" r={currentStep === 4 ? "9" : "8"} fill={currentStep >= 4 ? (currentStep === 4 ? "#E8A23D" : "#1F6F78") : "none"} stroke={currentStep < 4 ? "#8D97AC" : "none"} strokeWidth="2" className={currentStep === 4 ? "origin-center animate-pulse-node" : ""}/>
          
          {/* Node 5: Hired */}
          <circle cx="420" cy="25" r={currentStep === 5 ? "9" : "8"} fill={currentStep >= 5 ? (currentStep === 5 ? "#3F7D5C" : "#1F6F78") : "none"} stroke={currentStep < 5 ? "#8D97AC" : "none"} strokeWidth="2" className={currentStep === 5 ? "origin-center animate-pulse-node" : ""}/>
          
          <text x="6" y="45" fontFamily="Poppins" fontSize="11" fill={currentStep === 1 ? "#A66A1E" : "#8D97AC"} fontWeight={currentStep === 1 ? "600" : "400"}>Applied</text>
          <text x="95" y="45" fontFamily="Poppins" fontSize="11" fill={currentStep === 2 ? "#A66A1E" : (currentStep > 2 ? "#16233F" : "#8D97AC")} fontWeight={currentStep === 2 ? "600" : "400"}>Screening</text>
          <text x="192" y="45" fontFamily="Poppins" fontSize="11" fill={currentStep === 3 ? "#A66A1E" : (currentStep > 3 ? "#16233F" : "#8D97AC")} fontWeight={currentStep === 3 ? "600" : "400"}>Interview</text>
          <text x="303" y="45" fontFamily="Poppins" fontSize="11" fill={currentStep === 4 ? "#A66A1E" : (currentStep > 4 ? "#16233F" : "#8D97AC")} fontWeight={currentStep === 4 ? "600" : "400"}>Offer</text>
          <text x="403" y="45" fontFamily="Poppins" fontSize="11" fill={currentStep === 5 ? "#3F7D5C" : "#8D97AC"} fontWeight={currentStep === 5 ? "600" : "400"}>Hired</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/candidate/dashboard" className="inline-flex items-center gap-1.5 text-body-sm text-ink-500 hover:text-teal-700 mb-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        Kembali ke Dashboard
      </Link>

      <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className={`w-12 h-12 rounded-md ${statusInfo.bgClass} flex items-center justify-center ${statusInfo.textClass} font-semibold text-heading-md flex-shrink-0`}>
              {app.company_logo ? (
                <img src={app.company_logo} alt={app.company_name} className="w-full h-full object-cover rounded-md" />
              ) : getInitials(app.company_name)}
            </div>
            <div>
              <h1 className="text-heading-md font-semibold text-ink-700">{app.job_title}</h1>
              <p className="text-body-md text-ink-500">{app.company_name}</p>
            </div>
          </div>
          <span className={`text-body-sm px-3 py-1 rounded-full ${statusInfo.colorClass} font-medium whitespace-nowrap`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Stage Rail */}
        {renderStageRail()}
      </div>

      {/* Dokumen yang dipakai */}
      <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Dokumen Lamaran Ini</h2>
        <div className="flex items-center gap-3 border border-canvas-border rounded-md p-3 bg-gray-50/50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F6F78" strokeWidth="1.75">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>
          </svg>
          <span className="text-body-md text-ink-700 flex-1">
            {app.resume_url ? (app.resume_url.split('/').pop() || 'Resume Dokumen') : 'CV Tersimpan'}
          </span>
          <span className="text-body-sm text-ink-300 font-mono">Snapshot saat melamar</span>
        </div>
      </div>

      {/* Aksi */}
      {app.status === 'active' && (
        <div className="flex justify-end">
          <button 
            onClick={() => setShowWithdrawModal(true)} 
            className="text-coral-600 hover:bg-coral-100 border border-coral-500 font-medium text-body-md px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Tarik Lamaran
          </button>
        </div>
      )}

      {/* Modal konfirmasi withdraw */}
      <Modal 
        isOpen={showWithdrawModal} 
        onClose={() => setShowWithdrawModal(false)}
        maxWidth="max-w-sm"
      >
        <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Tarik lamaran ini?</h3>
        <p className="text-body-md text-ink-500 mb-6">Setelah ditarik, kamu tidak bisa mengembalikannya lagi. Kamu perlu melamar ulang bila berubah pikiran.</p>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowWithdrawModal(false)} 
            className="flex-1 text-ink-700 border border-canvas-border hover:bg-gray-50 font-medium text-body-md py-2.5 rounded-md transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="flex-1 bg-coral-600 hover:bg-coral-700 text-white font-semibold text-body-md py-2.5 rounded-md transition-colors flex justify-center items-center"
          >
            {withdrawing ? 'Menarik...' : 'Ya, Tarik Lamaran'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateApplicationDetail;
