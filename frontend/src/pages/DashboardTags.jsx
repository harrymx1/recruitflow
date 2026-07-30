import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import HRLayout from '../components/HRLayout';

const PRESET_COLORS = [
  '#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444',
  '#10b981', '#f97316', '#ec4899', '#6366f1', '#64748b'
];

const DashboardTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#0d9488');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard/tags');
      setTags(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setSaving(true);
    setError('');
    try {
      await api.post('/dashboard/tags', { name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      fetchTags();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat tag');
    } finally {
      setSaving(false);
    }
  };

  return (
    <HRLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-lg font-semibold text-ink-700">Kelola Tag Kandidat</h1>
          <p className="text-body-sm text-ink-400 mt-1">
            Tag digunakan untuk mengelompokkan atau menandai kandidat di perusahaan Anda.
          </p>
        </div>
      </div>

      {/* Create Tag Form */}
      <div className="bg-white p-6 rounded-lg border border-canvas-border mb-6">
        <h2 className="font-semibold text-ink-700 mb-4">Buat Tag Baru</h2>
        <form onSubmit={handleCreateTag} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-body-sm font-medium text-ink-600 block mb-1">Nama Tag *</label>
            <input
              type="text"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="cth: Top Talent, Promising, On Hold..."
              maxLength={50}
              className="w-full px-3 py-2 border border-canvas-border rounded text-body-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-body-sm font-medium text-ink-600 block mb-1">Warna</label>
            <div className="flex gap-2 items-center">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTagColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${newTagColor === color ? 'ring-2 ring-offset-2 ring-ink-700 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={saving || !newTagName.trim()}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded font-medium text-body-md transition-colors"
            >
              {saving ? 'Menyimpan...' : '+ Tambah Tag'}
            </button>
          </div>
        </form>
        {error && <p className="text-coral-600 text-body-sm mt-2">{error}</p>}

        {/* Preview */}
        {newTagName && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-body-sm text-ink-400">Preview:</span>
            <span
              style={{ backgroundColor: newTagColor + '22', color: newTagColor, borderColor: newTagColor + '44' }}
              className="text-xs px-2.5 py-1 rounded-full border font-medium"
            >
              {newTagName}
            </span>
          </div>
        )}
      </div>

      {/* Tag List */}
      <div className="bg-white p-6 rounded-lg border border-canvas-border">
        <h2 className="font-semibold text-ink-700 mb-4">Daftar Tag ({tags.length})</h2>
        {loading ? (
          <p className="text-ink-300 text-center py-8">Memuat...</p>
        ) : tags.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🏷️</div>
            <p className="text-ink-400">Belum ada tag. Buat tag pertama Anda di atas!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <div
                key={tag.id}
                style={{ backgroundColor: tag.color + '15', borderColor: tag.color + '44' }}
                className="flex items-center gap-2 px-3 py-2 rounded-full border"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-sm font-medium" style={{ color: tag.color }}>
                  {tag.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </HRLayout>
  );
};

export default DashboardTags;
