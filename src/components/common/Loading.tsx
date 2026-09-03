import { Loader2 } from 'lucide-react';

export function Loading({
  label = 'Loading…',
  sublabel,
}: {
  label?: string;
  sublabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="relative">
        <span className="h-10 w-10 block rounded-full border-2 border-brand-100 animate-ping absolute inset-0 opacity-40" />
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600 shadow-sm border border-brand-100">
          <Loader2 size={22} className="animate-spin" />
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
      </div>
    </div>
  );
}
