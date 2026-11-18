import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ReportData } from '@/services/api/types';

const tooltipStyle = {
  backgroundColor: '#151F30',
  border: '1px solid #24324A',
  borderRadius: 8,
  color: '#F1F5F9',
  fontSize: 12,
};

export function IncidentHistoryChart({ data }: { data: ReportData['incidentHistory'] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={4}>
        <CartesianGrid stroke="#1B2740" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59, 130, 246, 0.06)' }} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#A9B6CB' }} />
        <Bar dataKey="opened" name="Opened" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="resolved" name="Resolved" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
