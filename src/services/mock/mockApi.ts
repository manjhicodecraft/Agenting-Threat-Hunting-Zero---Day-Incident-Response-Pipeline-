import type {
  DashboardStats,
  Incident,
  Investigation,
  ProcessRecord,
  ReportData,
  ResponseAction,
  ScanRequest,
  ScanResponse,
  SecurityEvent,
} from '@/services/api/types';
import { mockAnomalies, mockDashboardStats, mockEvents, mockProcesses } from '@/services/mock/mockEvents';
import {
  mockIncidents,
  mockInvestigations,
  mockReport,
  mockResponseActions,
} from '@/services/mock/mockIncidents';

const latency = (min = 350, max = 900) => new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
const clone = <T>(value: T): T => structuredClone(value);

let actionStore: ResponseAction[] = clone(mockResponseActions);

export async function getDashboardStats(): Promise<DashboardStats> {
  await latency();
  return clone(mockDashboardStats);
}

export async function getEvents(): Promise<SecurityEvent[]> {
  await latency();
  return clone(mockEvents);
}

export async function getProcesses(): Promise<ProcessRecord[]> {
  await latency(500, 1000);
  return clone(mockProcesses);
}

export async function scanThreats({ query, severity }: ScanRequest): Promise<ScanResponse> {
  await latency(900, 1600);
  const needle = query.trim().toLowerCase();
  const matches = (text: string) => !needle || text.toLowerCase().includes(needle);

  const events = mockEvents.filter(
    (event) =>
      (severity === 'all' || event.severity === severity) &&
      [event.eventType, event.host, event.user, event.description, event.mitreTechnique].some(matches),
  );
  const anomalies = mockAnomalies.filter(
    (anomaly) =>
      (severity === 'all' || anomaly.severity === severity) &&
      [anomaly.entity, anomaly.behavior, anomaly.details].some(matches),
  );

  return { events: clone(events), anomalies: clone(anomalies), scannedAt: new Date().toISOString() };
}

export async function getIncidents(): Promise<Incident[]> {
  await latency();
  return clone(mockIncidents);
}

export async function getInvestigation(investigationId: string): Promise<Investigation> {
  await latency();
  const investigation = mockInvestigations.find((item) => item.id === investigationId);
  if (!investigation) {
    throw new Error(`Investigation ${investigationId} was not found.`);
  }
  return clone(investigation);
}

export async function analyzeInvestigation(investigationId: string): Promise<Investigation> {
  await latency(1400, 2200);
  const investigation = mockInvestigations.find((item) => item.id === investigationId);
  if (!investigation) {
    throw new Error(`Investigation ${investigationId} was not found.`);
  }
  return clone({ ...investigation, status: 'ready' });
}

export async function getResponseActions(incidentId: string): Promise<ResponseAction[]> {
  await latency();
  return clone(actionStore.filter((action) => action.incidentId === incidentId));
}

export async function approveIncidentAction(incidentId: string, actionId: string): Promise<ResponseAction> {
  await latency(600, 1100);
  const target = actionStore.find((action) => action.id === actionId && action.incidentId === incidentId);
  if (!target) {
    throw new Error(`Action ${actionId} was not found for incident ${incidentId}.`);
  }
  const updated: ResponseAction = { ...target, status: 'approved' };
  actionStore = actionStore.map((action) => (action.id === actionId ? updated : action));
  return clone(updated);
}

export async function getReports(): Promise<ReportData> {
  await latency(700, 1200);
  return clone({ ...mockReport, generatedAt: new Date().toISOString() });
}
