import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, Search, Siren } from 'lucide-react';
import { AsyncView } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { scanThreats } from '@/services/api/endpoints';
import type { ScanRequest, Severity } from '@/services/api/types';
import { formatRelative, formatTime, severityMeta } from '@/utils/format';
import { cn } from '@/utils/cn';

const severityOptions: (Severity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];

export function ThreatHuntingPage() {
  const [draft, setDraft] = useState<ScanRequest>({ query: '', severity: 'all' });
  const [request, setRequest] = useState<ScanRequest>({ query: '', severity: 'all' });
  const navigate = useNavigate();
  const state = useAsync(() => scanThreats(request), [request]);

  const runScan = (event: React.FormEvent) => {
    event.preventDefault();
    setRequest({ ...draft });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Hunting"
        title="Threat Hunting"
        description="Search security events, review behavioral anomalies, and hand suspicious activity to the AI investigation pipeline."
      />

      <Card className="p-5">
        <form onSubmit={runScan} className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              className="input-base pl-9"
              placeholder="Search by event, host, user, or MITRE technique (e.g. T1059)"
              value={draft.query}
              onChange={(event) => setDraft({ ...draft, query: event.target.value })}
              aria-label="Search security events"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Filter by severity">
            {severityOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={draft.severity === option}
                onClick={() => setDraft({ ...draft, severity: option })}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all duration-200',
                  draft.severity === option
                    ? 'border-primary-500/60 bg-primary-500/15 text-slate-50'
                    : 'border-soc-border text-slate-400 hover:border-slate-500 hover:text-slate-200',
                )}
              >
                {option === 'all' ? 'All severities' : severityMeta[option].label}
              </button>
            ))}
          </div>
          <Button type="submit" variant="primary" icon={<Radar className="h-4 w-4" aria-hidden />} disabled={state.loading}>
            {state.loading ? 'Scanning...' : 'Run scan'}
          </Button>
        </form>
      </Card>

      <AsyncView
        {...state}
        onRetry={state.reload}
        loadingLabel="Scanning event store and behavioral baselines..."
        emptyState={
          <Card>
            <EmptyState icon={Search} title="No matching activity" description="Try a broader search term or select all severities." />
          </Card>
        }
        isEmpty={(result) => result.events.length === 0 && result.anomalies.length === 0}
      >
        {(result) => (
          <>
            <Card>
              <CardHeader
                title="Behavioral anomaly detection"
                description={`${result.anomalies.length} anomalies scored against entity baselines · scanned ${formatTime(result.scannedAt)}`}
              />
              {result.anomalies.length === 0 ? (
                <EmptyState icon={Siren} title="No anomalies for this search" description="Behavioral detections will appear here when a baseline deviation is found." />
              ) : (
                <div className="grid gap-4 p-5 lg:grid-cols-2">
                  {result.anomalies.map((anomaly) => (
                    <article
                      key={anomaly.id}
                      className="flex flex-col gap-4 rounded-xl border border-soc-border bg-soc-bg/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-500/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-slate-500">{anomaly.id}</p>
                          <h3 className="mt-1 text-base font-semibold text-slate-100">{anomaly.behavior}</h3>
                          <p className="mt-1 truncate text-sm text-slate-400">{anomaly.entity}</p>
                        </div>
                        <SeverityBadge severity={anomaly.severity} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Anomaly score</span>
                          <span className={cn('font-mono font-semibold', severityMeta[anomaly.severity].text)}>{anomaly.score}/100</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soc-elevated">
                          <div className="h-full rounded-full bg-primary-500 transition-all duration-700" style={{ width: `${anomaly.score}%`, backgroundColor: severityMeta[anomaly.severity].chart }} />
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{anomaly.details}</p>
                      <div className="flex flex-wrap gap-2">
                        {anomaly.indicators.map((indicator) => (
                          <Badge key={indicator} className="bg-soc-elevated text-slate-300 ring-soc-border">{indicator}</Badge>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-soc-border pt-4">
                        <span className="text-xs text-slate-500">Detected {formatRelative(anomaly.detectedAt)}</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/investigations?investigation=${anomaly.investigationId}`)}
                        >
                          Investigate Threat
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Matching security events" description={`${result.events.length} events match the current filters`} />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-soc-bg/40 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="table-cell-base font-semibold">Time</th>
                      <th className="table-cell-base font-semibold">Event</th>
                      <th className="table-cell-base font-semibold">Host / User</th>
                      <th className="table-cell-base font-semibold">MITRE</th>
                      <th className="table-cell-base font-semibold">Score</th>
                      <th className="table-cell-base font-semibold">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soc-border">
                    {result.events.map((event) => (
                      <tr key={event.id} className="transition-colors hover:bg-soc-elevated/60">
                        <td className="table-cell-base font-mono text-xs text-slate-400">{formatTime(event.timestamp)}</td>
                        <td className="table-cell-base">
                          <p className="text-slate-100">{event.eventType}</p>
                          <p className="mt-0.5 max-w-md truncate text-xs text-slate-500">{event.description}</p>
                        </td>
                        <td className="table-cell-base text-slate-300">
                          {event.host} <span className="text-slate-500">· {event.user}</span>
                        </td>
                        <td className="table-cell-base">
                          <Badge className="bg-soc-elevated text-slate-300 ring-soc-border font-mono">{event.mitreTechnique}</Badge>
                        </td>
                        <td className="table-cell-base font-mono text-slate-200">{event.anomalyScore}</td>
                        <td className="table-cell-base"><SeverityBadge severity={event.severity} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </AsyncView>
    </div>
  );
}
