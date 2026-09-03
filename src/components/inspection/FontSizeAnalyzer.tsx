import React, { useState } from 'react';
import { Ruler, Sparkles, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface FontCheckItem {
  field: string;
  measuredMm: number;
  mandatedMm: number;
  pdpAreaCm2: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
  ruleRef: string;
  details: string;
}

export function FontSizeAnalyzer({
  netQuantity = '340 ml',
  pdpArea = 180, // cm²
}: {
  netQuantity?: string;
  pdpArea?: number;
}) {
  const [selectedField, setSelectedField] = useState<string>('net_quantity');

  // Second Schedule rule table:
  // Net qty <= 50g/ml: 1.0mm
  // 50 < qty <= 200: 2.0mm
  // 200 < qty <= 1000: 4.0mm
  // > 1000: 6.0mm
  const fontChecks: Record<string, FontCheckItem> = {
    net_quantity: {
      field: 'Net Quantity Numerals',
      measuredMm: 4.2,
      mandatedMm: 4.0,
      pdpAreaCm2: pdpArea,
      status: 'PASS',
      ruleRef: 'Rule 9 & Second Schedule, Table 1',
      details: 'For 340ml package with PDP > 100 cm², minimum numeral height mandated is 4.0 mm. Measured: 4.2 mm.',
    },
    mrp: {
      field: 'MRP & Unit Sale Price',
      measuredMm: 2.8,
      mandatedMm: 2.0,
      pdpAreaCm2: pdpArea,
      status: 'PASS',
      ruleRef: 'Rule 6(1)(e) & Rule 9(2)',
      details: 'Measured MRP numeral height conforms to minimum permissible size for secondary price text.',
    },
    consumer_care: {
      field: 'Consumer Care Contact Text',
      measuredMm: 1.2,
      mandatedMm: 2.0,
      pdpAreaCm2: pdpArea,
      status: 'FAIL',
      ruleRef: 'Rule 9(1) Readability & Contrast',
      details: 'Helpline font size is 1.2 mm, which falls below the statutory 2.0 mm threshold for this package size.',
    },
    manufacturer: {
      field: 'Manufacturer Name & Address',
      measuredMm: 2.1,
      mandatedMm: 2.0,
      pdpAreaCm2: pdpArea,
      status: 'PASS',
      ruleRef: 'Rule 6(1)(a) & Rule 9(1)',
      details: 'Manufacturer text meets font height requirement with distinct foreground/background contrast ratio of 7.4:1.',
    },
  };

  const active = fontChecks[selectedField] || fontChecks.net_quantity;

  return (
    <div className="card p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700 border border-brand-100">
            <Ruler size={19} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              Font Size & Principal Display Panel (PDP) Analysis
              <span className="rounded bg-brand-100 text-brand-800 text-[10px] font-mono font-bold px-1.5 py-0.5">
                Rule 9 & Second Schedule
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated computer-vision letter height measurement based on net quantity & package surface area.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 self-start sm:self-auto font-mono">
          <span className="text-slate-500">PDP Area: <b className="text-slate-800 font-bold">{pdpArea} cm²</b></span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Tier: <b className="text-slate-800 font-bold">200g - 1kg (4.0mm)</b></span>
        </div>
      </div>

      {/* Interactive Field Selector Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(fontChecks).map(([key, item]) => {
          const isSelected = selectedField === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedField(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.status === 'PASS' ? (
                <CheckCircle2 size={13} className={isSelected ? 'text-emerald-400' : 'text-emerald-600'} />
              ) : item.status === 'WARNING' ? (
                <AlertTriangle size={13} className={isSelected ? 'text-amber-400' : 'text-amber-600'} />
              ) : (
                <XCircle size={13} className={isSelected ? 'text-rose-400' : 'text-rose-600'} />
              )}
              <span>{item.field}</span>
              <span className="font-mono text-[11px] opacity-75">({item.measuredMm}mm)</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Analysis Gauge Box */}
      <div className="mt-4 grid gap-4 lg:grid-cols-12 rounded-xl bg-slate-50 p-4 border border-slate-200/80 items-center">
        {/* Metric Gauges */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-white p-3 border border-slate-200/60 shadow-subtle">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Measured Height</p>
            <p className={`text-2xl font-black mt-1 font-mono ${
              active.status === 'PASS' ? 'text-emerald-600' : active.status === 'WARNING' ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {active.measuredMm} <span className="text-xs font-normal">mm</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Optical calibration</p>
          </div>

          <div className="rounded-lg bg-white p-3 border border-slate-200/60 shadow-subtle">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Statutory Minimum</p>
            <p className="text-2xl font-black mt-1 font-mono text-slate-800">
              {active.mandatedMm} <span className="text-xs font-normal">mm</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Second Schedule</p>
          </div>
        </div>

        {/* Evaluation Findings & Legal Citation */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Findings for <span className="text-brand-700">{active.field}</span>
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              active.status === 'PASS'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : active.status === 'WARNING'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {active.status === 'PASS' ? 'COMPLIANT WITH RULE 9' : active.status === 'WARNING' ? 'SUB-OPTIMAL CONTRAST' : 'NON-COMPLIANT FONT SIZE'}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {active.details}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <Info size={13} className="text-slate-400 shrink-0" />
            <span>Citation: <strong className="text-slate-700">{active.ruleRef}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

