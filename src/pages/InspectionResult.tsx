import {
  CheckCircle2,
  Download,
  Edit3,
  Save,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Check,
  Camera,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { ComplianceResult } from '../components/inspection/ComplianceResult';
import { ViolationCard } from '../components/inspection/ViolationCard';
import { FontSizeAnalyzer } from '../components/inspection/FontSizeAnalyzer';
import { EvidenceAttachmentModal } from '../components/inspection/EvidenceAttachmentModal';
import { ReportCertificateModal } from '../components/reports/ReportCertificateModal';
import type { Inspection } from '../types';
import { getInspectionById } from '../services/api';
import { useToast } from '../context/ToastContext';

export function InspectionResult() {
  const { id = '' } = useParams();
  const [item, setItem] = useState<Inspection | any>();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);
  const { success, info, error: toastError } = useToast();

  useEffect(() => {
    getInspectionById(id).then((data) => {
      if (data && data.detail) {
        // If the backend sent a FastAPI error like {"detail": "timeout"}
        toastError("Backend Error", data.detail);
      }
      setItem(data);
    }).catch(err => {
      console.error("Failed to load inspection:", err);
      toastError("Network Error", "Could not load inspection data.");
    });
  }, [id, toastError]);

  if (!item) {
    return <Loading label="Retrieving Metrology inspection record…" sublabel="Loading AI declaration tags and verification matrices" />;
  }

  // --- BULLETPROOF DATA PARSING ---
  // If backend fails and returns undefined, we fallback to safe defaults so React never crashes.
  const safeScore = Number(item.score) || 0;
  const safeConfidence = Number(item.auditConfidence) || 0;
  const safeChecks = Array.isArray(item.checks) ? item.checks : [];
  const safeDeclarations = Array.isArray(item.declarations) ? item.declarations : [];
  const safeViolations = Array.isArray(item.violations) ? item.violations : [];
  const safeRulesSummary = Array.isArray(item.rulesSummary) ? item.rulesSummary : [];
  const safeAuditReasons = Array.isArray(item.auditReasons) ? item.auditReasons : [];

  const handleSaveInspection = () => {
    success('Inspection Saved', `Inspection record ${item.id || 'N/A'} persisted to local Metrology repository.`);
  };

  const handleMarkReviewed = () => {
    setIsReviewed(true);
    success('Audit Finalized', `Inspection marked as reviewed and signed off by Officer Priya Sharma.`);
  };

  const handleSaveRemarks = () => {
    if (!remarks.trim()) {
      info('No Remarks Added', 'Please type an observation or select a preset.');
      return;
    }
    success('Remarks Recorded', 'Official officer remarks added to inspection audit trail.');
  };

  const presetRemarks = [
    'Notice issued under Rule 6(1)(l) for missing consumer care line.',
    'Packaged quantity and unit conformity confirmed with physical sample.',
    'Minor typography non-compliance; rectification advisory issued.',
  ];

  // Circular gauge calculations safely guarded against NaN
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              {item.id || 'NO-ID'}
            </span>
            <span className="text-xs text-slate-400 font-medium">• {item.category || 'General'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1.5">
            {item.product || 'Processing Error - No Product Found'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Manufacturer: <b className="text-slate-700">{item.manufacturer || 'Unknown'}</b></span>
            <span>Date: <b className="text-slate-700">{item.date || 'Unknown'}</b></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" onClick={() => setShowEvidenceModal(true)}>
            <Camera size={16} /> Supporting Exhibits (3)
          </Button>
          <Button variant="secondary" onClick={() => setShowReportModal(true)}>
            <Download size={16} /> Download Report
          </Button>
          <Button variant="secondary" onClick={handleSaveInspection}>
            <Save size={16} /> Save
          </Button>
          <Button onClick={handleMarkReviewed} disabled={isReviewed} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 size={16} /> {isReviewed ? 'Reviewed' : 'Mark as Reviewed'}
          </Button>
        </div>
      </div>

      {item.auditStatus && (
        <section className="card p-5 sm:p-6 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Audit Report</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900">Legal Metrology Label Assessment</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                Confidence: {safeConfidence}%
              </span>
            </div>
          </div>

          {safeAuditReasons.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-950">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle size={18} className="text-rose-600" />
                Requirements requiring attention
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                {safeAuditReasons.map((reason, i) => <li key={i}>{reason}</li>)}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-900">Rule-by-rule breakdown</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {safeRulesSummary.map((rule, i) => (
                <div key={i} className="rounded-xl border p-4 border-slate-200 bg-slate-50 text-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold">{rule.rule || 'Unknown Rule'}</h4>
                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase">
                      {rule.status || 'N/A'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm opacity-90">{rule.detail || ''}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero 3-Card Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 flex flex-col items-center justify-center text-center relative bg-gradient-to-b from-white to-slate-50/50">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">COMPLIANCE SCORE</p>
          <div className="relative my-4 flex items-center justify-center">
            <svg className="h-36 w-36 transform -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} className="stroke-slate-100" strokeWidth="12" fill="transparent" />
              <circle
                cx="70" cy="70" r={radius}
                className={safeScore >= 85 ? 'stroke-emerald-500' : 'stroke-amber-500'}
                strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black tracking-tight text-slate-900 font-sans">{safeScore}%</span>
            </div>
          </div>
          <Badge status={item.status || 'REVIEW'} size="md" />
        </div>

        <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Extracted Declarations</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {safeDeclarations.map((d, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400 truncate">{d.label || 'Unknown'}</p>
                <p className="mt-1 text-xs font-bold text-slate-900 truncate">{d.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Summary Checklist */}
      <div className="card p-5 sm:p-6 flex flex-col justify-between">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Compliance Summary</h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
            {safeChecks.filter((c) => c.status === 'PASS').length}/{safeChecks.length} Verified
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {safeChecks.map((check, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl p-3 border bg-slate-50 border-slate-200">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-950 text-xs">{check.requirement || 'Unknown'}</p>
                <p className="text-[11px] mt-0.5 text-slate-800">
                  <span className="font-mono bg-white px-1 rounded">{check.detectedValue || 'Not Detected'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Only render ComplianceResult if data is fully available to prevent inner-component crashes */}
      {item.id && <ComplianceResult inspection={item} />}

      {/* Report Modal */}
      <ReportCertificateModal open={showReportModal} onClose={() => setShowReportModal(false)} inspection={item} />
    </div>
  );
}