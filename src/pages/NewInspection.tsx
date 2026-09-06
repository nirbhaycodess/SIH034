import {
  ArrowRight,
  BrainCircuit,
  FileImage,
  Sparkles,
  Check,
  Languages,
  AlertTriangle,
  Camera,
  Wand2,
  Eye,
  Sliders,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ImageUploader } from '../components/inspection/ImageUploader';
import { ScanPreview } from '../components/inspection/ScanPreview';
import { analyzePackage } from '../services/api';
import { assessImageQuality, enhanceImageForOcr, type ImageQualityMetrics } from '../services/imageEnhancer';
import { useToast } from '../context/ToastContext';

// Real-world Indian packaged commodity test datasets for 1-click demonstration at SIH
const samplePackages = [
  {
    id: 'sample-1',
    name: 'Parle-G Original Gluco Biscuits (130g)',
    category: 'Food & Beverages',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    fileName: 'parle_g_gluco_biscuits_130g.jpg',
  },
  {
    id: 'sample-2',
    name: 'Kurkure Masala Munch Crisps (75g)',
    category: 'Food & Beverages',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    fileName: 'kurkure_masala_munch_75g.jpg',
  },
  {
    id: 'sample-3',
    name: 'Amul Pasteurized Butter (500g)',
    category: 'Dairy & Refrigerated',
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
    fileName: 'amul_butter_carton_500g.jpg',
  },
  {
    id: 'sample-4',
    name: 'DesiZaika Spices (100g - Non-Compliant)',
    category: 'Food & Beverages',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    fileName: 'desizaika_spices_violation_sample.jpg',
  },
];

const analysisSteps = [
  { id: 1, label: 'Scanning package surface & optical contrast analysis' },
  { id: 2, label: 'Detecting mandatory declaration bounding boxes' },
  { id: 3, label: 'Measuring font height & Principal Display Panel (Rule 9)' },
  { id: 4, label: 'Reading multilingual declarations (Bilingual OCR)' },
  { id: 5, label: 'Checking compliance against Legal Metrology Rules, 2011' },
];

export function NewInspection() {
  const [realFile, setRealFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [languageMode, setLanguageMode] = useState<'eng+hin' | 'eng' | 'hin'>('eng+hin');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [realProgressMsg, setRealProgressMsg] = useState<string>('');
  const [qualityMetrics, setQualityMetrics] = useState<ImageQualityMetrics | null>(null);
  const [enhancedPreviewUrl, setEnhancedPreviewUrl] = useState<string | null>(null);
  const [showEnhanced, setShowEnhanced] = useState<boolean>(false);
  const [notLabelWarning, setNotLabelWarning] = useState<boolean>(false);
  const retakeInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const { info, success, warning } = useToast();

  const handleFile = async (f: File) => {
    setRealFile(f);
    setSelectedSampleId(null);
    setFileName(f.name);
    setNotLabelWarning(false);
    const objUrl = URL.createObjectURL(f);
    setPreviewUrl(objUrl);
    setShowEnhanced(false);

    try {
      const q = await assessImageQuality(f);
      setQualityMetrics(q);
      const enh = await enhanceImageForOcr(f);
      setEnhancedPreviewUrl(enh.enhancedUrl);
      if (q.retakeRecommended) {
        warning('Image Quality Advisory', 'Blur or reflective glare detected. AI enhancement applied automatically.');
      } else {
        info('Image Loaded', `Optical Quality: ${q.overallQuality} (${q.sharpnessScore}% Sharpness, ${q.contrastScore}% Contrast).`);
      }
    } catch (e) {
      console.error('Quality assessment error:', e);
    }
  };

  const handleSelectSample = (sample: (typeof samplePackages)[0]) => {
    setPreviewUrl(sample.url);
    setFileName(sample.fileName);
    setRealFile(null);
    setSelectedSampleId(sample.id);
    setNotLabelWarning(false);
    setQualityMetrics({
      sharpnessScore: 94,
      contrastScore: 91,
      brightnessScore: 88,
      resolutionWidth: 1920,
      resolutionHeight: 1080,
      overallQuality: 'EXCELLENT',
      issuesDetected: [],
      retakeRecommended: false,
      retakeGuidance: [],
    });
    setEnhancedPreviewUrl(null);
    setShowEnhanced(false);
    info('Sample Loaded', `Loaded ${sample.name} for compliance audit demo.`);
  };

  async function startAnalysis() {
    if (!previewUrl) return;
    setLoading(true);
    setCurrentStep(1);
    setNotLabelWarning(false);

    try {
      if (realFile) {
        setRealProgressMsg('Assessing image quality & running neural OCR…');
        const res = await analyzePackage(
          realFile,
          undefined,
          (pct, status) => {
            setRealProgressMsg(status);
            if (pct < 25) setCurrentStep(1);
            else if (pct < 50) setCurrentStep(2);
            else if (pct < 70) setCurrentStep(3);
            else if (pct < 90) setCurrentStep(4);
            else setCurrentStep(5);
          },
          languageMode
        );

        // Check if the result is a "not a label" rejection
        const isNotLabel = res.violations?.some((v: any) => v.id === 'V-NOTLABEL');
        if (isNotLabel) {
          setNotLabelWarning(true);
          setLoading(false);
          return; // Don't navigate — show warning on the page
        }

        success('Analysis Complete', `Extracted declarations and evaluated Rule 6 for ${res.product}`);
        nav(`/inspection/${res.id}`);
      } else {
        setTimeout(() => setCurrentStep(2), 400);
        setTimeout(() => setCurrentStep(3), 800);
        setTimeout(() => setCurrentStep(4), 1200);
        setTimeout(() => setCurrentStep(5), 1600);

        setTimeout(async () => {
          const res = await analyzePackage(null, selectedSampleId || 'sample-1');
          nav(`/inspection/${res.id}`);
        }, 1900);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      const message = err instanceof Error ? err.message : 'The server analysis failed.';
      warning('Analysis Failed', `${message} No mock result was created.`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 border border-brand-100">
            Legal Metrology Act, 2009
          </span>
          <span className="text-xs text-slate-400">• Rule 6 Verification Engine</span>
        </div>
        <h1 className="page-title mt-1.5">Start New Inspection</h1>
        <p className="page-subtitle">
          Upload or capture package images to assess quality, extract declarations, and check statutory compliance.
        </p>
      </div>

      {/* Main 2-Column Workstation */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Step 1: Upload & Samples */}
        <div className="card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-sm font-black text-white shadow-xs">
                1
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Upload Package Image</h2>
                <p className="text-xs text-slate-500">Capture or drop product packaging photos</p>
              </div>
            </div>

            {/* Rule 9(3) Multi-lingual OCR Selection */}
            <div className="mb-4 rounded-xl bg-slate-50 p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Languages size={14} className="text-brand-600" />
                  Rule 9(3) Statutory OCR Language
                </span>
                <span className="text-[10px] font-mono text-slate-400">Devanagari / English</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'eng+hin' as const, label: 'Bilingual (Eng + हिंदी)', sub: 'Rule 9(3) Standard' },
                  { id: 'eng' as const, label: 'English Only', sub: 'Latin Script' },
                  { id: 'hin' as const, label: 'Hindi (हिंदी)', sub: 'Devanagari' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLanguageMode(opt.id)}
                    className={`p-2 rounded-lg text-left transition-all ${
                      languageMode === opt.id
                        ? 'bg-white border-2 border-brand-600 shadow-xs text-brand-950'
                        : 'bg-white/60 border border-slate-200/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <p className="text-[11px] font-bold leading-tight">{opt.label}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <ImageUploader onFile={handleFile} selectedName={fileName} />

            {/* ⚠️ Not a Product Label Warning Banner */}
            {notLabelWarning && (
              <div className="mt-4 rounded-2xl border-2 border-rose-400 bg-rose-50 p-4 shadow-md animate-pulse-once">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-xl">
                    🚫
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-rose-800">Invalid Image — Not a Product Label</p>
                    <p className="mt-1 text-xs text-rose-700 leading-relaxed">
                      The uploaded image does not appear to be a product packaging label. 
                      The AI detected <strong>insufficient label signals</strong> (no MRP, manufacturer, net quantity, FSSAI, ingredients, etc.).
                    </p>
                    <div className="mt-3 rounded-xl bg-white border border-rose-200 p-3">
                      <p className="text-[11px] font-bold text-rose-900 mb-1.5">✅ Please upload one of the following:</p>
                      <ul className="text-[11px] text-rose-700 space-y-0.5 list-disc list-inside">
                        <li>A photo of a biscuit / food packet label</li>
                        <li>A photo of a shampoo / cosmetic bottle label</li>
                        <li>A photo of any packaged commodity sold in India</li>
                        <li>A clear, well-lit photo showing MRP, manufacturer details</li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNotLabelWarning(false);
                        setPreviewUrl('');
                        setFileName('');
                        setRealFile(null);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
                    >
                      <Camera size={13} />
                      Upload a Different Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SIH Demo 1-Click Samples */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                Or Pick a Sample for Instant SIH Demo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePackages.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    type="button"
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      fileName === s.fileName
                        ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Image Preview & AI Analysis */}
        <div className="card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-navy-900 text-sm font-black text-white shadow-xs">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Package Verification & Scan</h2>
                  <p className="text-xs text-slate-500">Optical Character & Declaration Recognition</p>
                </div>
              </div>
              {previewUrl && (
                <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 border border-emerald-200">
                  Image Ready
                </span>
              )}
            </div>

            <ScanPreview
              url={showEnhanced && enhancedPreviewUrl ? enhancedPreviewUrl : previewUrl}
              name={showEnhanced ? `(AI Enhanced) ${fileName}` : fileName}
              isScanning={loading}
            />

            {/* Image Quality & Optical Enhancement Inspector */}
            {previewUrl && qualityMetrics && (
              <div className="mt-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-100 text-brand-700">
                      <Sliders size={13} />
                    </span>
                    <span className="text-xs font-bold text-slate-800">Optical Quality & Legibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        qualityMetrics.overallQuality === 'EXCELLENT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : qualityMetrics.overallQuality === 'GOOD'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : qualityMetrics.overallQuality === 'FAIR'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      }`}
                    >
                      {qualityMetrics.overallQuality === 'POOR_RETAKE_RECOMMENDED'
                        ? '⚠️ Retake Advised'
                        : `${qualityMetrics.overallQuality} Quality`}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {qualityMetrics.resolutionWidth}×{qualityMetrics.resolutionHeight}px
                    </span>
                  </div>
                </div>

                {/* Sharpness & Contrast Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Sharpness</span>
                      <span className="font-bold text-slate-700">{qualityMetrics.sharpnessScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          qualityMetrics.sharpnessScore > 60 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${qualityMetrics.sharpnessScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Lighting Contrast</span>
                      <span className="font-bold text-slate-700">{qualityMetrics.contrastScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          qualityMetrics.contrastScore > 50 ? 'bg-cyan-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${qualityMetrics.contrastScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Enhanced Toggle */}
                {enhancedPreviewUrl && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                      <Wand2 size={13} className="text-brand-600" />
                      AI Unsharp-Mask & Contrast Boost:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEnhanced(!showEnhanced)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        showEnhanced
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Eye size={12} />
                      {showEnhanced ? 'Showing Enhanced' : 'Preview Enhanced'}
                    </button>
                  </div>
                )}

                {/* Retake Warning Advisory Box */}
                {qualityMetrics.retakeRecommended && (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 border border-amber-200 text-amber-900">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Text May Not Be Fully Visible</p>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {qualityMetrics.issuesDetected.join(' • ')}. {qualityMetrics.retakeGuidance[0] || 'Ensure even lighting and tap to focus.'}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => retakeInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-navy-800 transition"
                          >
                            <Camera size={13} />
                            Retake Clearer Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowEnhanced(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-amber-900 border border-amber-300 hover:bg-amber-100 transition"
                          >
                            <Wand2 size={13} className="text-brand-600" />
                            Apply AI Sharpening
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden Retake Camera Trigger */}
                <input
                  ref={retakeInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            )}

            {/* AI Multi-Step Status State when Processing */}
            {loading ? (
              <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-white border border-slate-800 shadow-elevated">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      AI Legal Metrology Neural Engine
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Step {currentStep} of 5</span>
                </div>

                <div className="mt-4 space-y-3">
                  {analysisSteps.map((step) => {
                    const isDone = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 text-xs transition-opacity ${
                          isCurrent
                            ? 'text-cyan-300 font-semibold opacity-100'
                            : isDone
                            ? 'text-emerald-400 opacity-90'
                            : 'text-slate-500 opacity-50'
                        }`}
                      >
                        <div
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-cyan-500 text-slate-950 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isDone ? <Check size={11} className="stroke-[3]" /> : step.id}
                        </div>
                        <span className="truncate">{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                {realProgressMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white/5 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono flex items-center gap-2">
                    <Sparkles size={13} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{realProgressMsg}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5">
                <Button
                  size="lg"
                  className="w-full bg-brand-600 hover:bg-brand-700 shadow-elevated py-3 text-sm font-bold"
                  disabled={!previewUrl}
                  onClick={startAnalysis}
                >
                  <BrainCircuit size={18} />
                  Analyze Package
                  <ArrowRight size={18} />
                </Button>

                {!previewUrl && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-200/60">
                    <FileImage size={16} className="text-slate-400 shrink-0" />
                    <span>Select a sample or upload a package photo above to begin analysis.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
