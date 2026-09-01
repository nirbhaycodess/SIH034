import { ArrowRight, BrainCircuit, FileImage } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { ImageUploader } from '../components/inspection/ImageUploader';
import { ScanPreview } from '../components/inspection/ScanPreview';
import { analyzePackage } from '../services/api';
export function NewInspection() {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  async function start() {
    setLoading(true);
    const x = await analyzePackage();
    nav(`/inspection/${x.id}`);
  }
  return (
    <div>
      <h1 className="page-title">New inspection</h1>
      <p className="page-subtitle">Upload a clear package image to begin an assisted declaration review.</p>
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-sm font-bold text-white">
              1
            </span>
            <div>
              <h2 className="font-bold">Upload package image</h2>
              <p className="text-sm text-slate-500">Front label works best for this demonstration.</p>
            </div>
          </div>
          <ImageUploader onFile={setFile} />
        </div>
        <div className="card p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
              2
            </span>
            <div>
              <h2 className="font-bold">Review & analyse</h2>
              <p className="text-sm text-slate-500">Mock AI extracts visible declarations.</p>
            </div>
          </div>
          <ScanPreview url={file && URL.createObjectURL(file)} name={file?.name} />
          {loading ? (
            <Loading label="Analysing label declarations…" />
          ) : (
            <Button className="mt-5 w-full" disabled={!file} onClick={start}>
              <BrainCircuit size={18} />
              Start AI analysis <ArrowRight size={17} />
            </Button>
          )}{' '}
          {!file && (
            <div className="mt-4 flex gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <FileImage size={18} />
              Upload an image to activate analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
