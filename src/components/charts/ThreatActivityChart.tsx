import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ActivityPoint } from '@/services/api/types';

const tooltipStyle = {
  backgroundColor: '#151F30',
  border: '1px solid #24324A',
  borderRadius: 8,
  color: '#F1F5F9',
  fontSize: 12,
};

export function ThreatActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="criticalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1B2740" vertical={false} />
        <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#A9B6CB' }} />
        <Area type="monotone" dataKey="threats" name="Threats" stroke="#3B82F6" strokeWidth={2} fill="url(#threatFill)" />
        <Area type="monotone" dataKey="critical" name="Critical" stroke="#EF4444" strokeWidth={2} fill="url(#criticalFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
