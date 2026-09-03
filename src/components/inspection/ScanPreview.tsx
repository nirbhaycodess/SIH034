import { CheckCircle2, Image as ImageIcon, Sparkles, Scan, ZoomIn } from 'lucide-react';

export function ScanPreview({
  url,
  name,
  isScanning = false,
}: {
  url?: string;
  name?: string;
  isScanning?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-card">
      {/* Laser Scanning Overlay Line */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser" />
          <div className="absolute inset-0 bg-brand-500/10 backdrop-contrast-125 pointer-events-none" />
          <div className="absolute top-3 left-3 bg-brand-600/90 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur">
            LIVE OCR SCANNING ACTIVE
          </div>
        </div>
      )}

      {/* Main Preview Area */}
      <div className="relative flex min-h-[290px] items-center justify-center p-4 bg-slate-950/40">
        {url ? (
          <div className="relative max-h-72 w-full flex items-center justify-center overflow-hidden rounded-xl">
            <img
              src={url}
              alt="Uploaded package"
              className="max-h-64 max-w-full object-contain drop-shadow-md rounded-lg"
            />
          </div>
        ) : (
          <div className="text-center p-8 text-slate-400">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-800/80 text-slate-400 ring-1 ring-white/10">
              <ImageIcon size={30} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-300">No package image loaded</p>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Upload an image or pick a sample below to preview label declarations.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/95 px-4 py-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2
            size={16}
            className={url ? 'text-emerald-400 shrink-0' : 'text-slate-600 shrink-0'}
          />
          <span className="font-semibold text-slate-200 truncate">
            {name ?? 'Ready for packaging scan'}
          </span>
        </div>
        {url && (
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            100% Scale
          </span>
        )}
      </div>
    </div>
  );
}
