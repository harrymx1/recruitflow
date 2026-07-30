import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CandidateLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/candidate/auth');
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-canvas text-ink-700 antialiased min-h-screen flex flex-col font-sans">
      {/* ===== NAVBAR (varian kandidat, setelah login) ===== */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-canvas-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/cari-lowongan" className="flex items-center gap-2">
            <svg width="26" height="18" viewBox="0 0 28 20" fill="none">
              <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
              <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
              <circle cx="4" cy="16" r="3.5" fill="#1F6F78"/>
              <circle cx="14" cy="8" r="3.5" fill="#1F6F78"/>
              <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
            </svg>
            <span className="italic font-medium text-[19px] text-ink-700">RecruitFlow</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-7 text-body-md text-ink-500">
            <Link to="/cari-lowongan" className={`${location.pathname === '/cari-lowongan' ? 'text-teal-700 font-medium' : 'hover:text-ink-700'}`}>Cari Lowongan</Link>
            <Link to="/candidate/saved-jobs" className={`${location.pathname === '/candidate/saved-jobs' ? 'text-teal-700 font-medium' : 'hover:text-ink-700'}`}>Lowongan Tersimpan</Link>
            <Link to="/candidate/dashboard" className={`${location.pathname.startsWith('/candidate/dashboard') || location.pathname.startsWith('/candidate/applications') ? 'text-teal-700 font-medium' : 'hover:text-ink-700'}`}>Dashboard Saya</Link>
          </nav>
          
          <div className="relative group">
            <button className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-body-sm cursor-pointer outline-none">
              {getInitials(user?.name || user?.email)}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-canvas-border rounded-md shadow-sm py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link to="/candidate/profile" className="block px-4 py-2 text-body-sm text-ink-700 hover:bg-gray-50">Edit Profil</Link>
              <Link to="/candidate/documents" className="block px-4 py-2 text-body-sm text-ink-700 hover:bg-gray-50">Dokumen Saya</Link>
              <div className="border-t border-canvas-border my-1"></div>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-body-sm text-coral-600 hover:bg-gray-50">Keluar</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;
