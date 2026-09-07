import {
  BarChart3,
  ClipboardPlus,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Settings,
  Shield,
  X,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inspection/new', label: 'New Inspection', icon: ClipboardPlus, highlight: true },
  { to: '/inspections', label: 'Inspection History', icon: History, badge: '5' },
  { to: '/products', label: 'Product Repository', icon: PackageSearch },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { info } = useToast();

  const handleLogout = () => {
    info('Logged out', 'You have been safely signed out of the enforcement portal.');
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100/80">
        <Brand />
      </div>

      {/* Authority Banner */}
      <div className="px-5 pt-3.5 pb-1">
        <div className="flex items-center gap-2 rounded-lg bg-navy-50/80 px-2.5 py-1.5 text-[11px] font-medium text-navy-800 border border-navy-100/60">
          <Building2 size={13} className="text-navy-600 shrink-0" />
          <span className="truncate">Legal Metrology Division, MoCA</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Enforcement Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-subtle ring-1 ring-brand-600/10'
                    : item.highlight
                    ? 'text-brand-700 bg-brand-50/40 hover:bg-brand-50 hover:text-brand-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={19}
                  className="transition-colors shrink-0 group-hover:text-brand-600"
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                  {item.badge}
                </span>
              )}
              {item.highlight && !item.badge && (
                <span className="flex h-2 w-2 rounded-full bg-brand-600 ring-4 ring-brand-100" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 mt-auto">
        <div className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white hover:shadow-subtle border border-transparent hover:border-slate-200/60">
          <div className="relative">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-xs font-bold text-white shadow-sm">
              PS
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Priya Sharma</p>
            <p className="text-[11px] text-slate-500 truncate">Senior Officer #LM-408</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/90 bg-white shadow-subtle lg:block">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white shadow-elevated transition-transform duration-200 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition z-10"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          {navContent}
        </div>
      </aside>
    </>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 text-white shadow-sm ring-1 ring-brand-700/20">
        <Shield size={20} className="stroke-[2.2]" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-slate-900 text-base leading-none">
            PACKINSPECT
          </span>
          <span className="rounded bg-brand-600 px-1 py-0.2 text-[10px] font-black tracking-wide text-white">
            AI
          </span>
        </div>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Compliance Platform
        </p>
      </div>
    </div>
  );
}
