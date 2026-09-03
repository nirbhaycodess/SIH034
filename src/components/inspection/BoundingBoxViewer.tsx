import { useState } from 'react';
import { Layers, ZoomIn, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface Box {
  id: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  confidence: number;
}

const boundingBoxes: Box[] = [
  {
    id: 'name',
    label: 'Product Name',
    top: '16%',
    left: '18%',
    width: '64%',
    height: '14%',
    status: 'PASS',
    confidence: 98,
  },
  {
    id: 'mfr',
    label: 'Manufacturer Info',
    top: '34%',
    left: '15%',
    width: '70%',
    height: '15%',
    status: 'PASS',
    confidence: 94,
  },
  {
    id: 'qty',
    label: 'Net Quantity (340 ml)',
    top: '54%',
    left: '28%',
    width: '44%',
    height: '12%',
    status: 'PASS',
    confidence: 99,
  },
  {
    id: 'mrp',
    label: 'MRP Declaration',
    top: '70%',
    left: '20%',
    width: '60%',
    height: '12%',
    status: 'WARNING',
    confidence: 91,
  },
  {
    id: 'care',
    label: 'Customer Care Details',
    top: '84%',
    left: '15%',
    width: '70%',
    height: '11%',
    status: 'FAIL',
    confidence: 67,
  },
];

export function BoundingBoxViewer({
  imageUrl = 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
  productName = 'FreshGlow Herbal Shampoo',
}: {
  imageUrl?: string;
  productName?: string;
}) {
  const [showBoxes, setShowBoxes] = useState(true);
  const [activeBox, setActiveBox] = useState<string | null>(null);

  return (
    <div className="card overflow-hidden flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <Layers size={17} className="text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">AI Evidence Inspection View</h3>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-brand-700">
            5 Regions Detected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
              showBoxes
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {showBoxes ? <Eye size={13} /> : <EyeOff size={13} />}
            {showBoxes ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}
          </button>
        </div>
      </div>

      {/* Interactive Label View with Bounding Boxes */}
      <div className="relative flex-1 min-h-[360px] bg-slate-950 flex items-center justify-center p-4 overflow-hidden select-none">
        <div className="relative max-w-sm w-full rounded-lg overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-auto object-contain max-h-[420px] rounded-lg opacity-90 transition-opacity"
          />

          {/* Bounding Boxes */}
          {showBoxes &&
            boundingBoxes.map((box) => {
              const isSelected = activeBox === box.id;
              const colorClass =
                box.status === 'PASS'
                  ? 'border-emerald-400/90 bg-emerald-400/10 text-emerald-300'
                  : box.status === 'WARNING'
                  ? 'border-amber-400/90 bg-amber-400/15 text-amber-300'
                  : 'border-rose-500/90 bg-rose-500/20 text-rose-300 border-dashed';

              return (
                <div
                  key={box.id}
                  onClick={() => setActiveBox(isSelected ? null : box.id)}
                  style={{
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height,
                  }}
                  className={`absolute cursor-pointer border-2 transition-all duration-150 rounded-md ${colorClass} ${
                    isSelected
                      ? 'ring-4 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-[1.02] z-30'
                      : 'hover:scale-[1.01] hover:border-white z-10'
                  }`}
                >
                  <div
                    className={`absolute -top-6 left-0 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 whitespace-nowrap ${
                      box.status === 'PASS'
                        ? 'bg-emerald-600 text-white'
                        : box.status === 'WARNING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    <span>{box.label}</span>
                    <span className="opacity-80">({box.confidence}%)</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1.5 text-xs">
        <span className="text-[11px] font-bold text-slate-400 self-center mr-1">Highlight:</span>
        {boundingBoxes.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBox(activeBox === b.id ? null : b.id)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition ${
              activeBox === b.id
                ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                : b.status === 'PASS'
                ? 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                : b.status === 'WARNING'
                ? 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            {b.label.split(' (')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

