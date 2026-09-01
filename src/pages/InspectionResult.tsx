import { CheckCircle2, Download, Edit3, Image as ImageIcon, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { ComplianceResult } from '../components/inspection/ComplianceResult';
import { ViolationCard } from '../components/inspection/ViolationCard';
import type { Inspection } from '../types';
import { getInspectionById } from '../services/api';
export function InspectionResult() {
  const { id = '' } = useParams();
  const [item, setItem] = useState<Inspection>();
  useEffect(() => {
    getInspectionById(id).then(setItem);
  }, [id]);
  if (!item) return <Loading label="Loading inspection…" />;
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <div>
          <p className="text-sm font-semibold text-blue-700">{item.id}</p>
          <h1 className="page-title">Inspection result</h1>
          <p className="page-subtitle">
            {item.product} · inspected {item.date}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Download size={16} />
            Download report
          </Button>
          <Button variant="secondary">
            <Save size={16} />
            Save inspection
          </Button>
          <Button>
            <CheckCircle2 size={16} />
            Mark as reviewed
          </Button>
        </div>
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        <div className="card p-6 text-center">
          <p className="text-sm font-semibold text-slate-500">COMPLIANCE SCORE</p>
          <p className="mt-2 text-5xl font-bold text-blue-700">{item.score}%</p>
          <div className="mx-auto mt-4 w-max">
            <Badge status={item.status} />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            AI extraction confidence: <b className="text-slate-700">94%</b>
          </p>
        </div>
        <div className="card p-5 xl:col-span-2">
          <h2 className="font-bold">Product information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {item.declarations.slice(0, 6).map((x) => (
              <div key={x.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{x.label}</p>
                <p className="mt-1 text-sm font-medium">{x.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <ComplianceResult inspection={item} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold">Potential violations</h2>
          <div className="mt-4 space-y-3">
            {item.violations.length ? (
              item.violations.map((x) => <ViolationCard key={x.id} violation={x} />)
            ) : (
              <p className="rounded-lg bg-emerald-50 p-5 text-sm text-emerald-700">
                No potential violations detected.
              </p>
            )}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Evidence image</h2>
          <div className="mt-4 grid h-60 place-items-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50">
            <div className="text-center">
              <ImageIcon className="mx-auto text-blue-500" size={34} />
              <p className="mt-2 text-sm font-semibold text-blue-800">Highlighted declaration evidence</p>
              <p className="mt-1 text-xs text-blue-600">Image processing placeholder</p>
            </div>
          </div>
          <label className="mt-4 block text-sm font-medium">
            Inspector remarks
            <textarea className="field min-h-20" placeholder="Add observations or a review note…" />
          </label>
          <Button variant="secondary" className="mt-3">
            <Edit3 size={16} />
            Save remarks
          </Button>
        </div>
      </div>
    </div>
  );
}
