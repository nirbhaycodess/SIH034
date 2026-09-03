import { ArrowRight, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockInspections } from '../../data/mockInspections';
import { Badge } from '../common/Badge';

export function RecentInspections() {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Recent Inspections</h3>
            <span className="rounded-full bg-brand-50 text-brand-700 font-bold text-xs px-2.5 py-0.5 border border-brand-100">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest packaged commodity audits submitted by field officers
          </p>
        </div>
        <Link
          to="/inspections"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800 transition"
        >
          View all 12,458 inspections <ArrowRight size={14} />
        </Link>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Product & ID</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Score</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Inspector</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockInspections.map((x) => (
              <tr key={x.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <Link
                    to={`/inspection/${x.id}`}
                    className="font-bold text-slate-900 group-hover:text-brand-700 transition"
                  >
                    {x.product}
                  </Link>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{x.id} • {x.category}</p>
                </td>
                <td className="px-4 py-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                  {x.date}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black ${
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
                <td className="px-4 py-4 text-xs font-medium text-slate-600">
                  {x.inspector}
                </td>
                <td className="px-6 py-4 text-right">
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

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {mockInspections.map((x) => (
          <Link
            key={x.id}
            to={`/inspection/${x.id}`}
            className="block p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{x.product}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{x.id}</p>
              </div>
              <Badge status={x.status} size="sm" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
              <span>Score: <b className="text-slate-800 font-bold">{x.score}%</b></span>
              <span>{x.date}</span>
              <span className="text-brand-600 font-semibold flex items-center gap-0.5">
                Review <ChevronRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
