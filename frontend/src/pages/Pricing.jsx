import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Pricing = () => {
  const [billingMode, setBillingMode] = useState('monthly');
  const [userType, setUserType] = useState('company');

  useEffect(() => {
    document.title = "Harga — RecruitFlow";
  }, []);

  return (
    <div className="bg-canvas text-ink-700 antialiased font-sans min-h-screen flex flex-col">
      <Navbar />

      <section className="max-w-container mx-auto px-6 py-16 lg:py-24 text-center">
        <div className="text-center mb-10">
          <h1 className="font-bold text-display-lg text-ink-700 mb-3">Harga yang jelas, tanpa kejutan</h1>
          <p className="text-body-lg text-ink-500 max-w-md mx-auto">Pilih paket sesuai kebutuhan Anda. Mulai gratis, upgrade kapan saja.</p>
        </div>

        <div className="flex flex-col items-center gap-6 mb-12">
          {/* User Type Toggle */}
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button 
              onClick={() => setUserType('company')} 
              className={`text-body-md font-medium px-6 py-2 rounded-full transition-all ${userType === 'company' ? 'bg-white shadow text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
            >
              Untuk Perusahaan
            </button>
            <button 
              onClick={() => setUserType('candidate')} 
              className={`text-body-md font-medium px-6 py-2 rounded-full transition-all ${userType === 'candidate' ? 'bg-white shadow text-teal-700' : 'text-ink-500 hover:text-ink-700'}`}
            >
              Untuk Kandidat
            </button>
          </div>

          {/* Billing Mode Toggle */}
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button 
              onClick={() => setBillingMode('monthly')} 
              className={`toggle-btn text-body-sm font-medium px-4 py-2 rounded-full transition-all ${billingMode === 'monthly' ? 'active bg-white shadow' : 'text-ink-500 hover:text-ink-700'}`}
            >
              Bulanan
            </button>
            <button 
              onClick={() => setBillingMode('yearly')} 
              className={`toggle-btn text-body-sm font-medium px-4 py-2 rounded-full transition-all ${billingMode === 'yearly' ? 'active bg-white shadow' : 'text-ink-500 hover:text-ink-700'}`}
            >
              Tahunan <span className="text-moss-700">(hemat 20%)</span>
            </button>
          </div>
        </div>

        {userType === 'company' ? (
          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="plan-card bg-white border border-canvas-border rounded-xl p-7 text-left">
              <h3 className="text-heading-md font-semibold text-ink-700 mb-1">Starter</h3>
              <p className="text-body-sm text-ink-500 mb-5">Untuk tim kecil yang baru mulai merapikan rekrutmen.</p>
              <p className="text-3xl font-bold text-ink-700 font-mono mb-1">Rp0</p>
              <p className="text-body-sm text-ink-300 mb-6">selamanya gratis</p>
              <Link to="/company/register" className="block text-center border border-teal-500 text-teal-700 hover:bg-teal-100 font-medium text-body-md py-2.5 rounded-md mb-6">Mulai Gratis</Link>
              <ul className="space-y-3 text-body-md text-ink-700">
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>1 lowongan aktif</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>2 anggota tim</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Pipeline standar</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Candidate tracking portal</li>
              </ul>
            </div>

            {/* Growth */}
            <div className="plan-card featured bg-white border-2 rounded-xl p-7 relative text-left">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-ink-700 text-body-sm font-semibold px-3 py-1 rounded-full">Paling Populer</span>
              <h3 className="text-heading-md font-semibold text-ink-700 mb-1">Growth</h3>
              <p className="text-body-sm text-ink-500 mb-5">Untuk tim HR yang aktif merekrut sepanjang tahun.</p>
              <p className="text-3xl font-bold text-ink-700 font-mono mb-1">
                <span>{billingMode === 'monthly' ? 'Rp50rb' : 'Rp40rb'}</span>
                <span className="text-body-md font-normal text-ink-500">/bulan</span>
              </p>
              <p className="text-body-sm text-ink-300 mb-6">per workspace</p>
              <button className="w-full block text-center bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md py-2.5 rounded-md mb-6">Pilih Growth</button>
              <ul className="space-y-3 text-body-md text-ink-700">
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Lowongan aktif tanpa batas</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Hingga 10 anggota tim</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Pipeline kustom per lowongan</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Dashboard analitik lengkap</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Template email kustom</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="plan-card bg-white border border-canvas-border rounded-xl p-7 text-left">
              <h3 className="text-heading-md font-semibold text-ink-700 mb-1">Enterprise</h3>
              <p className="text-body-sm text-ink-500 mb-5">Untuk perusahaan besar dengan kebutuhan khusus.</p>
              <p className="text-3xl font-bold text-ink-700 mb-1">Hubungi Kami</p>
              <p className="text-body-sm text-ink-300 mb-6">harga disesuaikan kebutuhan</p>
              <a href="mailto:sales@recruitflow.id" className="block text-center border border-teal-500 text-teal-700 hover:bg-teal-100 font-medium text-body-md py-2.5 rounded-md mb-6">Hubungi Sales</a>
              <ul className="space-y-3 text-body-md text-ink-700">
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Semua fitur Growth</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Anggota tim tanpa batas</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Dukungan prioritas</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>SLA khusus</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Candidate Free */}
            <div className="plan-card bg-white border border-canvas-border rounded-xl p-7 text-left">
              <h3 className="text-heading-md font-semibold text-ink-700 mb-1">Reguler</h3>
              <p className="text-body-sm text-ink-500 mb-5">Fitur esensial untuk melamar kerja secara efisien.</p>
              <p className="text-3xl font-bold text-ink-700 font-mono mb-1">Rp0</p>
              <p className="text-body-sm text-ink-300 mb-6">selamanya gratis</p>
              <Link to="/candidate/auth" className="block text-center border border-teal-500 text-teal-700 hover:bg-teal-100 font-medium text-body-md py-2.5 rounded-md mb-6">Mulai Melamar</Link>
              <ul className="space-y-3 text-body-md text-ink-700">
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Lamar lowongan tanpa batas</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Profil lengkap & Resume</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Status pelacakan standar</li>
              </ul>
            </div>

            {/* Candidate Premium */}
            <div className="plan-card featured bg-white border-2 rounded-xl p-7 relative text-left">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-ink-700 text-body-sm font-semibold px-3 py-1 rounded-full">Kandidat Unggulan</span>
              <h3 className="text-heading-md font-semibold text-ink-700 mb-1">Premium</h3>
              <p className="text-body-sm text-ink-500 mb-5">Tingkatkan visibilitas Anda agar dilirik oleh rekruter.</p>
              <p className="text-3xl font-bold text-ink-700 font-mono mb-1">
                <span>{billingMode === 'monthly' ? 'Rp19rb' : 'Rp15rb'}</span>
                <span className="text-body-md font-normal text-ink-500">/bulan</span>
              </p>
              <p className="text-body-sm text-ink-300 mb-6">per akun kandidat</p>
              <button className="w-full block text-center bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md py-2.5 rounded-md mb-6">Tingkatkan ke Premium</button>
              <ul className="space-y-3 text-body-md text-ink-700">
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Lamaran Prioritas (Selalu di urutan atas)</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Lencana Profil Premium Eksklusif</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Wawasan Kisaran Gaji (Salary Insights)</li>
                <li className="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F7D5C" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>Lihat Siapa yang Mengunjungi Profil Anda</li>
              </ul>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="text-heading-lg font-semibold text-ink-700 text-center mb-8">Pertanyaan Umum</h2>
          <div className="space-y-4">
            <div className="bg-white border border-canvas-border rounded-lg p-5">
              <p className="text-body-md font-semibold text-ink-700 mb-1">Apakah paket Starter benar-benar gratis selamanya?</p>
              <p className="text-body-md text-ink-500">Ya, tidak ada batas waktu untuk paket Starter. Anda bisa upgrade kapan saja saat kebutuhan tim bertambah.</p>
            </div>
            <div className="bg-white border border-canvas-border rounded-lg p-5">
              <p className="text-body-md font-semibold text-ink-700 mb-1">Bisakah saya berpindah paket kapan saja?</p>
              <p className="text-body-md text-ink-500">Bisa. Upgrade atau downgrade paket dapat dilakukan kapan saja dari dashboard perusahaan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-ink-700 mt-16">
        <div className="max-w-container mx-auto px-6 py-8 text-body-sm text-ink-300 text-center">© 2026 RecruitFlow. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Pricing;
