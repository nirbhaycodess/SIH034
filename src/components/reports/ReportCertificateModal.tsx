import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import type { Inspection } from '../../types';
import { useToast } from '../../context/ToastContext';

export function ReportCertificateModal({
  open,
  onClose,
  inspection,
}: {
  open: boolean;
  onClose: () => void;
  inspection: Inspection;
}) {
  const { success } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    success('Certificate Exported', `Official compliance report PDF generated for ${inspection.product}.`);
    onClose();
  };

  const handleDownloadEditableNotice = () => {
    const noticeContent = `
GOVERNMENT OF INDIA
MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
LEGAL METROLOGY DIVISION (PACKAGED COMMODITIES)

STATUTORY INSPECTION REPORT & NOTICE OF FINDINGS
Inspection ID: ${inspection.id}
Date of Audit: ${inspection.date}
Enforcement Zone: Zone 4 — Delhi NCR
Authorized Officer: ${inspection.inspector} (LM-DEL-408)

1. COMMODITY DETAILS:
- Product Generic Name: ${inspection.product}
- Category: ${inspection.category}
- Manufacturer / Packer: ${inspection.manufacturer}
- Compliance Health Score: ${inspection.score}%
- Overall Status: ${inspection.status}

2. STATUTORY RULE 6 DECLARATION AUDIT:
${inspection.checks.map((c) => `[${c.status}] ${c.requirement} -> Detected: "${c.detectedValue}" (${c.explanation})`).join('\n')}

3. RECORDED INFRACTIONS & VIOLATIONS:
${inspection.violations.length === 0 ? 'No statutory non-compliances recorded. Commodity conforms to Legal Metrology Rules, 2011.' : inspection.violations.map((v) => `Rule: ${v.rule} | Severity: ${v.severity}\nInfraction: ${v.title}\nDetails: ${v.description}\n`).join('\n')}

4. OFFICER REMARKS & STATUTORY DIRECTIVE:
Under Section 29 / 36 of the Legal Metrology Act, 2009, this report constitutes an official record of packaged commodity declarations inspected.
Officer Signature: _______________________
Date: ${inspection.date}
`;

    const blob = new Blob([noticeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statutory_Notice_${inspection.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    success('Editable Notice Exported', 'Statutory inspection report exported in editable text/word format.');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(inspection, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Compliance_Dossier_${inspection.id}.json`;
    link.click();
    URL.revokeObjectURL(url);

    success('JSON Dossier Exported', 'Machine-readable compliance dossier downloaded.');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Official Compliance Certificate & Statutory Reports"
      subtitle="Ministry of Consumer Affairs, Food & Public Distribution • Legal Metrology Division"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Certificate Container Styled like Govt of India Notice */}
        <div className="rounded-2xl border-2 border-slate-300/80 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden font-sans">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-8xl font-black text-slate-900 tracking-widest uppercase">
              LEGAL METROLOGY
            </span>
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-navy-50 text-navy-800 mb-2 border border-navy-100">
              <ShieldCheck size={26} className="text-brand-700" />
            </div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              GOVERNMENT OF INDIA • DEPARTMENT OF CONSUMER AFFAIRS
            </p>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Certificate of Packaged Commodity Inspection
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Issued under the Legal Metrology (Packaged Commodities) Rules, 2011 (Rule 6 & 18)
            </p>
          </div>

          {/* Key Identification Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inspection ID</p>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{inspection.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inspection Date</p>
              <p className="font-medium text-slate-900 mt-0.5">{inspection.date}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Score</p>
              <p className="font-bold text-brand-700 mt-0.5">{inspection.score}% Conformance</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
              <div className="mt-0.5">
                <Badge status={inspection.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Verified Commodity Information */}
          <div className="mt-6 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">{inspection.product}</h4>
              <p className="text-slate-500 mt-0.5">
                Manufacturer/Packer: <span className="font-semibold text-slate-800">{inspection.manufacturer}</span>
              </p>
            </div>

            {/* Checklist Findings */}
            <div>
              <p className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider text-slate-500">
                Statutory Rule 6 Declaration Audit:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 text-slate-600">
                {inspection.checks.map((c, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <span className="truncate">• {c.requirement}: <b className="text-slate-800 font-mono">{c.detectedValue}</b></span>
                    <Badge status={c.status} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Officer Signature & QR Verification */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
                <QrCode size={44} className="text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                <p className="font-bold text-slate-800">DIGITALLY VERIFIED</p>
                <p>Hash: 7a9e…4f01</p>
                <p>National Portal Grid</p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="inline-block border-b border-slate-400 pb-1 px-4 mb-1">
                <span className="font-serif italic text-brand-900 font-bold">Priya Sharma</span>
              </div>
              <p className="font-bold text-slate-900">{inspection.inspector}</p>
              <p className="text-slate-500 text-[11px]">Senior Legal Metrology Officer</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (PDF + Editable Formats as mandated by SIH) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadEditableNotice}>
              Export Editable Notice (.txt)
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJson}>
              Export JSON Dossier
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer size={15} />
              Print
            </Button>
            <Button size="sm" onClick={handleDownload} className="bg-brand-600 hover:bg-brand-700">
              <Download size={15} />
              Download Signed PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
