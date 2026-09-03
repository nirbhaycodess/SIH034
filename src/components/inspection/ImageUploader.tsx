import { useState, useRef, type DragEvent } from 'react';
import { Camera, FileUp, ImagePlus, CheckCircle2 } from 'lucide-react';

export function ImageUploader({
  onFile,
  selectedName,
}: {
  onFile: (file: File) => void;
  selectedName?: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
            : 'border-slate-300/80 bg-slate-50/60 hover:border-brand-400 hover:bg-brand-50/30'
        }`}
      >
        <div className="relative">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 shadow-sm ring-1 ring-brand-200/50">
            <ImagePlus size={28} className="stroke-[2.2]" />
          </span>
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white text-[10px] font-bold shadow-xs">
            AI
          </span>
        </div>

        <p className="mt-4 text-base font-bold text-slate-900">
          Drag & drop package image here
        </p>
        <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
          Supports PNG, JPG, or WEBP. Optical contrast & sharpening will be auto-applied.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-brand-700 shadow-subtle border border-slate-200 hover:bg-slate-50 transition"
          >
            <FileUp size={14} />
            Browse Files
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-navy-800 transition"
          >
            <Camera size={14} />
            Snap with Camera
          </button>
        </div>

        {/* Regular file upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />

        {/* Direct hardware camera snapshot with environment back-facing sensor */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </div>

      {selectedName && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 p-3 text-xs font-medium text-emerald-800 border border-emerald-200/70">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="truncate">Loaded: <b>{selectedName}</b></span>
        </div>
      )}
    </div>
  );
}
