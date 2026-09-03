import {
  Shield,
  Sparkles,
  Lock,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Scale,
  User,
  Mail,
  BadgeAlert,
  MapPin,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function Register() {
  const nav = useNavigate();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [designation, setDesignation] = useState('Legal Metrology Officer');
  const [zone, setZone] = useState('Zone 4 — Delhi NCR');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      error('Password Mismatch', 'Password and confirmation password must match.');
      return;
    }
    if (!agreed) {
      error('Statutory Declaration', 'You must confirm statutory officer authorization.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success(
        'Officer Registered',
        `Account created for ${name || 'Officer'}. Redirecting to sign in...`
      );
      nav('/login');
    }, 700);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      success('Demo Session Initialized', 'Logged in with authorized Inspector credentials.');
      nav('/dashboard');
    }, 400);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-12 bg-white selection:bg-brand-600 selection:text-white">
      {/* Left Column: Official Government Tech Showcase + Demo Access */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-navy-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background Glows */}
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
                  PACKSURE
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

        {/* Vision & Demo Access Card (Placed on this side) */}
        <div className="relative z-10 my-auto max-w-xl py-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-300 border border-brand-500/30 mb-5">
            <Scale size={14} />
            <span>Officer Credential Issuance</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white">
            Join the National Legal Metrology Inspection Grid.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Registered officers receive instant AI declaration audit tooling, digital rulebook references, and automated statutory certificate generation.
          </p>

          {/* Quick Demo Sign-In Card on the Left Side */}
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                  SIH Evaluator Quick Access
                </span>
                <p className="text-sm font-bold text-white mt-1">Want to test the platform immediately?</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Skip manual registration and jump directly into Inspector Priya Sharma's pre-configured live command center.
                </p>
              </div>
              <Sparkles size={20} className="text-cyan-400 shrink-0 mt-1" />
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

        {/* Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Official Enforcement Environment</span>
          <span className="font-mono text-[11px]">Authorized Personnel Only</span>
        </div>
      </section>

      {/* Right Column: Register Form */}
      <section className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy-950 text-white">
              <Shield size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">PACKSURE AI</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">
                Compliance Platform
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 border border-brand-100">
                New Officer Registration
              </span>
              <span className="text-xs text-slate-400">• Credentials Enrollment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Register Officer Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enroll your government inspection credentials to access the PackSure AI grid.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="field-label">Full Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Inspector Rohan Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
              />
            </div>

            <div>
              <label className="field-label">Government / Official Email</label>
              <input
                required
                type="email"
                placeholder="rohan.mehta@gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Designation</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="field cursor-pointer text-xs"
                >
                  <option value="Legal Metrology Officer">Legal Metrology Officer</option>
                  <option value="Field Inspector">Field Inspector</option>
                  <option value="Senior Enforcement Officer">Senior Enforcement Officer</option>
                  <option value="Superintendent">Superintendent</option>
                </select>
              </div>

              <div>
                <label className="field-label">Officer Badge / ID</label>
                <input
                  required
                  placeholder="LM-DEL-512"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="field font-mono uppercase text-xs"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Assigned Enforcement Zone</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="field cursor-pointer text-xs"
              >
                <option value="Zone 4 — Delhi NCR">Zone 4 — Delhi NCR</option>
                <option value="Zone 1 — Northern Region">Zone 1 — Northern Region</option>
                <option value="Zone 2 — Western Region">Zone 2 — Western Region</option>
                <option value="Zone 3 — Southern Region">Zone 3 — Southern Region</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field text-xs"
                />
              </div>

              <div>
                <label className="field-label">Confirm Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="field text-xs"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 rounded accent-brand-600 mt-0.5 cursor-pointer shrink-0"
                />
                <span>
                  I declare that I am an authorized enforcement officer under the Legal Metrology Act, 2009.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full bg-navy-950 hover:bg-navy-900 shadow-elevated mt-2"
            >
              <Lock size={15} />
              Register Officer Profile
            </Button>
          </form>

          {/* Already have an account */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Already registered with an officer account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800">
              Sign in securely →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

