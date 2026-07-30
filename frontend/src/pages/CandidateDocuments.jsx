import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';

const CandidateDocuments = () => {
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [file, setFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/candidate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !newLabel) return alert('Pilih file dan berikan label.');

    setUploading(true);
    try {
      // 1. Upload file to server
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await axios.post('http://localhost:5000/api/uploads/document', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      const fileUrl = uploadRes.data.url;

      // 2. Save document record to profile
      await axios.post('http://localhost:5000/api/candidate/profile/documents', {
        label: newLabel,
        file_url: fileUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Dokumen berhasil diunggah');
      setNewLabel('');
      setFile(null);
      setShowUploadModal(false);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah dokumen');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = async (id) => {
    if (!window.confirm('Hapus dokumen ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/candidate/profile/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(documents.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus dokumen');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-heading-lg font-semibold text-ink-700">Dokumen Saya</h1>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-sm px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            + Unggah Dokumen
          </button>
        </div>
        <p className="text-body-md text-ink-500 mb-6">Kelola koleksi CV & dokumen pendukung. Pilih salah satu saat melamar, atau unggah dokumen khusus per lamaran.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse-node rounded-full h-8 w-8 bg-teal-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-canvas-border border-dashed text-center">
          <h3 className="text-heading-md font-medium text-ink-700">Belum ada dokumen</h3>
          <p className="mt-2 text-body-md text-ink-500 mb-6">Anda belum mengunggah dokumen apapun.</p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold text-body-md px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            Mulai Unggah
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white border border-canvas-border rounded-lg p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-sm transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1F6F78" strokeWidth="1.75" className="flex-shrink-0">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-body-md font-medium text-ink-700 truncate">{doc.label}</p>
                <p className="text-body-sm text-ink-300 font-mono truncate">Diunggah {new Date(doc.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
              </div>
              <button onClick={() => window.open(doc.file_url, '_blank')} className="text-body-sm text-teal-700 hover:underline px-2 py-1">Lihat</button>
              <button onClick={() => removeDocument(doc.id)} className="text-body-sm text-coral-600 hover:underline px-2 py-1">Hapus</button>
            </div>
          ))}
        </div>
      )}

      {/* Peringatan hapus dokumen yang sedang dipakai (Visual only based on design) */}
      {documents.length > 0 && (
        <div className="mt-6 flex items-start gap-3 bg-amber-100 border border-amber-300 rounded-md p-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A66A1E" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <div className="text-body-sm text-amber-900">
            <strong>Catatan:</strong> Menghapus dokumen yang sedang dipakai untuk melamar tidak akan merusak lamaran tersebut. Perusahaan akan tetap bisa melihat snapshot dokumen yang kamu kirim saat melamar.
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        title="Unggah Dokumen Baru"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-ink-700 mb-1">Label Dokumen</label>
            <input 
              type="text" 
              className="w-full border border-canvas-border rounded-lg p-2.5 text-body-sm text-ink-700 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all" 
              value={newLabel} 
              onChange={e => setNewLabel(e.target.value)} 
              required 
              placeholder="mis. CV - Software Engineer" 
            />
          </div>
          
          <div>
            <label className="block text-body-sm font-medium text-ink-700 mb-1">File (PDF)</label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              className="block w-full text-body-sm text-ink-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-teal-50 file:text-teal-700
                hover:file:bg-teal-100 transition-colors
              "
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-canvas-border mt-6">
            <button 
              type="button"
              onClick={() => setShowUploadModal(false)} 
              className="flex-1 text-ink-700 border border-canvas-border hover:bg-gray-50 font-medium text-body-md py-2.5 rounded-md transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={uploading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-body-md py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengunggah...
                </>
              ) : 'Unggah'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CandidateDocuments;
