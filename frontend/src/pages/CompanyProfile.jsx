import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';

const CompanyProfile = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tentang');

  useEffect(() => {
    fetchPublicProfile();
  }, [slug]);

  const fetchPublicProfile = async () => {
    try {
      const res = await api.get(`/public/companies/${slug}`);
      const data = res.data.data;
      if (data.socials && typeof data.socials === 'string') data.socials = JSON.parse(data.socials);
      if (data.benefits && typeof data.benefits === 'string') data.benefits = JSON.parse(data.benefits);
      setProfile(data);
    } catch (err) {
      setError('Perusahaan tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-300">Memuat profil...</div>;
  }

  if (error || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-coral-600">{error}</div>;
  }

  return (
    <div className="bg-canvas text-ink-700 min-h-screen font-sans">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-canvas-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
              <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
              <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
              <circle cx="4" cy="16" r="3.5" fill="#1F6F78"/>
              <circle cx="14" cy="8" r="3.5" fill="#1F6F78"/>
              <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
            </svg>
            <span className="italic font-medium text-[20px] text-ink-700">RecruitFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-body-md text-ink-500">
            <Link to="/jobs" className="hover:text-ink-700">Cari Lowongan</Link>
            <span className="text-teal-700 font-medium">Perusahaan</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/candidate/auth" className="hidden sm:inline text-body-md text-ink-700 hover:text-teal-700 px-3 py-2">Masuk</Link>
            <Link to="/candidate/auth" className="bg-amber-500 hover:bg-amber-600 text-ink-700 text-body-md font-semibold px-4 py-2 rounded-md transition-colors">Daftar</Link>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div 
        className="h-48 md:h-64 w-full bg-cover bg-center" 
        style={{
          background: profile.banner_url ? `url(${profile.banner_url})` : `linear-gradient(rgba(22,35,63,0.35), rgba(22,35,63,0.15)), repeating-linear-gradient(135deg, #1F6F78 0px, #1F6F78 40px, #195A61 40px, #195A61 80px)`
        }}
      ></div>

      <main className="max-w-[1200px] mx-auto px-6">
        {/* Header profil */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-8">
          <div className="w-24 h-24 rounded-lg bg-white border-4 border-white shadow-sm flex items-center justify-center text-teal-700 font-bold text-3xl flex-shrink-0 overflow-hidden">
            {profile.logo_url ? <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" /> : getInitials(profile.name)}
          </div>
          <div className="flex-1 pb-1">
            <h1 className="text-heading-lg font-semibold text-ink-700">{profile.name}</h1>
            <p className="text-body-lg text-teal-700 mt-0.5">{profile.tagline || 'Tagline belum ditambahkan'}</p>
            <p className="text-body-md text-ink-500 mt-1">
              {profile.industry || 'Industri'} · {profile.size_range || 'Ukuran tidak diketahui'} karyawan 
              {profile.founded_year && ` · Berdiri ${profile.founded_year}`}
            </p>
          </div>
          <div className="flex items-center gap-3 pb-2">
            {profile.website && (
              <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="text-body-sm text-teal-700 hover:underline">
                {profile.website} ↗
              </a>
            )}
            {profile.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-ink-500 hover:bg-teal-100 hover:text-teal-700 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.5V23H.24V8.25zM8.5 8.25h4.3v2.02h.06c.6-1.13 2.06-2.32 4.24-2.32 4.53 0 5.37 2.98 5.37 6.85V23h-4.5v-6.96c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.81-2.68 3.68V23h-4.5V8.25z"/></svg>
              </a>
            )}
            {profile.socials?.instagram && (
              <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-ink-500 hover:bg-teal-100 hover:text-teal-700 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-canvas-border mb-8">
          <button onClick={() => setActiveTab('tentang')} className={`pb-3 px-4 text-body-md transition-colors border-b-2 ${activeTab === 'tentang' ? 'border-amber-500 text-ink-700 font-semibold' : 'border-transparent text-ink-300 hover:text-ink-500'}`}>Tentang Kami</button>
          <button onClick={() => setActiveTab('lowongan')} className={`pb-3 px-4 text-body-md transition-colors border-b-2 ${activeTab === 'lowongan' ? 'border-amber-500 text-ink-700 font-semibold' : 'border-transparent text-ink-300 hover:text-ink-500'}`}>Lowongan (0)</button>
        </div>

        {/* Panels */}
        {activeTab === 'tentang' && (
          <div className="grid md:grid-cols-3 gap-8 pb-16">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-heading-md font-semibold text-ink-700 mb-3">Deskripsi</h2>
                <div className="text-body-md text-ink-700 whitespace-pre-wrap leading-relaxed">
                  {profile.description || 'Belum ada deskripsi.'}
                </div>
              </section>

              {profile.benefits && profile.benefits.length > 0 && profile.benefits[0] !== '' && (
                <section>
                  <h2 className="text-heading-md font-semibold text-ink-700 mb-3">Benefit & Fasilitas</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {profile.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-3 bg-white p-4 rounded-md border border-canvas-border">
                        <div className="w-8 h-8 rounded-full bg-moss-100 text-moss-700 flex items-center justify-center flex-shrink-0 text-lg">✓</div>
                        <div>
                          <h3 className="font-semibold text-body-md">{benefit}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-canvas-border shadow-xs">
                <h3 className="font-semibold text-body-md text-ink-700 mb-4">Ringkasan Perusahaan</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-body-sm text-ink-300 mb-0.5">Industri</span>
                    <span className="block text-body-md font-medium text-ink-700">{profile.industry || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-ink-300 mb-0.5">Ukuran</span>
                    <span className="block text-body-md font-medium text-ink-700">{profile.size_range || '-'} karyawan</span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-ink-300 mb-0.5">Didirikan</span>
                    <span className="block text-body-md font-medium text-ink-700">{profile.founded_year || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lowongan' && (
          <div className="pb-16 text-center text-ink-500 py-12">
            Belum ada lowongan yang aktif saat ini.
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyProfile;
