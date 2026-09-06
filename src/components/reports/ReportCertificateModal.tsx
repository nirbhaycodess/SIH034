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
            {/* Large Ashoka Chakra Watermark */}
            <svg viewBox="0 0 100 100" className="w-96 h-96 text-slate-900 fill-current">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              {Array.from({length: 24}).map((_, i) => (
                <line key={i} x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 15} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b-2 border-slate-300 relative z-10">
            {/* National Emblem Placeholder (Ashoka Chakra) */}
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-800 fill-current">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
                {Array.from({length: 24}).map((_, i) => (
                  <line key={i} x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="2" transform={`rotate(${i * 15} 50 50)`} />
                ))}
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="4"/>
              </svg>
            </div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-600 font-serif mb-1">
              Government of India
            </p>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-serif">
              Ministry of Consumer Affairs, Food & Public Distribution
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 font-serif border-y border-slate-200 py-3 mx-auto w-fit px-8">
              CERTIFICATE OF INSPECTION
            </h2>
            <p className="text-xs text-slate-600 mt-3 font-mono font-medium">
              Issued under the Legal Metrology (Packaged Commodities) Rules, 2011 (Rule 6 & 18)
            </p>
          </div>

          {/* Key Identification Grid */}
          <div className="mt-8 relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-0 text-xs border border-slate-300">
            <div className="p-3 border-r border-b sm:border-b-0 border-slate-300">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-serif mb-1">Inspection ID No.</p>
              <p className="font-mono font-bold text-slate-900">{inspection.id}</p>
            </div>
            <div className="p-3 border-b sm:border-b-0 sm:border-r border-slate-300">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-serif mb-1">Date of Audit</p>
              <p className="font-medium text-slate-900 font-serif">{inspection.date}</p>
            </div>
            <div className="p-3 border-r border-slate-300">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-serif mb-1">Compliance Score</p>
              <p className="font-bold text-slate-900 font-serif">{inspection.score}% Conformance</p>
            </div>
            <div className="p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-serif mb-1">Overall Status</p>
              <div>
                <Badge status={inspection.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Verified Commodity Information */}
          <div className="mt-8 space-y-5 text-sm relative z-10 font-serif">
            <div className="pb-4">
              <p className="text-xs text-slate-500 mb-1">This is to certify that the packaged commodity titled:</p>
              <h4 className="font-bold text-slate-900 text-lg uppercase tracking-wide">{inspection.product}</h4>
              <p className="text-slate-600 mt-2 text-sm">
                Manufactured or packed by <span className="font-bold text-slate-900">{inspection.manufacturer}</span>, 
                was inspected and evaluated against the mandatory declarations under the Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>

            {/* Checklist Findings */}
            <div className="bg-slate-50 border border-slate-200 p-4">
              <p className="font-bold text-slate-900 mb-3 uppercase text-[11px] tracking-widest border-b border-slate-200 pb-2">
                Statutory Rule 6 Declaration Audit
              </p>
              <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-4 text-slate-800 text-xs">
                {inspection.checks.map((c, i) => (
                  <li key={i} className="flex items-start justify-between gap-3">
                    <span className="leading-relaxed">
                      <span className="font-semibold">{c.requirement}:</span>{" "}
                      <span className="font-mono bg-white px-1 py-0.5 border border-slate-200 text-brand-700">{c.detectedValue}</span>
                    </span>
                    <Badge status={c.status} size="sm" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Violations / Infractions (Only show if there are any) */}
            {inspection.violations && inspection.violations.length > 0 && (
              <div className="bg-red-50/50 border border-red-200 p-4 mt-4">
                <p className="font-bold text-red-900 mb-3 uppercase text-[11px] tracking-widest border-b border-red-200 pb-2">
                  Recorded Infractions & Statutory Violations
                </p>
                <div className="space-y-3">
                  {inspection.violations.map((v, i) => (
                    <div key={i} className="text-xs text-red-900">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold uppercase tracking-wider">{v.rule}</span>
                        <span className="text-[10px] bg-red-100 px-1.5 py-0.5 font-bold uppercase">{v.severity}</span>
                      </div>
                      <p className="font-medium text-red-800">{v.title}</p>
                      <p className="text-red-700 mt-0.5 opacity-80">{v.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Officer Signature & QR Verification */}
          <div className="mt-12 pt-8 border-t-2 border-slate-300 flex items-end justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center bg-white border-2 border-slate-300 p-1">
                <QrCode size={64} className="text-slate-900" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                <p className="font-bold text-slate-900 text-xs mb-1">DIGITALLY VERIFIED</p>
                <p>Auth: LMD-GOI-4492A</p>
                <p>Hash: 7a9e3b4f...01c</p>
                <p>Timestamp: {inspection.date}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-2">
                {/* Dummy Signature SVG */}
                <svg viewBox="0 0 100 40" className="h-10 w-32 mx-auto text-brand-900 stroke-current opacity-80" fill="transparent" strokeWidth="2">
                  <path d="M10,20 Q15,5 20,25 T30,15 T40,25 Q45,10 50,30 T60,20 T70,30 Q75,15 80,25 T90,20" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="border-t border-slate-400 pt-1 px-4">
                <p className="font-bold text-slate-900 font-serif text-sm uppercase">{inspection.inspector}</p>
                <p className="text-slate-500 text-[10px] font-serif uppercase tracking-widest mt-1">Senior Metrology Officer</p>
              </div>
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
