import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  useEffect(() => {
    document.title = "RecruitFlow — Menghubungkan Pencari Kerja & Perusahaan";
  }, []);

  return (
    <div className="bg-canvas text-ink-700 antialiased font-sans min-h-screen flex flex-col">
      <Navbar />

      <section className="hero-spotlight-neutral relative overflow-hidden border-b border-canvas-border">
        <div className="max-w-container mx-auto px-6 py-16 lg:py-20 text-center">
          <h1 className="font-bold text-display-lg lg:text-display-xl text-ink-700 max-w-2xl mx-auto mb-5">
            Menghubungkan pencari kerja terbaik dengan perusahaan yang tepat.
          </h1>
          <p className="text-body-lg text-ink-500 max-w-xl mx-auto">
            Satu platform, dua sisi — job board lintas perusahaan untuk kandidat, dan sistem pengelolaan rekrutmen lengkap untuk tim HR.
          </p>
        </div>
      </section>

      {/* DUA JALUR SETARA */}
      <main className="max-w-container mx-auto px-6 py-14 lg:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jalur Kandidat */}
          <Link to="/cari-lowongan" className="path-card block bg-white border-2 border-canvas-border hover:border-teal-500 rounded-xl p-8">
            <div className="w-14 h-14 rounded-lg bg-teal-100 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1F6F78" strokeWidth="1.75"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h2 className="text-heading-lg font-semibold text-ink-700 mb-2">Saya Mencari Pekerjaan</h2>
            <p className="text-body-md text-ink-500 mb-6">Jelajahi ratusan lowongan dari berbagai perusahaan. Satu profil untuk melamar ke mana saja, pantau statusnya real-time.</p>
            <span className="inline-flex items-center gap-2 text-teal-700 font-semibold text-body-md">
              Cari Lowongan
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </Link>

          {/* Jalur Perusahaan */}
          <Link to="/untuk-perusahaan" className="path-card block bg-white border-2 border-canvas-border hover:border-amber-500 rounded-xl p-8">
            <div className="w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A66A1E" strokeWidth="1.75"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 4V2M16 4V2M3 10h18"/></svg>
            </div>
            <h2 className="text-heading-lg font-semibold text-ink-700 mb-2">Saya Ingin Merekrut</h2>
            <p className="text-body-md text-ink-500 mb-6">Kelola seluruh proses rekrutmen tim Anda — dari posting lowongan hingga kandidat diterima — dalam satu pipeline visual.</p>
            <span className="inline-flex items-center gap-2 text-amber-700 font-semibold text-body-md">
              Pelajari untuk Perusahaan
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </Link>
        </div>

        {/* Stage Rail */}
        <div className="flex flex-col items-center mt-16">
          <p className="text-body-sm font-semibold tracking-wide text-ink-300 uppercase mb-4">Satu alur yang sama, dilihat dari dua sisi</p>
          <svg width="440" height="60" viewBox="0 0 440 60">
            <line x1="20" y1="30" x2="120" y2="30" stroke="#DDE1EA" strokeWidth="3"/><line x1="120" y1="30" x2="220" y2="30" stroke="#DDE1EA" strokeWidth="3"/>
            <line x1="220" y1="30" x2="320" y2="30" stroke="#DDE1EA" strokeWidth="3"/><line x1="320" y1="30" x2="420" y2="30" stroke="#DDE1EA" strokeWidth="3"/>
            <circle cx="20" cy="30" r="8" fill="#1F6F78"/><circle cx="120" cy="30" r="8" fill="#1F6F78"/>
            <circle cx="220" cy="30" r="9" fill="#E8A23D" className="origin-center animate-pulse-node"/>
            <circle cx="320" cy="30" r="8" fill="none" stroke="#8D97AC" strokeWidth="2"/><circle cx="420" cy="30" r="8" fill="none" stroke="#8D97AC" strokeWidth="2"/>
            <text x="6" y="50" fontFamily="Poppins" fontSize="11" fill="#8D97AC">Applied</text>
            <text x="95" y="50" fontFamily="Poppins" fontSize="11" fill="#8D97AC">Screening</text>
            <text x="195" y="50" fontFamily="Poppins" fontSize="11" fill="#A66A1E" fontWeight="600">Interview</text>
            <text x="303" y="50" fontFamily="Poppins" fontSize="11" fill="#8D97AC">Offer</text>
            <text x="403" y="50" fontFamily="Poppins" fontSize="11" fill="#8D97AC">Hired</text>
          </svg>
          <p className="text-body-sm text-ink-500 mt-4 max-w-md text-center">Kandidat memantau tahap ini dari Dashboard-nya. Perusahaan mengelola tahap yang sama dari Pipeline-nya. Satu data, dua sudut pandang.</p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-ink-700">
        <div className="max-w-container mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="26" height="18" viewBox="0 0 28 20" fill="none"><line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/><line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/><circle cx="4" cy="16" r="3.5" fill="#7EC1C7"/><circle cx="14" cy="8" r="3.5" fill="#7EC1C7"/><circle cx="24" cy="4" r="4" fill="#E8A23D"/></svg>
              <span className="italic font-medium text-[19px] text-white">RecruitFlow</span>
            </div>
            <p className="text-body-sm text-ink-300">Satu platform untuk menemukan dan mengelola setiap tahap rekrutmen.</p>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Untuk Pencari Kerja</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/cari-lowongan" className="hover:text-amber-500 transition-colors">Cari Lowongan</Link></li>
              <li><Link to="/candidate/auth" className="hover:text-amber-500 transition-colors">Buat Profil</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Untuk Perusahaan</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="/untuk-perusahaan" className="hover:text-amber-500 transition-colors">Pasang Lowongan</Link></li>
              <li><Link to="/harga" className="hover:text-amber-500 transition-colors">Harga</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-white uppercase tracking-wide mb-3">Perusahaan</h4>
            <ul className="space-y-2 text-body-sm text-ink-300">
              <li><Link to="#" className="hover:text-amber-500 transition-colors">Tentang Kami</Link></li>
              <li><Link to="#" className="hover:text-amber-500 transition-colors">Bantuan</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-container mx-auto px-6 py-5 text-body-sm text-ink-300">© 2026 RecruitFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
