import { Download } from 'lucide-react';
import { AsyncView } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { IncidentHistoryChart } from '@/components/charts/IncidentHistoryChart';
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart';
import { useAsync } from '@/hooks/useAsync';
import { getReports } from '@/services/api/endpoints';
import { formatNumber, downloadCsv, formatDateTime } from '@/utils/format';
import { Activity, CheckCircle2, ShieldAlert, Timer } from 'lucide-react';

export function ReportsAnalyticsPage() {
  const state = useAsync(getReports);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reports"
        title="Reports & Analytics"
        description="Threat statistics, incident history, and risk distribution for management and audit reviews."
        actions={
          <Button
            variant="primary"
            icon={<Download className="h-4 w-4" aria-hidden />}
            disabled={!state.data}
            onClick={() =>
              state.data &&
              downloadCsv(
                'incident-history.csv',
                state.data.incidentHistory.map((row) => ({ Month: row.month, Opened: row.opened, Resolved: row.resolved })),
              )
            }
          >
            Export report (CSV)
          </Button>
        }
      />

      <AsyncView {...state} onRetry={state.reload} loadingLabel="Compiling report..." emptyState={null}>
        {(report) => (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Threats detected" value={formatNumber(report.totals.threats)} hint="Year to date" icon={ShieldAlert} tone="primary" />
              <StatCard label="Incidents opened" value={report.totals.incidents} hint="Year to date" icon={Activity} tone="warning" />
              <StatCard label="Incidents resolved" value={report.totals.resolved} hint={`${Math.round((report.totals.resolved / report.totals.incidents) * 100)}% closure rate`} icon={CheckCircle2} tone="success" />
              <StatCard label="Mean time to respond" value={`${report.totals.meanTimeToRespondMin} min`} hint="From detection to first action" icon={Timer} tone="primary" />
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="Incident history" description="Incidents opened and resolved per month" />
                <div className="px-3 py-5">
                  <IncidentHistoryChart data={report.incidentHistory} />
                </div>
              </Card>
              <Card>
                <CardHeader
                  title="Risk distribution"
                  description="Open findings by severity"
                  action={
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        downloadCsv(
                          'risk-distribution.csv',
                          report.riskDistribution.map((row) => ({ Severity: row.name, Count: row.value })),
                        )
                      }
                    >
                      Export
                    </Button>
                  }
                />
                <div className="p-6">
                  <RiskDistributionChart data={report.riskDistribution} />
                </div>
              </Card>
            </div>

            <p className="text-xs text-slate-500">Generated {formatDateTime(report.generatedAt)} from demo data.</p>
          </>
        )}
      </AsyncView>
    </div>
  );
}
