import type { Violation } from '../../types';
import { AlertCircle, ShieldAlert, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export function ViolationCard({
  violation,
  confidence = 94,
}: {
  violation: Violation;
  confidence?: number;
}) {
  const { success } = useToast();
  const [reviewed, setReviewed] = useState(false);

  const config = {
    High: {
      border: 'border-rose-200/90',
      bg: 'bg-rose-50/50',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: 'text-rose-600',
      iconBg: 'bg-rose-100/80',
    },
    Medium: {
      border: 'border-amber-200/90',
      bg: 'bg-amber-50/50',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: 'text-amber-600',
      iconBg: 'bg-amber-100/80',
    },
    Low: {
      border: 'border-blue-200/90',
      bg: 'bg-blue-50/50',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100/80',
    },
  }[violation.severity];

  const handleReview = () => {
    setReviewed(true);
    success('Violation Verified', `Officer verified rule notice for ${violation.title}.`);
  };

  return (
    <div
      className={`rounded-xl border p-4.5 transition-all duration-150 ${config.border} ${config.bg} ${
        reviewed ? 'opacity-70 bg-slate-50 border-slate-200' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${config.iconBg} ${config.icon}`}>
            <AlertCircle size={20} className="stroke-[2.2]" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {violation.title}
              </h4>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${config.badge}`}
              >
                {violation.severity} Risk
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {violation.description}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Bar: Evidence, Rule, Confidence */}
      <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] font-bold text-navy-800 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
            {violation.rule}
          </span>
          <span className="text-[11px] text-slate-500">
            OCR Confidence: <b className="text-slate-800 font-bold">{confidence}%</b>
          </span>
          <span className="text-[11px] text-slate-500">
            Evidence: <span className="font-medium text-slate-700">Image Region #3</span>
          </span>
        </div>

        <button
          onClick={handleReview}
          disabled={reviewed}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
            reviewed
              ? 'bg-emerald-100 text-emerald-800 cursor-default'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
          }`}
        >
          {reviewed ? (
            <>
              <CheckCircle size={13} className="text-emerald-600" /> Reviewed
            </>
          ) : (
            <>Review Violation</>
          )}
        </button>
      </div>
    </div>
  );
}
