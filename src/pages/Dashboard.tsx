import { AlertTriangle, CheckCircle2, ClipboardCheck, Plus, SearchCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ComplianceChart } from '../components/dashboard/ComplianceChart';
import { RecentInspections } from '../components/dashboard/RecentInspections';
import { StatCard } from '../components/dashboard/StatCard';
import { ViolationSummary } from '../components/dashboard/ViolationSummary';
export function Dashboard() {
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="page-title">Good morning, Priya</h1>
          <p className="page-subtitle">Here’s your inspection overview for August 2026.</p>
        </div>
        <Link to="/inspection/new">
          <Button>
            <Plus size={17} />
            Start new inspection
          </Button>
        </Link>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total inspections" value="1,284" change="12.4%" icon={ClipboardCheck} />
        <StatCard title="Compliant" value="1,038" change="8.1%" icon={CheckCircle2} tone="green" />
        <StatCard title="Needs review" value="156" change="4.7%" icon={SearchCheck} tone="amber" />
        <StatCard title="Potential violations" value="90" change="2.3%" icon={AlertTriangle} tone="red" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComplianceChart />
        </div>
        <ViolationSummary />
      </div>
      <div className="mt-6">
        <RecentInspections />
      </div>
    </div>
  );
}
