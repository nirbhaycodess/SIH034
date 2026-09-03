import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useState } from 'react';

const monthlyData = [
  { m: 'Mar 2026', compliant: 720, review: 180, violations: 95, rate: 72.3 },
  { m: 'Apr 2026', compliant: 810, review: 195, violations: 88, rate: 74.1 },
  { m: 'May 2026', compliant: 890, review: 210, violations: 92, rate: 74.6 },
  { m: 'Jun 2026', compliant: 1040, review: 230, violations: 110, rate: 75.3 },
  { m: 'Jul 2026', compliant: 1120, review: 240, violations: 105, rate: 76.4 },
  { m: 'Aug 2026', compliant: 1284, review: 156, violations: 90, rate: 83.9 },
];

export function ComplianceChart() {
  const [view, setView] = useState<'volume' | 'rate'>('volume');

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Compliance & Inspection Overview</h3>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              83.9% Pass Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown of inspected commodities under Legal Metrology Rules, 2011
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1 self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setView('volume')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              view === 'volume'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Volume Count
          </button>
          <button
            onClick={() => setView('rate')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              view === 'rate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compliance %
          </button>
        </div>
      </div>

      <div className="mt-5 h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'volume' ? (
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="m"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="compliant"
                name="Compliant"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#colorCompliant)"
              />
              <Area
                type="monotone"
                dataKey="review"
                name="Needs Review"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#colorReview)"
              />
              <Area
                type="monotone"
                dataKey="violations"
                name="Violations"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#colorViolations)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="m"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                domain={[60, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="%"
              />
              <Tooltip
                formatter={(val: number) => [`${val}%`, 'Compliance Rate']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                name="Compliance Rate %"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#colorRate)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
