import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function Badge({ status, size = 'sm' }: any) {
  const safeStatus = (status || 'REVIEW').toUpperCase();
  
  // Explicitly tell TypeScript this is a dictionary object
  const config: Record<string, any> = {
    COMPLIANT: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
    VIOLATION: { border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-700', icon: XCircle },
    'NEEDS REVIEW': { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle },
    REVIEW: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle }
  };

  const appliedConfig = config[safeStatus] || { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-700', icon: AlertTriangle };
  const Icon = appliedConfig.icon;
  
  const padding = size === 'md' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${appliedConfig.border} ${appliedConfig.bg} ${appliedConfig.text} ${padding}`}>
      <Icon size={size === 'md' ? 16 : 14} />
      {safeStatus}
    </span>
  );
}