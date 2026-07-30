import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CompanyLanding = () => {
  useEffect(() => {
    document.title = "RecruitFlow untuk Perusahaan — Kelola Rekrutmen Lebih Mudah";
  }, []);

  return (
    <div className="bg-canvas text-ink-700 antialiased font-sans min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="hero-spotlight relative overflow-hidden border-b border-canvas-border">
        <div className="max-w-container mx-auto px-6 py-20 lg:py-28 text-center">
          <p className="text-body-sm font-semibold tracking-wide text-teal-700 uppercase mb-4">Untuk Tim HR & Perusahaan</p>
          <h1 className="font-bold text-display-lg lg:text-display-xl text-ink-700 max-w-2xl mx-auto mb-6">
            Satu platform untuk mengelola seluruh proses rekrutmen Anda.
          </h1>
          <p className="text-body-lg text-ink-500 max-w-xl mx-auto mb-8">
            Dari posting lowongan hingga kandidat diterima — pantau semuanya lewat pipeline visual, tanpa lagi bergantung pada spreadsheet dan email berantakan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/company/register" className="bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-7 py-3 rounded-md transition-colors">Daftar Gratis</Link>
            <Link to="/harga" className="border border-teal-500 text-teal-700 hover:bg-teal-100 font-medium text-body-md px-7 py-3 rounded-md transition-colors">Lihat Harga</Link>
          </div>
          <p className="text-body-sm text-ink-300 mt-4">Tidak perlu kartu kredit untuk memulai.</p>
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="max-w-container mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg font-semibold text-ink-700 mb-3">Semua yang tim HR Anda butuhkan</h2>
          <p className="text-body-lg text-ink-500 max-w-lg mx-auto">Dirancang untuk menggantikan spreadsheet, email, dan tab browser yang bertebaran.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="feature-card bg-white border border-canvas-border rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-teal-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6F78" strokeWidth="1.75"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 4V2M16 4V2M3 10h18"/></svg></div>
            <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Job Posting Lengkap</h3>
            <p className="text-body-md text-ink-500">Buat lowongan detail lengkap dengan pertanyaan seleksi kustom — tanpa perlu form eksternal.</p>
          </div>
          <div className="feature-card bg-white border border-canvas-border rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-amber-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A66A1E" strokeWidth="1.75"><rect x="3" y="3" width="7" height="18"/><rect x="14" y="3" width="7" height="10"/></svg></div>
            <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Pipeline Visual</h3>
            <p className="text-body-md text-ink-500">Pantau progres tiap kandidat lewat kanban board — geser kartu, semua langsung ter-update.</p>
          </div>
          <div className="feature-card bg-white border border-canvas-border rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-moss-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#294F3A" strokeWidth="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Jadwal Interview Terpusat</h3>
            <p className="text-body-md text-ink-500">Kelola seluruh jadwal interview tim Anda dalam satu kalender, tanpa bentrok.</p>
          </div>
          <div className="feature-card bg-white border border-canvas-border rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-teal-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6F78" strokeWidth="1.75"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
            <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Analitik Rekrutmen</h3>
            <p className="text-body-md text-ink-500">Funnel, time-to-hire, dan sumber kandidat terbaik — semua dalam satu dashboard.</p>
          </div>
          <div className="feature-card bg-white border border-canvas-border rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-amber-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A66A1E" strokeWidth="1.75"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Kolaborasi Tim</h3>
            <p className="text-body-md text-ink-500">Undang rekan HR, beri catatan dan skor bersama untuk keputusan yang lebih matang.</p>
          </div>
          <div className="feature-card bg-white border border-canvas-border rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-moss-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#294F3A" strokeWidth="1.75"><path d="M4 4h16v16H4z"/><path d="M4 8h16M8 4v16"/></svg></div>
            <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Komunikasi Profesional</h3>
            <p className="text-body-md text-ink-500">Kirim surat offer & penolakan resmi dari template yang bisa Anda sesuaikan.</p>
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="bg-white border-y border-canvas-border py-16 lg:py-24">
        <div className="max-w-container mx-auto px-6">
          <h2 className="text-heading-lg font-semibold text-ink-700 text-center mb-12">Mulai dalam 3 langkah</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-heading-md mx-auto mb-4">1</div>
              <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Daftar & Lengkapi Profil</h3>
              <p className="text-body-md text-ink-500">Buat workspace perusahaan Anda dalam hitungan menit.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-ink-700 flex items-center justify-center font-semibold text-heading-md mx-auto mb-4">2</div>
              <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Pasang Lowongan</h3>
              <p className="text-body-md text-ink-500">Tayang langsung ke job board publik, siap menerima pelamar.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-moss-500 text-white flex items-center justify-center font-semibold text-heading-md mx-auto mb-4">3</div>
              <h3 className="text-heading-md font-semibold text-ink-700 mb-2">Kelola & Rekrut</h3>
              <p className="text-body-md text-ink-500">Pantau kandidat lewat pipeline hingga keputusan akhir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONI (placeholder) */}
      <section className="max-w-container mx-auto px-6 py-16 lg:py-24">
        <h2 className="text-heading-lg font-semibold text-ink-700 text-center mb-12">Dipercaya tim HR di berbagai industri</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="bg-white border border-canvas-border rounded-lg p-6">
            <p className="text-body-md text-ink-700 mb-4">"Proses rekrutmen kami yang tadinya berantakan di spreadsheet, sekarang jauh lebih rapi dan cepat."</p>
            <p className="text-body-sm font-semibold text-ink-700">Nama Perwakilan</p>
            <p className="text-body-sm text-ink-300">HR Manager, Perusahaan Contoh</p>
          </div>
          <div className="bg-white border border-canvas-border rounded-lg p-6">
            <p className="text-body-md text-ink-700 mb-4">"Kandidat kami senang karena bisa pantau status lamaran sendiri, tim kami jadi lebih sedikit ditanya-tanya."</p>
            <p className="text-body-sm font-semibold text-ink-700">Nama Perwakilan</p>
            <p className="text-body-sm text-ink-300">Talent Acquisition Lead, Perusahaan Contoh</p>
          </div>
          <div className="bg-white border border-canvas-border rounded-lg p-6">
            <p className="text-body-md text-ink-700 mb-4">"Fitur pipeline kustomnya pas banget dengan proses interview bertingkat yang kami punya."</p>
            <p className="text-body-sm font-semibold text-ink-700">Nama Perwakilan</p>
            <p className="text-body-sm text-ink-300">Head of People, Perusahaan Contoh</p>
          </div>
        </div>
        <p className="text-body-sm text-ink-300 text-center mt-4">*Testimoni bersifat contoh (placeholder) — ganti dengan testimoni nyata saat produk sudah punya pengguna.</p>
      </section>

      {/* CTA PENUTUP */}
      <section className="bg-ink-700 py-16">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="text-heading-lg font-semibold text-white mb-3">Siap merapikan proses rekrutmen Anda?</h2>
          <p className="text-body-lg text-ink-300 mb-8">Gratis untuk memulai, tidak perlu kartu kredit.</p>
          <Link to="/company/register" className="inline-block bg-amber-500 hover:bg-amber-600 text-ink-700 font-semibold text-body-md px-8 py-3 rounded-md transition-colors">Daftarkan Perusahaan Anda</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink-700 border-t border-white/10">
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

export default CompanyLanding;
