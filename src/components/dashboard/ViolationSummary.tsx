import { AlertTriangle } from 'lucide-react';
import { mockViolations } from '../../data/mockViolations';
export function ViolationSummary() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">Violation summary</h3>
          <p className="text-sm text-slate-500">Common issues this month</p>
        </div>
        <AlertTriangle className="text-amber-500" />
      </div>
      <div className="mt-4 space-y-4">
        {mockViolations.map((v, i) => (
          <div key={v.id} className="flex gap-3">
            <span
              className={`mt-1 h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-amber-500' : 'bg-blue-500'}`}
            />
            <div className="flex-1">
              <div className="flex justify-between gap-2">
                <p className="text-sm font-semibold">{v.title}</p>
                <span className="text-xs font-bold text-slate-500">{24 - i * 7}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{v.rule}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
