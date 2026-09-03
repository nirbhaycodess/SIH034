import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  SearchCheck,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ComplianceChart } from '../components/dashboard/ComplianceChart';
import { RecentInspections } from '../components/dashboard/RecentInspections';
import { StatCard } from '../components/dashboard/StatCard';
import { ViolationSummary } from '../components/dashboard/ViolationSummary';

const liveActivity = [
  {
    id: 1,
    officer: 'Rohan Mehta',
    action: 'Approved & certified commodity',
    product: 'Nature Harvest Oats (1 kg)',
    time: '18 minutes ago',
    status: 'COMPLIANT',
    score: 96,
  },
  {
    id: 2,
    officer: 'Priya Sharma',
    action: 'Flagged non-compliance notice',
    product: 'PowerCell AA Batteries (Pack of 4)',
    time: '45 minutes ago',
    status: 'VIOLATION',
    score: 64,
  },
  {
    id: 3,
    officer: 'Vikram Singh',
    action: 'Submitted routine compliance audit',
    product: 'PureHome Floor Cleaner (500 ml)',
    time: '2 hours ago',
    status: 'COMPLIANT',
    score: 91,
  },
  {
    id: 4,
    officer: 'Rohan Mehta',
    action: 'Requested manufacturer clarification',
    product: 'Sunny Bites Cookies (200 g)',
    time: '4 hours ago',
    status: 'NEEDS REVIEW',
    score: 76,
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Command Center Greeting & Quick Action */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              National Metrology Grid • Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Good morning, Inspector
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor packaged commodity inspections and compliance activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/inspection/new">
            <Button size="lg" className="shadow-elevated bg-brand-600 hover:bg-brand-700">
              <Plus size={18} className="stroke-[2.5]" />
              New Inspection
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Premium Statistics Cards with Requested Numbers */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Inspections"
          value="12,458"
          change="+12.4%"
          trend="up"
          subtitle="FY 2026-27"
          icon={ClipboardCheck}
          tone="blue"
        />
        <StatCard
          title="Compliant"
          value="8,921"
          change="+8.1%"
          trend="up"
          subtitle="71.6% total"
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          title="Needs Review"
          value="2,314"
          change="+4.7%"
          trend="up"
          subtitle="Requires officer signoff"
          icon={SearchCheck}
          tone="amber"
        />
        <StatCard
          title="Potential Violations"
          value="1,223"
          change="-2.3%"
          trend="down"
          subtitle="Notices pending"
          icon={AlertTriangle}
          tone="red"
        />
      </div>

      {/* Compliance Overview Chart & Violations Summary */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComplianceChart />
        </div>
        <ViolationSummary />
      </div>

      {/* Inspection Activity Feed & Recent Inspections Table */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Inspection Activity Feed */}
        <div className="card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Clock size={17} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Inspection Activity</h3>
                  <p className="text-xs text-slate-500">Live operational timeline</p>
                </div>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="mt-5 space-y-4">
              {liveActivity.map((a, i) => (
                <div key={a.id} className="relative flex gap-3 pb-3 last:pb-0">
                  {i < liveActivity.length - 1 && (
                    <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-100" />
                  )}
                  <div
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ring-4 ring-white z-10 ${
                      a.status === 'COMPLIANT'
                        ? 'bg-emerald-100 text-emerald-700'
                        : a.status === 'VIOLATION'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {a.score}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {a.officer} · <span className="font-normal text-slate-500">{a.action}</span>
                    </p>
                    <p className="text-xs font-semibold text-brand-700 truncate mt-0.5">
                      {a.product}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <Link
              to="/inspections"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
            >
              View audit log records <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Recent Inspections Table */}
        <div className="xl:col-span-2">
          <RecentInspections />
        </div>
      </div>
    </div>
  );
}
