import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Clean SVG line-art icons (no emojis, no AI icons) ── */
const IconDashboard = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5"/>
    <rect x="11" y="2" width="7" height="7" rx="1.5"/>
    <rect x="2" y="11" width="7" height="7" rx="1.5"/>
    <rect x="11" y="11" width="7" height="7" rx="1.5"/>
  </svg>
);

const IconTasks = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10l2 2 4-4"/>
    <rect x="3" y="3" width="14" height="14" rx="2"/>
  </svg>
);

const IconSubmissions = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"/>
    <path d="M8 10h4M8 14h2M8 6h4"/>
  </svg>
);

const IconTalents = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path d="M4 17a6 6 0 0112 0"/>
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 10H3M13 10l-3-3M13 10l-3 3"/>
    <path d="M7 4H4a1 1 0 00-1 1v10a1 1 0 001 1h3"/>
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 5h14M3 10h14M3 15h14" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);

const navItems = [
  { label: 'Dashboard',   path: '/admin/dashboard',   Icon: IconDashboard   },
  { label: 'Tasks',       path: '/admin/tasks',       Icon: IconTasks       },
  { label: 'Submissions', path: '/admin/submissions', Icon: IconSubmissions },
  { label: 'Talents',     path: '/admin/talents',     Icon: IconTalents     },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const nav = (
    <>
      <div className="flex items-center justify-center px-5 py-6">
        <img src="/modelsuite-talents.png" alt="ModelSuite Talents" className="w-40 h-auto object-contain" />
      </div>

      <div className="sidebar-divider mx-4" />

      <nav className="flex flex-col gap-0.5 flex-1 px-3 pt-5">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] px-2 mb-2"
          style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
          Menu
        </p>

        {navItems.map(({ label, path, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button key={path}
              onClick={() => goTo(path)}
              className={`nav-item ${isActive ? 'nav-active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="sidebar-divider mb-4" />
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full avatar-admin flex items-center justify-center text-[12px] font-bold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold truncate max-w-[110px]"
                style={{ color: '#E5E2E1', fontFamily: 'Inter, sans-serif' }}>
                {user?.name}
              </p>
              <p className="text-[11px]" style={{ color: '#4B5563' }}>Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="logout-btn">
            <IconLogout />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-bg-surface px-4 md:hidden">
        <img src="/modelsuite-talents.png" alt="ModelSuite Talents" className="w-32 h-auto object-contain" />
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-input text-text-primary">
          {isOpen ? <IconClose /> : <IconMenu />}
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[60] flex w-[240px] flex-col transition-transform duration-200 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0D0D0D' }}>
        {nav}
      </aside>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[240px] flex-col md:flex"
        style={{ background: '#0D0D0D' }}>
        {nav}
      </aside>
    </>
  );
};

export default Sidebar;
