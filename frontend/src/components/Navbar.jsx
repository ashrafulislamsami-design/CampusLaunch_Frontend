// frontend/src/components/Navbar.jsx
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircleUser, ChevronDown, Bell, LayoutGrid, Mail, ShieldCheck, Menu, X } from 'lucide-react';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };

const Navbar = () => {
  const { isAuthenticated, userTeamId, user, logout, unreadCount, refreshUnreadCount } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Poll for unread notification count every 30 seconds while logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUnreadCount]);

  // Auto close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Returns className for a nav link based on whether its path matches current route
  const navLinkCls = (to) => {
    const active = pathname === to || (to !== '/home' && pathname.startsWith(to));
    return active
      ? 'text-white font-semibold uppercase tracking-widest whitespace-nowrap transition-colors'
      : 'text-zinc-500 hover:text-zinc-100 font-medium uppercase tracking-widest whitespace-nowrap transition-colors';
  };

  const teamDashTo = userTeamId ? `/teams/dashboard/${userTeamId}` : '/teams/create';
  const canvasTo   = userTeamId ? `/canvas/${userTeamId}`          : '/teams/create';

  return (
    <nav className="bg-[#09090B] border-b border-[#27272A] relative z-50" role="navigation" aria-label="Main Navigation">
      <div className="max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-14 items-center">

          {/* ── Logo — pure monospace branding string ──────────── */}
          <div className="flex-shrink-0">
            <Link
              to={isAuthenticated ? '/home' : '/'}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              style={{ ...MONO, fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}
              aria-label="CampusLaunch homepage"
            >
              CampusLaunch
              <span className="mx-1.5 text-zinc-700">·</span>
              2026
            </Link>
          </div>

          {/* ── Desktop Navigation & User Actions ──────────────── */}
          <div className="hidden lg:flex items-center justify-between flex-1">
            {isAuthenticated ? (
              <>
                {/* Centered Navigation Links */}
                <div className="flex-1 flex justify-evenly items-center px-4 gap-x-1">

                  {/* Standard nav links */}
                  {[
                    { to: '/home',          label: 'Dashboard' },
                    { to: teamDashTo,       label: 'My Team'   },
                    { to: '/teams/browse',  label: 'Startups'  },
                    { to: '/profiles',      label: 'Profiles'  },
                    { to: '/profile/me',    label: 'My Profile'},
                    { to: '/leaderboard',   label: 'Leaderboard'},
                    { to: '/ai-validator',  label: 'AI Validator'},
                    { to: '/resources',     label: 'Resources' },
                  ].map(({ to, label }) => (
                    <Link
                      key={label}
                      to={to}
                      className={navLinkCls(to)}
                      style={{ ...MONO, fontSize: '10px' }}
                      aria-label={`Go to ${label}`}
                    >
                      {label}
                    </Link>
                  ))}

                  {/* Canvas — with LayoutGrid icon (static, no animation) */}
                  <Link
                    to={canvasTo}
                    className={`${navLinkCls(canvasTo)} flex items-center gap-1`}
                    style={{ ...MONO, fontSize: '10px' }}
                    title={userTeamId ? 'Open your Business Model Canvas' : 'Join a team to open the canvas'}
                    aria-label={userTeamId ? 'Open your Business Model Canvas' : 'Join a team to open the canvas'}
                  >
                    <LayoutGrid size={11} className="text-zinc-600" />
                    Canvas
                  </Link>

                  {/* Admin link — only visible to Admin role */}
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin"
                      className="text-[#2563EB] hover:text-blue-400 font-semibold uppercase tracking-widest whitespace-nowrap flex items-center gap-1 border border-[#2563EB] bg-blue-950/40 px-2 py-1 rounded-sm transition-colors"
                      style={{ ...MONO, fontSize: '10px' }}
                      aria-label="Admin Control Panel"
                    >
                      <ShieldCheck size={11} />
                      Admin
                    </Link>
                  )}

                  {/* Notification Bell */}
                  <Link
                    to="/notifications"
                    className={`relative ${pathname === '/notifications' ? 'text-white' : 'text-zinc-500 hover:text-zinc-100'} transition-colors`}
                    title="Notifications"
                    aria-label={`Notifications, ${unreadCount} unread`}
                  >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-1.5 -right-1.5 bg-[#2563EB] text-white text-[9px] font-bold w-4 h-4 rounded-sm flex items-center justify-center leading-none"
                        style={MONO}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* ── User Identity Block — Dropdown ───────────── */}
                <div className="relative border-l border-[#27272A] pl-5">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    aria-label="User identity menu"
                    className="flex items-center gap-2.5 text-left focus:outline-none hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 bg-[#18181B] border border-[#27272A] flex items-center justify-center text-zinc-100 font-bold text-sm rounded-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <CircleUser size={16} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-zinc-100 leading-tight whitespace-nowrap" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {user?.name || 'Student'}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest" style={MONO}>
                        {user?.teamRole || user?.role || 'Member'}
                      </span>
                    </div>
                    <ChevronDown size={12} className="text-zinc-500 ml-0.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#18181B] border border-[#27272A] rounded-sm z-50 overflow-hidden" role="menu">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-xs text-zinc-300 hover:bg-[#27272A] hover:text-zinc-100 font-medium uppercase tracking-widest border-b border-[#27272A] transition-colors"
                        style={MONO}
                        role="menuitem"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/notifications"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-xs text-zinc-300 hover:bg-[#27272A] hover:text-zinc-100 font-medium uppercase tracking-widest border-b border-[#27272A] transition-colors"
                        style={MONO}
                        role="menuitem"
                      >
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/settings/email-preferences"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-xs text-zinc-300 hover:bg-[#27272A] hover:text-zinc-100 font-medium uppercase tracking-widest border-b border-[#27272A] transition-colors"
                        style={MONO}
                        role="menuitem"
                      >
                        <Mail size={12} className="text-zinc-500" />
                        <span>Email Prefs</span>
                      </Link>
                      {user?.role === 'Admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-xs text-[#2563EB] hover:bg-[#27272A] font-medium uppercase tracking-widest border-b border-[#27272A] transition-colors"
                          style={MONO}
                          role="menuitem"
                        >
                          <ShieldCheck size={12} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-xs text-red-500 hover:bg-red-950/30 hover:text-red-400 font-medium uppercase tracking-widest transition-colors border-0"
                        style={MONO}
                        role="menuitem"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── Unauthenticated state ───────────────────────── */
              <div className="flex items-center gap-4 ml-auto">
                <Link
                  to="/login"
                  className="text-zinc-500 hover:text-zinc-100 font-medium uppercase tracking-widest text-[10px] transition-colors"
                  style={MONO}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors"
                  style={MONO}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Navigation Controls ─────────────────────── */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className={`relative ${pathname === '/notifications' ? 'text-white' : 'text-zinc-500'} p-2`}
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#2563EB] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-sm flex items-center justify-center">
                    {unreadCount > 99 ? '99' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none p-2"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer Overlay Panel ─────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#09090B] border-b border-[#27272A] px-4 py-6 space-y-4">
          {isAuthenticated ? (
            <>
              {/* Profile Card Summary */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#27272A]">
                <div className="w-9 h-9 bg-[#18181B] border border-[#27272A] flex items-center justify-center text-zinc-100 font-bold text-sm rounded-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">
                    {user?.teamRole || user?.role || 'Member'}
                  </p>
                </div>
              </div>

              {/* Navigation stacked list */}
              <div className="flex flex-col gap-2 pt-2">
                {[
                  { to: '/home',          label: 'Dashboard' },
                  { to: teamDashTo,       label: 'My Team'   },
                  { to: '/teams/browse',  label: 'Startups'  },
                  { to: '/profiles',      label: 'Profiles'  },
                  { to: '/profile/me',    label: 'My Profile'},
                  { to: '/leaderboard',   label: 'Leaderboard'},
                  { to: '/ai-validator',  label: 'AI Validator'},
                  { to: '/resources',     label: 'Resources' },
                  { to: canvasTo,         label: 'Business Canvas' },
                ].map(({ to, label }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-xs text-zinc-400 hover:text-white font-mono uppercase tracking-widest transition-colors"
                  >
                    {label}
                  </Link>
                ))}

                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-xs text-[#2563EB] hover:text-blue-400 font-mono uppercase tracking-widest transition-colors"
                  >
                    <ShieldCheck size={13} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <Link
                  to="/settings/email-preferences"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 text-xs text-zinc-400 hover:text-white font-mono uppercase tracking-widest transition-colors"
                >
                  <Mail size={13} />
                  <span>Email Prefs</span>
                </Link>

                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full text-left py-3 text-xs text-red-500 hover:text-red-400 font-mono uppercase tracking-widest transition-colors border-0 bg-transparent mt-4 pt-4 border-t border-[#27272A]"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 py-4">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center border border-[#27272A] text-zinc-400 hover:text-zinc-100 font-mono uppercase tracking-widest py-3.5 text-[10px] transition-colors rounded-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-[#2563EB] hover:bg-blue-600 text-white font-mono uppercase tracking-widest py-3.5 text-[10px] transition-colors rounded-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
