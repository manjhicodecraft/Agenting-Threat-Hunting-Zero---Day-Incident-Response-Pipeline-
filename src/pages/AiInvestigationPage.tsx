import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bot, Loader2, Play } from 'lucide-react';
import { AsyncView } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { analyzeInvestigation, getIncidents, getInvestigation } from '@/services/api/endpoints';
import type { AgentLog, BehaviorFinding, Evidence, Investigation, TimelineEntry } from '@/services/api/types';
import { formatTime, incidentStatusMeta, severityMeta } from '@/utils/format';
import { cn } from '@/utils/cn';

export function AiInvestigationPage() {
  const [params, setParams] = useSearchParams();
  const incidents = useAsync(getIncidents);
  const linked = (incidents.data ?? []).filter((incident) => incident.investigationId);
  const selectedId = params.get('investigation') ?? linked[0]?.investigationId ?? null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI Investigation"
        title="AI Investigation Center"
        description="Agent-generated timelines, behavior analysis, and collected evidence. Agents analyze and recommend; they never act without an analyst."
      />
      <AsyncView
        {...incidents}
        onRetry={incidents.reload}
        loadingLabel="Loading investigations..."
        isEmpty={(data) => data.filter((incident) => incident.investigationId).length === 0}
        emptyState={
          <Card>
            <EmptyState icon={Bot} title="No investigations yet" description="Investigations open automatically when the hunting pipeline raises a high-confidence anomaly." />
          </Card>
        }
      >
        {(data) => (
          <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
            <Card className="h-fit">
              <CardHeader title="Investigations" description="Select a case to review" />
              <ul className="divide-y divide-soc-border">
                {data
                  .filter((incident) => incident.investigationId)
                  .map((incident) => {
                    const active = incident.investigationId === selectedId;
                    return (
                      <li key={incident.id}>
                        <button
                          type="button"
                          onClick={() => setParams({ investigation: incident.investigationId ?? '' })}
                          className={cn(
                            'flex w-full flex-col gap-2 px-5 py-4 text-left transition-colors',
                            active ? 'bg-primary-500/10' : 'hover:bg-soc-elevated/60',
                          )}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="font-mono text-xs text-slate-500">{incident.investigationId}</span>
                            <span className={cn('h-2 w-2 rounded-full', severityMeta[incident.severity].dot)} />
                          </div>
                          <span className="text-sm font-medium text-slate-100">{incident.threatType}</span>
                          <Badge className={incidentStatusMeta[incident.status].badge}>{incidentStatusMeta[incident.status].label}</Badge>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </Card>
            {selectedId ? (
              <InvestigationDetail key={selectedId} investigationId={selectedId} />
            ) : (
              <Card>
                <EmptyState icon={Bot} title="Select an investigation" description="Choose a case on the left to see its timeline and evidence." />
              </Card>
            )}
          </div>
        )}
      </AsyncView>
    </div>
  );
}

function InvestigationDetail({ investigationId }: { investigationId: string }) {
  const state = useAsync(() => getInvestigation(investigationId), [investigationId]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const navigate = useNavigate();

  const runAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      state.setData(await analyzeInvestigation(investigationId));
    } catch (cause) {
      setAnalysisError(cause instanceof Error ? cause.message : 'Analysis could not be started.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AsyncView {...state} onRetry={state.reload} emptyState={null} loadingLabel="Loading investigation...">
      {(investigation: Investigation) => (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs text-slate-500">{investigation.id}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-50">{investigation.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{investigation.summary}</p>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-3">
                <Button variant="primary" onClick={runAnalysis} disabled={analyzing} icon={analyzing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}>
                  {analyzing ? 'Analyzing...' : 'Run analysis'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/incidents`)}>
                  Open incident queue
                </Button>
              </div>
            </div>
            {analysisError && <p className="mt-4 text-sm text-critical-400" role="alert">{analysisError}</p>}
            <RiskAssessment score={investigation.riskScore} />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Investigation timeline" description="Agent and analyst actions in order" />
              <TimelineList entries={investigation.timeline} />
            </Card>
            <Card>
              <CardHeader title="Threat behavior analysis" description="Observed techniques mapped to MITRE ATT&CK" />
              <BehaviorList findings={investigation.behaviors} />
            </Card>
          </div>

          <Card>
            <CardHeader title="Evidence collection" description="Artifacts preserved with SHA-256 hashes for chain of custody" />
            <EvidenceList items={investigation.evidence} />
          </Card>

          <Card>
            <CardHeader title="Agent activity logs" description="Reasoning steps reported by each analysis agent" />
            <AgentLogList logs={investigation.agentLogs} />
          </Card>
        </div>
      )}
    </AsyncView>
  );
}

function RiskAssessment({ score }: { score: number }) {
  const level = score >= 85 ? 'critical' : score >= 65 ? 'high' : score >= 40 ? 'medium' : 'low';
  const meta = severityMeta[level];
  return (
    <div className="mt-6 rounded-xl border border-soc-border bg-soc-bg/50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">Risk assessment</p>
        <span className={cn('font-mono text-sm font-semibold', meta.text)}>
          {score}/100 · {meta.label}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-soc-elevated">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${score}%`, backgroundColor: meta.chart }} />
      </div>
    </div>
  );
}

function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return <EmptyState title="No timeline events yet" description="Events appear here as the agent gathers evidence." />;
  return (
    <ol className="space-y-5 p-5">
      {entries.map((entry) => (
        <li key={entry.id} className="relative pl-6">
          <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500 ring-4 ring-primary-500/15" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-100">{entry.title}</p>
            <span className="font-mono text-xs text-slate-500">{formatTime(entry.time)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">{entry.detail}</p>
          <span className="mt-2 inline-block text-xs text-slate-500">{entry.actor}</span>
        </li>
      ))}
    </ol>
  );
}

function BehaviorList({ findings }: { findings: BehaviorFinding[] }) {
  if (findings.length === 0) return <EmptyState title="No behaviors identified" description="Behavior findings appear after analysis." />;
  return (
    <ul className="space-y-4 p-5">
      {findings.map((finding) => (
        <li key={finding.name} className="rounded-lg bg-soc-bg/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-slate-100">{finding.name}</p>
            <Badge className="bg-soc-elevated font-mono text-slate-300 ring-soc-border">{finding.mitreTechnique}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-400">{finding.description}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soc-elevated">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.round(finding.confidence * 100)}%` }} />
            </div>
            <span className="font-mono text-xs text-slate-400">{Math.round(finding.confidence * 100)}% confidence</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EvidenceList({ items }: { items: Evidence[] }) {
  if (items.length === 0) return <EmptyState title="No evidence collected" description="Artifacts will be listed here once they are preserved." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-soc-bg/40 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="table-cell-base font-semibold">Type</th>
            <th className="table-cell-base font-semibold">Description</th>
            <th className="table-cell-base font-semibold">SHA-256</th>
            <th className="table-cell-base font-semibold">Collected</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-soc-border">
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-soc-elevated/60">
              <td className="table-cell-base text-slate-200">{item.type}</td>
              <td className="table-cell-base text-slate-400">{item.description}</td>
              <td className="table-cell-base font-mono text-xs text-slate-500" title={item.sha256}>{item.sha256.slice(0, 16)}...</td>
              <td className="table-cell-base font-mono text-xs text-slate-400">{formatTime(item.collectedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgentLogList({ logs }: { logs: AgentLog[] }) {
  if (logs.length === 0) return <EmptyState title="No agent activity" description="Agent logs will stream here during analysis." />;
  const levelClass = { info: 'text-primary-300', warn: 'text-warning-400', success: 'text-success-400' };
  return (
    <ul className="max-h-72 space-y-2 overflow-y-auto p-5 font-mono text-xs">
      {logs.map((log) => (
        <li key={log.id} className="flex flex-wrap gap-x-3 rounded-md bg-soc-bg/60 px-3 py-2">
          <span className="text-slate-500">{formatTime(log.time)}</span>
          <span className={levelClass[log.level]}>[{log.agent}]</span>
          <span className="text-slate-300">{log.message}</span>
        </li>
      ))}
    </ul>
  );
}
