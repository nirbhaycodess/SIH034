import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { StatCard } from '../components/dashboard/StatCard';
import {
  ClipboardCheck,
  Percent,
  TriangleAlert,
  Users,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useState } from 'react';

const categoryData = [
  { category: 'Food & Beverages', inspections: 520, compliant: 440, violations: 80 },
  { category: 'Personal Care', inspections: 380, compliant: 295, violations: 85 },
  { category: 'Household', inspections: 240, compliant: 210, violations: 30 },
  { category: 'Electronics', inspections: 144, compliant: 93, violations: 51 },
];

const inspectorLeaderboard = [
  { name: 'Priya Sharma', role: 'Senior Officer', audits: 482, complianceRate: '86.4%', flags: 42 },
  { name: 'Rohan Mehta', role: 'Enforcement Officer', audits: 420, complianceRate: '88.1%', flags: 28 },
  { name: 'Vikram Singh', role: 'Field Inspector', audits: 382, complianceRate: '82.7%', flags: 35 },
];

const violationBreakdown = [
  { rule: 'Rule 6(1)(l)', title: 'Customer care email/phone missing', count: 38, pct: 42 },
  { rule: 'Rule 6(1)(e)', title: 'MRP format / tax inclusion error', count: 27, pct: 30 },
  { rule: 'Rule 6(1)(d)', title: 'Country of origin missing/obscured', count: 15, pct: 17 },
  { rule: 'Rule 11 & 12', title: 'Net quantity unit non-standard', count: 10, pct: 11 },
];

export function Analytics() {
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'ytd'>('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              National Intelligence
            </span>
            <span className="text-xs text-slate-400">• Enforcement Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Inspection & Compliance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Statistical breakdown of packaged commodity audits, recurring violation patterns, and field activity.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/60 self-start sm:self-auto">
          {(['30d', '90d', 'ytd'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-lg px-3 py-1 text-xs font-bold uppercase transition ${
                timeframe === t
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === '30d' ? 'Last 30 Days' : t === '90d' ? 'Last Quarter' : 'Year to Date'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Audits Conducted"
          value="12,458"
          change="+12.4%"
          trend="up"
          subtitle="All 14 jurisdictions"
          icon={ClipboardCheck}
          tone="blue"
        />
        <StatCard
          title="Average Compliance Rate"
          value="81.2%"
          change="+3.4%"
          trend="up"
          subtitle="Target: 85%"
          icon={Percent}
          tone="green"
        />
        <StatCard
          title="Active Violation Flags"
          value="1,223"
          change="-4.2%"
          trend="down"
          subtitle="Resolutions pending"
          icon={TriangleAlert}
          tone="red"
        />
        <StatCard
          title="Active Field Inspectors"
          value="48 Officers"
          change="+6.0%"
          trend="up"
          subtitle="Across 4 zones"
          icon={Users}
          tone="amber"
        />
      </div>

      {/* Category Breakdown & AI Insights */}
      <div className="grid gap-6 xl:grid-cols-12 items-start">
        {/* Category Compliance Bar Chart */}
        <div className="xl:col-span-8 card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inspections by Product Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Compliant commodities vs. non-compliant commodities
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              4 Industry Categories
            </span>
          </div>

          <div className="mt-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
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
                <Bar
                  dataKey="compliant"
                  name="Compliant"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="violations"
                  name="Violations"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Metrology Insight Bulletin */}
        <div className="xl:col-span-4 card p-5 sm:p-6 bg-gradient-to-br from-navy-900 to-slate-900 text-white flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Sparkles size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
                AI Enforcement Bulletin
              </h3>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-400" /> Personal Care High Flag Rate
                </p>
                <p className="mt-1 text-slate-300">
                  22.4% of cosmetic and shampoo labels reviewed this month omit the customer care helpline required under Rule 6(1)(l). Targeted manufacturer audit suggested.
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-cyan-400" /> Food Packaging Quality High
                </p>
                <p className="mt-1 text-slate-300">
                  Food & Beverage commodities achieved 84.6% compliance, showing the highest standard of standard net quantity unit conformity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 font-mono">
            Automated intelligence model v2.4 • Updated today
          </div>
        </div>
      </div>

      {/* Common Violations Distribution & Field Inspector Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Common Violations Distribution */}
        <div className="card p-5 sm:p-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Common Violation Distribution</h3>
              <p className="text-xs text-slate-500">Legal Metrology Rules, 2011 Non-compliance</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              90 Total Recorded
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {violationBreakdown.map((v, i) => (
              <div key={v.rule} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {v.title} <span className="font-mono text-slate-400 font-normal">({v.rule})</span>
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {v.count} ({v.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? 'bg-rose-500'
                        : i === 1
                        ? 'bg-amber-500'
                        : i === 2
                        ? 'bg-brand-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${v.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspector Leaderboard */}
        <div className="card p-5 sm:p-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Officer Activity & Performance</h3>
              <p className="text-xs text-slate-500">Field compliance enforcement audits completed</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              Zone 4 Division
            </span>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {inspectorLeaderboard.map((officer, idx) => (
              <div key={officer.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-50 text-xs font-black text-navy-800 border border-navy-100">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{officer.name}</p>
                    <p className="text-[11px] text-slate-400">{officer.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{officer.audits}</p>
                    <p className="text-[10px] text-slate-400">Audits</p>
                  </div>
                  <div>
                    <p className="font-bold text-emerald-600">{officer.complianceRate}</p>
                    <p className="text-[10px] text-slate-400">Pass Rate</p>
                  </div>
                  <div>
                    <p className="font-bold text-rose-600">{officer.flags}</p>
                    <p className="text-[10px] text-slate-400">Flags</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
