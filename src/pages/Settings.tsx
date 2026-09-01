import { Button } from '../components/common/Button';
export function Settings() {
  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your profile and workspace preferences.</p>
      <div className="mt-7 max-w-3xl space-y-5">
        <section className="card p-6">
          <h2 className="font-bold">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Full name
              <input className="field" defaultValue="Priya Sharma" />
            </label>
            <label className="text-sm font-medium">
              Official email
              <input className="field" defaultValue="priya.sharma@gov.in" />
            </label>
          </div>
          <Button className="mt-5">Save profile</Button>
        </section>
        <section className="card p-6">
          <h2 className="font-bold">Notification settings</h2>
          <div className="mt-4 space-y-4 text-sm">
            {[
              'Email me when an inspection is assigned',
              'Notify me about high-risk violations',
              'Weekly compliance summary',
            ].map((x) => (
              <label key={x} className="flex items-center justify-between">
                <span>{x}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-700" />
              </label>
            ))}
          </div>
        </section>
        <section className="card p-6">
          <h2 className="font-bold">Security</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your authentication settings and active sessions.
          </p>
          <Button variant="secondary" className="mt-4">
            Change password
          </Button>
        </section>
      </div>
    </div>
  );
}
