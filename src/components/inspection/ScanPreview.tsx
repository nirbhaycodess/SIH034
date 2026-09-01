import { CheckCircle2, Image as ImageIcon } from 'lucide-react';
export function ScanPreview({ url, name }: { url?: string; name?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {url ? (
        <img src={url} alt="Uploaded package" className="h-64 w-full object-contain" />
      ) : (
        <div className="grid h-64 place-items-center bg-gradient-to-br from-slate-100 to-blue-50">
          <div className="text-center text-slate-400">
            <ImageIcon className="mx-auto" size={38} />
            <p className="mt-2 text-sm">Package image preview</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 border-t bg-white px-4 py-3 text-sm">
        <CheckCircle2 size={16} className="text-emerald-600" />
        <span className="font-medium">{name ?? 'Ready for mock analysis'}</span>
      </div>
    </div>
  );
}
