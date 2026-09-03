import { Bell, Menu, Search, ShieldCheck, X, Check, ArrowRight } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const routeTitles: Record<string, { title: string; breadcrumb: string }> = {
  '/dashboard': { title: 'Compliance Dashboard', breadcrumb: 'Dashboard' },
  '/inspection/new': { title: 'New Package Inspection', breadcrumb: 'Inspections / New' },
  '/inspections': { title: 'Inspection Records', breadcrumb: 'Inspections / History' },
  '/products': { title: 'Commodity Repository', breadcrumb: 'Products / Repository' },
  '/reports': { title: 'Compliance Reports', breadcrumb: 'Reports & Certificates' },
  '/analytics': { title: 'Compliance Analytics', breadcrumb: 'Analytics & Insights' },
  '/settings': { title: 'Officer Settings', breadcrumb: 'Settings' },
};

const mockNotifications = [
  {
    id: 1,
    title: 'High Severity Violation Detected',
    desc: 'PowerCell AA Batteries missing mandatory consumer care line.',
    time: '12m ago',
    unread: true,
    link: '/inspection/INS-2026-00480',
  },
  {
    id: 2,
    title: 'Inspection Completed',
    desc: 'FreshGlow Herbal Shampoo marked for inspector review.',
    time: '1h ago',
    unread: true,
    link: '/inspection/INS-2026-00482',
  },
  {
    id: 3,
    title: 'Monthly Summary Generated',
    desc: 'August 2026 Metrology compliance report is now available.',
    time: '1d ago',
    unread: false,
    link: '/reports',
  },
];

export function Header({ onMenu }: { onMenu: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const current = routeTitles[location.pathname] || {
    title: 'Inspection Detail',
    breadcrumb: 'Inspections / Result',
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8 shadow-subtle">
      {/* Left: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-brand-700 tracking-wide uppercase truncate">
            {current.breadcrumb}
          </p>
          <h1 className="text-base font-bold text-slate-900 leading-none truncate hidden sm:block">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search Bar */}
      <div className="relative hidden md:block max-w-xs lg:max-w-md w-full mx-4">
        <Search className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
        <input
          placeholder="Search inspection ID, product, rule…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate('/inspections');
            }
          }}
          className="w-full rounded-lg border border-slate-200/90 bg-slate-50/80 py-2 pl-9 pr-12 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        />
        <kbd className="absolute right-2.5 top-2.5 hidden lg:inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-2xs">
          Ctrl K
        </kbd>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Government Badge */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200/60">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Govt of India • Dept of Consumer Affairs</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-elevated border border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">Enforcement Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-brand-600 hover:text-brand-800 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link}
                    onClick={() => setShowNotifications(false)}
                    className={`block p-3 rounded-xl transition hover:bg-slate-50 ${
                      n.unread ? 'bg-brand-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.desc}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                <Link
                  to="/inspections"
                  onClick={() => setShowNotifications(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
                >
                  View all inspection activity <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 border-l border-slate-200/90 pl-3 sm:pl-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy-900 text-xs font-bold text-white shadow-xs">
            PS
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Priya Sharma</p>
            <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              On Duty (Zone 4)
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
