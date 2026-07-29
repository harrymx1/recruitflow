import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

const CompanyProfileEdit = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    industry: '',
    size_range: '51-200',
    founded_year: '',
    website: '',
    description: '',
    socials: { linkedin: '', instagram: '' },
    benefits: [''],
    logo_url: '',
    banner_url: ''
  });

  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ city: '', province: '', country: 'Indonesia', is_headquarters: false });
  const [showLocationForm, setShowLocationForm] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/dashboard/company/locations');
      setLocations(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/dashboard/company/profile');
      const data = res.data.data;
      
      setFormData({
        name: data.name || '',
        tagline: data.tagline || '',
        industry: data.industry || '',
        size_range: data.size_range || '51-200',
        founded_year: data.founded_year || '',
        website: data.website || '',
        description: data.description || '',
        socials: data.socials ? (typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials) : { linkedin: '', instagram: '' },
        benefits: data.benefits ? (typeof data.benefits === 'string' ? JSON.parse(data.benefits) : data.benefits) : [''],
        logo_url: data.logo_url || '',
        banner_url: data.banner_url || ''
      });
    } catch (err) {
      setError('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, socials: { ...prev.socials, [name]: value } }));
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const addBenefit = () => setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  const removeBenefit = (index) => {
    const newBenefits = [...formData.benefits];
    newBenefits.splice(index, 1);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleAddLocation = async () => {
    if (!newLocation.city) return;
    try {
      await api.post('/dashboard/company/locations', newLocation);
      setNewLocation({ city: '', province: '', country: 'Indonesia', is_headquarters: false });
      setShowLocationForm(false);
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveLocation = async (id) => {
    if (!confirm('Yakin ingin menghapus lokasi ini?')) return;
    try {
      await api.delete(`/dashboard/company/locations/${id}`);
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetHQ = async (id) => {
    try {
      await api.patch(`/dashboard/company/locations/${id}/headquarters`);
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put('/dashboard/company/profile', formData);
      setSuccess('Profil berhasil diperbarui!');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

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
          <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md border-l-[3px] text-white bg-[rgba(31,111,120,0.2)] border-amber-500">
            Profil Perusahaan
          </Link>
          <Link to="/dashboard/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md border-l-[3px] border-transparent text-gray-300 hover:text-white">
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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-heading-lg font-semibold text-ink-700">Profil Perusahaan</h1>
            <Link to={`/company/${formData.name.toLowerCase().replace(/ /g, '-')}`} target="_blank" className="text-body-sm border border-teal-500 text-teal-700 hover:bg-teal-100 font-medium px-4 py-2 rounded-md">
              Lihat Preview Publik ↗
            </Link>
          </div>

          <div className="max-w-2xl">
            {error && <div className="mb-4 bg-coral-100 text-coral-700 p-3 rounded-md text-body-sm font-medium">{error}</div>}
            {success && <div className="mb-4 bg-moss-100 text-moss-700 p-3 rounded-md text-body-sm font-medium">{success}</div>}

            {loading ? (
              <p className="text-body-md text-ink-300">Memuat data...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Info Dasar */}
                <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Info Dasar</h2>
                  <div className="space-y-4">
                    <div><label className="field-label">Nama Perusahaan</label><input required className="input-field" name="name" value={formData.name} onChange={handleChange}/></div>
                    <div><label className="field-label">Tagline Singkat</label><input className="input-field" name="tagline" value={formData.tagline} onChange={handleChange}/></div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="field-label">Industri</label><input className="input-field" name="industry" value={formData.industry} onChange={handleChange}/></div>
                      <div><label className="field-label">Jumlah Karyawan</label>
                        <select className="input-field" name="size_range" value={formData.size_range} onChange={handleChange}>
                          <option value="1-10">1–10 orang</option>
                          <option value="11-50">11–50 orang</option>
                          <option value="51-200">51–200 orang</option>
                          <option value="200+">Lebih dari 200 orang</option>
                        </select>
                      </div>
                      <div><label className="field-label">Tahun Berdiri</label><input type="number" className="input-field font-mono" name="founded_year" value={formData.founded_year} onChange={handleChange}/></div>
                      <div><label className="field-label">Website</label><input type="url" className="input-field" name="website" value={formData.website} onChange={handleChange}/></div>
                    </div>
                  </div>
                </div>

                {/* Lokasi */}
          <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-md font-semibold text-ink-700">Lokasi Kantor</h2>
              <button type="button" onClick={() => setShowLocationForm(!showLocationForm)} className="text-body-sm text-teal-700 hover:underline font-medium">
                {showLocationForm ? 'Batal Tambah' : '+ Tambah Cabang'}
              </button>
            </div>
            
            {showLocationForm && (
              <div className="bg-canvas p-4 rounded-md mb-4 border border-canvas-border">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="field-label">Kota</label>
                    <input className="input-field" value={newLocation.city} onChange={(e) => setNewLocation({...newLocation, city: e.target.value})} placeholder="mis. Jakarta"/>
                  </div>
                  <div>
                    <label className="field-label">Provinsi</label>
                    <input className="input-field" value={newLocation.province} onChange={(e) => setNewLocation({...newLocation, province: e.target.value})} placeholder="mis. DKI Jakarta"/>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-body-sm text-ink-700">
                    <input type="checkbox" checked={newLocation.is_headquarters} onChange={(e) => setNewLocation({...newLocation, is_headquarters: e.target.checked})} className="rounded text-teal-600 focus:ring-teal-500"/>
                    Jadikan sebagai Kantor Pusat (HQ)
                  </label>
                  <button type="button" onClick={handleAddLocation} className="px-4 py-2 bg-teal-600 text-white rounded-md text-body-sm font-medium hover:bg-teal-700">
                    Simpan Lokasi
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {locations.map((loc) => (
                <div key={loc.id} className="border border-canvas-border rounded-md p-3 flex items-center justify-between">
                  <div>
                    <span className="text-body-md text-ink-700">{loc.city}{loc.province ? `, ${loc.province}` : ''}</span>
                    {loc.is_headquarters && <span className="ml-3 text-body-sm px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">HQ</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {!loc.is_headquarters && (
                      <button type="button" onClick={() => handleSetHQ(loc.id)} className="text-body-sm text-ink-300 hover:text-teal-600">Set HQ</button>
                    )}
                    <button type="button" onClick={() => handleRemoveLocation(loc.id)} className="text-body-sm text-coral-600 hover:underline">Hapus</button>
                  </div>
                </div>
              ))}
              {locations.length === 0 && <p className="text-body-sm text-ink-300 italic">Belum ada lokasi yang ditambahkan.</p>}
            </div>
          </div>

          {/* Sosial Media */}
                <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Tautan Sosial Media</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="field-label">LinkedIn</label><input className="input-field" name="linkedin" value={formData.socials?.linkedin || ''} onChange={handleSocialChange}/></div>
                    <div><label className="field-label">Instagram</label><input className="input-field" name="instagram" value={formData.socials?.instagram || ''} onChange={handleSocialChange}/></div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-4">Deskripsi Perusahaan</h2>
                  <textarea rows="4" className="input-field" name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>

                {/* Benefit */}
                <div className="bg-white border border-canvas-border rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-heading-md font-semibold text-ink-700">Benefit & Fasilitas</h2>
                    <button type="button" onClick={addBenefit} className="text-body-sm text-teal-700 hover:underline font-medium">+ Tambah</button>
                  </div>
                  {formData.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input className="input-field" value={benefit} onChange={(e) => handleBenefitChange(idx, e.target.value)}/>
                      <button type="button" onClick={() => removeBenefit(idx)} className="text-ink-300 hover:text-coral-600">✕</button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pb-8">
                  <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-6 py-2.5 rounded-md disabled:opacity-50">
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfileEdit;
