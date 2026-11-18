import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AsyncView } from '@/components/ui/AsyncView';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { getIncidents } from '@/services/api/endpoints';
import type { Incident, IncidentStatus, Severity } from '@/services/api/types';
import { formatDateTime, formatRelative, incidentStatusMeta, severityMeta } from '@/utils/format';
import { cn } from '@/utils/cn';

export function IncidentManagementPage() {
  const state = useAsync(getIncidents);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [status, setStatus] = useState<IncidentStatus | 'all'>('all');
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = useMemo(
    () =>
      (state.data ?? []).filter(
        (incident) =>
          (severity === 'all' || incident.severity === severity) &&
          (status === 'all' || incident.status === status) &&
          (!query.trim() || `${incident.id} ${incident.threatType} ${incident.affectedHosts.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [state.data, query, severity, status],
  );

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Incidents" title="Incident Management" description="Track every confirmed threat from detection through investigation and containment." />

      <AsyncView
        {...state}
        onRetry={state.reload}
        loadingLabel="Loading incident queue..."
        emptyState={
          <Card>
            <EmptyState title="No incidents recorded" description="Incidents are created when a detection is confirmed as a threat." />
          </Card>
        }
        isEmpty={(data) => data.length === 0}
      >
        {() => (
          <Card>
            <div className="flex flex-col gap-3 border-b border-soc-border p-5 lg:flex-row lg:items-center">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                <input className="input-base pl-9" placeholder="Search incident ID, threat type, or host" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search incidents" />
              </label>
              <select className="input-base lg:w-44" value={severity} onChange={(event) => setSeverity(event.target.value as Severity | 'all')} aria-label="Filter by severity">
                <option value="all">All severities</option>
                {(Object.keys(severityMeta) as Severity[]).map((key) => (
                  <option key={key} value={key}>{severityMeta[key].label}</option>
                ))}
              </select>
              <select className="input-base lg:w-48" value={status} onChange={(event) => setStatus(event.target.value as IncidentStatus | 'all')} aria-label="Filter by investigation status">
                <option value="all">All statuses</option>
                {(Object.keys(incidentStatusMeta) as IncidentStatus[]).map((key) => (
                  <option key={key} value={key}>{incidentStatusMeta[key].label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="No incidents match these filters" description="Adjust the search or filters to see more incidents." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-soc-bg/40 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="table-cell-base font-semibold">Incident ID</th>
                      <th className="table-cell-base font-semibold">Threat type</th>
                      <th className="table-cell-base font-semibold">Severity</th>
                      <th className="table-cell-base font-semibold">Detected</th>
                      <th className="table-cell-base font-semibold">Investigation</th>
                      <th className="table-cell-base font-semibold"><span className="sr-only">Details</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soc-border">
                    {filtered.map((incident) => (
                      <tr key={incident.id} className="transition-colors hover:bg-soc-elevated/60">
                        <td className="table-cell-base font-mono text-slate-200">{incident.id}</td>
                        <td className="table-cell-base max-w-xs truncate text-slate-100">{incident.threatType}</td>
                        <td className="table-cell-base"><SeverityBadge severity={incident.severity} /></td>
                        <td className="table-cell-base text-slate-400">
                          {formatDateTime(incident.detectedAt)} <span className="text-xs text-slate-600">· {formatRelative(incident.detectedAt)}</span>
                        </td>
                        <td className="table-cell-base"><Badge className={incidentStatusMeta[incident.status].badge}>{incidentStatusMeta[incident.status].label}</Badge></td>
                        <td className="table-cell-base text-right">
                          <Button size="sm" variant="secondary" onClick={() => setSelected(incident)}>View details</Button>
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

      <IncidentDetailDrawer incident={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function IncidentDetailDrawer({ incident, onClose }: { incident: Incident | null; onClose: () => void }) {
  const navigate = useNavigate();
  if (!incident) return null;

  return (
    <Drawer open title={incident.threatType} subtitle={incident.id} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <SeverityBadge severity={incident.severity} />
          <Badge className={incidentStatusMeta[incident.status].badge}>{incidentStatusMeta[incident.status].label}</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-4 rounded-xl border border-soc-border bg-soc-bg/50 p-5 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500">Detected</dt>
            <dd className="mt-1 text-slate-200">{formatDateTime(incident.detectedAt)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-500">Affected assets</dt>
            <dd className="mt-1 font-mono text-slate-200">{incident.affectedHosts.join(', ')}</dd>
          </div>
        </dl>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Summary</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{incident.summary}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {incident.investigationId && (
            <Button variant="primary" onClick={() => navigate(`/investigations?investigation=${incident.investigationId}`)}>
              Open investigation
            </Button>
          )}
          <Button onClick={() => navigate(`/response?incident=${incident.id}`)}>Review response actions</Button>
        </div>
        <button type="button" onClick={onClose} className="sr-only">
          <X className="h-4 w-4" aria-hidden />
          Close
        </button>
        <p className={cn('text-xs text-slate-600')}>No response action runs automatically from this view.</p>
      </div>
    </Drawer>
  );
}
