import { useState } from 'react';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import {
  User,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  KeyRound,
  Laptop,
  Check,
} from 'lucide-react';

export function Settings() {
  const { success } = useToast();

  // Profile Form State
  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@gov.in');
  const [officerId, setOfficerId] = useState('LM-DEL-408');
  const [zone, setZone] = useState('Zone 4 — Delhi NCR');

  // App Preferences State
  const [confidenceThreshold, setConfidenceThreshold] = useState('85');
  const [rulebook, setRulebook] = useState('2011-amended-2024');
  const [autoFlagHigh, setAutoFlagHigh] = useState(true);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success('Profile Updated', 'Officer profile information saved successfully.');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    success('Preferences Saved', 'AI detection sensitivity and rulebook updated.');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    success('Notifications Saved', 'Alert and email preferences saved.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-card">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
            System Preferences
          </span>
          <span className="text-xs text-slate-400">• Officer Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
          Settings & Workspace Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure officer credentials, Legal Metrology AI sensitivity thresholds, and alerts.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Profile Section */}
        <section className="card p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <User size={19} className="text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Officer Profile</h2>
              <p className="text-xs text-slate-500">Government credential details and jurisdiction</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Full Name</label>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Official Email</label>
                <input
                  type="email"
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Officer Badge / ID</label>
                <input
                  className="field font-mono"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Assigned Enforcement Zone</label>
                <input
                  className="field"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </section>

        {/* 2. Security Section */}
        <section className="card p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Shield size={19} className="text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Authentication</h2>
              <p className="text-xs text-slate-500">
                Authorized government session control and multi-factor authentication
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                  <KeyRound size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Two-Factor Authentication (Govt e-Sign)</p>
                  <p className="text-xs text-slate-500">Secured with National Informatics Centre (NIC) OTP</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 self-start sm:self-auto">
                Enforced & Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-200 text-slate-700 shrink-0">
                  <Laptop size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Active Enforcement Terminal</p>
                  <p className="text-xs text-slate-500">Windows 11 • Chrome 124 • IP: 10.14.88.19 (Govt Intranet)</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => success('Password Dialog', 'Password change link sent to official email.')}
              >
                Change Password
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Notifications Section */}
        <section className="card p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Bell size={19} className="text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Select when and how you receive compliance alerts</p>
            </div>
          </div>

          <form onSubmit={handleSaveNotifications} className="mt-5 space-y-4">
            <div className="space-y-3">
              <label className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">High-Risk Violation Notifications</p>
                  <p className="text-xs text-slate-500">Instant notification when Rule 6(1)(l) or MRP violations are detected</p>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskAlerts}
                  onChange={(e) => setHighRiskAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-brand-600 mt-1 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Officer Assignment Pings</p>
                  <p className="text-xs text-slate-500">Notify me when a new product batch is assigned to my inspection queue</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-brand-600 mt-1 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Weekly Division Compliance Briefing</p>
                  <p className="text-xs text-slate-500">Receive summary statistics every Monday at 09:00 IST</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="h-4 w-4 rounded accent-brand-600 mt-1 cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                Save Notification Settings
              </Button>
            </div>
          </form>
        </section>

        {/* 4. Application Preferences Section */}
        <section className="card p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders size={19} className="text-brand-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Application Preferences</h2>
              <p className="text-xs text-slate-500">AI recognition sensitivity and Metrology rulebook parameters</p>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">OCR Confidence Filter Threshold</label>
                <select
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(e.target.value)}
                  className="field cursor-pointer"
                >
                  <option value="90">90% (Strict Legal Proceeding Level)</option>
                  <option value="85">85% (Recommended Default)</option>
                  <option value="75">75% (High Sensitivity / Pre-screening)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Confidence level below which declarations are flagged for human inspection.
                </p>
              </div>

              <div>
                <label className="field-label">Active Metrology Rulebook</label>
                <select
                  value={rulebook}
                  onChange={(e) => setRulebook(e.target.value)}
                  className="field cursor-pointer"
                >
                  <option value="2011-amended-2024">
                    Packaged Commodities Rules, 2011 (with 2024 Amendments)
                  </option>
                  <option value="2011-standard">Rules, 2011 Standard Edition</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Includes latest provisions for e-commerce declarations and font heights.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                Save Application Preferences
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
