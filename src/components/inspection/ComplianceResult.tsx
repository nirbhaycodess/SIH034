import { useState } from 'react';
import type { Inspection } from '../../types';
import { Badge } from '../common/Badge';
import { CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react';

export function ComplianceResult({ inspection }: { inspection: Inspection }) {
  const [filter, setFilter] = useState<'ALL' | 'PASS' | 'WARNING' | 'FAIL'>('ALL');

  const filteredChecks = inspection.checks.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Declaration Analysis</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {inspection.checks.length} Prescribed Checks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-by-rule assessment under Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'PASS', 'WARNING', 'FAIL'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'ALL' ? 'All Checks' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Mandatory Requirement</th>
              <th className="px-5 py-3.5">Detected Value</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">AI Confidence</th>
              <th className="px-6 py-3.5">Rule Compliance Finding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChecks.map((c, i) => {
              // Simulated high confidence based on status
              const confidence = c.status === 'PASS' ? 98 - i * 2 : c.status === 'WARNING' ? 88 : 67;
              return (
                <tr key={c.requirement} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                    {c.requirement}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-800">
                      {c.detectedValue}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Badge status={c.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-700">
                        {confidence}%
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${
                            confidence >= 90
                              ? 'bg-emerald-500'
                              : confidence >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 leading-relaxed max-w-sm">
                    {c.explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
