import type { Violation } from '../../types';
import { AlertCircle } from 'lucide-react';
export function ViolationCard({ violation }: { violation: Violation }) {
  const c = {
    High: 'border-red-200 bg-red-50 text-red-700',
    Medium: 'border-amber-200 bg-amber-50 text-amber-700',
    Low: 'border-blue-200 bg-blue-50 text-blue-700',
  }[violation.severity];
  return (
    <div className={`rounded-lg border p-4 ${c}`}>
      <div className="flex gap-3">
        <AlertCircle size={19} />
        <div>
          <div className="flex gap-2">
            <p className="font-semibold">{violation.title}</p>
            <span className="text-xs">{violation.severity}</span>
          </div>
          <p className="mt-1 text-sm opacity-90">{violation.description}</p>
          <p className="mt-2 text-xs font-semibold">{violation.rule}</p>
        </div>
      </div>
    </div>
  );
}
