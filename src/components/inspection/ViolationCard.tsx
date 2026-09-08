import { AlertTriangle } from 'lucide-react';

export function ViolationCard({ violation, confidence = 90 }: any) {
  // 1. Safely handle missing severity and force it to uppercase
  const safeSeverity = (violation?.severity || 'REVIEW').toUpperCase();

  // 2. The fallback object at the end guarantees 'config.border' will NEVER be undefined
  const config = {
    CRITICAL: { border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-900', badge: 'bg-rose-600' },
    HIGH: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-500' },
    MEDIUM: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-500' },
    LOW: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900', badge: 'bg-blue-500' },
  }[safeSeverity] || { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-900', badge: 'bg-slate-500' };

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl border ${config.border} ${config.bg}`}>
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <AlertTriangle size={16} className={config.text} />
            <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${config.badge}`}>
               {safeSeverity}
            </span>
            <span className="font-mono text-xs text-slate-500">{violation?.id || 'V-UNKNOWN'}</span>
         </div>
         <span className="text-xs font-bold text-slate-500">{confidence}% Match</span>
      </div>
      <h4 className={`font-bold text-sm ${config.text}`}>{violation?.title || 'Metrology Violation Flagged'}</h4>
      <p className="text-xs text-slate-700">{violation?.description || 'Mandatory declaration anomaly detected.'}</p>
      
      {violation?.recommendation && (
        <div className="mt-2 text-[11px] font-medium bg-white/60 p-2 rounded border border-white">
          <span className="font-bold">Recommendation:</span> {violation.recommendation}
        </div>
      )}
    </div>
  );
}