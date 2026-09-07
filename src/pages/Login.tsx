import {
  Shield,
  Sparkles,
  Lock,
  ArrowRight,
  Building2,
  FileCheck2,
  Scale,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function Login() {
  const nav = useNavigate();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      success('Demo Authentication Successful', 'Demo mode is active.');
      nav('/dashboard');
    } catch (error) {
      showError('Authentication Failed', error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      success('Demo Session Initialized', 'Logged in with authorized Inspector credentials.');
      nav('/dashboard');
      setLoading(false);
    }, 400);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-12 bg-white selection:bg-brand-600 selection:text-white">
      {/* Left Column: Official Government Technology Showcase + Demo Login Section */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-navy-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background Gradients & Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md ring-1 ring-white/20">
              <Shield size={24} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-lg leading-none">
                  PACKINSPECT
                </span>
                <span className="rounded bg-brand-600 px-1.5 py-0.2 text-[10px] font-black tracking-wide text-white">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                Legal Metrology Compliance Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300 border border-white/10 backdrop-blur">
            <Building2 size={13} className="text-brand-400" />
            <span>Ministry of Consumer Affairs</span>
          </div>
        </div>

        {/* Central Vision / Value Proposition */}
        <div className="relative z-10 my-auto max-w-xl py-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-300 border border-brand-500/30 mb-5">
            <Scale size={14} />
            <span>Smart India Hackathon 2026 Showcase</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white">
            Automated intelligence for packaged commodity compliance.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Empowering Legal Metrology enforcement officers with instant multi-modal OCR, Rule 6 validation, and verifiable digital compliance certification.
          </p>

          {/* Key Platform Highlights */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Sparkles size={16} />
                <span>AI Declaration Extraction</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Reads Net Quantity, MRP, Manufacturer, and Consumer Care details in milliseconds.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <FileCheck2 size={16} />
                <span>Statutory Rule Checking</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Direct cross-referencing with Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>

          {/* Dedicated Demo Access Card on the Left Side */}
          <div className="mt-8 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-900/40 to-slate-900/60 p-5 backdrop-blur-md shadow-elevated">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                  Smart India Hackathon Evaluator Access
                </span>
                <p className="text-sm font-bold text-white mt-1">
                  1-Click Live Workspace Demo
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Bypass authentication and launch Inspector Priya Sharma's pre-configured live command center with full inspection history and AI reports.
                </p>
              </div>
              <Sparkles size={20} className="text-cyan-400 shrink-0 mt-0.5" />
            </div>

            <Button
              type="button"
              onClick={handleQuickDemo}
              loading={loading}
              className="mt-4 w-full bg-brand-600 hover:bg-brand-500 text-xs py-2.5 font-bold shadow-md"
            >
              Sign In as Inspector Priya Sharma (1-Click Demo) <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* Footer Authority Note */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Protected Government Enforcement Environment</span>
          <span className="font-mono text-[11px]">Build v2.4 • Secure Session</span>
        </div>
      </section>

      {/* Right Column: Sign In Form */}
      <section className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy-950 text-white">
              <Shield size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">PACKINSPECT AI</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">
                Compliance Platform
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 border border-brand-100">
                Officer Portal
              </span>
              <span className="text-xs text-slate-400">• Single Sign-On</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Sign in to PackInspect AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your authorized enforcement officer credentials.
            </p>
          </div>

          {/* Quick Demo Button for Mobile Screens Only */}
          <div className="lg:hidden rounded-xl border border-brand-200 bg-brand-50/80 p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-brand-900">SIH Hackathon Evaluator?</p>
              <Button
                type="button"
                size="sm"
                onClick={handleQuickDemo}
                loading={loading}
                className="bg-brand-600 hover:bg-brand-700 text-xs py-1.5"
              >
                1-Click Demo <ArrowRight size={12} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Official Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <span className="text-xs font-semibold text-brand-600 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-brand-600" />
                <span>Remember session on this device</span>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full bg-navy-950 hover:bg-navy-900 shadow-elevated"
            >
              <Lock size={15} />
              Sign in securely
            </Button>
          </form>

          {/* Register New Officer Link */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Don't have an officer account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800">
              Register New Officer Profile →
            </Link>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Protected government inspection environment • Legal Metrology Act, 2009
          </p>
        </div>
      </section>
    </main>
  );
}
