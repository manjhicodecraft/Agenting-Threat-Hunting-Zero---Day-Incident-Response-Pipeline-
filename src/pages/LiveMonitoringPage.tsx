import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AsyncView } from '@/components/ui/AsyncView';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { getProcesses } from '@/services/api/endpoints';
import type { ProcessClassification, ProcessStatus } from '@/services/api/types';
import { classificationMeta, processStatusMeta } from '@/utils/format';
import { cn } from '@/utils/cn';
import { EmptyState } from '@/components/ui/DataState';
import { Badge } from '@/components/ui/Badge';

export function LiveMonitoringPage() {
  const state = useAsync(getProcesses);
  const [query, setQuery] = useState('');
  const [classification, setClassification] = useState<ProcessClassification | 'all'>('all');
  const [status, setStatus] = useState<ProcessStatus | 'all'>('all');

  const processes = useMemo(() => state.data ?? [], [state.data]);
  const filtered = useMemo(
    () =>
      processes.filter(
        (process) =>
          (classification === 'all' || process.classification === classification) &&
          (status === 'all' || process.status === status) &&
          (!query.trim() || `${process.name} ${process.user} ${process.pid}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [processes, query, classification, status],
  );
  const suspiciousCount = processes.filter((process) => process.classification === 'suspicious').length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Monitoring"
        title="Live System Monitoring"
        description="Process telemetry from endpoint agents. Flagged processes are surfaced for analyst review; nothing is stopped automatically."
        actions={
          <Badge className="bg-warning-500/10 text-warning-400 ring-warning-500/30">Demo telemetry</Badge>
        }
      />

      <AsyncView
        {...state}
        onRetry={state.reload}
        emptyState={null}
        loadingLabel="Collecting process telemetry..."
      >
        {() => (
          <Card>
            <div className="flex flex-col gap-4 border-b border-soc-border p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{processes.length} processes</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-critical-400">{suspiciousCount} flagged suspicious</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                  <input
                    className="input-base pl-9 sm:w-64"
                    placeholder="Search name, user, or PID"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search processes"
                  />
                </label>
                <select className="input-base sm:w-44" value={classification} onChange={(event) => setClassification(event.target.value as ProcessClassification | 'all')} aria-label="Filter by classification">
                  <option value="all">All classifications</option>
                  {(Object.keys(classificationMeta) as ProcessClassification[]).map((key) => (
                    <option key={key} value={key}>{classificationMeta[key].label}</option>
                  ))}
                </select>
                <select className="input-base sm:w-40" value={status} onChange={(event) => setStatus(event.target.value as ProcessStatus | 'all')} aria-label="Filter by status">
                  <option value="all">All statuses</option>
                  {(Object.keys(processStatusMeta) as ProcessStatus[]).map((key) => (
                    <option key={key} value={key}>{processStatusMeta[key].label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="No processes match these filters" description="Clear the search or choose a different classification to see more processes." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-soc-bg/40 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="table-cell-base font-semibold">PID</th>
                      <th className="table-cell-base font-semibold">Process</th>
                      <th className="table-cell-base font-semibold">User</th>
                      <th className="table-cell-base font-semibold">CPU</th>
                      <th className="table-cell-base font-semibold">Memory</th>
                      <th className="table-cell-base font-semibold">Status</th>
                      <th className="table-cell-base font-semibold">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soc-border">
                    {filtered.map((process) => (
                      <tr
                        key={process.pid}
                        className={cn('transition-colors hover:bg-soc-elevated/60', process.classification === 'suspicious' && 'bg-critical-500/5')}
                      >
                        <td className="table-cell-base font-mono text-slate-400">{process.pid}</td>
                        <td className="table-cell-base font-mono text-slate-100">{process.name}</td>
                        <td className="table-cell-base text-slate-300">{process.user}</td>
                        <td className="table-cell-base">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-soc-elevated">
                              <div
                                className={cn('h-full rounded-full transition-all duration-700', process.cpuPercent > 30 ? 'bg-critical-500' : 'bg-primary-500')}
                                style={{ width: `${Math.min(100, process.cpuPercent * 2.5)}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-slate-300">{process.cpuPercent.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="table-cell-base font-mono text-slate-300">{process.memoryMb} MB</td>
                        <td className="table-cell-base">
                          <span className="inline-flex items-center gap-2 text-slate-300">
                            <span className={cn('h-2 w-2 rounded-full', processStatusMeta[process.status].dot)} />
                            {processStatusMeta[process.status].label}
                          </span>
                        </td>
                        <td className="table-cell-base">
                          <Badge className={classificationMeta[process.classification].badge}>{classificationMeta[process.classification].label}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </AsyncView>
    </div>
  );
}
