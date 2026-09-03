import type { Status, CheckStatus } from '../../types';

export function Badge({
  status,
  size = 'md',
  showDot = true,
}: {
  status: Status | CheckStatus | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}) {
  const norm = status.toUpperCase();

  const isCompliant = norm === 'COMPLIANT' || norm === 'PASS';
  const isViolation = norm === 'VIOLATION' || norm === 'FAIL';
  const isWarning = norm === 'NEEDS REVIEW' || norm === 'WARNING' || norm === 'REVIEW';

  const config = isCompliant
    ? {
        bg: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 border-emerald-200/60',
        dot: 'bg-emerald-500',
      }
    : isViolation
    ? {
        bg: 'bg-rose-50 text-rose-700 ring-rose-600/20 border-rose-200/60',
        dot: 'bg-rose-500',
      }
    : isWarning
    ? {
        bg: 'bg-amber-50 text-amber-700 ring-amber-600/20 border-amber-200/60',
        dot: 'bg-amber-500',
      }
    : {
        bg: 'bg-slate-100 text-slate-700 ring-slate-500/20 border-slate-200',
        dot: 'bg-slate-400',
      };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ring-1 ring-inset ${sizeClasses} ${config.bg}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />}
      {status}
    </span>
  );
}
