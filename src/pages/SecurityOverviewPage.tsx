import { Activity, AlertOctagon, RefreshCw, ShieldAlert, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThreatActivityChart } from '@/components/charts/ThreatActivityChart';
import { AsyncView } from '@/components/ui/AsyncView';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SecurityScoreGauge } from '@/components/ui/SecurityScoreGauge';
import { SeverityBadge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { useAsync } from '@/hooks/useAsync';
import { getDashboardStats } from '@/services/api/endpoints';
import { formatNumber, formatRelative, severityMeta } from '@/utils/format';

export function SecurityOverviewPage() {
  const state = useAsync(getDashboardStats);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Security Overview"
        description="Detected threats, open incidents, and overall posture across monitored endpoints, identities, and cloud workloads."
        actions={
          <Button onClick={state.reload} icon={<RefreshCw className="h-4 w-4" aria-hidden />} disabled={state.loading}>
            Refresh
          </Button>
        }
      />
      <AsyncView
        {...state}
        onRetry={state.reload}
        emptyState={null}
        loadingLabel="Loading security overview..."
      >
        {(stats) => (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total detected threats" value={formatNumber(stats.totalThreats)} hint="Last 30 days" icon={ShieldAlert} tone="primary" />
              <StatCard label="Critical incidents" value={stats.criticalIncidents} hint="Open and requiring response" icon={Siren} tone="critical" />
              <StatCard label="High-risk activities" value={stats.highRiskActivities} hint="Anomalies scored above 80" icon={AlertOctagon} tone="warning" />
              <Card className="flex items-center p-5">
                <SecurityScoreGauge score={stats.securityScore} />
              </Card>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="Threat activity" description="Detected threats and critical alerts over the last 24 hours" />
                <div className="px-3 py-5">
                  <ThreatActivityChart data={stats.activity} />
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Recent security alerts"
                  description="Newest detections across sensors"
                  action={
                    <Link to="/threat-hunting" className="text-xs font-medium text-primary-400 transition-colors hover:text-primary-300">
                      View all
                    </Link>
                  }
                />
                <ul className="divide-y divide-soc-border">
                  {stats.recentAlerts.map((alert) => (
                    <li key={alert.id} className="flex gap-3 px-5 py-4 transition-colors hover:bg-soc-elevated/50">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityMeta[alert.severity].dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="truncate text-sm font-medium text-slate-100">{alert.eventType}</p>
                          <SeverityBadge severity={alert.severity} />
                        </div>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Activity className="h-3 w-3" aria-hidden />
                          {alert.host} · {formatRelative(alert.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        )}
      </AsyncView>
    </div>
  );
}
