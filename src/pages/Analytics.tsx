import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StatCard } from '../components/dashboard/StatCard';
import { ClipboardCheck, Percent, TriangleAlert } from 'lucide-react';
const data = [
  { n: 'Food', v: 402 },
  { n: 'Personal care', v: 280 },
  { n: 'Household', v: 214 },
  { n: 'Electronics', v: 168 },
];
export function Analytics() {
  return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Compliance performance and inspection trends across categories.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <StatCard title="Total inspections" value="1,284" change="12.4%" icon={ClipboardCheck} />
        <StatCard title="Compliance percentage" value="80.8%" change="3.2%" icon={Percent} tone="green" />
        <StatCard title="Open violations" value="90" change="-6.4%" icon={TriangleAlert} tone="amber" />
      </div>
      <div className="card mt-6 p-5">
        <h2 className="font-bold">Product category statistics</h2>
        <p className="text-sm text-slate-500">Inspections processed by category</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="n" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="v" fill="#2563eb" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold">Most common violations</h2>
          <ol className="mt-4 space-y-3 text-sm">
            <li>
              1. Consumer care details missing <b className="float-right">24</b>
            </li>
            <li>
              2. MRP declaration requires review <b className="float-right">17</b>
            </li>
            <li>
              3. Country of origin incomplete <b className="float-right">10</b>
            </li>
          </ol>
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Monthly insight</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Food & beverage inspections show the strongest improvement this month, while personal care labels
            account for the highest share of reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
