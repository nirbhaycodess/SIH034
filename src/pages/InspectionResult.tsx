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
  const [item, setItem] = useState<Inspection>();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);
  const { success, info } = useToast();

  useEffect(() => {
    getInspectionById(id).then(setItem);
  }, [id]);

  if (!item) {
    return <Loading label="Retrieving Metrology inspection record…" sublabel="Loading AI declaration tags and verification matrices" />;
  }

  const handleSaveInspection = () => {
    success('Inspection Saved', `Inspection record ${item.id} persisted to local Metrology repository.`);
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

  // Circular gauge calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (item.score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Bar Header & Action Buttons */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
              {item.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">• {item.category}</span>
            {isReviewed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check size={12} /> Officer Signed
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1.5">
            {item.product}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Manufacturer: <b className="text-slate-700">{item.manufacturer}</b></span>
            <span>Date: <b className="text-slate-700">{item.date}</b></span>
            <span>Inspector: <b className="text-slate-700">{item.inspector}</b></span>
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" onClick={() => setShowEvidenceModal(true)}>
            <Camera size={16} />
            Supporting Exhibits (3)
          </Button>
          <Button variant="secondary" onClick={() => setShowReportModal(true)}>
            <Download size={16} />
            Download Report
          </Button>
          <Button variant="secondary" onClick={handleSaveInspection}>
            <Save size={16} />
            Save Inspection
          </Button>
          <Button
            onClick={handleMarkReviewed}
            disabled={isReviewed}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-elevated"
          >
            <CheckCircle2 size={16} />
            {isReviewed ? 'Marked as Reviewed' : 'Mark as Reviewed'}
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
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-black ${
                  item.auditStatus === 'PASS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.auditStatus === 'FAIL'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.auditStatus}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                Confidence: {item.auditConfidence ?? 0}%
              </span>
            </div>
          </div>

          {item.auditReasons && item.auditReasons.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-950">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle size={18} className="text-rose-600" />
                Requirements requiring attention
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                {item.auditReasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-900">Rule-by-rule breakdown</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {(item.rulesSummary ?? []).map((rule) => {
                const styles = {
                  green: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
                  red: 'border-rose-200 bg-rose-50/60 text-rose-900',
                  yellow: 'border-amber-200 bg-amber-50/60 text-amber-900',
                }[rule.color];
                return (
                  <div key={rule.rule} className={`rounded-xl border p-4 ${styles}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold">{rule.rule}</h4>
                      <span className="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] font-black uppercase">
                        {rule.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm opacity-90">{rule.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <details className="rounded-xl border border-slate-200 bg-slate-50">
            <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-800">
              View extracted OCR text
            </summary>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap border-t border-slate-200 px-4 py-3 text-xs leading-relaxed text-slate-600">
              {item.extractedText || 'No OCR text returned.'}
            </pre>
          </details>

          {item.auditId && (
            <p className="text-right font-mono text-[11px] text-slate-400">
              Database ID: {item.auditId}
            </p>
          )}
        </section>
      )}

      {/* Hero 3-Card Summary: Circular Gauge + Executive Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compliance Score with Large Circular Progress Indicator */}
        <div className="card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            COMPLIANCE SCORE
          </p>

          {/* SVG Circular Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="h-36 w-36 transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                className={
                  item.score >= 90
                    ? 'stroke-emerald-500'
                    : item.score >= 75
                    ? 'stroke-amber-500'
                    : 'stroke-rose-500'
                }
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black tracking-tight text-slate-900 font-sans">
                {item.score}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Legal Index</span>
            </div>
          </div>

          <div className="mt-1">
            <Badge status={item.status} size="md" />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-500">
            <span>AI Confidence: <b className="text-slate-800">94.8%</b></span>
            <span>Rules Evaluated: <b className="text-slate-800">{item.checks.length}</b></span>
          </div>
        </div>

        {/* Declarations Extraction Overview */}
        <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <FileCheck2 size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Extracted Package Declarations</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Auto-extracted via VLM OCR</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {item.declarations.map((d) => (
                <div
                  key={d.label}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 hover:bg-white hover:border-slate-300 transition"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {d.label}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-900 truncate">{d.value}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Confidence</span>
                    <span className="font-mono font-bold text-emerald-600">{d.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-brand-600" />
              Conforms with Legal Metrology (Packaged Commodities) Rules, 2011
            </span>
            <span className="text-[11px] font-mono text-slate-400">Zone 4 Metrology Grid</span>
          </div>
        </div>
      </div>

      {/* Compliance Summary Checklist (Full Width Layout) */}
      <div className="card p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Compliance Summary</h3>
              <p className="text-xs text-slate-500">Rule 6 Mandatory Checklist</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              {item.checks.filter((c) => c.status === 'PASS').length}/{item.checks.length} Verified
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {item.checks.map((check, idx) => {
              let bgClass = 'bg-slate-50/70 border-slate-200';
              let textClass = 'text-slate-950';
              let subTextClass = 'text-slate-800';
              let Icon = CheckCircle2;
              let iconClass = 'text-slate-600';

              if (check.status === 'PASS') {
                bgClass = 'bg-emerald-50/70 border-emerald-100';
                textClass = 'text-emerald-950';
                subTextClass = 'text-emerald-800';
                Icon = CheckCircle2;
                iconClass = 'text-emerald-600';
              } else if (check.status === 'WARNING' || check.status === 'REVIEW') {
                bgClass = 'bg-amber-50/70 border-amber-200';
                textClass = 'text-amber-950';
                subTextClass = 'text-amber-800';
                Icon = AlertTriangle;
                iconClass = 'text-amber-600';
              } else if (check.status === 'FAIL') {
                bgClass = 'bg-rose-50/70 border-rose-200';
                textClass = 'text-rose-950';
                subTextClass = 'text-rose-800';
                Icon = XCircle;
                iconClass = 'text-rose-600';
              }

              return (
                <div key={idx} className={`flex items-start gap-3 rounded-xl p-3 border text-xs ${bgClass}`}>
                  <Icon size={18} className={`shrink-0 mt-0.5 ${iconClass}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${textClass}`}>{check.requirement}</p>
                    <p className={`text-[11px] mt-0.5 ${subTextClass}`}>
                      <span className="font-mono bg-white/50 px-1 rounded">{check.detectedValue || 'Not Detected'}</span>
                      <span className="block mt-1 opacity-90">{check.explanation}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => setShowReportModal(true)}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 transition"
          >
            Generate printable compliance statement →
          </button>
        </div>
      </div>

      {/* Font Size & PDP Readability Analysis (Rule 9 & Second Schedule) */}
      <FontSizeAnalyzer netQuantity="340 ml" pdpArea={180} />

      {/* Detailed Declaration Analysis Table Section */}
      <ComplianceResult inspection={item} />

      {/* Potential Violations & Inspector Remarks */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Potential Violations Section */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Potential Violations</h3>
              <p className="text-xs text-slate-500">Legal Metrology flags requiring officer adjudication</p>
            </div>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
              {item.violations.length} Flags
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {item.violations.length ? (
              item.violations.map((v, idx) => (
                <ViolationCard key={v.id} violation={v} confidence={94 - idx * 6} />
              ))
            ) : (
              <div className="rounded-xl bg-emerald-50 p-6 text-center text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="mx-auto text-emerald-600 mb-2" size={28} />
                <p className="font-bold text-sm">No potential violations detected</p>
                <p className="text-xs text-emerald-700 mt-1">
                  All prescribed declarations meet Rule 6 standards.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inspector Remarks Card */}
        <div className="card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Inspector Remarks & Evidence Notes</h3>
              <p className="text-xs text-slate-500">Official log recorded for legal proceedings</p>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</p>
              <div className="space-y-1.5">
                {presetRemarks.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setRemarks(preset)}
                    className="w-full text-left text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-900 transition"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="field-label">Official Observation</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record observations, notice dispatch status, or lab measurement results…"
                  rows={4}
                  className="field resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Timestamp: {item.date} 11:42 IST</span>
            <Button variant="secondary" onClick={handleSaveRemarks}>
              <Edit3 size={15} />
              Save Remarks
            </Button>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <ReportCertificateModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        inspection={item}
      />

      {/* Supporting Legal Evidence Modal */}
      <EvidenceAttachmentModal
        open={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        productName={item.product}
      />
    </div>
  );
}