import { ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
export function Login() {
  const nav = useNavigate();
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-blue-800 p-12 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 font-bold">
          <ShieldCheck /> PackSure AI
        </div>
        <div className="my-auto max-w-lg">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-200">Inspection intelligence</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Confident compliance for every packaged commodity.
          </h1>
          <p className="mt-5 leading-7 text-blue-100">
            A secure workspace for Legal Metrology officers to inspect package declarations, identify risks,
            and produce clear compliance records.
          </p>
        </div>
        <p className="text-sm text-blue-200">Legal Metrology (Packaged Commodities) Rules, 2011</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex items-center gap-2 font-bold text-blue-800">
            <ShieldCheck />
            PackSure AI
          </div>
          <p className="text-sm font-semibold text-blue-700">WELCOME BACK</p>
          <h1 className="mt-2 text-3xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-slate-500">Use your authorised enforcement account.</p>
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              nav('/dashboard');
            }}
          >
            <label className="block text-sm font-medium">
              Official email
              <input required type="email" defaultValue="priya.sharma@gov.in" className="field" />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input required type="password" defaultValue="password" className="field" />
            </label>
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" /> Remember me
              </label>
              <a className="font-semibold text-blue-700">Forgot password?</a>
            </div>
            <Button className="w-full" type="submit">
              Sign in securely
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-slate-500">
            Protected government inspection environment
          </p>
          <Link to="/dashboard" className="mt-2 block text-center text-xs text-blue-600">
            View demo dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
