import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  tone = 'blue',
  trend = 'up',
  subtitle,
}: {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: 'blue' | 'green' | 'amber' | 'red';
  trend?: 'up' | 'down';
  subtitle?: string;
}) {
  const styles = {
    blue: {
      iconBg: 'bg-brand-50 text-brand-700 ring-brand-600/10',
      borderAccent: 'border-l-brand-600',
      progressBg: 'bg-brand-600',
    },
    green: {
      iconBg: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
      borderAccent: 'border-l-emerald-600',
      progressBg: 'bg-emerald-600',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700 ring-amber-600/10',
      borderAccent: 'border-l-amber-500',
      progressBg: 'bg-amber-500',
    },
    red: {
      iconBg: 'bg-rose-50 text-rose-700 ring-rose-600/10',
      borderAccent: 'border-l-rose-600',
      progressBg: 'bg-rose-600',
    },
  }[tone];

  const isPositive = trend === 'up';

  return (
    <div className={`card p-5 relative overflow-hidden card-hover border-l-4 ${styles.borderAccent}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 font-sans">{value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${styles.iconBg} shadow-xs shrink-0`}>
          <Icon size={22} className="stroke-[2.2]" />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <span
            className={`inline-flex items-center font-bold gap-0.5 ${
              tone === 'red'
                ? isPositive
                  ? 'text-rose-600'
                  : 'text-emerald-600'
                : isPositive
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
          <span className="text-slate-400 font-normal">vs. last month</span>
        </div>
        {subtitle && <span className="text-[11px] text-slate-400 font-medium">{subtitle}</span>}
      </div>
    </div>
  );
}
