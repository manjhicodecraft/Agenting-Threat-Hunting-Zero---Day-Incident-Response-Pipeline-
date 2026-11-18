import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Severity } from '@/services/api/types';
import { severityMeta } from '@/utils/format';

const tooltipStyle = {
  backgroundColor: '#151F30',
  border: '1px solid #24324A',
  borderRadius: 8,
  color: '#F1F5F9',
  fontSize: 12,
};

export function RiskDistributionChart({ data }: { data: { name: Severity; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-56 w-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={96} paddingAngle={3} stroke="none">
              {data.map((item) => (
                <Cell key={item.name} fill={severityMeta[item.name].chart} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-slate-50">{total}</span>
          <span className="text-xs text-slate-500">open risks</span>
        </div>
      </div>
      <ul className="grid w-full flex-1 gap-3">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between rounded-lg bg-soc-bg/50 px-4 py-3">
            <span className="flex items-center gap-3 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severityMeta[item.name].chart }} />
              {severityMeta[item.name].label}
            </span>
            <span className="font-mono text-sm font-medium text-slate-100">
              {item.value}
              <span className="ml-2 text-xs text-slate-500">{Math.round((item.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
