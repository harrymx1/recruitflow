import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-canvas-border">
      <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
            <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
            <circle cx="4" cy="16" r="3.5" fill="#1F6F78"/>
            <circle cx="14" cy="8" r="3.5" fill="#1F6F78"/>
            <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
          </svg>
          <span className="font-sans italic text-[20px] font-medium text-ink-700">RecruitFlow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-body-md text-ink-500">
          <Link to="/cari-lowongan" className={`${location.pathname === '/cari-lowongan' ? 'text-teal-700 font-medium' : 'hover:text-ink-700'}`}>Cari Lowongan</Link>
          <Link to="/untuk-perusahaan" className={`${location.pathname === '/untuk-perusahaan' ? 'text-teal-700 font-medium' : 'hover:text-ink-700'}`}>Pasang Lowongan</Link>
          <Link to="/harga" className={`${location.pathname === '/harga' ? 'text-teal-700 font-medium' : 'hover:text-ink-700'}`}>Paket Premium</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to={!user.role ? "/candidate/dashboard" : "/dashboard/jobs"} className="text-body-md text-ink-700 hover:text-teal-700 px-3 py-2 font-medium">Dashboard</Link>
          ) : (
            <>
              <Link to="/company/login" className="hidden sm:inline text-body-md text-ink-700 hover:text-teal-700 px-3 py-2">Masuk</Link>
              <Link to="/company/register" className="bg-amber-500 hover:bg-amber-600 text-ink-700 text-body-md font-semibold px-4 py-2 rounded-md transition-colors">
                Daftar Gratis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
