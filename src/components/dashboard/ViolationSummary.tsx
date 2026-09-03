import { AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const commonViolations = [
  {
    id: 'V-01',
    title: 'Customer Care Details Missing',
    rule: 'Rule 6(1)(l) — Packaged Commodities Rules',
    count: 38,
    pct: 42,
    severity: 'High',
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50 border-rose-100 text-rose-700',
  },
  {
    id: 'V-02',
    title: 'MRP / Inclusive Tax Format Non-compliant',
    rule: 'Rule 6(1)(e) — Price declaration font & format',
    count: 27,
    pct: 30,
    severity: 'Medium',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 border-amber-100 text-amber-700',
  },
  {
    id: 'V-03',
    title: 'Country of Origin Obscured or Missing',
    rule: 'Rule 6(1)(d) — Mandatory origin declaration',
    count: 15,
    pct: 17,
    severity: 'Medium',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 border-amber-100 text-amber-700',
  },
  {
    id: 'V-04',
    title: 'Net Quantity Prescribed Unit Violation',
    rule: 'Rule 11 & 12 — Standard unit declaration',
    count: 10,
    pct: 11,
    severity: 'Low',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 border-blue-100 text-blue-700',
  },
];

export function ViolationSummary() {
  return (
    <div className="card p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Common Violations</h3>
              <p className="text-xs text-slate-500">Legal Metrology Act violations this month</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
            90 Total Flags
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {commonViolations.map((v) => (
            <div key={v.id} className="group rounded-xl p-2.5 -mx-2.5 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-700 transition">
                      {v.title}
                    </p>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-extrabold uppercase border ${v.lightColor}`}
                    >
                      {v.severity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 font-mono">{v.rule}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-800">{v.count}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({v.pct}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${v.color}`}
                  style={{ width: `${v.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 text-center">
        <Link
          to="/analytics"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
        >
          Detailed violation analytics <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
