import { Bell, Menu, Search } from 'lucide-react';
export function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
      <button onClick={onMenu} className="rounded-md p-2 hover:bg-slate-100 lg:hidden">
        <Menu size={21} />
      </button>
      <div className="relative hidden w-80 md:block">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
        <input
          placeholder="Search inspections, products..."
          className="w-full rounded-lg bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
          <i className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            PS
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Priya Sharma</p>
            <p className="text-xs text-slate-500">Enforcement Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
