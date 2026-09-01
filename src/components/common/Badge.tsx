import type { Status, CheckStatus } from '../../types';
export function Badge({ status }: { status: Status | CheckStatus }) {
  const c =
    status === 'COMPLIANT' || status === 'PASS'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
      : status === 'VIOLATION' || status === 'FAIL'
        ? 'bg-red-50 text-red-700 ring-red-600/20'
        : status === 'NEEDS REVIEW' || status === 'WARNING' || status === 'REVIEW'
          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
          : 'bg-slate-100 text-slate-600 ring-slate-500/20';
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${c}`}
    >
      {status}
    </span>
  );
}
