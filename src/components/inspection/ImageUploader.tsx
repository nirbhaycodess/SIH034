import { ImagePlus } from 'lucide-react';
export function ImageUploader({ onFile }: { onFile: (file: File) => void }) {
  return (
    <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-blue-400 hover:bg-blue-50">
      <ImagePlus className="text-blue-600" size={34} />
      <p className="mt-3 font-semibold">Upload package or label image</p>
      <p className="mt-1 text-sm text-slate-500">PNG, JPG, or WEBP up to 10 MB</p>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <span className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm">
        Choose image
      </span>
    </label>
  );
}
