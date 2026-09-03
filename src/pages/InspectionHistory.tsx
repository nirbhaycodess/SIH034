import {
  Eye,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Calendar,
  ChevronRight,
  Plus,
  Package,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockInspections } from '../data/mockInspections';
import { useToast } from '../context/ToastContext';

export function InspectionHistory() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const { success } = useToast();

  const rows = useMemo(() => {
    return mockInspections
      .filter((x) => {
        const matchesStatus = status === 'All' || x.status === status;
        const matchesCategory = category === 'All' || x.category === category;
        const matchesQuery =
          `${x.product} ${x.manufacturer} ${x.id}`.toLowerCase().includes(q.toLowerCase());
        return matchesStatus && matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score;
        return 0; // default order
      });
  }, [q, status, category, sortBy]);

  const handleExportCSV = () => {
    success('CSV Exported', 'Inspection records successfully exported to CSV file.');
  };

  const handleResetFilters = () => {
    setQ('');
    setStatus('All');
    setCategory('All');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              Audit Registry
            </span>
            <span className="text-xs text-slate-400">• National Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Inspection History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter and review all recorded packaged commodity compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" onClick={handleExportCSV}>
            <Download size={15} />
            Export CSV
          </Button>
          <Link to="/inspection/new">
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Plus size={16} />
              New Inspection
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Search Box */}
          <div className="relative lg:col-span-5">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by product name, manufacturer, or ID…"
              className="field pl-9 py-2 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field py-2 text-xs cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="NEEDS REVIEW">Needs Review Only</option>
              <option value="VIOLATION">Violations Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field py-2 text-xs cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Household">Household</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          {/* Sort By Toggle */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'score' : 'date')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition"
            >
              <ArrowUpDown size={13} />
              {sortBy === 'score' ? 'Top Score' : 'Latest Date'}
            </button>
            {(q || status !== 'All' || category !== 'All') && (
              <button
                onClick={handleResetFilters}
                title="Reset filters"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table: Desktop / Tablet */}
      <div className="card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Inspection ID</th>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Manufacturer</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Score</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5">Inspector</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-brand-700">
                    <Link to={`/inspection/${x.id}`} className="hover:underline">
                      {x.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/inspection/${x.id}`}
                      className="font-bold text-slate-900 group-hover:text-brand-700 transition"
                    >
                      {x.product}
                    </Link>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{x.category}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600 max-w-[200px] truncate">
                    {x.manufacturer}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                    {x.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black ${
                          x.score >= 90
                            ? 'text-emerald-700'
                            : x.score >= 75
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {x.score}%
                      </span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${
                            x.score >= 90
                              ? 'bg-emerald-500'
                              : x.score >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${x.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge status={x.status} />
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {x.inspector}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link
                      to={`/inspection/${x.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50/60 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-200/50 transition"
                    >
                      <Eye size={13} />
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {rows.map((x) => (
            <Link
              key={x.id}
              to={`/inspection/${x.id}`}
              className="block p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-mono font-bold text-brand-700">{x.id}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{x.product}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{x.manufacturer}</p>
                </div>
                <Badge status={x.status} size="sm" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-50">
                <span>Score: <b className="text-slate-800 font-bold">{x.score}%</b></span>
                <span>{x.date}</span>
                <span className="text-brand-600 font-semibold flex items-center gap-0.5">
                  View <ChevronRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {!rows.length && (
          <div className="py-16 text-center p-6">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">No inspections match the filter</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, status selection, or reset filters to view all records.
            </p>
            <div className="mt-5">
              <Button variant="secondary" onClick={handleResetFilters}>
                <RotateCcw size={14} />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
