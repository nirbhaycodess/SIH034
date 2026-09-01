import { Eye, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { mockInspections } from '../data/mockInspections';
export function InspectionHistory() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const rows = useMemo(
    () =>
      mockInspections.filter(
        (x) =>
          (status === 'All' || x.status === status) &&
          `${x.product} ${x.manufacturer}`.toLowerCase().includes(q.toLowerCase())
      ),
    [q, status]
  );
  return (
    <div>
      <h1 className="page-title">Inspection history</h1>
      <p className="page-subtitle">Search and review all recorded package inspections.</p>
      <div className="card mt-7 p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-3 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search product or manufacturer"
              className="field mt-0 pl-9"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field mt-0 md:w-48">
            <option>All</option>
            <option>COMPLIANT</option>
            <option>NEEDS REVIEW</option>
            <option>VIOLATION</option>
          </select>
          <select className="field mt-0 md:w-48">
            <option>All categories</option>
            <option>Food & Beverages</option>
            <option>Personal Care</option>
          </select>
        </div>
      </div>
      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Inspection ID', 'Product', 'Manufacturer', 'Date', 'Score', 'Status', 'Inspector', ''].map(
                (h) => (
                  <th key={h} className="px-5 py-3">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="px-5 py-4 font-semibold text-blue-700">{x.id}</td>
                <td className="font-semibold">{x.product}</td>
                <td>{x.manufacturer}</td>
                <td>{x.date}</td>
                <td className="font-bold">{x.score}%</td>
                <td>
                  <Badge status={x.status} />
                </td>
                <td>{x.inspector}</td>
                <td className="px-5">
                  <Link to={`/inspection/${x.id}`} className="text-blue-700">
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="p-10 text-center text-sm text-slate-500">
            No inspections match the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
