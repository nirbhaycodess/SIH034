import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockInspections } from '../../data/mockInspections';
import { Badge } from '../common/Badge';
export function RecentInspections() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="font-bold">Recent inspections</h3>
          <p className="text-sm text-slate-500">Latest package reviews</p>
        </div>
        <Link to="/inspections" className="flex items-center gap-1 text-sm font-semibold text-blue-700">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-y bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Inspection</th>
              <th>Score</th>
              <th>Status</th>
              <th className="px-5">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockInspections.slice(0, 4).map((x) => (
              <tr key={x.id} className="border-b last:border-0">
                <td className="px-5 py-4">
                  <Link to={`/inspection/${x.id}`} className="font-semibold text-slate-800">
                    {x.product}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">{x.id}</p>
                </td>
                <td className="font-bold">{x.score}%</td>
                <td>
                  <Badge status={x.status} />
                </td>
                <td className="px-5 text-slate-500">{x.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
