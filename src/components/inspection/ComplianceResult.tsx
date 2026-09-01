import type { Inspection } from '../../types';
import { Badge } from '../common/Badge';
export function ComplianceResult({ inspection }: { inspection: Inspection }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b p-5">
        <h3 className="font-bold">Compliance checks</h3>
        <p className="text-sm text-slate-500">Rule-based declaration assessment</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Requirement</th>
              <th>Detected value</th>
              <th>Status</th>
              <th className="px-5">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {inspection.checks.map((c) => (
              <tr key={c.requirement} className="border-t align-top">
                <td className="px-5 py-4 font-semibold">{c.requirement}</td>
                <td className="py-4 text-slate-600">{c.detectedValue}</td>
                <td className="py-4">
                  <Badge status={c.status} />
                </td>
                <td className="px-5 py-4 text-slate-500">{c.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
