import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { AsyncView } from '@/components/ui/AsyncView';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsync } from '@/hooks/useAsync';
import { approveIncidentAction, getIncidents, getResponseActions } from '@/services/api/endpoints';
import type { ActionStatus, ResponseAction } from '@/services/api/types';
import { cn } from '@/utils/cn';

const statusMeta: Record<ActionStatus, { label: string; badge: string; hint: string }> = {
  pending_approval: { label: 'Awaiting approval', badge: 'bg-warning-500/10 text-warning-400 ring-warning-500/30', hint: 'Needs analyst sign-off' },
  approved: { label: 'Approved', badge: 'bg-primary-500/10 text-primary-300 ring-primary-500/30', hint: 'Queued for an authorized responder' },
  rejected: { label: 'Rejected', badge: 'bg-slate-500/15 text-slate-350 ring-slate-500/30', hint: 'Not pursued' },
  completed: { label: 'Completed', badge: 'bg-success-500/10 text-success-400 ring-success-500/30', hint: 'Executed and verified' },
};

export function IncidentResponsePage() {
  const [params, setParams] = useSearchParams();
  const incidents = useAsync(getIncidents);
  const incidentId = params.get('incident') ?? incidents.data?.[0]?.id ?? null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Response"
        title="Incident Response Center"
        description="Recommended containment and recovery steps. Every action waits for analyst approval before anything is executed."
      />

      <div className="flex items-start gap-3 rounded-xl border border-primary-500/25 bg-primary-500/10 p-4 text-sm text-slate-300">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" aria-hidden />
        Human approval is required before any critical action. Approving records your decision; it does not stop processes or change systems automatically.
      </div>

      <AsyncView
        {...incidents}
        onRetry={incidents.reload}
        loadingLabel="Loading incidents..."
        isEmpty={(data) => data.length === 0}
        emptyState={
          <Card>
            <EmptyState title="No incidents need a response" description="Recommended actions appear here once an incident is confirmed." />
          </Card>
        }
      >
        {(data) => (
          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <Card className="h-fit">
              <CardHeader title="Incidents" description="Choose an incident to plan its response" />
              <ul className="divide-y divide-soc-border">
                {data.map((incident) => (
                  <li key={incident.id}>
                    <button
                      type="button"
                      onClick={() => setParams({ incident: incident.id })}
                      className={cn(
                        'flex w-full flex-col gap-2 px-5 py-4 text-left transition-colors',
                        incident.id === incidentId ? 'bg-primary-500/10' : 'hover:bg-soc-elevated/60',
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-mono text-xs text-slate-500">{incident.id}</span>
                        <SeverityBadge severity={incident.severity} />
                      </div>
                      <span className="text-sm text-slate-100">{incident.threatType}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
            {incidentId && <ResponseActions key={incidentId} incidentId={incidentId} />}
          </div>
        )}
      </AsyncView>
    </div>
  );
}

function ResponseActions({ incidentId }: { incidentId: string }) {
  const state = useAsync(() => getResponseActions(incidentId), [incidentId]);
  const [pending, setPending] = useState<ResponseAction | null>(null);

  return (
    <Card>
      <CardHeader title="Recommended response actions" description={`Plan for ${incidentId}`} />
      <AsyncView
        {...state}
        onRetry={state.reload}
        loadingLabel="Loading recommended actions..."
        isEmpty={(actions) => actions.length === 0}
        emptyState={<EmptyState icon={Clock3} title="No actions recommended yet" description="The response planner has not proposed actions for this incident." />}
      >
        {(actions) => (
          <ul className="divide-y divide-soc-border">
            {actions.map((action) => (
              <li key={action.id} className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-soc-elevated/40 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-soc-elevated capitalize text-slate-300 ring-soc-border">{action.category}</Badge>
                    <Badge className="bg-soc-elevated text-slate-300 ring-soc-border">{action.impact} impact</Badge>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-100">{action.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{action.rationale}</p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                  <Badge className={statusMeta[action.status].badge}>
                    {action.status === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <Clock3 className="h-3.5 w-3.5" aria-hidden />}
                    {statusMeta[action.status].label}
                  </Badge>
                  <span className="text-xs text-slate-500">{statusMeta[action.status].hint}</span>
                  {action.status === 'pending_approval' && (
                    <Button variant="primary" size="sm" onClick={() => setPending(action)}>
                      Review and approve
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncView>

      <ApprovalDialog
        action={pending}
        incidentId={incidentId}
        onClose={() => setPending(null)}
        onApproved={() => {
          setPending(null);
          state.reload();
        }}
      />
    </Card>
  );
}

function ApprovalDialog({
  action,
  incidentId,
  onClose,
  onApproved,
}: {
  action: ResponseAction | null;
  incidentId: string;
  onClose: () => void;
  onApproved: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setConfirmed(false);
    setError(null);
    onClose();
  };

  const approve = async () => {
    if (!action) return;
    setSubmitting(true);
    setError(null);
    try {
      await approveIncidentAction(incidentId, action.id);
      setConfirmed(false);
      onApproved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The approval could not be recorded. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={action !== null}
      title="Approve response action"
      description="Confirm you have reviewed the impact before authorizing this step."
      onClose={close}
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={approve} disabled={!confirmed || submitting}>
            {submitting ? 'Recording approval...' : 'Approve action'}
          </Button>
        </>
      }
    >
      {action && (
        <div className="space-y-5">
          <div className="rounded-lg bg-soc-bg/60 p-4">
            <p className="text-sm font-semibold text-slate-100">{action.title}</p>
            <p className="mt-2 text-sm text-slate-400">{action.rationale}</p>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-soc-border bg-soc-bg accent-primary-500"
            />
            I have reviewed the impact and authorize this action on behalf of the SOC team.
          </label>
          {error && <p className="text-sm text-critical-400" role="alert">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
