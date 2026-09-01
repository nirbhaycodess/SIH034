import { Download, Eye, FileText } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockInspections } from '../data/mockInspections';
export function Reports() {
  return (
    <div>
      <h1 className="page-title">Reports</h1>
      <p className="page-subtitle">Generated compliance records ready for review and export.</p>
      <div className="mt-7 space-y-3">
        {mockInspections.map((x) => (
          <div key={x.id} className="card flex flex-col gap-4 p-5 md:flex-row md:items-center">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <FileText size={20} />
            </span>
            <div className="flex-1">
              <h2 className="font-semibold">REP-{x.id.slice(4)}</h2>
              <p className="text-sm text-slate-500">
                {x.product} · {x.date} · {x.inspector}
              </p>
            </div>
            <Badge status={x.status} />
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3">
                <Eye size={16} />
                View
              </Button>
              <Button className="px-3">
                <Download size={16} />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
