import React, { useState, useEffect } from 'react';
import HRLayout from '../components/HRLayout';
import api from '../utils/axios';

const DashboardEmailTemplates = () => {
  const [activeTab, setActiveTab] = useState('offer'); // 'offer' | 'reject'
  const [template, setTemplate] = useState({ subject: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplate(activeTab);
  }, [activeTab]);

  const fetchTemplate = async (type) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/dashboard/email-templates/${type}`);
      if (data.data) {
        setTemplate({
          subject: data.data.subject,
          body: data.data.body
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/dashboard/email-templates/${activeTab}`, template);
      alert('Template berhasil disimpan.');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan template.');
    } finally {
      setSaving(false);
    }
  };

  const previewSubject = template.subject
    .replace(/{{candidate_name}}/g, 'Budi Santoso')
    .replace(/{{job_title}}/g, 'Frontend Developer')
    .replace(/{{company_name}}/g, 'PT Tech Indo');

  const previewBody = template.body
    .replace(/{{candidate_name}}/g, 'Budi Santoso')
    .replace(/{{job_title}}/g, 'Frontend Developer')
    .replace(/{{company_name}}/g, 'PT Tech Indo');

  return (
    <HRLayout>
      <div className="mb-6">
        <h1 className="text-heading-lg font-semibold text-ink-700">Template Email</h1>
        <p className="text-body-md text-ink-500">Kelola template email otomatis untuk Offer (Hired) dan Reject.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-canvas-border mb-6">
        <button
          onClick={() => setActiveTab('offer')}
          className={`pb-3 text-body-md font-semibold transition-colors ${activeTab === 'offer' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
        >
          Template Offer (Hired)
        </button>
        <button
          onClick={() => setActiveTab('reject')}
          className={`pb-3 text-body-md font-semibold transition-colors ${activeTab === 'reject' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
        >
          Template Reject
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white p-5 rounded-lg border border-canvas-border">
          <h3 className="font-semibold text-ink-700 mb-4 pb-2 border-b border-canvas-border">Editor</h3>
          
          {loading ? (
            <p className="text-body-sm text-ink-400">Memuat...</p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="text-body-sm font-medium text-ink-700 block mb-1">Subject Email</label>
                <input
                  type="text"
                  required
                  value={template.subject}
                  onChange={e => setTemplate({ ...template, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="text-body-sm font-medium text-ink-700 block mb-1">Isi Email</label>
                <textarea
                  required
                  rows="12"
                  value={template.body}
                  onChange={e => setTemplate({ ...template, body: e.target.value })}
                  className="w-full px-3 py-2 border border-canvas-border rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                />
              </div>

              <div className="bg-teal-50 p-3 rounded-md border border-teal-100 mb-4">
                <p className="text-body-sm font-medium text-teal-700 mb-1">Variabel Tersedia:</p>
                <ul className="list-disc list-inside text-body-sm text-teal-700 space-y-0.5 font-mono">
                  <li>{'{{'}candidate_name{'}}'}</li>
                  <li>{'{{'}job_title{'}}'}</li>
                  <li>{'{{'}company_name{'}}'}</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-body-sm px-5 py-2 rounded font-medium transition-colors"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Template'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gray-50 p-5 rounded-lg border border-canvas-border">
          <h3 className="font-semibold text-ink-700 mb-4 pb-2 border-b border-canvas-border">Preview (Contoh)</h3>
          
          <div className="bg-white border border-canvas-border rounded p-4 mb-4">
            <p className="text-body-sm text-ink-500 mb-1 border-b border-canvas-border pb-2">
              <span className="font-semibold text-ink-700">Subject:</span> {previewSubject || '-'}
            </p>
            <p className="text-body-sm text-ink-700 whitespace-pre-wrap mt-3 font-serif">
              {previewBody || '-'}
            </p>
          </div>
        </div>
      </div>
    </HRLayout>
  );
};

export default DashboardEmailTemplates;
