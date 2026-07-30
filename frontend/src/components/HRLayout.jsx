import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ===== SVG Icons (inline, matching design-reference exactly) =====
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
    <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
  </svg>
);
const IconJobs = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z"/><path d="M8 7V5h8v2"/>
  </svg>
);
const IconCandidates = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconAnalytics = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
);
const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconCompanyProfile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/>
    <path d="M15 8h3M15 12h3M6 16h12"/>
  </svg>
);
const IconTeam = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const HRLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { to: '/dashboard/jobs', label: 'Dashboard', icon: <IconDashboard />, exact: '/dashboard/jobs' },
    { to: '/dashboard/jobs', label: 'Lowongan', icon: <IconJobs /> },
    { to: '/dashboard/candidates', label: 'Kandidat', icon: <IconCandidates /> },
    { to: '/dashboard/interviews', label: 'Kalender', icon: <IconCalendar /> },
    { to: '/dashboard/analytics', label: 'Analitik', icon: <IconAnalytics /> },
    { to: '/dashboard/email-templates', label: 'Template Email', icon: <IconEmail /> },
    { to: '/dashboard/profile', label: 'Profil Perusahaan', icon: <IconCompanyProfile /> },
    { to: '/dashboard/team', label: 'Tim', icon: <IconTeam />, badge: 'Admin' },
  ];

  // Fix: use unique nav items properly
  const sidebarNav = [
    { to: '/dashboard/jobs', label: 'Lowongan', icon: <IconJobs />, match: '/dashboard/jobs' },
    { to: '/dashboard/candidates', label: 'Kandidat', icon: <IconCandidates />, match: '/dashboard/candidates' },
    { to: '/dashboard/interviews', label: 'Kalender', icon: <IconCalendar />, match: '/dashboard/interviews' },
    { to: '/dashboard/email-templates', label: 'Template Email', icon: <IconEmail />, match: '/dashboard/email-templates' },
    { to: '/dashboard/profile', label: 'Profil Perusahaan', icon: <IconCompanyProfile />, match: '/dashboard/profile' },
    { to: '/dashboard/team', label: 'Tim', icon: <IconTeam />, match: '/dashboard/team', badge: 'Admin' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/company/login');
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-60 bg-ink-700 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6">
          <Link to="/dashboard/jobs" className="flex items-center gap-2">
            <svg width="24" height="17" viewBox="0 0 28 20" fill="none">
              <line x1="4" y1="16" x2="14" y2="8" stroke="#7EC1C7" strokeWidth="2"/>
              <line x1="14" y1="8" x2="24" y2="4" stroke="#E8A23D" strokeWidth="2"/>
              <circle cx="4" cy="16" r="3.5" fill="#7EC1C7"/>
              <circle cx="14" cy="8" r="3.5" fill="#7EC1C7"/>
              <circle cx="24" cy="4" r="4" fill="#E8A23D"/>
            </svg>
            <span className="italic font-medium text-[18px] text-white">RecruitFlow</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="px-3 py-2 text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
            Dashboard
          </div>
          {sidebarNav.map((item, idx) => {
            const active = isActive(item.match);
            return (
              <Link
                key={`${item.to}-${idx}`}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md border-l-[3px] transition-colors
                  ${active
                    ? 'text-white bg-[rgba(31,111,120,0.2)] border-amber-500'
                    : 'border-transparent text-ink-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className="text-body-sm text-ink-300 font-mono ml-auto">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-body-sm font-semibold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm text-white font-medium truncate">{user?.name || 'HR User'}</p>
              <p className="text-body-sm text-ink-300 truncate">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== KONTEN UTAMA ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-canvas-border flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <p className="text-body-sm text-ink-300">Workspace</p>
            <p className="text-body-md font-semibold text-ink-700">{user?.companyName || 'Perusahaan Anda'}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-canvas-border transition-colors">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#3D4A66" strokeWidth="1.75">
                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            {/* Avatar + dropdown */}
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-ink-700 text-white flex items-center justify-center font-semibold text-body-sm">
                {getInitials(user?.name)}
              </button>
              <div className="absolute right-0 mt-2 w-44 bg-white border border-canvas-border rounded-md shadow-sm py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <Link to="/" className="block px-4 py-2 text-body-sm text-ink-700 hover:bg-canvas-border transition-colors">Beranda Publik</Link>
                <Link to="/dashboard/profile" className="block px-4 py-2 text-body-sm text-ink-700 hover:bg-canvas-border transition-colors">Profil Perusahaan</Link>
                <div className="border-t border-canvas-border my-1"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-body-sm text-coral-600 hover:bg-coral-50 transition-colors">Keluar</button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto bg-canvas">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HRLayout;
