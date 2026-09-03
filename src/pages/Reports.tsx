import { Download, Eye, FileText, Printer, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockInspections } from '../data/mockInspections';
import { ReportCertificateModal } from '../components/reports/ReportCertificateModal';
import type { Inspection } from '../types';
import { useToast } from '../context/ToastContext';

export function Reports() {
  const [q, setQ] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const { success } = useToast();

  const reportsList = mockInspections.map((x) => ({
    reportId: `REP-${x.id.slice(4)}`,
    inspection: x,
    generatedDate: `${x.date}, 14:30 IST`,
  }));

  const filtered = reportsList.filter(
    (r) =>
      r.reportId.toLowerCase().includes(q.toLowerCase()) ||
      r.inspection.product.toLowerCase().includes(q.toLowerCase()) ||
      r.inspection.inspector.toLowerCase().includes(q.toLowerCase())
  );

  const handleQuickDownload = (prodName: string) => {
    success('Certificate Downloaded', `PDF compliance audit certificate for ${prodName} downloaded.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              Legal Certificates
            </span>
            <span className="text-xs text-slate-400">• Official Inspection Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit certificates and statutory notices generated under Legal Metrology Rules, 2011.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 sm:p-5">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            className="field pl-9 py-2 text-xs"
            placeholder="Search report ID, product, or inspector…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Table / Cards */}
      <div className="card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Report ID</th>
                <th className="px-5 py-3.5">Product & Commodity</th>
                <th className="px-4 py-3.5">Inspection Date</th>
                <th className="px-4 py-3.5">Compliance Status</th>
                <th className="px-4 py-3.5">Inspector</th>
                <th className="px-4 py-3.5">Generated Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.reportId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-brand-700">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-slate-400 shrink-0" />
                      {item.reportId}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{item.inspection.product}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.inspection.id}</p>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {item.inspection.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge status={item.inspection.status} />
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {item.inspection.inspector}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-400 whitespace-nowrap">
                    {item.generatedDate}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedInspection(item.inspection)}
                      >
                        <Eye size={13} />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-brand-600 hover:bg-brand-700"
                        onClick={() => handleQuickDownload(item.inspection.product)}
                      >
                        <Download size={13} />
                        PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map((item) => (
            <div key={item.reportId} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-700">
                    {item.reportId}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                    {item.inspection.product}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.inspection.date} • {item.inspection.inspector}
                  </p>
                </div>
                <Badge status={item.inspection.status} size="sm" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedInspection(item.inspection)}
                >
                  <Eye size={13} />
                  View Certificate
                </Button>
                <Button
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-700"
                  onClick={() => handleQuickDownload(item.inspection.product)}
                >
                  <Download size={13} />
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedInspection && (
        <ReportCertificateModal
          open={Boolean(selectedInspection)}
          onClose={() => setSelectedInspection(null)}
          inspection={selectedInspection}
        />
      )}
    </div>
  );
}
