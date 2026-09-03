import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center p-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm border border-brand-100">
          <ShieldAlert size={32} />
        </div>
        <p className="mt-5 font-mono text-sm font-bold text-brand-600">ERROR 404</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight">
          Resource Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          The requested compliance route, inspection record, or commodity dossier could not be located in the Legal Metrology database.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button className="bg-brand-600 hover:bg-brand-700">
              <ArrowLeft size={16} />
              Return to Inspection Command Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
