import type { LucideIcon } from 'lucide-react';
export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  tone = 'blue',
}: {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: 'blue' | 'green' | 'amber' | 'red';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={`rounded-lg p-2.5 ${colors[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-emerald-600">
        {change} <span className="font-normal text-slate-400">vs. last month</span>
      </p>
    </div>
  );
}
