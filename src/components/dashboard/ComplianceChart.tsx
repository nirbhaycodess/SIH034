import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const data = [
  { m: 'Mar', v: 73 },
  { m: 'Apr', v: 78 },
  { m: 'May', v: 75 },
  { m: 'Jun', v: 82 },
  { m: 'Jul', v: 80 },
  { m: 'Aug', v: 86 },
];
export function ComplianceChart() {
  return (
    <div className="card p-5">
      <div>
        <h3 className="font-bold">Compliance trend</h3>
        <p className="text-sm text-slate-500">Monthly compliance rate</p>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity=".25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip />
            <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={3} fill="url(#fill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
