import { Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { mockProducts } from '../data/mockProducts';
export function ProductRepository() {
  const [q, setQ] = useState('');
  const items = mockProducts.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <h1 className="page-title">Product repository</h1>
      <p className="page-subtitle">Previously scanned commodities and their latest compliance record.</p>
      <div className="relative mt-7 max-w-md">
        <Search size={17} className="absolute left-3 top-3 text-slate-400" />
        <input
          className="field mt-0 pl-9"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((x, i) => (
          <div className="card overflow-hidden" key={x.id}>
            <div
              className={`grid h-32 place-items-center ${['bg-amber-50', 'bg-emerald-50', 'bg-indigo-50'][i % 3]}`}
            >
              <span className="text-4xl">{['🧴', '🥣', '🔋'][i % 3]}</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between gap-2">
                <div>
                  <h2 className="font-bold">{x.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {x.brand} · {x.category}
                  </p>
                </div>
                <Badge status={x.status} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Last inspection</p>
                  <p className="mt-1 font-medium">{x.lastInspection}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Violations</p>
                  <p className="mt-1 font-medium">{x.violations}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
