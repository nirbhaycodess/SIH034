import {
  BarChart3,
  ClipboardPlus,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
const links = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/inspection/new', 'New Inspection', ClipboardPlus],
  ['/inspections', 'Inspection History', History],
  ['/products', 'Product Repository', PackageSearch],
  ['/reports', 'Reports', FileText],
  ['/analytics', 'Analytics', BarChart3],
  ['/settings', 'Settings', Settings],
] as const;
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = (
    <nav className="mt-7 space-y-1">
      {links.map(([to, label, Icon]) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Brand />
        {nav}
        <div className="absolute bottom-5 left-5 right-5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-50 bg-slate-900/30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white p-5 shadow-xl transition-transform lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-white">
        <ShieldCheck size={21} />
      </span>
      <div>
        <p className="font-bold leading-none text-slate-900">PackSure AI</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          Compliance Suite
        </p>
      </div>
    </div>
  );
}
