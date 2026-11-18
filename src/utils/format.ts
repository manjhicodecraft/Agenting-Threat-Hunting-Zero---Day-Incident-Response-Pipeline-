import type { IncidentStatus, ProcessClassification, ProcessStatus, Severity } from '@/services/api/types';

export const severityMeta: Record<Severity, { label: string; text: string; badge: string; dot: string; chart: string }> = {
  critical: {
    label: 'Critical',
    text: 'text-critical-400',
    badge: 'bg-critical-500/10 text-critical-400 ring-critical-500/30',
    dot: 'bg-critical-500',
    chart: '#EF4444',
  },
  high: {
    label: 'High',
    text: 'text-warning-400',
    badge: 'bg-warning-500/10 text-warning-400 ring-warning-500/30',
    dot: 'bg-warning-500',
    chart: '#F59E0B',
  },
  medium: {
    label: 'Medium',
    text: 'text-primary-400',
    badge: 'bg-primary-500/10 text-primary-300 ring-primary-500/30',
    dot: 'bg-primary-500',
    chart: '#3B82F6',
  },
  low: {
    label: 'Low',
    text: 'text-success-400',
    badge: 'bg-success-500/10 text-success-400 ring-success-500/30',
    dot: 'bg-success-500',
    chart: '#22C55E',
  },
};

export const incidentStatusMeta: Record<IncidentStatus, { label: string; badge: string }> = {
  new: { label: 'New', badge: 'bg-primary-500/10 text-primary-300 ring-primary-500/30' },
  triaging: { label: 'Triaging', badge: 'bg-warning-500/10 text-warning-400 ring-warning-500/30' },
  investigating: { label: 'Investigating', badge: 'bg-warning-500/10 text-warning-400 ring-warning-500/30' },
  contained: { label: 'Contained', badge: 'bg-success-500/10 text-success-400 ring-success-500/30' },
  resolved: { label: 'Resolved', badge: 'bg-slate-500/15 text-slate-350 ring-slate-500/30' },
};

export const processStatusMeta: Record<ProcessStatus, { label: string; dot: string }> = {
  running: { label: 'Running', dot: 'bg-success-500' },
  sleeping: { label: 'Sleeping', dot: 'bg-slate-500' },
  suspended: { label: 'Suspended', dot: 'bg-warning-500' },
};

export const classificationMeta: Record<ProcessClassification, { label: string; badge: string }> = {
  trusted: { label: 'Trusted', badge: 'bg-success-500/10 text-success-400 ring-success-500/30' },
  monitored: { label: 'Monitored', badge: 'bg-primary-500/10 text-primary-300 ring-primary-500/30' },
  unknown: { label: 'Unknown', badge: 'bg-slate-500/15 text-slate-350 ring-slate-500/30' },
  suspicious: { label: 'Suspicious', badge: 'bg-critical-500/10 text-critical-400 ring-critical-500/30' },
};

const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso));

export function formatRelative(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
