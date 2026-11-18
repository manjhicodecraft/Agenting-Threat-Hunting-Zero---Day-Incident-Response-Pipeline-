import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AiInvestigationPage } from '@/pages/AiInvestigationPage';
import { IncidentManagementPage } from '@/pages/IncidentManagementPage';
import { IncidentResponsePage } from '@/pages/IncidentResponsePage';
import { LiveMonitoringPage } from '@/pages/LiveMonitoringPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ReportsAnalyticsPage } from '@/pages/ReportsAnalyticsPage';
import { SecurityOverviewPage } from '@/pages/SecurityOverviewPage';
import { ThreatHuntingPage } from '@/pages/ThreatHuntingPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<SecurityOverviewPage />} />
        <Route path="monitoring" element={<LiveMonitoringPage />} />
        <Route path="threat-hunting" element={<ThreatHuntingPage />} />
        <Route path="investigations" element={<AiInvestigationPage />} />
        <Route path="incidents" element={<IncidentManagementPage />} />
        <Route path="response" element={<IncidentResponsePage />} />
        <Route path="reports" element={<ReportsAnalyticsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
